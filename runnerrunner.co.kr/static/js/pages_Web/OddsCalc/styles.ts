import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  color: white;
  padding-bottom: 150px;
  background: linear-gradient(180deg, #070D1C 12.24%, #182734 23.88%);

  .background {
    position: absolute;
    top: 85px;
    width: 100%;
  }
`;

export const BackButton = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  cursor: pointer;
  width: 24px;
  height: 24px;
  padding: 5px;

  img {
    width: 24px;
    height: 24px;
  }
`;

export const Header = styled.h2`
  padding: 20px 0;
  margin-left: 20px;;
  position: fixed;
  top: 7px;
  left: 40px;
  right: 0;
  z-index: 1000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
`;

export const PlayersContainer = styled.div`
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding: 0 15px;
  margin-top: 385px;
  padding-bottom: 30px;
`;

export const ButtonContainer = styled.div`
  position: fixed;
  top: 295px;
  left: 0;
  width: 100%;
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

export const CardBox = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: auto;
  aspect-ratio: 3 / 4;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  background-size: cover;
  pointer-events: ${({ selected }) => (selected ? "none" : "auto")};
  opacity: ${({ selected }) => (selected ? 0.5 : 1)};
  box-shadow: 0px 0px 4px 0px #00000040;
  border-radius: 10%;

  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CommunityBoard = styled.div`
  position: fixed;
  top: 155px;
  left: 0;
  right: 0;
  padding: 10px;
  z-index: 999;
  overflow-x: auto;
`;

export const CommunityCards = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;  
  min-width: max-content;
  gap: 5px;
`;
  
  export const FlopCards = styled.div`
  gap: 5px;
  display: flex;
`;
  
  export const TurnRiverCards = styled.div`
  gap: 5px;
  display: flex;
`;

export const CardGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CardItem = styled.div<{ isFocus: boolean }>`
  width: 46px;
  height: auto;
  border: 2px solid ${({ isFocus }) => (isFocus ? "#FFD700" : "#444")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 12%;

  > img {
    width: 100%;
    height: 100%;
  }
`;

export const CardPreview = styled.div`
  position: absolute;
  top: 260px;
  left: 0;
  display: flex;
  gap: 5px;
  padding: 0px 30px;
  z-index: 1000;
  width: 100%;
  justify-content: center;

  .preview-item {
    width: 62px; 
  }
`

export const CardContainer = styled.div`
  background-color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  overflow-y: auto;
  height: 450px;
`;

export const CardWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  width: 100%;
  z-index: 1000;
  overflow-y: auto;
  height: 300px;
  padding: 20px;
  flex-wrap: wrap;
`;

export const CardIcon = styled.div`
  display: flex;
  justify-content: space-evenly;

  > .icon {
    width: 60.2px;
    height: 60px;
    border-radius: 131px;
    box-shadow: 0px 4px 4px 0px #00000040;
    background: #fff;
    line-height: 73px;
    text-align: center;
    z-index: 1000;
    pointer-events: all;

    &.select {
      background: #6436E7;
    }
  }
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px;
  padding: 15px;
  background: #808080;
  box-shadow: 0px 0px 12px 0px #00000033;
  border-radius: 10px;
  color: white;
`;

export const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 10px;

  > .player{
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
  }
`;

export const PlayerHand = styled.div`
  display: flex;
  gap: 5px;
`;

export const WinRateInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const WinRate = styled.div`
  color: #fff;
  font-family: Pretendard;
  font-size: 25px;
  font-weight: 600;
  text-align: center;
`;

export const DrawRate = styled.div`
  color: #D0FF00;
  text-align: center;
  background: #121212;
  width: 96px;
  height: 20px;
  border-radius: 15px;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
`;

export const RankBox = styled.div`
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px 20px;
  font-size: 13px;
`;

export const RankItem = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const RankName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.right {
    text-align: right;
    width: 91px;
  }
`;

export const RankValue = styled.span`
  text-align: right;
  min-width: 50px;
`;

export const Button = styled.button`
  color: #808080;
  background-color: #fff;
  border: none;
  padding: 10px 15px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: 158px;
  height: 48px;

  &.purple{
    color: white;
    background: var(--Purple-300, #6436E7);
  }
`;
