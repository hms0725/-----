import moment, {Moment} from "moment";

export const calcPlayTime = (startedAt: Moment, playTimeSec: number, restTimeSec: number): number => {
  let playTime = Math.max(moment().unix() - startedAt.unix(), 0);
  let restCount = Math.floor(playTime / (playTimeSec + restTimeSec));
  playTime -= restCount * restTimeSec;

  return playTime;
};

export const calcLevel = (playTime: number, blindStructure: Array<Array<number>>): number => {

  let level = 0;
  for (let levelInfo of blindStructure) {
    if (playTime >= levelInfo[3]) {
      playTime -= levelInfo[3];
      ++level;
    } else {
      break;
    }
  }

  if (level > blindStructure.length - 1)
    level = blindStructure.length - 1;

  return level;
};

export const calcBlindUpTime = (playTime: number, blindStructure: Array<Array<number>>): number => {
  let result = 0;

  for (let levelInfo of blindStructure) {
    if (playTime >= levelInfo[3]) {
      playTime -= levelInfo[3];
    } else {
      result = levelInfo[3] - playTime
      break;
    }
  }
  if (result < 0)
    return 0;
  return result;
}

// 양수면 라운드 경과시간, 음수면 시작시간까지 남은 시간
export const calcElapsedForRound = (startedAt: Moment, playTimeSec: number, restTimeSec: number): number => {
  const now = moment().unix();
  const elapsedSec = now - startedAt.unix();

  if (elapsedSec >= 0) {
    return Math.floor(elapsedSec % (playTimeSec + restTimeSec));
  } else {
    return elapsedSec;
  }
};

export const determineRestTime = (startedAt: Moment, playTimeSec: number, restTimeSec: number) => {
  const elapsedForRound = calcElapsedForRound(startedAt, playTimeSec, restTimeSec);
  return elapsedForRound >= playTimeSec;
};
