import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Cafe } from "../../../../api/types";
import { LikeType } from "../../../../api/like";
import { isPremiumAndVIP, openNewWindow } from "../../../../utils/common";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const OpenButton = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 31px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  position: fixed;
  right: 16px;
  z-index: 1000;
  color: black;
`;
const MenuBackWrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  animation: ${fadeInUp} 0.3s ease-out forwards;
`;
const MenuWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 100px;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-evenly;
  transition: all 0.3s ease-in-out;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: translateX(-50%),
    ${(props) => (props.isOpen ? "translateY(0)" : "translateY(20px)")};
  &::before {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const MenuItem = styled.div<{ count: number }>`
  cursor: pointer;
  border-radius: 45px;
  width: 50px;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #613eea;
  backdrop-filter: blur(24px);
  animation: ${fadeInUp} 0.3s ease-out forwards;
  opacity: 0;
  position: relative;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
    bottom: 25px;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
    ${(props) => (props.count === 4 ? "bottom: 25px;" : "")}
  }
  &:nth-child(4) {
    animation-delay: 0.4s;
  }
  &:nth-child(5) {
    animation-delay: 0.5s;
  }

  > img {
    width: 17px;
    height: 17px;
    object-fit: contain;
  }

  > span {
    color: #fff;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;
  }
`;

interface ExtraInfoProps {
  data: Cafe;
  onOpenCall: () => void;
  onShare: () => void;
  onNavigate: () => void;
}

const FloatingMenu: React.FC<ExtraInfoProps> = ({
  data,
  onOpenCall,
  onShare,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(
    isPremiumAndVIP(data.pubType) && data.openChatUrl ? 4 : 3
  );
  return (
    <Wrapper>
      {isOpen && <MenuBackWrapper></MenuBackWrapper>}
      {!isOpen && (
        <OpenButton onClick={() => setIsOpen(true)}>
          <img alt="button" src="/image-web/store/Btn/store_float_open.svg" />
        </OpenButton>
      )}
      {isOpen && (
        <OpenButton onClick={() => setIsOpen(false)}>
          <img alt="button" src="/image-web/store/Btn/store_float_close.svg" />
        </OpenButton>
      )}
      <MenuWrapper isOpen={isOpen}>
        <MenuItem onClick={onOpenCall} count={count}>
          <img src="/image-web/store/Phone-vip.svg" />
          <span>전화</span>
        </MenuItem>
        <MenuItem onClick={onNavigate} count={count}>
          <img src="/image-web/store/Navigation-vip.svg" />
          <span>길안내</span>
        </MenuItem>
        <MenuItem onClick={onShare} count={count}>
          <img src="/image-web/store/Share-vip.svg" />
          <span>공유</span>
        </MenuItem>
        {isPremiumAndVIP(data.pubType) && data.openChatUrl && (
          <MenuItem
            onClick={() => {
              if (data.openChatUrl) {
                openNewWindow(data.openChatUrl);
              }
            }}
            count={count}
          >
            <img src="/image-web/store/Btn/Kakao-vip.svg" />
            <span>오픈채팅</span>
          </MenuItem>
        )}
      </MenuWrapper>
    </Wrapper>
  );
};

export default FloatingMenu;
