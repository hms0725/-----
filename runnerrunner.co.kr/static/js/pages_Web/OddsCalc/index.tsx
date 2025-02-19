import { useOddsCalc } from "../../../hooks/useOddsCalc";
import { CARD_INFO } from "../../../dataset";
import {
  PageWrapper,
  Header,
  PlayersContainer,
  ButtonContainer,
  CardBox,
  CommunityBoard,
  CommunityCards,
  FlopCards,
  TurnRiverCards,
  CardGroup,
  CardItem,
  CardWrapper,
  Overlay,
  PlayerWrapper,
  PlayerInfo,
  PlayerHand,
  WinRateInfo,
  WinRate,
  DrawRate,
  RankBox,
  RankItem,
  RankName,
  RankValue,
  Button,
  BackButton,
  CardIcon,
  CardContainer,
  CardPreview,
} from "./styles";
import { useState } from "react";
import { Players } from "../Game/Component/RankingDialog/players";
interface CardProps {
  card: string;
  index: number;
  onClick: (index: number) => void;
  selected: boolean;
  src: string; // Add src prop for the image
}

const Card: React.FC<CardProps> = ({ card, index, onClick, selected, src }) => {
  return (
    <CardBox onClick={() => onClick(index)} selected={selected}>
      <img src={src} />
    </CardBox>
  );
};

