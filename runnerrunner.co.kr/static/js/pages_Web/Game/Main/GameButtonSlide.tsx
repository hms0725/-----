import { useGameContext } from "../Hook/GameContext";
import {
  GameButtonSlideItem,
  GameButtonSlideWrapper,
} from "../Style/GameStyles";
import { Swiper, SwiperSlide } from "swiper/react";
import { getTournamentType } from "../../../../utils/common";

export const GameButtonSlide = () => {
  const {
    openDialog,
    register,
    dailyTournament,
    tournamentData,
    handleClickPlayGame,
    getDailyTournament,
    checkRegisterLimit,
  } = useGameContext();

  return (
    <GameButtonSlideWrapper>
      <div className="title">TOURNAMENT</div>
      <Swiper
        slidesPerView={"auto"}
        centeredSlides={false}
        spaceBetween={10}
        className="mySwiper"
      >
        {dailyTournament &&
          dailyTournament.map((item) => {
            return tournamentData.find(
              (x) => x.info.groupId === item.groupId
            ) ? (
              <SwiperSlide key={item.id}>
                <GameButtonSlideItem>
                  <img src="/image-web/game/tournament_background.png" />
                  <div className="title">{item.title}</div>
                  <div className="entry">
                    <div className="title"> 엔트리 등록</div>
                    {tournamentData.find((x) => x.info.groupId === item.groupId)
                      ?.info.totalRegisterCount ?? "-"}
                    명 등록
                  </div>
                  <div
                    className="button"
                    onClick={() => {
                      const tournament = tournamentData.find(
                        (x) => x.info.groupId === item.groupId
                      );
                      if (tournament?.info.isEnd === 1) {
                        return;
                      }

                      if (
                        checkRegisterLimit(tournament) &&
                        tournament?.info.isRegister === 0
                      ) {
                        return;
                      }
                      openDialog({
                        text: `‘프리 토너먼트’에\n${
                          tournament?.info.isRegister === 1 ? "입장" : "등록"
                        } 하시겠습니까?`,
                        buttonText:
                          tournament?.info.isRegister === 1
                            ? "입장하기"
                            : "등록하기",
                        onConfirm: () => {
                          if (tournament?.info.isRegister === 1) {
                            handleClickPlayGame(item.groupId, tournament);
                          } else {
                            register(
                              item.groupId,
                              getTournamentType(
                                tournament?.info.data.startedAt || ""
                              )
                            );
                          }
                          getDailyTournament();
                        },
                      });
                    }}
                  >
                    {checkRegisterLimit(
                      tournamentData.find(
                        (x) => x.info.groupId === item.groupId
                      )
                    ) &&
                    tournamentData.find((x) => x.info.groupId === item.groupId)
                      ?.info.isRegister === 0
                      ? "참가 마감"
                      : tournamentData.find(
                          (x) => x.info.groupId === item.groupId
                        )?.info.isEnd === 1
                      ? "종료"
                      : tournamentData.find(
                          (x) => x.info.groupId === item.groupId
                        )?.info.isRegister === 1
                      ? "게임 입장"
                      : "게임 등록"}
                  </div>
                </GameButtonSlideItem>
              </SwiperSlide>
            ) : (
              <></>
            );
          })}
      </Swiper>
    </GameButtonSlideWrapper>
  );
};
