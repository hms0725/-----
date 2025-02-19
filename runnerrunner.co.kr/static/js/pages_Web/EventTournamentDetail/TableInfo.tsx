import styled from "styled-components";
import {InfoBoxWrapper} from "../../../components/common/InfoBoxWrapper";
import {RefObject, useEffect, useState} from "react";
import {getObserveLink, getTournamentTableInfo, TableInfoInterface, TournamentInfoInterface} from "../../../api/game";
import {LOCAL_STORAGE_ACCESS_KEY} from "../../../utils/network";
import {useSetRecoilState} from "recoil";
import {loadingState} from "../../../recoil/app";
import {enqueueSnackbar} from "notistack";

const TableInfoBox = styled(InfoBoxWrapper)`
  padding: 20px 16px;

  > .button {
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--Black-100, #F0F0F0);
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

  > .empty-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;

    > img {
      margin-top: 10px;
      width: 180px;
      object-fit: contain;
    }

    > .empty-text {
      width: 100%;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
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

      > .no {
        width: 40px;
        text-align: center;
      }

      > .player {
        width: 49px;
        text-align: center;
      }

      > .max-chip {
        width: 50px;
        text-align: center;
      }

      > .min-chip {
        width: 50px;
        text-align: center;
      }

      > .observe {
        width: 40px;
        text-align: center;
      }

      > .observe.button {
        cursor: pointer;
        border-radius: 4px;
        background: var(--Purple-100, #F0EAFF);
        color: var(--Purple-300, #6436E7);
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        padding: 4px;
      }
    }

    > .item.me {
      border-radius: 4px;
      background: var(--Purple-100, #F0EAFF);

      > span {
        color: var(--Purple-300, #6436E7);
      }
    }

    > .item.header {
      > span {
        color: var(--Black-200, #BDBDBD);
        font-weight: 500;
      }
    }

  }
`


interface InfoBoxRef {
  boxRef: RefObject<HTMLDivElement>
  tournamentInfo: TournamentInfoInterface
}

const EXPAND_COUNT = 50;
const TableInfo = ({boxRef, tournamentInfo}: InfoBoxRef) => {
  const setLoading = useSetRecoilState(loadingState);
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const [tableInfoList, setTableInfoList] = useState<TableInfoInterface[]>([]);
  const [canExpand, setCanExpand] = useState<boolean>(false)
  const [expandCount, setExpandCount] = useState<number>(EXPAND_COUNT)
  useEffect(() => {
    const groupId = tournamentInfo.info.groupId;
    if (groupId) {
      getTournamentTableInfo({groupId}).then((res) => {
        setTableInfoList(res.data.list);
      })
    }
  }, [tournamentInfo.info.groupId]);
  useEffect(() => {
    if (tableInfoList === null) return;
    if (tableInfoList.length > EXPAND_COUNT) {
      setCanExpand(true)
    } else {
      setCanExpand(false)
    }
  }, [tableInfoList]);
  const handleClickExpand = () => {
    if (!canExpand) return;
    setExpandCount(expandCount + EXPAND_COUNT)
    //100개씩 더보기
    if (expandCount + EXPAND_COUNT >= tableInfoList.length) {
      setCanExpand(false)
    } else {
      setCanExpand(true)
    }
  }

  const handleClickObserve = (roomId: number) => {
    if (!accessToken) return;
    setLoading(true);
    getObserveLink({
      roomId,
      groupId: tournamentInfo.info.groupId,
      token: accessToken.replace("Bearer ", "")
    }).then((res) => {
      const result = res.data.result;
      if (typeof result !== "string") {
        if(result === -11){
          enqueueSnackbar('플레이 중에는 관전이 불가능합니다.', {variant: "error"})
        }else{
          enqueueSnackbar(`관전 입장에 실패했습니다. (ERR:${result})`, {variant: "error"})
        }
      } else {
        window.location.href = result;
      }
    }).finally(() => {
      setLoading(false);
    })
  }
  return <>
    <TableInfoBox ref={boxRef}>
      <div className='title-row'>
        <div className='title'>테이블</div>
      </div>
      {
        tableInfoList.length === 0 ? <div className='empty-wrapper'>
          <img src='/image-web/None.png'/>
          <div className='empty-text'>
            현재 관전 가능한 테이블이<br/>없습니다.
          </div>
        </div> : <>
          <div className='list'>
            <div className='item header'>
              <span className='no'>번호</span>
              <span className='player'>플레이어</span>
              <span className='max-chip'>최대칩</span>
              <span className='min-chip'>최소칩</span>
              <span className='observe'>관전</span>
            </div>
            {
              tableInfoList.slice(0, expandCount).map((tableInfo, index) => {
                return <div className='item' key={index}>
                  <span className='no'>{tableInfo.roomId}</span>
                  <span className='player'>{
                    tableInfo.playerCount
                  }</span>
                  <span className='max-chip'>
                    {
                      Math.max(...tableInfo.players.filter((player) => player !== null).map((player) => player!.stackSize)).toLocaleString()
                    }
                  </span>
                  <span className='min-chip'>
                    {
                      Math.min(...tableInfo.players.filter((player) => player !== null).map((player) => player!.stackSize)).toLocaleString()
                    }
                  </span>
                  <span className='observe button' onClick={() => {
                    handleClickObserve(tableInfo.roomId)
                  }}>입장</span>
                </div>
              })
            }
          </div>
          {
            canExpand && <div className='button' onClick={handleClickExpand}>
              더보기
            </div>
          }
        </>
      }
      <div className='bottom-bar'/>
    </TableInfoBox>
  </>
}
export default TableInfo;