const OddsCalc = () => {
  const {
    winningRates,
    flop,
    turn,
    river,
    isCardSelect,
    selectMode,
    selectedCards,
    handleAddPlayer,
    handleCardClick,
    selectCardForPlayer,
    selectCardForFlop,
    selectCardForTurn,
    selectCardForRiver,
    clear,
    handleOverlayClick,
    handleClose,
    isIconSelect,
    setIsIconSelect,
  } = useOddsCalc();

  return (
    <PageWrapper>
      <BackButton onClick={handleClose}>
        <img src="/image-web/Icon/Back_white.svg" alt="close" />
      </BackButton>
      <Header>확률 계산기</Header>
      <img className="background" src="/image-web/calc/calc_background.png" />
      <CommunityBoard>
        <CommunityCards>
          <CardGroup>
            <FlopCards>
              {flop.map((hand, handIndex) => (
                <CardItem
                  isFocus={
                    selectMode?.type === "flop" &&
                    selectMode.index === handIndex
                  }
                  key={handIndex}
                  onClick={() => selectCardForFlop(handIndex)}
                >
                  {hand !== -1 ? (
                    <img src={`/image-web/card/${hand}.png`} alt="flop card" />
                  ) : (
                    <img
                      src={`/image-web/calc/card_back.png`}
                      alt="card back"
                    />
                  )}
                </CardItem>
              ))}
            </FlopCards>
          </CardGroup>
          <TurnRiverCards>
            <CardGroup>
              <CardItem
                isFocus={selectMode?.type === "turn" && selectMode.index === 0}
                onClick={() => selectCardForTurn()}
              >
                {turn !== null ? (
                  <img src={`/image-web/card/${turn}.png`} alt="turn card" />
                ) : (
                  <img src={`/image-web/calc/card_back.png`} alt="card back" />
                )}
              </CardItem>
            </CardGroup>
            <CardGroup>
              <CardItem
                isFocus={selectMode?.type === "river" && selectMode.index === 0}
                onClick={() => selectCardForRiver()}
              >
                {river !== null ? (
                  <img src={`/image-web/card/${river}.png`} alt="river card" />
                ) : (
                  <img src={`/image-web/calc/card_back.png`} alt="card back" />
                )}
              </CardItem>
            </CardGroup>
          </TurnRiverCards>
        </CommunityCards>
      </CommunityBoard>
      <ButtonContainer>
        <Button onClick={() => clear()}>초기화</Button>
        {winningRates.length < 9 && (
          <Button className="purple" onClick={() => handleAddPlayer()}>
            플레이어 추가
          </Button>
        )}
      </ButtonContainer>
      <PlayersContainer>
        {winningRates.map((player, playerIndex) => (
          <PlayerWrapper key={player.userIndex}>
            <PlayerInfo>
              <div className="player">
                {playerIndex === 0 ? "You" : `Player ${playerIndex}`}
              </div>
              <PlayerHand>
                {player.hands.map((hand, handIndex) => (
                  <CardItem
                    isFocus={
                      selectMode?.player === playerIndex &&
                      selectMode.index === handIndex
                    }
                    key={handIndex}
                    onClick={() => selectCardForPlayer(playerIndex, handIndex)}
                  >
                    {hand !== -1 ? (
                      <img
                        src={`/image-web/card/${hand}.png`}
                        alt={`player card ${handIndex}`}
                      />
                    ) : (
                      <img
                        src={`/image-web/calc/card_back.png`}
                        alt="card back"
                      />
                    )}
                  </CardItem>
                ))}
              </PlayerHand>
              <WinRateInfo>
                <WinRate>
                  {player.win
                    ? Number(player.win.replace("%", "")).toFixed(1) + "%"
                    : "0.0%"}
                </WinRate>
                <DrawRate>
                  TIE :{" "}
                  {player.draw
                    ? Number(player.draw.replace("%", "")).toFixed(1) + "%"
                    : "0.0%"}
                </DrawRate>
              </WinRateInfo>
            </PlayerInfo>

            <RankBox>
              <RankItem>
                <RankName>로얄 플러시</RankName>
                <RankValue>{player.royalFlush || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName className="right">스트레이트 플러시</RankName>
                <RankValue>{player.straightFlush || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName>포카드</RankName>
                <RankValue>{player.quads || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName className="right">풀하우스</RankName>
                <RankValue>{player.fullHouse || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName>플러시</RankName>
                <RankValue>{player.flush || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName className="right">스트레이트</RankName>
                <RankValue>{player.straight || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName>트리플</RankName>
                <RankValue>{player.treeOfAKind || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName className="right">투 페어</RankName>
                <RankValue>{player.twoPairs || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName>원 페어</RankName>
                <RankValue>{player.onePair || "0%"}</RankValue>
              </RankItem>
              <RankItem>
                <RankName className="right">하이 카드</RankName>
                <RankValue>{player.highCards || "0%"}</RankValue>
              </RankItem>
            </RankBox>
          </PlayerWrapper>
        ))}
      </PlayersContainer>

      {isCardSelect && (
        <>
          <Overlay onClick={handleOverlayClick} />
          <CardPreview>
            {selectMode?.type !== "player" ? (
              <>
                {flop.map((hand, handIndex) => (
                  <CardItem
                    className="preview-item"
                    isFocus={
                      selectMode?.type === "flop" &&
                      selectMode.index === handIndex
                    }
                    key={handIndex}
                    onClick={() => selectCardForFlop(handIndex)}
                  >
                    {hand !== -1 ? (
                      <img
                        src={`/image-web/card/${hand}.png`}
                        alt="flop card"
                      />
                    ) : (
                      <img
                        src={`/image-web/calc/card_back.png`}
                        alt="card back"
                      />
                    )}
                  </CardItem>
                ))}
                <CardGroup>
                  <CardItem
                    className="preview-item"
                    isFocus={
                      selectMode?.type === "turn" && selectMode.index === 0
                    }
                    onClick={() => selectCardForTurn()}
                  >
                    {turn !== null ? (
                      <img
                        src={`/image-web/card/${turn}.png`}
                        alt="turn card"
                      />
                    ) : (
                      <img
                        src={`/image-web/calc/card_back.png`}
                        alt="card back"
                      />
                    )}
                  </CardItem>
                </CardGroup>
                <CardGroup>
                  <CardItem
                    className="preview-item"
                    isFocus={
                      selectMode?.type === "river" && selectMode.index === 0
                    }
                    onClick={() => selectCardForRiver()}
                  >
                    {river !== null ? (
                      <img
                        src={`/image-web/card/${river}.png`}
                        alt="river card"
                      />
                    ) : (
                      <img
                        src={`/image-web/calc/card_back.png`}
                        alt="card back"
                      />
                    )}
                  </CardItem>
                </CardGroup>
              </>
            ) : (
              <>
                {winningRates.map((player, playerIndex) => {
                  if (playerIndex === selectMode.player) {
                    return player.hands.map((hand, handIndex) => (
                      <CardItem
                        className="preview-item"
                        isFocus={
                          selectMode?.player === playerIndex &&
                          selectMode.index === handIndex
                        }
                        key={handIndex}
                      >
                        {hand !== -1 ? (
                          <img
                            src={`/image-web/card/${hand}.png`}
                            alt={`player card ${handIndex}`}
                          />
                        ) : (
                          <img
                            src={`/image-web/calc/card_back.png`}
                            alt="card back"
                          />
                        )}
                      </CardItem>
                    ));
                  }
                  return null;
                })}
              </>
            )}
          </CardPreview>
          <CardContainer>
            <CardIcon>
              <div
                className={`icon ${isIconSelect === "heart" ? "select" : ""}`}
                onClick={() => {
                  setIsIconSelect("heart");
                }}
              >
                <img
                  src={`/image-web/calc/heart${
                    isIconSelect === "heart" ? "-select" : ""
                  }.svg`}
                />
              </div>
              <div
                className={`icon ${isIconSelect === "space" ? "select" : ""}`}
                onClick={() => setIsIconSelect("space")}
              >
                <img
                  src={`/image-web/calc/space${
                    isIconSelect === "space" ? "-select" : ""
                  }.svg`}
                />
              </div>
              <div
                className={`icon ${isIconSelect === "club" ? "select" : ""}`}
                onClick={() => setIsIconSelect("club")}
              >
                <img
                  src={`/image-web/calc/club${
                    isIconSelect === "club" ? "-select" : ""
                  }.svg`}
                />
              </div>
              <div
                className={`icon ${isIconSelect === "diamond" ? "select" : ""}`}
                onClick={() => setIsIconSelect("diamond")}
              >
                <img
                  src={`/image-web/calc/diamond${
                    isIconSelect === "diamond" ? "-select" : ""
                  }.svg`}
                />
              </div>
            </CardIcon>
            <CardWrapper>
              {CARD_INFO.map((card, index) => {
                if (isIconSelect === "heart" && (index < 26 || index > 38)) {
                  return null;
                }
                if (isIconSelect === "space" && (index < 39 || index > 51)) {
                  return null;
                }
                if (isIconSelect === "club" && (index < 0 || index > 12)) {
                  return null;
                }
                if (isIconSelect === "diamond" && (index < 13 || index > 25)) {
                  return null;
                }

                return (
                  <Card
                    key={index}
                    card={card}
                    index={index}
                    onClick={() => handleCardClick(index)}
                    selected={selectedCards.includes(index)}
                    src={`/image-web/card/${index}.png`}
                  />
                );
              })}
            </CardWrapper>
          </CardContainer>
        </>
      )}
    </PageWrapper>
  );
};

export default OddsCalc;
