import React from "react";
import { useGameContext } from "../Hook/GameContext";
import {
  GameLobbyTournamentWrapper,
  GameLobbyTournamentInfoWrapper,
  GameLobbyTournamentGameInfoWrapper,
  GameLobbyTournamentInfoCountWrapper,
  GameLobbyTournamentInfoTitleWrapper,
  GameLobbyTournamentInfoTimeWrapper,
} from "../Style/GameStyles";
import { getTournamentType } from "../../../../utils/common";
import TournamentTimer from "../../Home/TournamentTimer";
import { TournamentInfoInterface } from "../../../../api/game";
import { DashboardDailyTournament } from "../../../../api/dashboard";

const useTournamentActions = () => {
  const {
    openDialog,
    register,
    getDailyTournament,
    handleClickPlayGame,
    checkRegisterLimit,
  } = useGameContext();

  const handleRegistration = (
    event: React.MouseEvent,
    item: DashboardDailyTournament,
    currentTournament: TournamentInfoInterface | undefined
  ) => {
    event.stopPropagation();
    if (!currentTournament || currentTournament.info.isEnd === 1) return;
    const isRegistered = currentTournament.info.isRegister === 1;
    if (!isRegistered && checkRegisterLimit(currentTournament)) return;
    openDialog({
      text: `'${
        item.tournamentInfo?.info.data.buyinPrice === 0 ? "프리" : ""
      } 토너먼트'에\n${isRegistered ? "입장" : "등록"} 하시겠습니까?`,
      buttonText: isRegistered ? "입장하기" : "등록하기",
      onConfirm: () => {
        if (isRegistered) {
          handleClickPlayGame(item.groupId, currentTournament);
        } else {
          register(
            item.groupId,
            getTournamentType(currentTournament.info.data.startedAt)
          );
        }
        getDailyTournament();
      },
    });
  };

  return { handleRegistration };
};

// Sub-components
const TournamentHeader: React.FC<{
  item: DashboardDailyTournament;
}> = ({ item }) => {
  const formattedDate = item.startAt.slice(0, 10).replace(/-/g, ".");

  return (
    <div className="register-info-row">
      <GameLobbyTournamentInfoCountWrapper>
        <div className="date">{formattedDate}</div>
        <div className="count">
          <img src="/image-web/game/lobby/person.svg" alt="Players" />
          {item.tournamentInfo?.info.totalRegisterCount ?? "-"}
        </div>
      </GameLobbyTournamentInfoCountWrapper>
      <GameLobbyTournamentInfoTitleWrapper>
        <div className="image-container">
          <img
            alt="Tournament type"
            src={`/image-web/game/category/${
              item.tournamentInfo?.info.data.buyinPrice > 0
                ? "tournament"
                : "freeTournament"
            }.png`}
          />
        </div>
        <div className="title-column">
          <div className="title">{item.title}</div>
          <div className="sub-title">{item.tournamentInfo?.info.data.name}</div>
        </div>
      </GameLobbyTournamentInfoTitleWrapper>
      <GameLobbyTournamentInfoTimeWrapper>
        <div className="time-wrapper">
          <TournamentTimer
            start={item.startAt}
            end={item.tournamentInfo?.info.isEnd}
          />
        </div>
      </GameLobbyTournamentInfoTimeWrapper>
    </div>
  );
};

const TournamentInfo: React.FC<{
  item: DashboardDailyTournament;
  onInfoClick: (info: TournamentInfoInterface) => void;
  onRegister: (event: React.MouseEvent) => void;
  currentTournament?: TournamentInfoInterface;
}> = ({ item, onInfoClick, onRegister, currentTournament }) => {
  const totalPrize = item.tournamentInfo?.info.data.prize.reduce(
    (acc, curr) => acc + curr,
    0
  );
  const { checkRegisterLimit } = useGameContext();
  const infoItems = [
    {
      title: "스타팅칩",
      content: `${item.tournamentInfo?.info.data.beginChip.toLocaleString()}칩`,
    },
    {
      title: "레지마감",
      content: `LV${item.tournamentInfo?.info.data.availableRegisterLevel}`,
    },
    {
      title: "게임종류",
      content: "노리밋홀덤",
    },
    {
      title: "바이인(GP)",
      content:
        item.tournamentInfo?.info.data.buyinPrice === 0
          ? "FREE"
          : item.tournamentInfo?.info.data.buyinPrice.toLocaleString(),
    },
    {
      title: "듀레이션",
      content: `${
        item.tournamentInfo?.info.data.blindStructure[0][4]
          ? Number(item.tournamentInfo.info.data.blindStructure[0][4]) / 60
          : 0
      }분`,
    },
  ];

  return (
    <GameLobbyTournamentGameInfoWrapper>
      <div className="back">
        <div className="top">
          <div className="header">
            <div className="title">
              총보상
              <br />
              {totalPrize?.toLocaleString()}GP
            </div>
            <div
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick(item.tournamentInfo);
              }}
            >
              <span>게임정보</span>
            </div>
          </div>
          <div className="player-left">
            Player left{" "}
            {item.tournamentInfo.info.totalPlayerCount
              ? item.tournamentInfo.info.totalPlayerCount
              : "0"}
            /
            {item.tournamentInfo.info.totalRegisterCount
              ? item.tournamentInfo.info.totalRegisterCount
              : "0"}
          </div>
        </div>
        <div className="bottom">
          <div className="info">
            {infoItems.map((info, index) => (
              <React.Fragment key={info.title}>
                <div className="column">
                  <div className="title">{info.title}</div>
                  <div className="content">{info.content}</div>
                </div>
                {index < infoItems.length - 1 && <div className="partition" />}
              </React.Fragment>
            ))}
          </div>
          <div className="button" onClick={onRegister}>
            {checkRegisterLimit(currentTournament) &&
            currentTournament?.info.isRegister === 0
              ? "참가 마감"
              : currentTournament?.info.isEnd === 1
              ? "종료"
              : currentTournament?.info.isRegister === 1
              ? "게임 입장"
              : "게임 등록"}
          </div>
        </div>
      </div>
    </GameLobbyTournamentGameInfoWrapper>
  );
};

// Main Component
export const GameLobbyTournament: React.FC = () => {
  const { dailyTournament, tournamentData, openGameInfoDialog } =
    useGameContext();
  const [selectedItemId, setSelectedItemId] = React.useState<number>(-1);
  const { handleRegistration } = useTournamentActions();

  if (!dailyTournament) return null;

  return (
    <GameLobbyTournamentWrapper>
      {dailyTournament.map((item) => {
        const currentTournament = tournamentData.find(
          (x) => x.info.groupId === item.groupId
        );

        if (!currentTournament) return null;

        return (
          <GameLobbyTournamentInfoWrapper
            key={item.id}
            onClick={() =>
              setSelectedItemId(selectedItemId === item.id ? -1 : item.id)
            }
            className={selectedItemId === item.id ? "selected" : ""}
          >
            <TournamentHeader item={item} />
            {selectedItemId === item.id && (
              <TournamentInfo
                item={item}
                onInfoClick={openGameInfoDialog}
                onRegister={(e) =>
                  handleRegistration(e, item, currentTournament)
                }
                currentTournament={currentTournament}
              />
            )}
          </GameLobbyTournamentInfoWrapper>
        );
      })}
    </GameLobbyTournamentWrapper>
  );
};
