import { enqueueSnackbar } from "notistack";
import React from "react";
import styled from "styled-components";

const InfoMenuWrapper = styled.div<{ $tabCount: number }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 30px;
  width: calc(100% - 40px);
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #2f3332;
  z-index: 101;
  height: 60px;
  padding: 5px;
  box-sizing: border-box;
  gap: 20px;
  border-radius: 75px;
`;

const MenuContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

const MenuItem = styled.div<{ $isSelected?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard;
  font-size: 9px;
  font-weight: ${({ $isSelected }) => ($isSelected ? "700" : "400")};
  color: ${({ $isSelected }) => ($isSelected ? "white" : "#808080")};
  transition: all 0.5s;
  cursor: pointer;
  z-index: 1;

  > .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
`;

export type InfoMenuType = "detail" | "rank" | "location" | "review";

interface InfoMenuProps {
  showRestaurantTab: boolean;
  currentMenu: InfoMenuType;
  onMenuClick: (menu: InfoMenuType) => void;
  reviewCount: number;
}

const PremiumInfoMenu: React.FC<InfoMenuProps> = ({
  showRestaurantTab,
  currentMenu,
  onMenuClick,
}) => {
  const tabCount = showRestaurantTab ? 4 : 3;

  const menuItems: Array<{ id: InfoMenuType; label: string }> = [
    { id: "detail" as const, label: "상세정보" },
    { id: "location" as const, label: "위치" },
    { id: "rank" as const, label: "랭킹" },
    { id: "review" as const, label: `리뷰` },
  ];

  return (
    <InfoMenuWrapper $tabCount={tabCount}>
      <MenuContainer>
        {menuItems.map((item, index) => (
          <>
            {index === 2 && <MenuItem />}
            <MenuItem
              key={item.id}
              $isSelected={currentMenu === item.id}
              onClick={() => {
                if (item.id === "rank") {
                  enqueueSnackbar("준비중입니다.");
                } else {
                  onMenuClick(item.id);
                }
              }}
            >
              <div className="item">
                {currentMenu === item.id ? (
                  <img src={`/image-web/store/${item.id}-select.svg`} />
                ) : (
                  <img src={`/image-web/store/${item.id}.svg`} />
                )}
                {item.label}
              </div>
            </MenuItem>
          </>
        ))}
      </MenuContainer>
    </InfoMenuWrapper>
  );
};

export default PremiumInfoMenu;
