import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";
import Signup from "./SignUp";
import FindId from "./FindId";
import FindPW from "./FindPW";
import { enqueueSnackbar } from "notistack";
import { useHistory, useLocation } from "react-router-dom";
import { authLogin } from "../../api/auth";
import { useSetRecoilState } from "recoil";
import useUserInfo from "../../hooks/useUserInfo";
import { loadingState } from "../../recoil/app";
import useScreenOrientation, {
  MEDIA_DESKTOP,
  MIN_HEIGHT_DESKTOP,
  MIN_WIDTH_DESKTOP,
} from "../../hooks/useScreenOrientation";
import useDialog from "../../hooks/useDialog";
import useNativeApp, { isApp } from "../../hooks/useNativeApp";
import ChangeForKakao from "../../components/changeForKakao";
import { clearCredential, LOCAL_STORAGE_ACCESS_KEY } from "../../utils/network";
import { Overlay } from "./OddsCalc/styles";
import LoginToKakao from "../../components/LoginKakao/loginToKakaoInfo";

const LoginWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: scroll;
  position: relative;
  > .back {
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
    cursor: pointer;
    position: absolute;
    top: 16px;
    left: 16px;
  }
  > .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 48px;
    padding-bottom: 100px;
    position: relative;
    @media ${MEDIA_DESKTOP} {
      padding-top: 120px;
      padding-bottom: 0px;
    }

    > .logo {
      width: 64px;
      height: 64px;
      object-fit: contain;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    > .logo-title {
      margin-top: 12px;
      color: ${(p) => p.theme.color.purple300};
      text-align: center;
      font-family: "yg-jalnan";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 134%; /* 26.8px */
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    > .login-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 30px 0 20px;
      gap: 6px;
    }

    > .sns-login-box {
      margin-top: 44px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;

      > .title {
        color: ${(p) => p.theme.color.black400};
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 16px;

        > .item {
          cursor: pointer;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: red;
          padding: 11px;
          overflow: hidden;
          position: relative;

          > img {
            width: 100%;
            height: 100%;
          }

          > .rendered-button {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            overflow: hidden;
          }
        }

        > .item.apple {
          background: black;
        }

        .item.apple:active {
          background: #333333;
        }

        > .item.kakao {
          background: #f9e001;
        }

        .item.kakao:active {
          background: #d1b600;
        }

        > .item.naver {
          background: #00cd4c;
        }

        .item.naver:active {
          background: #009c37;
        }

        > .item.google {
          background: white;
          border: 1px solid ${(p) => p.theme.color.black100};
        }

        .item.google:active {
          background: #e6e6e6;
        }
      }
    }

    > .menu-row {
      margin-top: 38px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      > .menu {
        cursor: pointer;
        color: ${(p) => p.theme.color.black400};
        text-align: center;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
        padding: 0 20px;
        border-left: 1.7px solid ${(p) => p.theme.color.black100};

        &:first-child {
          padding-left: 0;
          border-left: none;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }
  }
`;

const InputWrapper = styled.input`
  width: 312px;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.28px;
  padding: 15px 12px;
  border-radius: 8px;
  border: 1px solid ${(p) => p.theme.color.black100};
  color: ${(p) => p.theme.color.black500};
  outline: none;
  text-align: left;

  &::placeholder {
    color: ${(p) => p.theme.color.black200};
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 312px;
  height: 56px;
  border-radius: 8px;
  background: ${(p) => p.theme.color.purple300};
  color: #f0f0f0;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease-in-out;

  &:active {
    background-color: ${(p) => p.theme.color.purple200};
  }
`;

const LoginPopup = styled.div`
  background: #fff;
  position: absolute;
  width: 308px;
  height: 242px;
  border-radius: 12px;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export interface LoginRouterState {
  redirect?: string;
  loginType?: string;
  accessToken?: string;
  textId?: string | null;
}

const Login = () => {
  const setLoading = useSetRecoilState(loadingState);
  const history = useHistory();
  const location = useLocation<LoginRouterState>();

  const idRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [showFindID, setFindId] = useState<boolean>(false);
  const [showFindPW, setFindPW] = useState<boolean>(false);
  const [snsData, setSnsData] = useState<LoginRouterState>({});

  const [isKakao, setIsKakao] = useState(false);
  const [isPopup, setIsPopup] = useState(false);

  const { openDialog } = useDialog();
  const { user, refreshUser } = useUserInfo();
  const { sendMessageToNative } = useNativeApp();

  // 이미 로그인 되어 있다면 뒤로 이동
  useEffect(() => {
    if (user) {
      history.goBack();
    }
  }, []);

  useEffect(() => {
    // path가 signup이면 회원가입을 띄운다.
    if (location.pathname === "/signup") {
      setShowSignUp(true);
    } else {
      setShowSignUp(false);
    }
  }, [location.pathname]);

  const handleLogin = useCallback(
    async (e: any, snsData?: LoginRouterState) => {
      setLoading(true);

      const params: {
        textId: string;
        password: string;
        loginType?: string;
        accessToken?: string;
      } = {
        textId: idRef.current?.value || "",
        password: pwRef.current?.value || "",
        loginType: snsData?.loginType,
        accessToken: snsData?.accessToken,
      };

      if (snsData?.textId) {
        params.textId = snsData.textId;
      }

      try {
        await authLogin(params);
        await refreshUser();
        if (params.loginType === "SIMPLE_KAKAO") {
          setLoading(false);
          setIsKakao(true);
          enqueueSnackbar(
            "2025년 2월3일부터 러너러너에서 카카오톡 지원이 종료됩니다. 기존 회원님의 데이터를 이어받을 계정을 새로 생성해주세요",
            { variant: "error" }
          );
          return;
        }

        const redirect = (location.state?.redirect ?? "").replace(
          window.location.origin,
          ""
        );
        if (history.action === "PUSH") {
          history.goBack();
        } else if (history.action === "REPLACE" && redirect.length > 0) {
          history.replace(redirect);
        } else {
          history.replace("/");
        }
      } catch (e: any) {
        if (e.code === 4007) {
          if (params.loginType !== "SIMPLE_KAKAO") {
            if (
              window.innerWidth > MIN_WIDTH_DESKTOP &&
              window.innerHeight > MIN_HEIGHT_DESKTOP
            ) {
              if (snsData?.loginType && snsData?.accessToken) {
                sessionStorage.setItem("type", snsData?.loginType);
                sessionStorage.setItem("token", snsData?.accessToken);
                sessionStorage.setItem("text_id", e.payload);
              }

              history.push(`/signup`);
            } else {
              setShowSignUp(true);
            }
            setSnsData((v) => ({
              ...v,
              textId: e.payload,
            }));
          } else {
            enqueueSnackbar(
              "2025년 2월3일부터 러너러너에서 카카오톡 지원이 종료됩니다. 다른 간편로그인을 선택해 주세요.",
              { variant: "error" }
            );
            history.replace("/login");
          }
        } else {
          enqueueSnackbar(e.message, { variant: "error" });
          // 로그인 실패 시 /login 경로로 리디렉션
          history.replace("/login");
        }
      }

      setLoading(false);
    },
    []
  );

  const handleKakaoLogin = useCallback(() => {
    setIsPopup(true);
  }, []);

  const handleNaverLogin = useCallback(() => {
    const cId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUri = `${window.location.origin}/snslogin/naverCallback`;
    const state = location.state?.redirect || "";
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${cId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.replace(url);
  }, []);

  const handleGoogleLogin = useCallback(() => {
    const cId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/snslogin/googleCallback`;
    const state = location.state?.redirect || "";
    const scope = "email";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${cId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
    window.location.href = url;
  }, []);

  const decodeApplePayload = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(payload);
    } catch (e) {
      enqueueSnackbar("디코딩 실패", { variant: "error" });
    }
  };

  const handleAppleLogin = useCallback(() => {
    if (isApp) {
      sendMessageToNative("snsAppleLogin", "getAppLoginInfo", {
        data: "OK",
      }).then((res: any) => {
        if (res.loginType === "SIMPLE_APPLE") {
          const profile = JSON.parse(res.profile);
          let decodeToken;
          let textId = null;
          let accessToken;
          if (!profile.id_token) {
            if (!profile.identityToken) {
              enqueueSnackbar("SNS 로그인을 실패했습니다.", {
                variant: "error",
              });
              return;
            }
            try {
              accessToken = profile.identityToken;
              decodeToken = decodeApplePayload(profile.identityToken);
              if (profile.email != null) {
                textId = profile.email;
              }
            } catch (e) {
              enqueueSnackbar("SNS 로그인을 실패했습니다.", {
                variant: "error",
              });
            }
          } else {
            accessToken = profile.id_token;
            decodeToken = decodeApplePayload(profile.id_token);
            textId = decodeToken.email;
          }
          let snsDataObject: LoginRouterState;
          try {
            snsDataObject = {
              redirect: location.state?.redirect || "",
              loginType: "SIMPLE_APPLE",
              accessToken,
              textId,
            };
            setSnsData(snsDataObject);
            handleLogin(undefined, snsDataObject);
          } catch (e: any) {
            enqueueSnackbar("SNS 로그인을 실패했습니다.", { variant: "error" });
          }
        }
      });
    } else {
      window.AppleID.auth.signIn().then((res: any) => {
        if (!res.authorization.id_token) {
          enqueueSnackbar("SNS 로그인을 실패했습니다.", { variant: "error" });
          return;
        }
        const decodeToken = decodeApplePayload(res.authorization.id_token);
        const snsData = {
          redirect: res.authorization?.state || "",
          loginType: "SIMPLE_APPLE",
          accessToken: res.authorization.id_token,
          textId: decodeToken.email.toLowerCase(),
        };

        setSnsData(snsData);
        handleLogin(undefined, snsData);
      });
    }
  }, []);

  // SNS 로그인 SDK 초기화 (네이버랑 구글은 REST API 사용)
  useEffect(() => {
    // if (window.Kakao && !window.Kakao.isInitialized()) {
    //   window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY)
    // }

    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
        redirectURI: `${window.location.origin}/snslogin/appleCallback`,
        scope: "name email",
        state: location.state?.redirect || "",
        usePopup: true,
      });
    }
  }, [handleGoogleLogin]);

  // SNS 로그인 및 인증 정보 라우터에서 삭제 (Apple 제외)
  useEffect(() => {
    if (location.state?.loginType && location.state?.accessToken) {
      const state = { ...location.state };
      setSnsData(state);

      history.replace(window.location.pathname + window.location.search, {
        redirect: location.state?.redirect,
      });

      handleLogin(undefined, state);
    }
  }, []);

  return (
    <LoginWrapper>
      {showSignUp && (
        <Signup snsData={snsData} onClose={() => history.replace("/login")} />
      )}
      {showFindID && (
        <FindId
          onClose={() => setFindId(false)}
          onFindPassword={() => {
            setFindPW(true);
            setFindId(false);
          }}
        />
      )}
      {showFindPW && <FindPW onClose={() => setFindPW(false)} />}
      <img
        className="back"
        src="/image-web/Icon/Back.svg"
        alt="close"
        onClick={() => {
          history.replace("/");
        }}
      />
      <div className="inner">
        <img className="logo" alt="logo" src="/image-web/logo.png" />
        <div className="logo-title">
          대한민국 No.1 홀덤 플랫폼
          <br />
          러너러너
        </div>
        <div className="login-box">
          <InputWrapper ref={idRef} type={"text"} placeholder="아이디" />
          <InputWrapper ref={pwRef} type={"password"} placeholder="비밀번호" />
        </div>
        <ButtonWrapper onClick={handleLogin}>로그인</ButtonWrapper>
        <div className="sns-login-box">
          <div className="row">
            <img
              className="item kakao"
              alt="kakao"
              src="/image-web/Logo/Kakao.png"
              onClick={handleKakaoLogin}
            />
            <img
              className="item naver"
              alt="naver"
              src="/image-web/Logo/Naver.png"
              onClick={handleNaverLogin}
            />
            <img
              className="item apple"
              alt="apple"
              src="/image-web/Icon/Apple.png"
              onClick={handleAppleLogin}
            />
          </div>
        </div>
        <div className="menu-row">
          <div className="menu" onClick={() => setFindId(true)}>
            아이디 찾기
          </div>
          <div className="menu" onClick={() => setFindPW(true)}>
            비밀번호 찾기
          </div>
          <div
            className="menu"
            onClick={() => {
              sessionStorage.removeItem("text_id");
              sessionStorage.removeItem("type");
              sessionStorage.removeItem("token");
              history.push("/signup");
            }}
          >
            회원가입
          </div>
        </div>
      </div>
      {isKakao && (
        <ChangeForKakao
          onClose={() => {
            setIsKakao(false);
            clearCredential();
            refreshUser();
          }}
        />
      )}
      {isPopup && (
        <>
          <LoginToKakao
            onClose={() => {
              setIsPopup(false);
              setFindId(true);
            }}
          />
        </>
      )}
    </LoginWrapper>
  );
};

export default Login;
