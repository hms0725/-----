import styled from "styled-components";

const StepWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 48px);
  margin-top: 48px;
  padding: 20px 24px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-items: flex-start;
  z-index: 100;

  > .title {
    flex-shrink: 0;
    color: ${(p) => p.theme.color.black500};
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 33.6px */
  }

  > .sub-title {
    flex-shrink: 0;
    margin-top: 12px;
    color: ${(p) => p.theme.color.black300};
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  > .small-content {
    margin-top: 32px;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 40px;
    color: ${(p) => p.theme.color.black500};
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border-radius: 4px;
    background: ${(p) => p.theme.color.black100};
  }

  > .re-find-box {
    margin-top: 20px;
    gap: 8px;
    width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    > .title {
      color: ${(p) => p.theme.color.black300};
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button {
      width: 70px;
      height: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: ${(p) => p.theme.color.black500};
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 18px;
      border: 1px solid ${(p) => p.theme.color.black200};
    }
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
      border: 10px solid ${(p) => p.theme.color.black100};
      border-radius: 50%;
      border-top: 10px solid ${(p) => p.theme.color.purple300};
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
    background: ${(p) => p.theme.color.purple300};
    color: #f0f0f0;
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
    background: ${(p) => p.theme.color.purple300};
    opacity: 1;
  }

  > .button.secondary {
    cursor: pointer;
    opacity: 1;
    margin-top: 12px;
    background: white;
    color: ${(p) => p.theme.color.purple300};
  }
`;

interface StepProps {
  id: string;
  onConfirm: () => void;
  onFindPassword: () => void;
}

const StepComplete = ({ id, onConfirm, onFindPassword }: StepProps) => {
  if (!id) {
    return (
      <StepWrapper>
        <div className="title">
          {!id ? (
            "아이디 찾는 중"
          ) : (
            <>
              아이디는
              <br />
              다음과 같습니다
            </>
          )}
        </div>
        <div className="content">
          <div className="loader" />
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <div className="title">
        아이디는
        <br />
        다음과 같습니다
      </div>

      <div className="small-content">{id}</div>
      <div className="content" />

      <div className={"button success"} onClick={onConfirm}>
        확인
      </div>
      <div className={"button secondary"} onClick={onFindPassword}>
        비밀번호 찾기
      </div>
    </StepWrapper>
  );
};

export default StepComplete;
