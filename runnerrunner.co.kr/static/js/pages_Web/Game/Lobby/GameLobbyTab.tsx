import React, { useEffect, useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import { GameLobbyTabWrapper } from "../Style/GameStyles";
import { GameTab } from "../Hook/useGameAction";

export interface GameTabWrapperProps {
  activeTab: GameTab;
}

export const GameLobbyTab: React.FC = () => {
  const { isGameTab, setGameTab, gameTab } = useGameContext();
  const tabData = [
    { tab: GameTab.TOURNAMENT, title: "토너먼트" },
    { tab: GameTab.HOLDEM, title: "홀덤" },
  ];

  const [activeTab, setActiveTab] = useState(GameTab.TOURNAMENT);

  // 탭이 바뀔 때마다 setActiveTab 호출
  const handleClick = (tab: GameTab) => {
    setGameTab(tab);
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab(gameTab);
  }, []);

  return (
    <GameLobbyTabWrapper activeTab={activeTab}>
      {tabData.map(({ tab, title }) => (
        <div
          key={tab}
          className={`tab ${isGameTab(tab) ? "selected" : ""}`}
          onClick={() => handleClick(tab)}
        >
          <div className="title">{title}</div>
        </div>
      ))}
      <div className="background" />
    </GameLobbyTabWrapper>
  );
};
