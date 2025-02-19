import styled from "styled-components";
import Dim from "../../../components/Dim";
import {useEffect, useState} from "react";
import {getUserBuyInInfo} from "../../../api/game";
import useUserInfo from "../../../hooks/useUserInfo";
import {useSetRecoilState} from "recoil";
import {loadingState} from "../../../recoil/app";
import {useParams} from "react-router-dom";
import Slider from "rc-slider";
import {getKoreanNumber} from "../../../utils/common";

const ReBuyinPopupWrapper = styled.div`
  position: fixed;
  padding: 24px 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 308px;
  flex-shrink: 0;
  border-radius: 12px;
  z-index: 111;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  > .title {
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
  }

  > .desc {
    margin-top: 12px;
    color: var(--Black-400, #444);
    text-align: center;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 19.6px */
  }

  > .game-point-box {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;

    > .line {
      width: 100%;
      height: 1px;
      background: #f0f0f0;
    }

    > .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      > .title {
        color: var(--Black-500, #202020);
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 19.6px */
      }

      > .value {
        color: var(--Purple-300, #6436E7);
        text-align: center;
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 22.4px */
      }
    }
  }

  > .box {
    width: 100%;
    margin-top: 17px;
    padding: 12px;
    border-radius: 8px;
    background: var(--Black-100, #F0F0F0);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;

    > .title {
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 18.2px */
    }

    > .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      > .item {
        flex: 1;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 19.6px */
      }
    }
  }

  > .box.purple {
    background: var(--Purple-100, #F0EAFF);
  }

  > .button {
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    border-radius: 8px;
    background: var(--Purple-300, #6436E7);
    padding: 15px;
    color: #FFF;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.165px;
  }

  > .close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    > img {
      width: 24px;
      height: 24px;
    }

  }
`

const DEFAULT_GAME_MONEY = 40000

interface ReBuyinPopupProps {
  onClose: () => void;
  onEnter: (addedGameMoney: number, useReBuyinTicket: boolean) => void;
}

const ReBuyinPopup = ({
                        onClose,
                        onEnter
                      }: ReBuyinPopupProps) => {
  const {user} = useUserInfo();
  const setLoading = useSetRecoilState(loadingState);
  const params = useParams<{
    groupId: string;
  }>();

  const [data, setData] = useState<{
    useReBuyinTicket: boolean;
    addedGameMoney: number;
    point: number;
    usePointLimit: number;
    rebuyinTicket: number;
  }>({
    useReBuyinTicket: false,
    addedGameMoney: 0,
    point: 0,
    usePointLimit: 0,
    rebuyinTicket: 0
  });
  useEffect(() => {
    if (user) {
      setLoading(true)
      getUserBuyInInfo({
        userId: user?.id,
        groupId: Number(params.groupId),
      }).then(res => {
        setData({
          useReBuyinTicket: res.data.useRebuyinTicket,
          addedGameMoney: 0,
          point: res.data.user.point,
          usePointLimit: Number(res.data.settingList.find((x: any) => x.name === 'usePointLimit')?.value) || 0,
          rebuyinTicket: res.data.user.rebuyinTicket
        })
      }).catch(e => {

      }).finally(() => {
        setLoading(false)
      })
    }
  }, [user]);

  const handleClickEnter = () => {
    onEnter(data.addedGameMoney, data.useReBuyinTicket)
  }

  return <>
    <ReBuyinPopupWrapper>
      <div className='close' onClick={onClose}>
        <img src='/image-web/Holdem%20Now/Icon/Close.svg'/>
      </div>
      <div className='title'>입장 설정</div>
      <div className='desc'>
        보유함에 리바인 또는 게임포인트 보유 시<br/>
        해당 토너먼트에서 사용 가능합니다.
      </div>
      <div className='box'>
        <div className='title'>보유 현황</div>
        <div className='row'>
          <div className='item'>리바인 : {data.rebuyinTicket}</div>
          <div className='item'>게임포인트 : {getKoreanNumber(data.point)}</div>
        </div>
      </div>
      <div className='game-point-box'>
        <div className='line'/>
        <div className='row'>
          <div className='title'>보유 게임포인트 사용</div>
          <div className='value'>{getKoreanNumber(data.addedGameMoney)}</div>
        </div>
      </div>
      <Slider
        style={{
          width: '90%',
          marginTop: 20
        }}
        min={0}
        max={Math.min(data.point, data.usePointLimit)}
        range={false}
        allowCross={false}
        defaultValue={data.addedGameMoney}
        value={data.addedGameMoney}
        onChange={value => {
          if (!Array.isArray(value)) {
            //100단위로
            setData({
              ...data,
              addedGameMoney: Math.round(value / 100) * 100
            })
          }
        }}
        trackStyle={{
          backgroundColor: '#6436E7',
          height: 4
        }}
        handleStyle={{
          borderWidth: 1.5,
          borderColor: '#6436E7',
          height: 26,
          width: 26,
          marginLeft: 0,
          marginTop: -12,
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.12)',
          opacity: 1
        }}
        activeDotStyle={{
          boxShadow: 'none'
        }}
      />
      <div className='box purple'>
        <div className='title'>입장 시 게임포인트</div>
        <div className='row'>
          <div className='item'>기본 : {getKoreanNumber(DEFAULT_GAME_MONEY)}</div>
          <div className='item'>추가 : {getKoreanNumber(data.addedGameMoney)}</div>
        </div>
      </div>
      <div className='button' onClick={handleClickEnter}>
        리바인하기 {data.useReBuyinTicket ? ' (바인권 1개 소모)' : ''}
      </div>
    </ReBuyinPopupWrapper>
    <Dim/>
  </>
}
export default ReBuyinPopup;
