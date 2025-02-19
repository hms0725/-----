import styled from "styled-components";
import {useState} from "react";
import {debounce} from "lodash";

const CreateSecretRoomPopupWrapper = styled.div`
  width: 278px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  >.title {
    color: var(--Black-500, #202020);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 12px;
  }
  > input {
    margin-top: 12px;
    text-align: left;
    width: 100%;
    padding: 10px 12px;
    color: var(--Black-300, #333333);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #F0F0F0);
    outline: none;
    &::placeholder {
      color: var(--Black-200, #B7B7B7);
    }
  }
  >.hint {
    margin-top: 8px;
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 16.8px */
  }
  >.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 12px;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    background: var(--Purple-100, #F0EAFF);
    >.value {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;
      > span {
        width: 100%;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 19.6px */
      }
    }
    >.desc {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 18.2px */
    }
  }
`
const CreateSecretRoomPopup = () =>{
  const [BB, setBB] = useState(-1)
  const [SB, setSB] = useState(-1)
  const [minBuyIn, setMinBuyIn] = useState(-1)
  return <CreateSecretRoomPopupWrapper>
    <div className='title'>비밀방 생성</div>
    <input id='secret-password' type='password' placeholder='사용할 비밀번호 입력'/>
    <input type='number' placeholder='BB 설정' onChange={e => {
      debounce(() => {
        const value = parseInt(e.target.value)
        if (isNaN(value) || value < 1) {
          setSB(-1)
          setMinBuyIn(-1)
          return
        }else if(value > 1000000){
          setSB(1000000)
          setMinBuyIn(10000000)
          return
        }else{
          const innerValue = Math.floor(value/100)*100
          setBB(innerValue)
          setSB(innerValue /2)
          setMinBuyIn(innerValue * 10)
        }
      }, 100)()
    }}/>
    <input type='hidden' id='secret-bb' value={BB}/>
    <div className='hint'>* 100단위로 입력 가능합니다. (최대 100만BB)</div>
    <div className='content'>
      <div className='value'>
        <span>SB : {SB === -1 ? '-' : SB.toLocaleString()}</span>
        <span>BB : {BB === -1 ? '-' : BB.toLocaleString()}</span>
        <span>최소 바이인 : {minBuyIn === -1 ? '-' : minBuyIn.toLocaleString()}</span>
      </div>
      <div className='desc'>SB는 BB의 절반, 최소 바이인은 BB의 10배로 자동 설정됩니다.</div>
    </div>
  </CreateSecretRoomPopupWrapper>
}

export default CreateSecretRoomPopup;
