import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import StepId from "./StepId";
import StepPassword from "./StepPassword";
import StepNickname from "./StepNickname";
import StepReferral from "./StepReferral";
import StepComplete from "./StepComplete";
import {
  authFindByNickname,
  authSignUp,
  authVerifiedNickname,
  authVerifiedTextId,
} from "../../../api/auth";
import { enqueueSnackbar } from "notistack";
import CertAskSheet from "./CertAskSheet";
import { USER_NOT_FOUND } from "../../../api/code";
import TermsSheet from "./TermsSheet";
import { certification } from "../../../utils/iamport";
import useScreenOrientation from "../../../hooks/useScreenOrientation";
import { useHistory } from "react-router-dom";
import { LoginRouterState } from "../Login";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import { referralLogRegister } from "../../../api/referral";
import useDialog from "../../../hooks/useDialog";
import Adjust from "@adjustcom/adjust-web-sdk";
import useNativeApp, { isApp } from "../../../hooks/useNativeApp";
import StepAddress from "./StepAddress";

const SignupWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100%;
  z-index: 10;
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

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }
  }
`;
type Step =
  | "id"
  | "password"
  | "nickname"
  | "address"
  | "cert"
  | "referral"
  | "terms"
  | "complete";

export interface UserData {
  id?: string;
  password?: string;
  nickname?: string;
  username?: string;
  phoneNumber?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE";
  certificated?: boolean;
  referral?: string;
  agreements?: boolean[];
  signupType?: string;
  accessToken?: string;
  areaProvinceId?: number;
  areaCityId?: number;
  role?: string;
}

interface SignupProps {
  snsData: LoginRouterState;
  onClose: () => void;
}

const Signup = ({ snsData, onClose }: SignupProps) => {
  const history = useHistory();
  const orientation = useScreenOrientation();
  const [step, setStep] = useState<Step>("id");
  const [userData, setUserData] = useState<UserData>({});
  const [done, setDone] = useState(false);
  const [showCertSkipSheet, setShowCertSkipSheet] = useState(false);
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const { sendMessageToNative } = useNativeApp();
  const setLoading = useSetRecoilState(loadingState);

  const { openDialog } = useDialog();

  const verifyId = async (id: string): Promise<boolean> => {
    try {
      const { code } = await authVerifiedTextId({ textId: id });
      return code === 200;
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
      return false;
    }
  };

  const verifyNickname = async (nickname: string) => {
    try {
      const { verified } = await authVerifiedNickname({ nickname });
      if (!verified) {
        enqueueSnackbar("이미 사용중인 닉네임입니다.", { variant: "error" });
      }
      return verified;
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
      return false;
    }
  };

  const verifyReferrer = async (nickname: string): Promise<boolean> => {
    try {
      const referrer = await authFindByNickname({ nickname });
      if (!referrer.validate) {
        enqueueSnackbar("본인인증이 되어 있지 않은 추천인입니다.", {
          variant: "error",
        });
        return false;
      }
      return true;
    } catch (e: any) {
      if (e.code === USER_NOT_FOUND) {
        enqueueSnackbar("존재하지 않는 추천인 입니다.", { variant: "error" });
      }
      return false;
    }
  };

  const certificateUser = () => {
    setShowCertSkipSheet(false);
    setLoading(true);
    certification()
      .then((res) => {
        setShowCertSkipSheet(false);

        if (res.existed) {
          enqueueSnackbar("이미 가입된 회원입니다.", { variant: "error" });
          setStep("nickname");
        } else {
          const newUserData: UserData = {
            ...userData,
            username: res.username,
            phoneNumber: res.phoneNumber,
            birthYear: res.birth[0],
            birthMonth: res.birth[1],
            birthDate: res.birth[2],
            gender: res.gender,
            certificated: true,
          };
          setUserData(newUserData);
          enqueueSnackbar("본인인증 되었습니다.", { variant: "success" });

          nextStep("cert", newUserData);
        }
      })
      .catch((e: any) => {
        if (e.message === "failed to init") {
          enqueueSnackbar("현재 본인인증을 할 수 없습니다", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("본인인증에 실패했습니다: " + e.message, {
            variant: "error",
          });
        }
        setStep("nickname");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    //PC버전인경우, signup으로 랜딩
    if (orientation === "landscape") {
      onClose();
      history.push("/signup");
    }
  }, [orientation]);

  // SNS 정보를 이용한 회원가입 핸들링
  useEffect(() => {
    const userData = {
      id: snsData?.textId || "",
      password: "",
      signupType: snsData?.loginType,
      accessToken: snsData?.accessToken,
    };

    if (userData.signupType && userData.accessToken) {
      setUserData(userData);
      setStep("nickname");
    }
  }, [snsData]);

  const signUp = (userData: UserData) => {
    authSignUp({
      textId: userData.id!,
      password: userData.password!,
      nickname: userData.nickname!,
      username: userData.username!,
      phoneNumber: userData.phoneNumber || "",
      birthYear: userData.birthYear || "",
      birthMonth: userData.birthMonth || "",
      birthDate: userData.birthDate || "",
      gender: userData.gender || null,
      expireType: "ONE_YEAR",
      isAgree1: userData.agreements![0],
      isAgree2: userData.agreements![1],
      isAgree3: userData.agreements![2],
      isAgree4: userData.agreements![3],
      isAgree5: userData.agreements![4],
      isAllAgree: userData.agreements!.find((x) => !x) === undefined,
      isValidate: !!userData.certificated,
      recommendNickname: userData.referral || "",
      signupType: userData.signupType || "",
      accessToken: userData.accessToken || "",
      areaProvinceId: userData?.areaProvinceId,
      areaCityId: userData?.areaCityId,
      role: userData?.role ?? "ROLE_USER",
    })
      .then(async (res) => {
        if (process.env.REACT_APP_ENV === "production") {
          if (!isApp) {
            if (userData.referral) {
              Adjust.trackEvent({
                eventToken: "dm6m4f",
                callbackParams: [
                  { key: "user_id", value: "" + res.payload.id },
                  { key: "event_value", value: "" + userData.id },
                ],
              });
            } else {
              Adjust.trackEvent({
                eventToken: "f0hhdw",
                callbackParams: [
                  { key: "user_id", value: "" + res.payload.id },
                  { key: "event_value", value: "Signup" },
                ],
              });
            }
          } else {
            if (userData.referral) {
              sendMessageToNative("adjustEvent", "", {
                eventToken: "dm6m4f",
                eventName: "Regiester_recommend",
                data: userData.id!,
                callbackParams: {
                  user_id: "" + res.payload.id,
                  event_value: "" + userData.id,
                },
              });
            } else {
              sendMessageToNative("adjustEvent", "", {
                eventToken: "f0hhdw",
                eventName: "Signup",
                data: userData.id!,
                callbackParams: {
                  user_id: "" + res.payload.id,
                  event_value: "Signup",
                },
              });
            }
          }
        }
        setDone(true);
        if (userData.referral) {
          referralLogRegister({
            referralName: userData.referral,
            newUserName: userData.nickname!,
            textId: userData.id!,
          }).then(() => {
            enqueueSnackbar("추천인 등록이 완료되었습니다.", {
              variant: "success",
            });
          });
        }
      })
      .catch((e: any) => {
        setDone(false);

        if (e.statusCode === 400) {
          enqueueSnackbar("회원가입 실패: " + e.message, { variant: "error" });
          setStep("id");
        }
      });
  };

  const nextStep = async (current: Step, userData: UserData) => {
    if (current === "id") {
      const verified = await verifyId(userData.id!);
      if (!verified) {
        return;
      }
      setStep("password");
    } else if (current === "password") {
      setStep("nickname");
    } else if (current === "nickname") {
      const verified = await verifyNickname(userData.nickname!);
      if (!verified) {
        return;
      }
      setStep("address");
    } else if (current === "address") {
      setShowCertSkipSheet(true);
    } else if (current === "cert") {
      setShowCertSkipSheet(false);
      if (userData.certificated) {
        setStep("referral");
      } else {
        setShowTermsSheet(true);
      }
    } else if (current === "referral") {
      if (userData.referral) {
        const verified = await verifyReferrer(userData.referral!);
        if (!verified) {
          return;
        }
      }
      setShowTermsSheet(true);
    } else if (current === "terms") {
      setShowTermsSheet(false);
      setStep("complete");
      signUp(userData);
    }

    setUserData({ ...userData });
  };

  const handleCloseSignUp = useCallback(() => {
    openDialog({
      text: "회원가입을 취소하시겠습니까?",
      confirm: true,
      type: "web",
      confirmText: "예",
      cancelText: "아니오",
      onConfirm: () => {
        window.location.href = "/login";
      },
    });
  }, [history, openDialog]);

  return orientation === "portrait" ? (
    <SignupWrapper>
      <div className="header">
        {step !== "complete" && (
          <img
            className="close"
            src="/image-web/Icon/Close_gray.svg"
            onClick={handleCloseSignUp}
          />
        )}
        <div className="title">회원가입</div>
      </div>
      <div className="wrap">
        <TransitionGroup className={`transition-group left`}>
          <CSSTransition
            key={step}
            timeout={{
              enter: 150,
              exit: 150,
            }}
            classNames={"transition-wrap"}
          >
            <div className="route-section fade">
              {step === "id" && (
                <StepId
                  onNext={(data) => {
                    nextStep(step, {
                      ...userData,
                      id: data.id,
                    });
                  }}
                />
              )}
              {step === "password" && (
                <StepPassword
                  onNext={(data) => {
                    nextStep(step, {
                      ...userData,
                      password: data.password,
                    });
                  }}
                />
              )}
              {step === "nickname" && (
                <StepNickname
                  onNext={(data) => {
                    nextStep(step, {
                      ...userData,
                      nickname: data.nickname,
                    });
                  }}
                />
              )}
              {step === "referral" && (
                <StepReferral
                  onNext={(data) => {
                    nextStep(step, {
                      ...userData,
                      referral: data.referral,
                    });
                  }}
                />
              )}
              {step === "address" && (
                <StepAddress
                  onNext={(data) => {
                    nextStep(step, {
                      ...userData,
                      areaProvinceId: data.areaProvinceId,
                      areaCityId: data.areaCityId,
                      role: data.role,
                    });
                  }}
                />
              )}
              {step === "complete" && (
                <StepComplete
                  done={done}
                  onNext={() => {
                    window.location.href = "/login";
                  }}
                />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
      <CertAskSheet
        show={showCertSkipSheet}
        onSkip={() => nextStep("cert", userData)}
        onContinue={certificateUser}
      />
      <TermsSheet
        show={showTermsSheet}
        onContinue={(arr) =>
          nextStep("terms", {
            ...userData,
            agreements: arr,
          })
        }
        onClose={() => setShowTermsSheet(false)}
        onError={() => {
          const termSheet = document.getElementById("terms-sheet");
          if (termSheet) {
            //Zindex를 낮춰서 snackbar가 보여지게
            termSheet.style.zIndex = "99";
            setTimeout(() => {
              enqueueSnackbar("필수약관에 모두 동의해주세요", {
                variant: "error",
              });
            }, 200);
          }
        }}
      />
    </SignupWrapper>
  ) : (
    <></>
  );
};

export default Signup;
