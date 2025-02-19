import React from "react";
import { GameWrapper } from "./Style/GameStyles";
interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <GameWrapper>
      <div className="dim"></div>
      {children}
    </GameWrapper>
  );
};
