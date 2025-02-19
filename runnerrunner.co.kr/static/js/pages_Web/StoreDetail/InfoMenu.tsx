// components/InfoMenu.tsx
import React from "react";
import styled from "styled-components";
import { InfoMenuType } from "./Premium/PremiumInfoMenu";

const InfoMenuWrapper = styled.div`
  position: sticky;
  left: 0;
  top: 48px;
  background: white;
  padding: 12px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
  height: 60px;
  z-index: 101;
  justify-content: space-around;

  > .item {
    text-align: center;
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    cursor: pointer;
  }

  > .item.selected {
    color: var(--Black-400, #444);
  }
`;

interface InfoMenuProps {
  pubType: string;
  currentMenu: string;
  onMenuClick: (menu: InfoMenuType) => void;
}

const InfoMenu: React.FC<InfoMenuProps> = ({
  pubType,
  currentMenu,
  onMenuClick,
}) => {
  return (
    <InfoMenuWrapper>
      <div
        onClick={() => onMenuClick("location")}
        className={`item ${currentMenu === "location" ? "selected" : ""}`}
      >
        위치
      </div>
      <div
        onClick={() => onMenuClick("review")}
        className={`item ${currentMenu === "review" ? "selected" : ""}`}
      >
        리뷰
      </div>
    </InfoMenuWrapper>
  );
};

export default InfoMenu;
