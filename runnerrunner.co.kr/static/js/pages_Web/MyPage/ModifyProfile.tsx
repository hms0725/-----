import { useCallback, useEffect, useMemo, useState } from "react";
import Agreement, { TermsType } from "../Agreement";
import { authExit, authUpdate } from "../../../api/auth";
import { enqueueSnackbar } from "notistack";
import { certification } from "../../../utils/iamport";
import useUserInfo from "../../../hooks/useUserInfo";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import {
  clearCredential,
  LOCAL_STORAGE_ACCESS_KEY,
} from "../../../utils/network";
import { useHistory } from "react-router-dom";
import useDialog from "../../../hooks/useDialog";
import Adjust from "@adjustcom/adjust-web-sdk";
import useNativeApp, { isApp } from "../../../hooks/useNativeApp";
import {
  AdditionalInfoWrapper,
  BasicInfoWrapper,
  ModifyProfileWrapper,
  PasswordButtonWrapper,
  TextBox,
  VerificationWrapper,
} from "./styles/ModifyProfile";

interface ModifyProfileProps {
  onClose: () => void;
  onPassword?: () => void;
  onNickname?: () => void;
}

interface ModifyProfileRequest {
  nickname?: string;
  username?: string;
  phoneNumber?: string;
  gender?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDate?: string;
  expireType?: string;
  isAgree1?: boolean;
  accountInfo?: string;
  isValidate?: boolean;
  existed?: boolean;
  role?: string;
}

