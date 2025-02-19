import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import {UserData} from "./index";
import {debounce} from "lodash";

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
  > .button.success {
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

const StepId = ({onNext}: StepProps) => {
  const [id, setId] = useState('');
  const [canNext, setCanNext] = useState(false);
  useEffect(() => {
    if (id !== '') {
      setCanNext(true)
    } else {
      setCanNext(false)
    }
  }, [id]);


  return <StepWrapper>
    <div className='title'>
      아이디를<br/>입력해주세요
    </div>
    <div className='content'>
      <InputWrapper success={id !== ''}>
        <input type='text' placeholder='아이디 입력' onChange={e => {
          //영문, 숫자 4~15자리
          const value = e.target.value;
          if (value.length < 4 || value.length > 15) {
            debounce(() => setId(''), 100)();
            return;
          }
          if (!/^[a-zA-Z0-9]{4,15}$/.test(value)) {
            debounce(() => setId(''), 100)();
            return;
          }
          debounce(() => setId(value), 100)();
        }}/>
        <div className='label'>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill="#B7B7B7"/>
            <path d="M4 6L5.77778 7.5L8 4.5" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>영문, 숫자 4~15자리</span>
        </div>
      </InputWrapper>
    </div>
    <div className={'button ' + (canNext ? 'success' : '')} onClick={() => {
      if (!canNext) return;
      onNext({id})
    }}>
      다음
    </div>
  </StepWrapper>
}

export default StepId;
