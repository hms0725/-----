import styled from "styled-components";
import { InfoBoxWrapper } from "../../../components/common/InfoBoxWrapper";
import { RefObject, useEffect, useState } from "react";
import Sheet from "react-modal-sheet";
import {
  getTournamentWinners,
  TournamentInfoInterface,
} from "../../../api/game";
import {
  calcBlind,
  getKoreanNumber,
  getTournamentType,
} from "../../../utils/common";

const PrizeInfoBox = styled(InfoBoxWrapper)`
  padding: 20px 16px;

  > .desc {
    margin-top: 12px;
    color: var(--Black-300, #808080);
    text-align: center;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > .prize {
    margin-top: 20px;
    width: 100%;
    height: 51px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #f77e26;
    text-align: right;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.32px;
    border-radius: 8px;
    background: #fff4ea;
  }

  > .list {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    > .item {
      padding: 4px 0;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;

      > span {
        color: var(--Black-300, #808080);
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }

      > .rank {
        width: 40px;
        text-align: center;
      }

      > .prize {
        width: 120px;
        text-align: center;
      }

      > .point {
        width: 72px;
        text-align: center;
      }
    }

    > .item.header {
      > span {
        color: var(--Black-200, #bdbdbd);
        font-weight: 500;
      }
    }
  }
`;

interface InfoBoxRef {
  boxRef: RefObject<HTMLDivElement>;
  groupId: number;
  tournamentInfo: TournamentInfoInterface;
}

const PrizeInfo = ({ boxRef, groupId, tournamentInfo }: InfoBoxRef) => {
  const [tournamentType, setTournamentType] = useState("");
  const [prizeList, setPrizeList] = useState<any[]>([]);
  useEffect(() => {
    if (groupId) {
      getTournamentWinners({ groupId }).then((res) => {
        setPrizeList(res.data.list);
      });
    }
  }, [groupId]);
  useEffect(() => {
    setTournamentType(getTournamentType(tournamentInfo.info.data.startedAt));
  }, [tournamentInfo]);
  return (
    <>
      <PrizeInfoBox ref={boxRef}>
        <div className="title-row">
          <div className="title">보상</div>
        </div>
        <div className="desc">
          {tournamentType === "Day" && "보상안내입니다."}
          {tournamentType === "Night" &&
            tournamentInfo.info.data.tournamentType === 0 &&
            "보상안내입니다."}
          {tournamentType === "Night" &&
            tournamentInfo.info.data.tournamentType === 1 &&
            "STN토너먼트는 게임포인트를 지급해 드리지 않습니다."}
        </div>
        <div className="prize">총 보상 500만 포인트</div>
        <div className="list">
          <div className="item header">
            <span className="rank">순위</span>
            <span className="prize">게임 포인트</span>
            <span className="point">랭킹 포인트</span>
          </div>
          {[
            1600000, 1000000, 750000, 500000, 400000, 350000, 250000, 100000,
            50000,
          ].map((prize, index) => {
            return (
              <div className="item" key={index}>
                <span className="rank">{index + 1}</span>
                <span className="prize">{getKoreanNumber(prize)}</span>
                <span className="point">{10 - index}</span>
              </div>
            );
          })}
        </div>
        <div className="bottom-bar" />
      </PrizeInfoBox>
    </>
  );
};
export default PrizeInfo;
