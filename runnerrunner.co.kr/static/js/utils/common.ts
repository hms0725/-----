import moment from "moment/moment";
import { History } from "history";
import { TournamentInfoInterface } from "../api/game";
import { calcLevel, calcPlayTime } from "./tournament";
import { parseDatetime } from "../constants/moment";
import { PubType } from "../api/types";

export const EMPTY_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const wait = async (ms: number) => {
  await new Promise<void>((r) => setTimeout(() => r(), ms));
};

export const convertMinutes = (time: number) => {
  if (time % 60 === 0) {
    return moment(time * 1000).format("m분");
  } else {
    return moment(time * 1000).format("m분 s초");
  }
};

export const fixedNumber = (value: number, fixed: number) => {
  //fixed 자리수까지 소수점
  return Number(value.toFixed(fixed));
};

export const closeWindow = () => {
  window.open("", "_self", "");
  window.close();
};

export const getKoreanNumber = (targetNum: number) => {
  const koreanUnits = ["조", "억", "만", ""];
  const unit = 10000;
  let answer = "";

  while (targetNum > 0) {
    const mod = targetNum % unit;
    const modToString = mod.toString().replace(/(\d)(\d{3})/, "$1,$2");
    targetNum = Math.floor(targetNum / unit);
    const textUnit = koreanUnits.pop();
    if (textUnit === "만") {
      answer = `${modToString}${textUnit}`;
    } else {
      answer = `${modToString}${textUnit}${answer}`;
    }
  }
  if (answer === "") {
    answer = targetNum.toLocaleString();
  }
  return answer;
};

export const copyClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("복사되었습니다.");
      })
      .catch(() => {
        alert("복사에 실패했습니다.");
      });
  } else {
    if (!document.queryCommandSupported("copy")) {
      return alert("Not supported Browser");
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.position = "fixed";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("복사되었습니다.");
  }
};

export const getReferralUrl = (userNickname: string) => {
  return (
    window.location.protocol +
    "//" +
    window.location.host +
    "/signup?referral=" +
    userNickname
  );
};

export const openUrl = (history: History, link: string) => {
  window.location.href = link;
};

export const shareURL = (url: string, title = "러너러너") => {
  if (navigator.share) {
    navigator
      .share({
        title,
        url: url,
      })
      .then(() => {})
      .catch(console.error);
  } else {
    // fallback
    copyClipboard(url);
  }
};

export const getTournamentType = (startedAt: string) => {
  const startTime = moment(startedAt).add(9, "hours").format("HH:mm:ss");
  const NightStart = "17:00:01";
  const NightEnd = "23:59:59";

  //NightStart부터 End까지는 Night, 나머지는 Day
  if (
    moment(startTime, "HH:mm:ss").isBetween(
      moment(NightStart, "HH:mm:ss"),
      moment(NightEnd, "HH:mm:ss")
    )
  ) {
    return "Night";
  } else {
    return "Day";
  }
};
export const openNewWindow = (url: string) => {
  const appYn = (window as any).ReactNativeWebView ? true : false;

  if (appYn) {
    const REQ_TIME = "ID_" + Date.now();
    const FUNC_OBJ = {
      id: REQ_TIME,
      func: "webUrl",
      data: {
        data: url,
      },
    };
    const reqCmdJsonString = JSON.stringify(FUNC_OBJ);
    (window as any).ReactNativeWebView.postMessage(reqCmdJsonString);
  } else {
    window.open(url, "_blank");
  }
};

export const getDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  precision = 1
) => {
  if (lat1 == lat2 && lon1 == lon2) return 0;

  const radLat1 = (Math.PI * lat1) / 180;
  const radLat2 = (Math.PI * lat2) / 180;
  const theta = lon1 - lon2;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
  if (dist > 1) dist = 1;

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344 * 1000;
  if (dist < 100) dist = Math.round(dist / 10) * 10;
  else dist = Math.round(dist / 100) * 100;

  return (dist / 1000).toFixed(precision);
};

export const timeAgo = (timestamp: string): string => {
  const now = moment();
  const past = moment(timestamp);
  const diffSeconds = now.diff(past, "seconds");

  if (diffSeconds < 60) {
    return `${diffSeconds}초 전`;
  } else if (diffSeconds < 3600) {
    const diffMinutes = now.diff(past, "minutes");
    return `${diffMinutes}분 전`;
  } else if (diffSeconds < 86400) {
    const diffHours = now.diff(past, "hours");
    const diffMinutes = now.diff(past, "minutes") % 60;
    return `${diffHours}시간 ${diffMinutes}분 전`;
  } else {
    const diffDays = now.diff(past, "days");
    return `${diffDays}일 전`;
  }
};

