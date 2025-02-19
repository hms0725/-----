import React, { createContext, useContext } from "react";
import { useCompetition } from "./useCompetition";

const CompetitionContext = createContext<ReturnType<
  typeof useCompetition
> | null>(null);

export const CompetitionProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const competitionData = useCompetition();
  return (
    <CompetitionContext.Provider value={competitionData}>
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetitionContext = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error(
      "useCompetitionContext must be used within a CompetitionProvider"
    );
  }
  return context;
};
