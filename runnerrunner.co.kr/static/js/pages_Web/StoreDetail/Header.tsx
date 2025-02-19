// components/Header.tsx
import React from "react";
import styled from "styled-components";
import { Cafe } from "../../../api/types";
import { LikeType } from "../../../api/like";

const HeaderWrapper = styled.div<{ $show: boolean }>`
  z-index: 101;
  transition: all 0.1s ease-in-out;
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
  gap: 8px;
  background: ${(props) => (props.$show ? "white" : "transparent")};

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
  }

  .close {
    cursor: pointer;
    width: 24px;
    height: 24px;

    svg path {
      stroke: ${(props) => (props.$show ? "var(--Black-400, #444)" : "white")};
    }
  }

  .title {
    transition: all 0.1s ease-in-out;
    color: ${(props) => (props.$show ? props.theme.color.black400 : "white")};
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

interface HeaderProps {
  show?: boolean;
  onClose: () => void;
  title: string;
  data?: Cafe;
  onToggleLike?: (id: number, type: LikeType) => Promise<boolean | undefined>;
}

const Header: React.FC<HeaderProps> = ({
  show = false,
  onClose,
  title,
  onToggleLike,
  data,
}) => {
  return (
    <HeaderWrapper $show={show}>
      <div className="right">
        <div className="close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 19L5 12M5 12L12 5M5 12H19"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="title">{title}</div>
      </div>
      {onToggleLike &&
        data &&
        (data.pubType === "VIP" ||
          data.pubType === "PREMIUM" ||
          data.pubType === "FRANCHISE") && (
          <div
            className="item"
            onClick={() => onToggleLike(data.id, "CAFE" as LikeType)}
          >
            <img
              src={`/image-web/store/${
                data.like
                  ? "Heart_on_vip"
                  : show
                  ? "Heart_scroll_vip"
                  : "Heart_vip"
              }.svg`}
              alt="heart"
            />
          </div>
        )}
    </HeaderWrapper>
  );
};

export default Header;
