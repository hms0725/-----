import React, { createContext, useContext } from "react";
import { useGame } from "./useGame";

const GameContext = createContext<ReturnType<typeof useGame> | null>(null);

export const GameProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const GameData = useGame();
  return (
    <GameContext.Provider value={GameData}>{children}</GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
