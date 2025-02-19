import styled from "styled-components";

export const GameNavigatorWrapper = styled.div`
  z-index: 1;
  bottom: 30px;
  width: calc(100% - 20px);
  max-width: 340px;
  height: 107px;
  background-image: url("/image-web/game/navigator/game_navi_back.png");
`;
export const GameNavigatorItemWrapper = styled.div`
  position: relative;
  top: 32px;
  height: 75px;
  width: 64px;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: #808080;
  justify-content: center;
  gap: 5px;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 133.333% */
  &.selected {
    color: #ffdb55;
  }
`;
export const GameNavigatorGameWrapper = styled.div`
  top: 10px;
  > img {
    width: 65px;
  }
`;
