import { useEffect, useState } from "react";
import {
  getTournamentMembers,
  TournamentMembersInterface,
} from "../../../../../api/game";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../../../utils/network";
import { GameInfoPlayersWrapper } from "../../Style/GameInfoDialogStyles";

export const Players = ({ groupId }: { groupId?: number }) => {
  if (!groupId) {
    return null;
  }
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const [tournamentMembersInfo, setTournamentMembersInfo] =
    useState<TournamentMembersInterface | null>(null);
  const getMembers = async () => {
    if (!accessToken) return;
    getTournamentMembers({
      groupId: Number(groupId),
      token: accessToken.replace("Bearer ", ""),
    }).then((res) => {
      setTournamentMembersInfo(res.data);
    });
  };
  useEffect(() => {
    getMembers();
  }, []);
  return (
    <GameInfoPlayersWrapper>
      <div className="header">
        <span>순위</span>
        <span>닉네임</span>
        <span>남은 칩</span>
      </div>
      <div className="body">
        {tournamentMembersInfo &&
          tournamentMembersInfo.list.map((item, index) => (
            <>
              <div className="item" key={index}>
                <span>{`${index + 1}위`}</span>
                <span>{`${item.nickname}`}</span>
                <span>{item.stackSize.toLocaleString()}</span>
              </div>
            </>
          ))}
      </div>
    </GameInfoPlayersWrapper>
  );
};