export const calcBlind = (tournamentInfoData: TournamentInfoInterface) => {
  const playTimeSeconds =
    tournamentInfoData.info.data.timeStructure.playTimeSeconds;
  const restTimeSeconds =
    tournamentInfoData.info.data.timeStructure.restTimeSeconds;
  const playTime = calcPlayTime(
    parseDatetime(tournamentInfoData.info.data.startedAt),
    playTimeSeconds,
    restTimeSeconds
  );
  const level = calcLevel(
    playTime,
    tournamentInfoData.info.data.blindStructure
  );
  return {
    small: tournamentInfoData.info.data.blindStructure[level][0],
    big: tournamentInfoData.info.data.blindStructure[level][1],
    ante: tournamentInfoData.info.data.blindStructure[level][2],
  };
};

export const sortKoreanDays = (days: string[]) => {
  const sorter: { [k: string]: number } = {
    일: 0,
    월: 1,
    화: 2,
    수: 3,
    목: 4,
    금: 5,
    토: 6,
  };
  days.sort((a, b) => sorter[a] - sorter[b]);
  return days;
};

export const getOpStatusText = (
  opDays: string[] | null,
  opStartTime: string | null,
  opEndTime: string | null
) => {
  if (!opDays || !opStartTime) {
    return "";
  }

  if (opDays.length > 0) {
    const i = moment().day();
    const koreanDays = ["일", "월", "화", "수", "목", "금", "토"];
    if (!opDays.includes(koreanDays[i])) {
      return "휴무일";
    }
  }

  const startMoment = moment(opStartTime || "00:00", "HH:mm");
  const endMoment = moment(opEndTime || "24:00", "HH:mm");
  const now = moment();
  if (endMoment.isBefore(startMoment)) {
    if (now.isAfter(startMoment) || now.isBefore(endMoment)) {
      return "운영중";
    }
  } else {
    if (now.isBetween(startMoment, endMoment)) {
      return "운영중";
    }
  }

  return "영업 종료";
};

export const getOpTimeText = (
  opDays: string[] | null,
  opStartTime: string | null,
  opEndTime: string | null
) => {
  if (!opDays || !opStartTime) {
    return "운영시간 미제공";
  }

  let str = "· ";
  if (opDays.length === 7) {
    str += "매일";
  } else {
    const hasWeekend = opDays.includes("일") && opDays.includes("토");
    if (opDays.length === 2 && hasWeekend) {
      str += "주말";
    } else if (opDays.length === 5 && !hasWeekend) {
      str += "평일";
    }
    str += sortKoreanDays(opDays).join(",");
  }
  str += " ";
  str += (opStartTime || "00:00") + " ~ " + (opEndTime || "24:00");

  return str;
};

export const urlToFile = async (
  url: string,
  filename: string
): Promise<File> => {
  const urlFileName = url.split("/").pop();
  if (urlFileName?.includes(".")) {
    filename = urlFileName;
  }

  const res = await fetch(url + "?t=" + Date.now());
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

export function parseJSON<T>(str: string): T | undefined {
  if (!str) {
    return;
  }

  try {
    return JSON.parse(str);
  } catch (e) {
    return;
  }
}

export const shortProvinceName = (name: string): string => {
  if (!name) {
    return "";
  }

  if (name === "서울특별시") return "서울";
  else if (name === "경기도") return "경기";
  else if (name === "강원도") return "강원";
  else if (name.includes("광역시")) return name.slice(0, 2);
  else if (name === "세종특별자치시") return "세종";
  else if (name === "제주특별자치도") return "제주";
  else return name[0] + name[2];
};

export const isPremium = (pubType?: PubType): boolean => {
  return pubType === "PREMIUM";
};

export const isVIP = (pubType?: PubType): boolean => {
  return pubType === "VIP" || pubType === "FRANCHISE";
};

export const isNormal = (pubType?: PubType): boolean => {
  return pubType === "NORMAL";
};

export const isPremiumAndVIP = (pubType?: PubType): boolean => {
  return pubType === "PREMIUM" || pubType === "VIP" || pubType === "FRANCHISE";
};
