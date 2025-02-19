import styled from "styled-components";
import { useHistory } from "react-router-dom";

const RegisterPremiumPubInfoWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 500px;
  left: 50%;
  transform: translateX(-50%);
  height: 100svh;
  overscroll-behavior: none;
  z-index: 107;
  background: white;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-top: 48px;

  > .floating-button-wrapper {
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    padding: 30px 24px 48px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;

    > .button {
      cursor: pointer;
      flex: 1;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      border-radius: 8px;
      text-align: center;
      padding: 15px 0;
      background: var(--Purple-300, #6436e7);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    > .button:active {
      background: #502bb5;
    }
    > .button.white {
      color: var(--Purple-300, #6436e7);
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      background: white;
    }
  }

  > .inner {
    width: 100%;
    height: 77vh;
    overflow-y: scroll;

    > .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 20px 16px;
      gap: 20px;

      > .description {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 140%; /* 19.6px */
      }
    }
  }

  > .header {
    top: 0;
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
    background: white;

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
const InfoBox = styled.div`
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--Black-100, #f0f0f0);
  background: #fff;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;

  > .title {
    color: var(--Purple-300, #6436e7);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  > .description {
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */
  }
`;

interface RegisterPremiumPubInfoProps {
  onClose: () => void;
}

const RegisterPremiumPubInfo = ({ onClose }: RegisterPremiumPubInfoProps) => {
  const history = useHistory();
  return (
    <RegisterPremiumPubInfoWrapper>
      <div className="header">
        <div className="close" onClick={onClose}>
          <img src="/image-web/Holdem%20Now/Icon/Close.svg" />
        </div>
        <div className="title">프리미엄 홀덤펍 등록</div>
      </div>
      <div className="inner">
        <div className="content">
          <InfoBox>
            <div className="title">Basic / 1개월 30만원 (VAT 별도)</div>
            <div className="description">
              <li>프리미엄 홀덤펍 등록</li>
              <li>지도 검색 시 프리미엄 마크 등록</li>
              <li>펍에서 사용 중인 오픈채팅방으로 바로가기 기능 지원</li>
            </div>
          </InfoBox>
          <InfoBox>
            <div className="title">Pro / 1개월 70만원 (VAT 별도)</div>
            <div className="description">
              <li>베이직 모든 기능 포함</li>
              <li>한달에 펍 홍보 앱 푸쉬 3회</li>
              <li>러너러너 공식 오픈채팅방 매장 광고 가능 (일 3회)</li>
            </div>
          </InfoBox>
          <InfoBox>
            <div className="title">Pro+ / 1개월 100만원 (VAT 별도)</div>
            <div className="description">
              <li>Pro 모든 기능 포함</li>
              <li>한달에 펍 홍보 앱 푸쉬 3회</li>
              <li>후원대회 무료 컨설팅</li>
            </div>
          </InfoBox>
          <InfoBox>
            <div className="title">VIP / 상담 후 결정</div>
            <div className="description">
              <li>Pro+ 모든 기능 포함</li>
              <li>한달에 펍 홍보 앱 푸쉬 3회</li>
              <li>후원대회 무료 컨설팅</li>
            </div>
          </InfoBox>
          <div className="description">
            * 오픈채팅 상담을 통해서 상담 후 등록할 수 있습니다.
          </div>
        </div>
      </div>
      <div className="floating-button-wrapper">
        <div
          className="button"
          onClick={() => {
            history.push("/event/detail/7");
          }}
        >
          상세보기
        </div>
        <div
          className="button"
          onClick={() => {
            window.open("http://pf.kakao.com/_BxbmbG");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5 2.5332C6.0815 2.5332 2.5 5.30028 2.5 8.71301C2.5 10.8354 3.88525 12.7065 5.9947 13.8194L5.10715 17.0616C5.02873 17.3481 5.35638 17.5765 5.60798 17.4105L9.49856 14.8427C9.82688 14.8744 10.1605 14.8929 10.5 14.8929C14.9182 14.8929 18.5 12.1259 18.5 8.71301C18.5 5.30028 14.9182 2.5332 10.5 2.5332Z"
              fill="white"
            />
          </svg>
          등록 문의
        </div>
      </div>
    </RegisterPremiumPubInfoWrapper>
  );
};
export default RegisterPremiumPubInfo;
