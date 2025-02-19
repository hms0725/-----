import {
  LoginTokakaoButton,
  LoginToKakaoOverlay,
  LoginToKakaoTitle,
  LoginToKakaoWrapper,
} from "./style";

interface props {
  onClose: () => void;
}

const LoginToKakao = ({ onClose }: props) => {
  return (
    <>
      <LoginToKakaoOverlay />
      <LoginToKakaoWrapper>
        <LoginToKakaoTitle>
          카카오톡 간편 로그인 서비스가 종료
          <div className="sub">
            카카오 간편 로그인 계정(이메일)이
            <br />
            러너러너 계정으로 전환되었습니다.
            <br />
            *아이디 찾기 / 비밀번호 변경 후 로그인 해주세요!
          </div>
        </LoginToKakaoTitle>
        <LoginTokakaoButton onClick={() => onClose()}>확인</LoginTokakaoButton>
      </LoginToKakaoWrapper>
    </>
  );
};

export default LoginToKakao;
