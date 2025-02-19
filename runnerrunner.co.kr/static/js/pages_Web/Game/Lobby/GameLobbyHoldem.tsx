import React, { useEffect, useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import {
  GameInfoItemWrapper,
  GameLobbyHoldemWrapper,
} from "../Style/GameStyles";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../../utils/network";
import {
  checkAlreadyJoinRingRoom,
  getRingGameList,
  joinRingRoom,
  RingGameItemInterface,
} from "../../../../api/game";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import { enqueueSnackbar } from "notistack";
import { getKoreanNumber } from "../../../../utils/common";

export const GameLobbyHoldem: React.FC = () => {
  const { history } = useGameContext();
  const [gameList, setGameList] = useState<RingGameItemInterface[]>([]);
  const setLoading = useSetRecoilState(loadingState);
  const accessToken = (
    localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY) ?? ""
  ).replace("Bearer ", "");

  const handleJoinGame = (gameId: number) => {
    setLoading(true);
    joinRingRoom({
      token: accessToken,
      groupId: gameId,
    })
      .then((res) => {
        if (res.data.result === 1) {
          window.location.href = res.data.link;
        } else {
          enqueueSnackbar("게임 참여에 실패했습니다.", { variant: "error" });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (accessToken) {
      setLoading(true);

      checkAlreadyJoinRingRoom({
        token: accessToken,
      })
        .then((res) => {
          if (res.data.result === 1) {
            if (res.data.link) {
              window.location.href = res.data.link;
            } else {
              setLoading(true);
              getRingGameList({
                token: accessToken,
              })
                .then((res) => {
                  setGameList(res.data.list.list);
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          } else {
            enqueueSnackbar("정보 로드에 실패했습니다.", { variant: "error" });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      history.push("/login", { redirect: window.location.href });
    }
  }, [accessToken, history, setLoading]);
  return (
    <GameLobbyHoldemWrapper>
      {gameList.map((item, index) => {
        return (
          <GameInfoItemWrapper key={index}>
            <div className="item-wrapper">
              <div className="left-wrapper">
                <div className="group-wrapper">
                  <div className="room">NO.{item.groupId}</div>
                  <div className="member-row">
                    <img
                      alt="인원"
                      src="/image-web/ringGame/UI/List/Icon/Person/small.svg"
                    />
                    <span>
                      {Number(item.totalPlayerCount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="game-info-wrapper">
                  <img
                    alt="카드"
                    src="/image-web/ringGame/UI/List/Icon/holdem.png"
                  />
                  <div className="game-info-box">
                    <div className="value">
                      {getKoreanNumber(item.data.blind[0])} /{" "}
                      {getKoreanNumber(item.data.blind[1])}
                    </div>
                    <div className="buy-in">
                      BUY-IN {getKoreanNumber(item.data.minBuyin)}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="button"
                onClick={() => {
                  handleJoinGame(item.groupId);
                }}
              >
                입장 하기
              </div>
            </div>
          </GameInfoItemWrapper>
        );
      })}
    </GameLobbyHoldemWrapper>
  );
};
