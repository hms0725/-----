import styled from "styled-components";
import { InfoBoxWrapper } from "../../../components/common/InfoBoxWrapper";
import { RefObject, useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
import RankingPointSheet from "../../../components/web/RankingPointSheet";
import { TournamentInfoInterface } from "../../../api/game";
import {
  calcBlind,
  getKoreanNumber,
  getTournamentType,
} from "../../../utils/common";
import moment from "moment/moment";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";

const BasicInfoBox = styled(InfoBoxWrapper)`
  padding: 20px 16px;

  > .list {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    > .item {
      padding: 4px 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: var(--Black-300, #808080);
      text-align: right;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .button-row {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;

    > .button {
      flex: 1;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 36px;
      gap: 2px;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 18px;
      border: 1px solid var(--Black-200, #b7b7b7);
    }
  }
`;

const InfoModal = styled.div`
  width: 100vw;
  max-width: 480px;
  max-height: 80vh;
  display: flex;
  padding: 30px 24px 60px 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 12px 12px 0px 0px;
  background: #fff;

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .title {
      color: ${(p) => p.theme.color.black500};
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 28px */
    }

    > .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > .description {
        margin-top: 12px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;

        > div {
          width: 100%;
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 140%; /* 19.6px */
          text-align: left;
        }

        > div.bold {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }
      }

      > .prize-wrapper {
        margin-top: 32px;
        padding: 20px 16px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        border-radius: 12px;
        border: 1px solid var(--Black-100, #f0f0f0);
        background: #fff;

        > .title {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 20px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

        > .prize-list {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 8px;

          > .row {
            padding: 4px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            > .item {
              width: 120px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              color: var(--Black-300, #808080);
              text-align: center;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }

            > .item.header {
              color: var(--Black-200, #b7b7b7);
              text-align: center;
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
          }
        }
      }
    }
  }

  > .button-row {
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;

    > .button {
      flex: 1;
      height: 48px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: ${(p) => p.theme.color.purple300};
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }

    > .button:active {
      background: #502bb5;
    }

    > .button.cancel {
      color: ${(p) => p.theme.color.purple300};
      background: none;
    }
  }
`;

const StyledSheetBackdrop = styled(Sheet.Backdrop)`
  @media ${MEDIA_DESKTOP} {
    background-color: unset !important;
  }
`;

interface InfoBoxRef {
  boxRef: RefObject<HTMLDivElement>;
  tournamentInfo: TournamentInfoInterface;
}

const BasicInfo = ({ boxRef, tournamentInfo }: InfoBoxRef) => {
  const [tournamentType, setTournamentType] = useState("");
  const [showGamePrizeSheet, setShowGamePrizeSheet] = useState(false);
  const [showRankingSheet, setShowRankingSheet] = useState(false);
  const [currentBlind, setCurrentBlind] = useState<{
    small: number;
    big: number;
  }>({
    small: 0,
    big: 0,
  });
  useEffect(() => {
    setCurrentBlind(calcBlind(tournamentInfo));
    setTournamentType(getTournamentType(tournamentInfo.info.data.startedAt));
  }, [tournamentInfo]);
  return (
    <>
      {showGamePrizeSheet && (
        <Sheet
          style={{
            width: "100%",
            maxWidth: 500,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          isOpen={showGamePrizeSheet}
          onClose={() => setShowGamePrizeSheet(false)}
          disableDrag={true}
          detent={"content-height"}
        >
          <Sheet.Container
            style={{
              maxWidth: 500,
            }}
          >
            <Sheet.Content>
              <InfoModal>
                <div className="inner">
                  <div className="title">게임 보상 안내</div>
                  <div className="content">
                    <div className="description">
                      {tournamentType === "Day" && (
                        <div>
                          매일 낮 2시 진행되는 낮 2시 토너먼트에서 일정 순위
                          안에 들게 되면 보상이 지급됩니다.
                        </div>
                      )}
                      {tournamentType === "Night" && (
                        <div>
                          화,목,토,일 저녁 8시 진행되는 밤 8시 토너먼트에서 일정
                          순위 안에 들게 되면 보상이 지급됩니다.
                          <br />
                          매주 월/수/금요일은 게임포인트를 따로 지급해 드리지
                          않습니다.
                        </div>
                      )}
                    </div>
                    <div className="prize-wrapper">
                      {tournamentType === "Day" && (
                        <div className="title">
                          순위별 게임포인트(GP) 지급표
                        </div>
                      )}
                      {tournamentType === "Night" && (
                        <div className="title">순위별 보상 지급표</div>
                      )}

                      <div className="prize-list">
                        <div className="row">
                          <div className="item header">순위</div>
                          <div className="item header">지급포인트</div>
                        </div>
                        {[
                          1600000, 1000000, 750000, 500000, 400000, 350000,
                          250000, 100000, 50000,
                        ].map((_, index) => {
                          return (
                            <div className="row" key={index}>
                              <div className="item">{index + 1}위</div>
                              <div className="item">{getKoreanNumber(_)}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="button-row">
                  <div
                    className="button"
                    onClick={() => setShowGamePrizeSheet(false)}
                  >
                    확인
                  </div>
                </div>
              </InfoModal>
            </Sheet.Content>
          </Sheet.Container>
          <StyledSheetBackdrop onTap={() => setShowGamePrizeSheet(false)} />
        </Sheet>
      )}
      <RankingPointSheet
        showRankingSheet={showRankingSheet}
        setShowRankingSheet={setShowRankingSheet}
      />
      <BasicInfoBox ref={boxRef}>
        <div className="title-row">
          <div className="title">정보</div>
        </div>
        <div className="list">
          <div className="item">
            <span>시작칩(BB)</span>
            <span>
              {tournamentInfo.info.data.beginChip.toLocaleString()} (
              {tournamentInfo.info.data.beginChip /
                Number(tournamentInfo.info.data.blindStructure[0][2])}
              BB)
            </span>
          </div>
          <div className="item">
            <span>게임 종류</span>
            <span>노-리밋 홀덤</span>
          </div>
          <div className="item">
            <span>최소/최대 인원</span>
            <span>
              {tournamentInfo.info.data.minTotalMember.toLocaleString()}/
              {tournamentInfo.info.data.maxTotalMember.toLocaleString()}
            </span>
          </div>
          <div className="item">
            <span>현재블라인드</span>
            <span>
              {tournamentInfo.info.isStarted
                ? `${getKoreanNumber(currentBlind.small)}/${getKoreanNumber(
                    currentBlind.big
                  ).toLocaleString()}`
                : "없음"}
            </span>
          </div>
          <div className="item">
            <span>바이인</span>
            <span>
              {tournamentInfo.info.data.availableRegisterLevel}Lv이내 1리바인
              가능
            </span>
          </div>
          <div className="item">
            <span>브레이크 타임</span>
            <span>
              게임{" "}
              {tournamentInfo.info.data.timeStructure.playTimeSeconds.toLocaleString()}
              분 후{" "}
              {tournamentInfo.info.data.timeStructure.restTimeSeconds.toLocaleString()}
              분 휴식
            </span>
          </div>
          <div className="item">
            <span>게임 스피드</span>
            <span>하이퍼 터보</span>
          </div>
        </div>
        <div className="button-row">
          <div className="button" onClick={() => setShowGamePrizeSheet(true)}>
            <img src="/image-web/event/Info/small.svg" />
            게임 보상 안내
          </div>
          <div className="button" onClick={() => setShowRankingSheet(true)}>
            <img src="/image-web/event/Info/small.svg" />
            랭킹 점수 안내
          </div>
        </div>
        <div className="bottom-bar" />
      </BasicInfoBox>
    </>
  );
};
export default BasicInfo;
