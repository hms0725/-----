import styled from "styled-components";
import { InfoBoxWrapper } from "../../../components/common/InfoBoxWrapper";
import { RefObject, useState } from "react";
import Sheet from "react-modal-sheet";
import { TournamentInfoInterface } from "../../../api/game";
import { getKoreanNumber } from "../../../utils/common";

const BlindInfoBox = styled(InfoBoxWrapper)`
  padding: 20px 16px;

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

      > .level {
        width: 40px;
        text-align: center;
      }

      > .blind {
        width: 120px;
        text-align: center;
      }

      > .ante {
        width: 72px;
        text-align: center;
      }

      > .time {
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
  tournamentInfo: TournamentInfoInterface;
}

const BasicInfo = ({ boxRef, tournamentInfo }: InfoBoxRef) => {
  return (
    <>
      <BlindInfoBox ref={boxRef}>
        <div className="title-row">
          <div className="title">블라인드</div>
        </div>
        <div className="list">
          <div className="item header">
            <span className="level">레벨</span>
            <span className="blind">블라인드</span>
            <span className="ante">앤티</span>
            <span className="time">레벨 업(분)</span>
          </div>
          {tournamentInfo.info.data.blindStructure.map((blindData, index) => {
            return (
              <div className="item" key={index}>
                <span className="level">{index + 1}</span>
                <span className="blind">
                  {getKoreanNumber(blindData[0])}/
                  {getKoreanNumber(blindData[1])}
                </span>
                <span className="ante">{getKoreanNumber(blindData[2])}</span>
                <span className="time">{blindData[3].toLocaleString()}</span>
              </div>
            );
          })}
        </div>
        <div className="bottom-bar" />
      </BlindInfoBox>
    </>
  );
};
export default BasicInfo;
