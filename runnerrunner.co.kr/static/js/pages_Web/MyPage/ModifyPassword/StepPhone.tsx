import styled from "styled-components";
import {useEffect, useState} from "react";
import {UserData} from "./index";
import {debounce} from "lodash";
import useUserInfo from "../../../../hooks/useUserInfo";
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

  > .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 32px;
    > .sub-title {
      flex-shrink: 0;
      color: ${p => p.theme.color.black300};
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
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
  >.button.success {
    cursor: pointer;
    background: ${p => p.theme.color.purple300};
    opacity: 1;
  }
`
const InputWrapper = styled.div<{ success: boolean }>`
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

const StepPhone = ({onNext}: StepProps) => {
  const {user} = useUserInfo(true)
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [canNext, setCanNext] = useState(false);
  useEffect(() => {
    if (phone.length === 13) {
      setCanNext(true)
    } else {
      setCanNext(false)
    }
  }, [phone]);
  return <StepWrapper>
    <div className='content'>
      <div className='sub-title'>
        본인인증을 진행한 휴대폰 번호를 입력해주세요
      </div>
      <InputWrapper success={phone !== ''}>
        <input type='decimal' placeholder='010' onChange={e => {
          const value = e.target.value.toString();
          if (value.length > 13) return;
          let tmpValue = ""
          if (!(value.length > 1 && value.slice(0, 4) === '010 ')) {
            if (phone.length - value.length < 0) {
              tmpValue += '010 '
            }
            console.log(value.length, value.slice(0, 4), value.slice(0, 4) === '010 ')

          }
          console.log(value.length, value)
          if (value.length > 8 && value[8] !== '-') {
            tmpValue += value.slice(0, 8) + '-' + value.slice(8)
          } else {
            tmpValue += value
          }
          debounce(() => setPhone(tmpValue), 100)();
        }} value={phone}/>
      </InputWrapper>
    </div>
    <div className={'button ' + (canNext ? 'success' : '')} onClick={() => {
      if (!canNext) return;
      const phoneNumber = phone.replace(/[^0-9]/g, '');
      if(user?.phoneNumber !== phoneNumber) {
        enqueueSnackbar('휴대폰 번호가 일치하지 않습니다.', {variant: 'error'})
      }else {
        onNext({})
      }
    }}>
      다음
    </div>
  </StepWrapper>
}

export default StepPhone;
