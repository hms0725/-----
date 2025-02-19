import React from "react";
import { GameProvider } from "./Hook/GameContext";
import GameContent from "./GameContent";

const Game: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Game;
