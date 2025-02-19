import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import BasicInfo from "./BasicInfo";
import Sheet from "react-modal-sheet";
import BlindInfo from "./BlindInfo";
import ParticipantInfo from "./ParticipantInfo";
import TableInfo from "./TableInfo";
import PrizeInfo from "./PrizeInfo";
import { enqueueSnackbar, useSnackbar } from "notistack";
import {
  getTournamentInfo,
  getTournamentMembers,
  getUserBuyInInfo,
  getUserTicketInfo,
  joinTournament,
  TournamentInfoInterface,
  TournamentMembersInterface,
  UserTicketInfoInterface,
} from "../../../api/game";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../utils/network";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import useUserInfo from "../../../hooks/useUserInfo";
import moment, { Moment } from "moment";
import { shootAgree } from "../../../api/auth";
import { addFriendRecommendRegister } from "../../../api/referral";
import { getTournamentType } from "../../../utils/common";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import ReBuyinPopup from "./ReBuyinPopup";
import Adjust from "@adjustcom/adjust-web-sdk";
import useNativeApp, { isApp } from "../../../hooks/useNativeApp";
import { registerRankingPoint } from "../../../api/tournament";

const EventTournamentDetailWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 88px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media ${MEDIA_DESKTOP} {
    position: static;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 500px;
    max-height: unset;
    padding: 40px 0;
  }
  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
     overflow-y: scroll;
  `}
  > .header {
    top: 0;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    z-index: 11;
    background: white;
    gap: 8px;

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button {
      cursor: pointer;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
  }

  > .header-additional {
    width: 100%;
    top: 48px;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    height: 40px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
    padding: 0 16px 12px;
    z-index: 11;
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > div {
      scroll-margin-top: 60px;
    }
  }
`;
const ContentWrapper = styled.div`
  width: 100%;
  padding: 20px 16px 40px;

  > .button {
    margin-top: 14px;
    width: 100%;
    height: 56px;
    border-radius: 8px;
    background: var(--Purple-300, #6436e7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    cursor: pointer;
  }

  > .button:active {
    background: #502bb5;
  }

  > .button-rows {
    margin-top: 14px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;

    > .button {
      cursor: pointer;
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
      border-radius: 8px;
      background: var(--Black-100, #f0f0f0);
      height: 48px;
    }
  }
`;
const MyRPWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #fff;
  gap: 8px;

  > .inner {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    border-radius: 15px;
    border: 1px solid var(--Black-100, #f0f0f0);
    padding: 0px 5px 0px 12px;

    > .wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      padding-bottom: 1px;

      > .vertical-line {
        width: 1px;
        height: 10px;
        background: #f0f0f0;
      }

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      > .point {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }

    > .button {
      cursor: pointer;
      width: 38px;
      height: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 26px;
      background: var(--Purple-100, #f0eaff);
    }

    > .button:active {
      background: #502bb5;
    }
  }
`;
const MainBannerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #161616;
  padding: 8px;
  position: relative;

  > .main {
    width: 312px;
    height: 460px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    > div {
      z-index: 2;
    }

    > .logo {
      width: 172px;
      object-fit: contain;
      z-index: 1;
    }

    > .background {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      object-fit: contain;
      z-index: 0;
    }

    > .tag {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 54px;
      height: 21px;
      flex-shrink: 0;
      color: #fff;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 18px;
      background: #099d4d;
    }

    > .title {
      margin-top: 12px;
      color: var(--Purple-200, #8359f7);
      font-family: "yg-jalnan";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    > .sub-title {
      margin-top: 3px;
      color: var(--Black-100, #f0f0f0);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .time {
      margin-top: 3px;
      color: #fff;
      text-align: center;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: Pretendard;
      font-size: 48px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.96px;
    }

    > .desc-1 {
      margin-top: 3px;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    > .desc-2 {
      margin-top: 115px;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    > .prize {
      margin-top: 6px;
      color: #fff;
      text-align: center;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: Pretendard;
      font-size: 28px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.56px;
    }

    > .info-row {
      margin-top: 24px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;

      > .bar {
        width: 1px;
        height: 36px;
        background: linear-gradient(0deg, #333 0%, #333 100%),
          linear-gradient(0deg, #333 0%, #333 100%), #333;
      }

      > .item {
        width: 80px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        > .value {
          color: #fff;
          text-align: center;
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

        > .title {
          color: var(--Black-300, #808080);
          text-align: center;
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }
      }
    }
  }
`;
const InfoMenuWrapper = styled.div`
  position: sticky;
  left: 0;
  top: 0px;
  background: white;
  width: 100%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
  height: 60px;
  z-index: 101;
  overflow-x: auto;

  > .inner {
    width: 100%;
    padding: 12px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    > .item {
      flex-shrink: 0;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .item.selected {
      color: var(--Black-400, #444);
    }
  }
`;

const AgreementModal = styled.div`
  width: 100vw;
  max-width: 480px;
  display: flex;
  padding: 30px 24px 60px 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 12px 12px 0px 0px;
  background: #fff;

  > .close {
    cursor: pointer;
    position: absolute;
    object-fit: contain;
    width: 24px;
    height: 24px;
    top: 20px;
    right: 20px;
  }

  > .title {
    color: ${(p) => p.theme.color.black500};
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 28px */
  }

  > .description {
    width: 100%;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;

    > .desc {
      width: 100%;
      text-align: left;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 19.6px */
    }

    > .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 12px;

      > .checkbox {
        width: 20px;
        height: 20px;
        flex-shrink: 0;

        > circle {
          transition: all 0.3s;
          fill: ${(p) => p.theme.color.black200};
        }
      }

      > .checkbox.checked {
        > circle {
          fill: ${(p) => p.theme.color.purple300};
        }
      }

      > .text {
        flex-grow: 1;
        color: var(--Black-500, #202020);
        text-align: left;
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      > .button {
        padding-top: 2px;
        cursor: pointer;
        flex-shrink: 0;
        color: var(--Black-200, #b7b7b7);
        text-align: right;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.26px;
      }
    }
  }

  > .button-row {
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;

    > .button {
      flex: 1;
      height: 48px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: ${(p) => p.theme.color.purple300};
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }

    > .button:active {
      background: #502bb5;
    }

    > .button.cancel {
      color: ${(p) => p.theme.color.purple300};
      background: none;
    }
  }
`;

type InfoMenuType =
  | "info"
  | "blind"
  | "participant-rank"
  | "table"
  | "prize"
  | "season-rank"
  | "record";

interface EventPageProps {
  onClose?: () => void;
}

const EventTournamentDetailPage = ({ onClose }: EventPageProps) => {
  const history = useHistory();
  const { user } = useUserInfo();
  const setLoading = useSetRecoilState(loadingState);
  const params = useParams<{
    groupId: string;
  }>();
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const [showReBuyInPopup, setShowReBuyInPopup] = useState(false);
  const menuListRef = Array.from({ length: 5 }).map(() =>
    useRef<HTMLDivElement>(null)
  );
  const innerRef = useRef<HTMLDivElement>(null);

  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [infoMenu, setInfoMenu] = useState<InfoMenuType>("info");
  const [tournamentInfo, setTournamentInfo] =
    useState<TournamentInfoInterface | null>(null);
  const [tournamentMembersInfo, setTournamentMembersInfo] =
    useState<TournamentMembersInterface | null>(null);
  const [userTicketInfo, setUserTicketInfo] =
    useState<UserTicketInfoInterface | null>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const [tournamentRefresh, setTournamentRefresh] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const [tournamentType, setTournamentType] = useState<"Day" | "Night" | "">(
    ""
  );
  const [tournamentWeekDay, setTournamentWeekDay] = useState<string>("");
  const { sendMessageToNative } = useNativeApp();
  useEffect(() => {
    setTimeout(() => {
      setRefresh(new Date().getTime());
    }, 300);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (params.groupId && accessToken) {
      setLoading(true);
      getTournamentInfo({
        groupId: Number(params.groupId),
        token: accessToken.replace("Bearer ", ""),
      })
        .then((res) => {
          if (Object.keys(res.data).length === 0) {
            alert("잘못된 접근입니다.");
            history.replace("/");
          }
          setTournamentInfo(res.data);

          setTournamentType(getTournamentType(res.data.info.data.startedAt));
          const dayArr = ["일", "월", "화", "수", "목", "금", "토"];
          setTournamentWeekDay(
            dayArr[moment(res.data.info.data.startedAt).add(9, "hours").day()]
          );
          intervalId = setInterval(() => {
            if (timerRef.current) {
              const diff = moment(res.data.info.data.startedAt)
                .add(9, "hours")
                .diff(moment());
              const duration = moment.duration(diff);
              if (duration.asSeconds() < 0) {
                clearInterval(intervalId);
                timerRef.current.innerText = "00 : 00 : 00";
              } else {
                timerRef.current.innerText = `${duration
                  .hours()
                  .toString()
                  .padStart(2, "0")} : ${duration
                  .minutes()
                  .toString()
                  .padStart(2, "0")} : ${duration
                  .seconds()
                  .toString()
                  .padStart(2, "0")}`;
              }
            }
          }, 1000);
        })
        .catch((e: any) => {
          // TODO: handle error
        })
        .finally(() => {
          setLoading(false);
        });
      getTournamentMembers({
        groupId: Number(params.groupId),
        token: accessToken.replace("Bearer ", ""),
      }).then((res) => {
        setTournamentMembersInfo(res.data);
      });
    } else {
      if (!accessToken) {
        enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
        history.push("/login", { redirect: window.location.href });
      } else {
        history.push("/");
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [tournamentRefresh]);

  useEffect(() => {
    if (user) {
      getUserTicketInfo({
        userId: user.id,
      })
        .then((res) => {
          setUserTicketInfo(res.data);
        })
        .catch((e) => {});
    }
  }, [user?.id]);

  const handleClose = () => {
    history.replace("/");
  };

  const handleClickMenu = (section: string) => {
    if (!menuListRef) return;

    let index = 0;
    switch (section) {
      case "info":
        index = 0;
        break;
      case "blind":
        index = 1;
        break;
      case "participant-rank":
        index = 2;
        break;
      case "table":
        index = 3;
        break;
      case "prize":
        index = 4;
        break;
      case "season-rank":
        index = 5;
        break;
      case "record":
        index = 6;
        break;
    }

    if (menuListRef[index].current) {
      menuListRef[index].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const processJoinTournamentResult = (
    result: number,
    isFirst = true,
    gameMoney = 0,
    ticket = 0
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
      enqueueSnackbar("이미 등록하셨습니다.", { variant: "error" });
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
              { key: "is_first", value: "" + isFirst },
              { key: "game_money", value: "" + gameMoney },
              { key: "ticket", value: "" + ticket },
            ],
          });
        } else {
          sendMessageToNative("adjustEvent", "", {
            eventToken: _token,
            eventName: _eventName,
            data: `${params.groupId} / ${user?.textId}`,
            callbackParams: {
              user_id: "" + user?.id,
              event_value: "Success",
              is_first: "" + isFirst,
              game_money: "" + gameMoney,
              ticket: "" + ticket,
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
              value: `WebFail_${result}_${params.groupId}`,
            },
          ],
        });
      } else {
        sendMessageToNative("adjustEvent", "", {
          eventToken: _token,
          eventName: _eventName,
          data: `${params.groupId} / ${user?.textId}`,
          callbackParams: {
            user_id: "" + user?.id,
            event_value: `Fail_${result}_${params.groupId}`,
          },
        });
      }
    }
    return false;
  };
  const handleClickPlayGame = () => {
    if (user) {
      setLoading(true);
      getUserBuyInInfo({
        userId: user?.id,
        groupId: Number(params.groupId),
      })
        .then((res) => {
          if (res.data.result) {
            enqueueSnackbar("게임에 입장할 수 없습니다.", { variant: "error" });
          } else {
            if (res.data.alreadyPlaying) {
              playGame({
                useRebuyinTicket: false,
                addedGameMoney: 0,
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
                setShowReBuyInPopup(true);
              } else {
                playGame({
                  useRebuyinTicket: false,
                  addedGameMoney: 0,
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
  const register = () => {
    if (accessToken) {
      setLoading(true);
      shootAgree()
        .then((res) => {
          if (res.code === 200) {
            setShowAgreementModal(false);
            setLoading(true);
            joinTournament({
              token: accessToken.replace("Bearer ", ""),
              groupId: Number(params.groupId),
              addPoint: 0,
            })
              .then((res) => {
                const result = res.data.result;
                if (processJoinTournamentResult(result ?? 0)) {
                  enqueueSnackbar(
                    "영상 촬영과 활용 동의 및 등록이 완료되었습니다.",
                    { variant: "success" }
                  );
                }
              })
              .finally(() => {
                setLoading(false);
                setTournamentRefresh(new Date().getTime());
              });
          } else {
            setShowAgreementModal(false);
            enqueueSnackbar("영상 촬영과 활용 동의 및 등록이 실패하였습니다.", {
              variant: "error",
            });
            setTournamentRefresh(new Date().getTime());
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
      history.push("/login", { redirect: window.location.href });
    }
  };
  const getSeasonPeriod = (
    season: number
  ): {
    start: Moment;
    end: Moment;
  } => {
    if (season <= 1) {
      // 시즌 1 = 23/11/22 ~ 24/03/31
      return {
        start: moment("2023-11-22 00:00:00", "YYYY-MM-DD HH:mm:ss"),
        end: moment("2024-03-31 00:00:00", "YYYY-MM-DD HH:mm:ss"),
      };
    } else {
      const multiplier = season - 2;
      const s2Start = moment("2024-04-01 00:00:00", "YYYY-MM-DD HH:mm:ss");
      const start = s2Start
        .clone()
        .add(3 * multiplier, "month")
        .startOf("month");
      const end = start.clone().add(2, "month").endOf("month");

      return {
        start: start,
        end: end,
      };
    }
  };
  const getSeasonByDate = (input: Moment) => {
    const firstSeasonPeriod = getSeasonPeriod(1);
    if (input.isBetween(firstSeasonPeriod.start, firstSeasonPeriod.end)) {
      return 1;
    }
    const secondSeasonPeriod = getSeasonPeriod(2);
    const diff = input.diff(secondSeasonPeriod.start, "months");
    return Math.floor(diff / 3) + 2;
  };
  const playGame = ({
    useRebuyinTicket,
    addedGameMoney,
  }: {
    useRebuyinTicket: boolean;
    addedGameMoney: number;
  }) => {
    if (!accessToken) {
      enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
      history.push("/login", { redirect: window.location.href });
      return;
    }
    setLoading(true);
    joinTournament({
      token: accessToken.replace("Bearer ", ""),
      groupId: Number(params.groupId),
      addPoint: addedGameMoney,
    })
      .then(async (res) => {
        const result = res.data.result;
        if (
          processJoinTournamentResult(
            result ?? 0,
            false,
            addedGameMoney,
            useRebuyinTicket ? 1 : 0
          )
        ) {
          if (res.data.open) {
            if (useRebuyinTicket || addedGameMoney > 0) {
              if (user) {
                addFriendRecommendRegister({
                  userId: user.id,
                  rebuy: useRebuyinTicket ? 1 : 0,
                  gameMoney: addedGameMoney,
                });
              }
            }
            if (user) {
              const request = {
                gameType: "FREE_TOURNAMENT",
                rankingPoint: 10,
                rank: null,
                season: 1,
                groupId: Number(params.groupId),
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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (innerRef.current) {
      //스크롤이 3px 이상 넘어가면 setShowHeader(true)
      const handleScroll = () => {
        if (innerRef.current) {
          const scrollTop = innerRef.current.scrollTop;

          const arr: InfoMenuType[] = [
            "info",
            "blind",
            "participant-rank",
            "table",
            "prize",
          ];
          //스크롤에 따라 selected menu 변경
          menuListRef.forEach((ref, index) => {
            if (!ref.current) {
              return;
            }

            const rect = ref.current.getBoundingClientRect();
            const top = Math.max(rect.top, 0);
            const bottom = Math.max(rect.bottom, 0);

            if (
              index === menuListRef.length - 1 &&
              bottom === window.innerHeight
            ) {
              setInfoMenu(arr[index]);
            } else if (top < 200 && bottom > 250) {
              setInfoMenu(arr[index]);
            }
          });
        }
      };

      innerRef.current.addEventListener("scroll", handleScroll);
      return () => {
        if (innerRef.current) {
          innerRef.current.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [innerRef.current, refresh]);

  const getCurrentStatus = useCallback(() => {
    if (tournamentInfo) {
      if (tournamentInfo.info.isEnd === 1) {
        return "종료";
      } else if (tournamentInfo.info.isStarted === 1) {
        return "진행중";
      } else if (tournamentInfo.info.isOpen === 1) {
        return "등록중";
      }
    }
    return "";
  }, [tournamentInfo]);

  return (
    <>
      {showReBuyInPopup && (
        <ReBuyinPopup
          onClose={() => setShowReBuyInPopup(false)}
          onEnter={(addedGameMoney: number, useRebuyinTicket: boolean) => {
            setShowReBuyInPopup(false);
            playGame({
              useRebuyinTicket,
              addedGameMoney,
            });
          }}
        />
      )}
      {
        <Sheet
          style={{
            width: "100%",
            maxWidth: 500,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          isOpen={showAgreementModal}
          onClose={() => setShowAgreementModal(false)}
          disableDrag={true}
          detent={"content-height"}
        >
          <Sheet.Container
            style={{
              maxWidth: 500,
            }}
          >
            <Sheet.Content>
              <AgreementModal>
                <img
                  className="close"
                  onClick={() => setShowAgreementModal(false)}
                  src="/image-web/Holdem%20Now/Icon/Close.svg"
                />
                <div className="title">영상 촬영 및 활용 동의</div>
                <div className="description">
                  <div className="row">
                    <div className="text">(필수) 영상 촬영 및 활용 동의서</div>
                  </div>
                  <div className="desc">
                    토너먼트 진행 중 촬영된 영상이 각종 채널을 통해 중계 또는
                    SNS 등을 통해 활용될 수 있음을 동의합니다.
                  </div>
                </div>
                <div className="button-row">
                  <div className="button" onClick={register}>
                    동의하고 참가하기
                  </div>
                </div>
              </AgreementModal>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={handleClose} />
        </Sheet>
      }
      <EventTournamentDetailWrapper scrollLock={false}>
        <div className="header">
          <div className="close" onClick={handleClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">
            {tournamentInfo ? tournamentInfo.info.data.name : ""}
          </div>
        </div>
        <div className="header-additional">
          <MyRPWrapper>
            <div className="inner">
              <div className="wrapper">
                <div className="title">리바인권</div>
                <div className="vertical-line" />
                <div className="point">
                  {userTicketInfo
                    ? userTicketInfo.user.rebuyinTicket.toLocaleString()
                    : ""}
                </div>
              </div>
            </div>
            <div className="inner">
              <div className="wrapper">
                <div className="title">게임포인트</div>
                <div className="vertical-line" />
                <div className="point">
                  {userTicketInfo
                    ? userTicketInfo.user.point.toLocaleString()
                    : ""}
                </div>
              </div>
            </div>
          </MyRPWrapper>
        </div>
        {tournamentInfo ? (
          <div className="inner" ref={innerRef}>
            <ContentWrapper>
              <MainBannerWrapper>
                <div className="main">
                  <img className="background" src="/image-web/event/bg.png" />
                  <img className="logo" src="/image-web/event/Logo/logo.png" />
                  <div className="tag">{getCurrentStatus()}</div>
                  <div className="title">바이인 프리롤</div>
                  <div className="sub-title">시작까지 남은 시간</div>
                  <div className="time" ref={timerRef}>
                    -- : -- : --
                  </div>
                  <div className="desc-1">시작 10분전부터 입장가능</div>
                  {tournamentType === "Night" &&
                    tournamentInfo.info.data.tournamentType === 0 && (
                      <>
                        <div className="desc-2">
                          토너먼트에 참여하고 STN 채널에 출연해보세요!
                        </div>
                        <div className="prize">파이널 5인에 도전하세요</div>
                      </>
                    )}
                  {tournamentType === "Night" &&
                    tournamentInfo.info.data.tournamentType === 1 && (
                      <>
                        <div className="desc-2">
                          토너먼트에 참여하고 보상과 게임포인트를 획득하세요!
                        </div>
                        <div className="prize">일일 총 보상 500만 포인트 </div>
                      </>
                    )}
                  {tournamentType === "Day" && (
                    <>
                      <div className="desc-2">
                        토너먼트에 참여하고 보상과 게임포인트를 획득하세요!
                      </div>
                      <div className="prize">일일 총 보상 500만 포인트 </div>
                    </>
                  )}

                  <div className="info-row">
                    <div className="item">
                      <div className="value">
                        시즌 {getSeasonByDate(moment())}
                      </div>
                      <div className="value">진행중</div>
                    </div>
                    <div className="bar" />
                    <div className="item">
                      <div className="title">
                        {moment(tournamentInfo.info.data.startedAt)
                          .add(9, "hours")
                          .format("MM월 DD일")}
                      </div>
                      <div className="value">
                        {moment(tournamentInfo.info.data.startedAt)
                          .add(9, "hours")
                          .format("HH:mm")}{" "}
                        시작
                      </div>
                    </div>
                    <div className="bar" />
                    <div className="item">
                      <div className="title">현재</div>
                      <div className="value">
                        {tournamentInfo.info.totalRegisterCount}명 등록
                      </div>
                    </div>
                  </div>
                </div>
              </MainBannerWrapper>
              <div
                className="button"
                onClick={() => {
                  if (tournamentInfo.info.isRegister === 1) {
                    handleClickPlayGame();
                  } else {
                    setShowAgreementModal(true);
                  }
                }}
              >
                {tournamentInfo.info.isRegister === 1 ? "입장하기" : "등록하기"}
              </div>
              <div className="button-rows">
                <div
                  className="button"
                  onClick={() => history.push("/ranking?t=season")}
                >
                  <img src="/image-web/event/Rank.svg" />
                  <span>시즌 랭킹</span>
                </div>
                <div
                  className="button"
                  onClick={() => history.push("/ranking?t=daily")}
                >
                  <img src="/image-web/event/Rank.svg" />
                  <span>일별 랭킹</span>
                </div>
              </div>
            </ContentWrapper>
            <InfoMenuWrapper>
              <div className="inner">
                <div
                  onClick={() => handleClickMenu("info")}
                  className={"item " + (infoMenu === "info" ? "selected" : "")}
                >
                  정보
                </div>
                <div
                  onClick={() => handleClickMenu("blind")}
                  className={"item " + (infoMenu === "blind" ? "selected" : "")}
                >
                  블라인드
                </div>
                <div
                  onClick={() => handleClickMenu("participant-rank")}
                  className={
                    "item " +
                    (infoMenu === "participant-rank" ? "selected" : "")
                  }
                >
                  현황
                </div>
                <div
                  onClick={() => handleClickMenu("table")}
                  className={"item " + (infoMenu === "table" ? "selected" : "")}
                >
                  테이블
                </div>
                <div
                  onClick={() => handleClickMenu("prize")}
                  className={"item " + (infoMenu === "prize" ? "selected" : "")}
                >
                  보상
                </div>
              </div>
            </InfoMenuWrapper>
            <BasicInfo
              tournamentInfo={tournamentInfo}
              boxRef={menuListRef[0]}
            />
            <BlindInfo
              tournamentInfo={tournamentInfo}
              boxRef={menuListRef[1]}
            />
            <ParticipantInfo
              tournamentMembersInfo={tournamentMembersInfo}
              boxRef={menuListRef[2]}
            />
            <TableInfo
              tournamentInfo={tournamentInfo}
              boxRef={menuListRef[3]}
            />
            <PrizeInfo
              tournamentInfo={tournamentInfo}
              groupId={Number(params.groupId)}
              boxRef={menuListRef[4]}
            />
          </div>
        ) : (
          <></>
        )}
      </EventTournamentDetailWrapper>
    </>
  );
};

export default EventTournamentDetailPage;