const ModifyProfile = ({
  onClose,
  onPassword,
  onNickname,
}: ModifyProfileProps) => {
  const { user, refreshUser } = useUserInfo(true);
  const [termsType, setTermsType] = useState<TermsType>(null);
  const agreementList = [
    "(필수) 이용약관 동의",
    "(필수) 개인정보 처리방침 약관 동의",
    "(필수) 위치정보 약관 동의",
    "(필수) 청소년 보호 약관 동의",
    "(선택) 마케팅에 관한 개인정보 수집 및 이용 동의",
  ];
  const [checkedAgreement, setCheckedAgreement] = useState([
    true,
    true,
    true,
    true,
    false,
  ]);
  const [expireType, setExpireType] = useState("ONE_YEAR");
  const [pendingUser, setPendingUser] = useState<ModifyProfileRequest>();
  const [accountBank, setAccountBank] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const { setUser } = useUserInfo(true);
  const history = useHistory();
  const { openDialog } = useDialog();
  const { sendMessageToNative } = useNativeApp();
  const setLoading = useSetRecoilState(loadingState);

  const isCertified = useMemo(() => {
    return Boolean(user?.validate || pendingUser?.isValidate);
  }, [user, pendingUser]);

  useEffect(() => {
    if (user?.expireType) {
      setExpireType(user.expireType);
    }
    if (user?.accountBank) {
      setAccountBank(user.accountBank);
    }
    if (user?.accountInfo) {
      setAccountNum(user.accountInfo);
    }
    if (user?.agree1) {
      setCheckedAgreement((v) => {
        const newVal = [...v];
        newVal[4] = user.agree1;
        return newVal;
      });
    }
  }, [user]);

  const handleClickCert = useCallback(() => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    certification()
      .then((res) => {
        return {
          nickname: res.nickname,
          username: res.username,
          phoneNumber: res.phoneNumber,
          birthYear: res.birth[0],
          birthMonth: res.birth[1],
          birthDate: res.birth[2],
          gender: res.gender,
          existed: res.existed,
          isValidate: true,
        } as ModifyProfileRequest;
      })
      .then(async (data: ModifyProfileRequest) => {
        if (data.existed) {
          enqueueSnackbar("이미 가입된 번호입니다.", { variant: "error" });
        } else {
          data.nickname = user.nickname;
          data.role = user.role;
          await authUpdate(data);
          await refreshUser();
          enqueueSnackbar("본인인증이 완료되었습니다.", { variant: "success" });
        }
      })
      .catch((e: any) => {
        enqueueSnackbar("본인인증에 실패했습니다: " + e.message, {
          variant: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!user?.id) {
      return;
    }
    const agreements = [...checkedAgreement].reverse();
    const data: any = {
      isAgree1: agreements[0],
      expireType: expireType,
    };

    data.nickname = user.nickname;
    data.role = user.role;

    data.accountBank = accountBank || null;
    data.accountInfo = accountNum || null;

    setLoading(true);
    authUpdate(data)
      .then(async () => {
        await refreshUser();
        enqueueSnackbar("정보를 업데이트했습니다.", { variant: "success" });
        if (process.env.REACT_APP_ENV !== "production") {
          if (!isApp) {
            Adjust.trackEvent({
              eventToken: "e543tc",
              callbackParams: [
                { key: "user_id", value: "" + user.id },
                { key: "event_value", value: "user_update" },
              ],
            });
          } else {
            sendMessageToNative("adjustEvent", "", {
              eventToken: "e543tc",
              eventName: "test_mypage",
              data: user.id!,
              callbackParams: {
                user_id: "" + user.id!,
                event_value: "user_update",
              },
            });
          }
        }
      })
      .catch((e: any) => {
        enqueueSnackbar(e.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [checkedAgreement, expireType, accountBank, accountNum]);

  //탈퇴
  const handleQuit = useCallback(() => {
    if (!user?.id) {
      return;
    }

    authExit({ userId: user.id })
      .then(() => {
        if (process.env.REACT_APP_ENV === "production") {
          if (!isApp) {
            Adjust.trackEvent({
              eventToken: "8o6svr",
              callbackParams: [
                { key: "user_id", value: "" + user.id },
                {
                  key: "event_value",
                  value: `Web_Exit_${user.nickname}`,
                },
              ],
            });
          } else {
            sendMessageToNative("adjustEvent", "", {
              eventToken: "8o6svr",
              eventName: "Register_remove",
              data: user.id!,
              callbackParams: {
                user_id: "" + user?.id,
                event_value: `Exit_${user.nickname}`,
              },
            });
          }
        } else {
          if (!isApp) {
            Adjust.trackEvent({
              eventToken: "e543tc",
              callbackParams: [
                { key: "user_id", value: "" + user.id },
                { key: "event_value", value: "user_exit" },
              ],
            });
          } else {
            sendMessageToNative("adjustEvent", "", {
              eventToken: "e543tc",
              eventName: "test_mypage",
              data: user.id!,
              callbackParams: {
                user_id: "" + user.id!,
                event_value: "user_exit",
              },
            });
          }
        }
        clearCredential();
        setUser(undefined);
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);
        history.replace("/logout");
        enqueueSnackbar("회원탈퇴가 완료되었습니다.", { variant: "success" });
      })
      .catch((e: any) => {
        enqueueSnackbar(e.message, { variant: "error" });
      });
  }, [user]);

  return (
    <>
      {termsType !== null && (
        <Agreement type={termsType} onClose={() => setTermsType(null)} />
      )}
      <ModifyProfileWrapper scrollLock={termsType !== null}>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">프로필 수정</div>
        </div>
        <div className="inner">
          <BasicInfoWrapper>
            <div className="title">기본 정보</div>
            <div className="sub-title">기본 정보는 수정이 불가합니다.</div>
            <div className="box">
              {user?.validate && (
                <>
                  <div className="item">
                    <div className="title">이름</div>
                    <TextBox>{user?.username}</TextBox>
                  </div>
                  <div className="item">
                    <div className="title">생년월일</div>
                    <TextBox>{user?.birthday}</TextBox>
                  </div>
                  <div className="item">
                    <div className="title">성별</div>
                    <TextBox>{user?.gender === "MALE" ? "남" : "여"}</TextBox>
                  </div>
                </>
              )}
              <div className="item">
                <div className="title">닉네임</div>
                <TextBox>{user?.nickname}</TextBox>
              </div>
            </div>
          </BasicInfoWrapper>
          <VerificationWrapper>
            <div className="title">본인 인증 정보</div>
            {isCertified && (
              <div className="verified-box">
                <div className="title">
                  <img src="/image-web/Icon/Certified/small.svg" />
                  본인 인증 완료
                </div>
                <div className="description">
                  인증 전화번호 :{" "}
                  {user?.phoneNumber || pendingUser?.phoneNumber}
                </div>
              </div>
            )}
            {!isCertified && (
              <div className="no-box">
                <div className="title">등록된 본인 인증 정보가 없습니다.</div>
                <div className="description">
                  본인 인증 후 계좌 정보 입력이 가능합니다.
                </div>
                <div className="button" onClick={handleClickCert}>
                  <img src="/image-web/customerMenu/small_black.svg" />
                  <span>본인 인증하기</span>
                </div>
              </div>
            )}
          </VerificationWrapper>
          <PasswordButtonWrapper>
            <div
              className="button"
              onClick={() => {
                onPassword && onPassword();
              }}
            >
              <span>비밀번호 변경</span>
            </div>
            <div
              className="button"
              onClick={() => {
                onNickname && onNickname();
              }}
            >
              <span>닉네임 변경</span>
            </div>
          </PasswordButtonWrapper>
          <AdditionalInfoWrapper>
            <div className="title">추가 정보</div>
            <div className="input-box">
              <div className="title">정보 보유 기간</div>
              <div className="radio-row">
                <div
                  className={
                    "item " + (expireType === "ONE_YEAR" ? "selected" : "")
                  }
                  onClick={() => setExpireType("ONE_YEAR")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle
                      className="border"
                      cx="10"
                      cy="10"
                      r="9.5"
                      fill="white"
                    />
                    <circle className="inner" cx="10" cy="10" r="6" />
                  </svg>
                  <div className="text">1년</div>
                </div>
                <div
                  className={
                    "item " + (expireType === "THREE_YEAR" ? "selected" : "")
                  }
                  onClick={() => setExpireType("THREE_YEAR")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle
                      className="border"
                      cx="10"
                      cy="10"
                      r="9.5"
                      fill="white"
                    />
                    <circle className="inner" cx="10" cy="10" r="6" />
                  </svg>
                  <div className="text">3년</div>
                </div>
                <div
                  className={
                    "item " + (expireType === "EXIT" ? "selected" : "")
                  }
                  onClick={() => setExpireType("EXIT")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle
                      className="border"
                      cx="10"
                      cy="10"
                      r="9.5"
                      fill="white"
                    />
                    <circle className="inner" cx="10" cy="10" r="6" />
                  </svg>
                  <div className="text">회원 탈퇴 시</div>
                </div>
              </div>
            </div>
            <div className="input-box">
              <div className="title">약관 동의 내역</div>
              <div className="list">
                {agreementList.map((item, index) => {
                  if (item.includes("필수")) {
                    return null;
                  }
                  const handleClickAgreement = () => {
                    const newCheckedAgreement = [...checkedAgreement];
                    newCheckedAgreement[index] = !newCheckedAgreement[index];
                    setCheckedAgreement(newCheckedAgreement);
                  };
                  return (
                    <div className="row" key={index}>
                      <svg
                        onClick={handleClickAgreement}
                        className={
                          "checkbox " +
                          (checkedAgreement[index] ? "checked" : "") +
                          (item.includes("필수") ? " disabled" : " ")
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <circle cx="10" cy="10" r="10" fill="#8359F7" />
                        <path
                          d="M6 10L8.96296 12.5L13.6667 7.5"
                          stroke="white"
                          strokeWidth="1.66667"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div onClick={handleClickAgreement} className="text">
                        {item}
                      </div>
                      <div
                        className="button"
                        onClick={() => setTermsType("marketing")}
                      >
                        보기
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="input-box">
              <div
                className="withdraw-button"
                onClick={() => {
                  openDialog({
                    type: "web",
                    text:
                      "회원 탈퇴를 진행하시겠습니까?<br/>" +
                      "탈퇴 후 데이터 복구는 불가합니다.",
                    onConfirm: handleQuit,
                    confirmText: "탈퇴하기",
                    confirm: true,
                    confirmColor: "#D91818",
                  });
                }}
              >
                회원탈퇴
              </div>
              <div className="edit-button" onClick={handleSubmit}>
                프로필 수정
              </div>
            </div>
          </AdditionalInfoWrapper>
        </div>
      </ModifyProfileWrapper>
    </>
  );
};

export default ModifyProfile;
