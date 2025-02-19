import { useCallback, useState } from "react";
import styled from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import StepPassword from "./StepPassword";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { authPassword } from "../../../../api/auth";
import useUserInfo from "../../../../hooks/useUserInfo";
import StepPhone from "./StepPhone";
import StepVerification from "./StepVerification";

const FindIdWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 11;
  background: white;
  transition: all 0.5s ease-in-out;

  div.wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .route-section {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    transition: all 0.3s ease-in-out;
  }

  .route-section.transition-wrap-enter-done {
    position: relative;
  }

  .transition-wrap {
    position: absolute;
    left: 15px;
    right: 15px;
    transition: all 0.3s ease-in-out;
  }

  .transition-group.left .transition-wrap-enter {
    position: absolute;
    opacity: 0;
    transform: translate3d(20px, 0, 0);
  }

  .left .transition-wrap-enter-active {
    opacity: 1;
    transform: translate3d(100%, 0, 0);
    transition: opacity 150ms, transform 1.5s;
  }

  .left .transition-wrap-exit {
    position: absolute;
    opacity: 1;
    //transform: translate3d(-100%, 0, 0);
  }

  .left .transition-wrap-exit-active {
    position: absolute;
    opacity: 0;
    //transform: scale(0.9);
    //transform: translate3d(-100%, 0, 0);
  }

  // right

  .right .transition-wrap-enter {
    position: absolute;
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .right .transition-wrap-enter-active {
    opacity: 1;
    transform: translate3d(-100%, 0, 0);
    transition: opacity 300ms, transform 1.5s;
  }

  .right .transition-wrap-exit {
    position: absolute;
    opacity: 1;
    transform: translate3d(100%, 0, 0);
  }

  .right .transition-wrap-exit-active {
    position: absolute;
    opacity: 0;
    transform: scale(0.9);
    transform: translate3d(100%, 0, 0);
  }

  > .section {
    width: 100%;
    height: 100%;
  }

  .page-wrap {
    display: block;
    overflow: hidden;
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;
  }

  > .header {
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 11;

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;
type Step = "phone" | "verification" | "change-password";

export interface UserData {
  id?: string;
  password?: string;
  nickname?: string;
  verification?: string | null;
  referral?: string;
  marketingAgreement?: boolean;
}

interface SignupProps {
  onClose: () => void;
}

const FindPW = ({ onClose }: SignupProps) => {
  const { user } = useUserInfo(true);
  const [step, setStep] = useState<Step>("phone");
  const handleConfirm = useCallback(
    (newPassword: string) => {
      if (!user?.textId) {
        return;
      }

      authPassword({
        textId: user.textId,
        newPassword: newPassword,
      })
        .then(() => {
          onClose();
          enqueueSnackbar("비밀번호 변경이 완료되었습니다.", {
            variant: "success",
          });
        })
        .catch((e: any) => {
          enqueueSnackbar(e.message, { variant: "error" });
        });
    },
    [user]
  );

  return (
    <FindIdWrapper>
      <div className="header">
        <img
          className="close"
          src="/image-web/Icon/Back.svg"
          onClick={onClose}
        />
        <div className="title">비밀번호 변경</div>
      </div>
      <div className="wrap">
        <TransitionGroup className={`transition-group left`}>
          <CSSTransition
            timeout={{
              enter: 150,
              exit: 150,
            }}
            classNames={"transition-wrap"}
          >
            <div className="route-section fade">
              {step === "phone" && (
                <StepPhone
                  onNext={() => {
                    setStep("verification");
                  }}
                />
              )}
              {step === "verification" && (
                <StepVerification
                  onNext={() => {
                    setStep("change-password");
                  }}
                />
              )}
              {step === "change-password" && (
                <StepPassword onConfirm={handleConfirm} />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </FindIdWrapper>
  );
};

export default FindPW;
