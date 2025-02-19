import { GameMainWrapper } from "../Style/GameStyles";
import { GameBanner } from "./GameBanner";
import { GameButtonSlide } from "./GameButtonSlide";
import { GameCategory } from "./GameCategory";

export const GameMain = () => {
  return (
    <GameMainWrapper>
      <GameBanner></GameBanner>
      <GameCategory></GameCategory>
      <GameButtonSlide></GameButtonSlide>
    </GameMainWrapper>
  );
};
