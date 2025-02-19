import styled from "styled-components";
import {useEffect, useState} from "react";
import {UserData} from "./index";
import {debounce} from "lodash";
import {certification} from "../../../../utils/iamport";
import {enqueueSnackbar} from "notistack";

const StepWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 48px;
  padding: 20px 24px;
  background: white;

  > .title {
    color: ${p => p.theme.color.black500};
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 33.6px */
  }
  >.sub-title {
    margin-top: 12px;
    color: ${p => p.theme.color.black300};
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  > .button {
    transition: all 0.3s;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 56px;
    width: 100%;
    border-radius: 8px;
    background: ${p => p.theme.color.purple300};
    color: #F0F0F0;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: not-allowed;
    opacity: 0.3;
  }
  > .button:active {
    background: #502bb5;
  }
  >.button.success {
    cursor: pointer;
    background: ${p => p.theme.color.purple300};
    opacity: 1;
  }
`
const InputWrapper = styled.div<{ success: boolean }>`
  margin-top: 32px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  input {
    padding: 10px 0;
    width: 100%;
    border: none;
    border-bottom-width: 2px;
    border-bottom-style: solid;
        border-bottom-color: ${p => p.success ? p.theme.color.purple300 : p.theme.color.black200};
    outline: none;
    text-align: left;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    transition: all 0.3s;

    &:focus {
        border-bottom-color: ${p => p.theme.color.purple300};
    }
    

    &::placeholder {
      color: ${p => p.theme.color.black200};
    }
  }

  > .label {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    color: ${p => p.theme.color.purple200};
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    > svg {
      > circle {
        transition: all 0.3s;
        fill: ${p => p.success ? p.theme.color.purple200 : p.theme.color.black200};

      }
    }
  }
`

interface StepProps {
  onNext: (data: UserData) => void
}

const StepVerification = ({onNext}: StepProps) => {
  const [phone, setPhone] = useState('');
  const [canNext, setCanNext] = useState(true);

  return <StepWrapper>
    <div className='title'>
      본인인증
    </div>
    <div className='sub-title'>
      본인인증을 진행해 주세요.
    </div>
    <div className='content'>

    </div>
    <div className={'button ' + (canNext ? 'success' : '')} onClick={() => {
      if (!canNext) return;
      certification(true).then((res) => {
        if (res) {
          onNext({id: '', password: '', nickname: '', verification: phone, referral: ''})
        }else{
          enqueueSnackbar('본인인증에 실패했습니다.', {variant: 'error'})
        }
      }).catch(()=>{
        enqueueSnackbar('본인인증에 실패했습니다.', {variant: 'error'})
      })
    }}>
      다음
    </div>
  </StepWrapper>
}

export default StepVerification;
