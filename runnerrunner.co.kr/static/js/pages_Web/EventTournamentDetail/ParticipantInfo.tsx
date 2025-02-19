import styled from "styled-components";
import { InfoBoxWrapper } from "../../../components/common/InfoBoxWrapper";
import { RefObject, useEffect, useState } from "react";
import {
  TournamentInfoInterface,
  TournamentMembersInterface,
} from "../../../api/game";

const BlindInfoBox = styled(InfoBoxWrapper)`
  padding: 20px 16px;
  > .button {
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--Black-100, #f0f0f0);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;
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

      > .nickname {
        width: 120px;
        text-align: center;
      }

      > .chip {
        width: 72px;
        text-align: center;
      }

      > .status {
        width: 72px;
        text-align: center;
      }
    }
    > .item.me {
      border-radius: 4px;
      background: var(--Purple-100, #f0eaff);
      > span {
        color: var(--Purple-300, #6436e7);
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
  tournamentMembersInfo: TournamentMembersInterface | null;
}

const BasicInfo = ({ boxRef, tournamentMembersInfo }: InfoBoxRef) => {
  const [canExpand, setCanExpand] = useState<boolean>(false);
  const [expandCount, setExpandCount] = useState<number>(100);
  useEffect(() => {
    if (tournamentMembersInfo === null) return;
    if (tournamentMembersInfo.list.length > 100) {
      setCanExpand(true);
    } else {
      setCanExpand(false);
    }
  }, [tournamentMembersInfo]);
  const handleClickExpand = () => {
    if (!canExpand) return;
    setExpandCount(expandCount + 100);
    //100개씩 더보기
    if (expandCount + 100 >= tournamentMembersInfo!.list.length) {
      setCanExpand(false);
    } else {
      setCanExpand(true);
    }
  };
  return (
    <>
      <BlindInfoBox ref={boxRef}>
        <div className="title-row">
          <div className="title">보유칩 현황</div>
        </div>
        <div className="list">
          <div className="item header">
            <span className="nickname">닉네임</span>
            <span className="chip">보유칩(BB)</span>
            <span className="status">상태</span>
          </div>
          {/*<div className='item me'>
          <span className='rank'>1</span>
          <span className='nickname'>AAAAA</span>
          <span className='chip'>10,000</span>
          <span className='status'>-</span>
        </div>*/}
          {tournamentMembersInfo === null && (
            <div className="item">
              <span className="nickname">-</span>
              <span className="chip">-</span>
              <span className="status">-</span>
            </div>
          )}
          {tournamentMembersInfo !== null &&
            tournamentMembersInfo.list
              .slice(0, expandCount)
              .map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <span className="nickname">{item.nickname}</span>
                    <span className="chip">
                      {item.stackSize.toLocaleString()}
                    </span>
                    <span className="status">
                      {item.eliminatedAt ? "종료" : "진행중"}
                    </span>
                  </div>
                );
              })}
        </div>
        {canExpand && (
          <div className="button" onClick={handleClickExpand}>
            더보기
          </div>
        )}
        <div className="bottom-bar" />
      </BlindInfoBox>
    </>
  );
};
export default BasicInfo;
