import styled from "styled-components";

const JoinSecretRoomPopupWrapper = styled.div`
  width: 278px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 20px;
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
        width: 122px;
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

const JoinSecretRoomPopup = () =>{
  return <JoinSecretRoomPopupWrapper>
    <div className='title'>비밀방 입장</div>
    <input id='secret-group-id' type='number' placeholder='방번호 입력'/>
    <input id='secret-password' type='password' placeholder='비밀번호 입력'/>
  </JoinSecretRoomPopupWrapper>
}

export default JoinSecretRoomPopup;
