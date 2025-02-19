import styled from "styled-components";
import {useEffect, useState} from "react";
import {UserData} from "./index";
import {debounce} from "lodash";

const StepWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 48px);
  margin-top: 48px;
  padding: 20px 24px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-items: flex-start;

  > .title {
    color: ${p => p.theme.color.black500};
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 33.6px */
  }

  > .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  > .content-loading {
    flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .loader {
      margin: auto;
      border: 10px solid ${p => p.theme.color.black100};
      border-radius: 50%;
      border-top: 10px solid ${p => p.theme.color.purple300};
      width: 100px;
      height: 100px;
      animation: spinner 4s linear infinite;
    }

    @keyframes spinner {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
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

  > .button.success {
    cursor: pointer;
    background: ${p => p.theme.color.purple300};
    opacity: 1;
  }
`
const InputWrapper = styled.div<{ success: boolean; show?: boolean }>`
  margin-top: 32px;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  overflow: hidden;
  ${p => p.show ? `
    opacity: 1;
    max-height: unset;
    height: auto;
  ` : `
    opacity: 0;
    height: 0;
    max-height: 0;
  `};

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
  onConfirm: (newPassword: string) => void
}

const StepPassword = ({onConfirm}: StepProps) => {
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (password !== '' && rePassword !== '') {
      setCanNext(true)
    } else {
      setCanNext(false)
    }
  }, [password, rePassword]);

  return <StepWrapper>
    <div className='title'>
      {
        password === '' ? <>
          변경할 비밀번호를<br/>입력해주세요
        </> : <>
          변경할 비밀번호를<br/>한번 더 입력해주세요
        </>
      }
    </div>
    <div className='content'>
      <InputWrapper success={password !== ''} show={true}>
        <input type='password' placeholder='비밀번호 입력' onChange={e => {
          const value = e.target.value;
          if (value.length < 8 || value.length > 15) {
            debounce(() => setPassword(''), 100)();
            return;
          }
          //영문, 숫자, 특수문자 조합 8~15자리
          if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.{8,15})/.test(value)) {
            debounce(() => setPassword(''), 100)();
            return;
          }
          debounce(() => setPassword(value), 100)();
        }}/>
        <div className='label'>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill="#B7B7B7"/>
            <path d="M4 6L5.77778 7.5L8 4.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>영문, 숫자, 특수문자 조합 8~15자리</span>
        </div>
      </InputWrapper>
      <InputWrapper success={rePassword !== ''} show={password !== ''}>
        <input type='password' placeholder='비밀번호 재입력' onChange={e => {
          const value = e.target.value;
          if (value !== password) {
            debounce(() => setRePassword(''), 100)();
            return;
          }
          debounce(() => setRePassword(value), 100)();
        }}/>
        <div className='label'>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill="#B7B7B7"/>
            <path d="M4 6L5.77778 7.5L8 4.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>동일한 비밀번호</span>
        </div>
      </InputWrapper>
    </div>
    <div className={'button ' + ((canNext) ? 'success' : '')} onClick={debounce(() => {
      if (canNext) {
        onConfirm(password)
      }
    }, 500)}
    >
      완료
    </div>

  </StepWrapper>
}

export default StepPassword;
