import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import { enqueueSnackbar } from "notistack";
import {
  joinTournament,
  getUserBuyInInfo,
  TournamentInfoInterface,
} from "../../../../api/game";
import { addFriendRecommendRegister } from "../../../../api/referral";
import useNativeApp, { isApp } from "../../../../hooks/useNativeApp";
import Adjust from "@adjustcom/adjust-web-sdk";
import { getTournamentType } from "../../../../utils/common";
import { shootAgree } from "../../../../api/auth";
import { useState } from "react";
import { registerRankingPoint } from "../../../../api/tournament";
import { calcLevel, calcPlayTime } from "../../../../utils/tournament";
import { parseDatetime } from "../../../../constants/moment";
import { attendanceCheck } from "../../../../api/attendance";

export enum GameTab {
  TOURNAMENT,
  HOLDEM,
}

export const useGameActions = (
  user: any,
  userTicketInfo: any,
  accessToken: string | null,
  onRegistrationSuccess?: () => void
) => {
  const history = useHistory();
  const setLoading = useSetRecoilState(loadingState);
  const { sendMessageToNative } = useNativeApp();
  const [gameTab, setGameTab] = useState(GameTab.TOURNAMENT);

  const register = async (groupId: number, type?: string) => {
    if (!type) {
      return;
    }
    if (accessToken) {
      setLoading(true);
      try {
        const agreeRes = await shootAgree();
        if (agreeRes.code === 200) {
          setLoading(true);
          const joinRes = await joinTournament({
            token: accessToken.replace("Bearer ", ""),
            groupId: Number(groupId),
            addPoint: 0,
          });

          const result = joinRes.data.result;
          if (processJoinTournamentResult(result ?? 0, groupId, type)) {
            enqueueSnackbar("토너먼트 등록이 완료되었습니다.", {
              variant: "success",
            });
            // Call the success callback to trigger data refresh
            onRegistrationSuccess?.();
          }
        } else {
          enqueueSnackbar("토너먼트 등록이 실패하였습니다.", {
            variant: "error",
          });
        }
      } catch (error) {
        enqueueSnackbar("토너먼트 등록이 실패하였습니다.", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
      history.push("/login", { redirect: window.location.href });
    }
  };

  const processJoinTournamentResult = (
    result: number,
    groupId: number,
    tournamentType: string
  ) => {
    if (result === -1) {
      enqueueSnackbar("유저정보를 읽지 못했습니다.", { variant: "error" });
    } else if (result === -2) {
      enqueueSnackbar("바이인하기 위한 보유금액이 부족합니다.", {
        variant: "error",
      });
    } else if (result === -3) {
      enqueueSnackbar("게임 오픈이 아직 안되었습니다.", { variant: "error" });
    } else if (result === -4) {
      enqueueSnackbar("다른 토너먼트를 등록 하셨습니다.", { variant: "error" });
    } else if (result === -5) {
      enqueueSnackbar("완전 종료되어 참여 불가합니다.", { variant: "error" });
    } else if (result === -6) {
      enqueueSnackbar("블라인드 바이인 제한 레벨을 넘어서 참여 불가합니다.", {
        variant: "error",
      });
    } else if (result === -10) {
      enqueueSnackbar("등록에 실패 했습니다.", { variant: "error" });
    } else if (result === -30) {
      enqueueSnackbar("리바인 못하는 레벨입니다.", { variant: "error" });
    } else if (result === -31) {
      enqueueSnackbar("보유하신 칩이 없습니다.", { variant: "error" });
    } else if (result === -32) {
      enqueueSnackbar("블라인드 바이인 제한 레벨을 넘어서 참여 불가합니다.", {
        variant: "error",
      });
    } else if (result === -39) {
      enqueueSnackbar("입장 가능시간이 아닙니다.", { variant: "error" });
    } else if (result === -40) {
      enqueueSnackbar("포인트가 부족합니다.", { variant: "error" });
    } else if (result === -41) {
      enqueueSnackbar("포인트 제한을 넘었습니다.", { variant: "error" });
    } else {
      if (process.env.REACT_APP_ENV === "production") {
        const _token = tournamentType === "Day" ? "25wubg" : "jf5j8w";
        const _eventName =
          tournamentType === "Day" ? "DailyTournament" : "Tournament";
        if (!isApp) {
          Adjust.trackEvent({
            eventToken: _token,
            callbackParams: [
              { key: "user_id", value: "" + user?.id },
              { key: "event_value", value: "WebSuccess" },
            ],
          });
        } else {
          sendMessageToNative("adjustEvent", "", {
            eventToken: _token,
            eventName: _eventName,
            data: `${groupId} / ${user?.textId}`,
            callbackParams: {
              user_id: "" + user?.id,
              event_value: "Success",
            },
          });
        }
      }
      return true;
    }
    if (process.env.REACT_APP_ENV === "production") {
      const _token = tournamentType === "Day" ? "25wubg" : "jf5j8w";
      const _eventName =
        tournamentType === "Day" ? "DailyTournament" : "Tournament";
      if (!isApp) {
        Adjust.trackEvent({
          eventToken: _token,
          callbackParams: [
            { key: "user_id", value: "" + user?.id },
            {
              key: "event_value",
              value: `WebFail_${result}_${groupId}`,
            },
          ],
        });
      } else {
        sendMessageToNative("adjustEvent", "", {
          eventToken: _token,
          eventName: _eventName,
          data: `${groupId} / ${user?.textId}`,
          callbackParams: {
            user_id: "" + user?.id,
            event_value: `Fail_${result}_${groupId}`,
          },
        });
      }
    }
    return false;
  };

  const playGame = ({
    groupId,
    useRebuyinTicket,
    addedGameMoney,
    type,
  }: {
    groupId: number;
    useRebuyinTicket: boolean;
    addedGameMoney: number;
    type: string;
  }) => {
    if (!accessToken) {
      enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
      history.push("/login", { redirect: window.location.href });
      return;
    }
    setLoading(true);
    joinTournament({
      token: accessToken.replace("Bearer ", ""),
      groupId: Number(groupId),
      addPoint: addedGameMoney,
    })
      .then(async (res) => {
        const result = res.data.result;
        if (processJoinTournamentResult(result ?? 0, groupId, type)) {
          if (res.data.open && res.data.link) {
            if (useRebuyinTicket || addedGameMoney > 0) {
              if (user) {
                await addFriendRecommendRegister({
                  userId: user.id,
                  rebuy: useRebuyinTicket ? 1 : 0,
                  gameMoney: addedGameMoney,
                });
              }
            }

            const request = {
              gameType: "FREE_TOURNAMENT",
              rankingPoint: 10,
              rank: null,
              season: 1,
              groupId: Number(groupId),
              userId: user.id,
            };
            try {
              await registerRankingPoint(request);
              window.location.href = res.data.link;
            } catch (e) {
              window.location.href = res.data.link;
            }
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickPlayGame = (
    groupId: number,
    tournamentInfo?: TournamentInfoInterface
  ) => {
    if (!tournamentInfo) {
      return;
    }
    if (user) {
      setLoading(true);
      getUserBuyInInfo({
        userId: user?.id,
        groupId: Number(groupId),
      })
        .then((res) => {
          if (res.data.result) {
            enqueueSnackbar("게임에 입장할 수 없습니다.", { variant: "error" });
          } else {
            if (res.data.alreadyPlaying) {
              playGame({
                groupId,
                useRebuyinTicket: false,
                addedGameMoney: 0,
                type: getTournamentType(tournamentInfo.info.data.startedAt),
              });
            } else {
              const buyinCount = res.data.buyinCount;
              if (
                tournamentInfo &&
                tournamentInfo.info.data.rebuyinLimit <= buyinCount &&
                userTicketInfo?.user.rebuyinTicket === 0
              ) {
                enqueueSnackbar("바인권이 부족하여 게임 입장이 불가능합니다.", {
                  variant: "error",
                });
                return;
              }
              if (buyinCount > 0) {
                enqueueSnackbar("해당 게임은 더 이상 참여 할 수 없습니다.", {
                  variant: "error",
                });
              } else {
                playGame({
                  groupId,
                  useRebuyinTicket: false,
                  addedGameMoney: 0,
                  type: getTournamentType(tournamentInfo.info.data.startedAt),
                });
              }
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      return;
    }
  };

  const isGameTab = (tab: GameTab) => gameTab === tab;

  const checkRegisterLimit = (tournament?: TournamentInfoInterface) => {
    if (!tournament) {
      return false;
    }
    const { playTimeSeconds, restTimeSeconds } =
      tournament.info.data.timeStructure;
    let playTime = calcPlayTime(
      parseDatetime(tournament.info.data.startedAt),
      playTimeSeconds,
      restTimeSeconds
    );
    const level = calcLevel(playTime, tournament.info.data.blindStructure);

    return tournament.info.data.availableRegisterLevel < level + 1
      ? true
      : false;
  };

  const dailyAttendanceCheck = async () => {
    try {
      await attendanceCheck();
    } catch (e: any) {
      if (e.code === 201) {
        return e.message;
      }
    }
  };

  return {
    register,
    handleClickPlayGame,
    gameTab,
    setGameTab,
    isGameTab,
    checkRegisterLimit,
    dailyAttendanceCheck,
  };
};
