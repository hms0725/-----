import styled from "styled-components";
import {useEffect, useState} from "react";

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
        flex-shrink: 0;
        color: ${p => p.theme.color.black500};
        font-family: Pretendard;
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 33.6px */
    }

    > .sub-title {
        flex-shrink: 0;
        margin-top: 12px;
        color: ${p => p.theme.color.black300};
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }

    > .content {
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
        flex-shrink: 0;
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

interface StepProps {
  done: boolean;
  onNext: () => void;
}

const StepComplete = ({
                        done,
                        onNext
                      }: StepProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (done) {
      setIsLoading(false);
    }
  }, [done]);

  return <StepWrapper>
    <div className='title'>
      {isLoading ? '회원가입 중' : '회원가입 완료!'}
    </div>
    {
      isLoading ? <div className='content'>
        <div className="loader"/>
      </div> : <>
        <div className='sub-title'>
          러너러너에 오신 것을 환영합니다
        </div>
        <div className='content'/>
      </>
    }
    <div className={'button ' + (isLoading ? '' : 'success')} onClick={() => {
      if (!isLoading) {
        onNext();
      }
    }}>
      확인
    </div>
  </StepWrapper>
}

export default StepComplete;
