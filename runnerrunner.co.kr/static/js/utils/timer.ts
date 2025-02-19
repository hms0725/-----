import { TournamentStructure, TimerDto, TimerInfoState } from "../api/types";

function formatRemainingTime(minutes: number, seconds: number): string {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

function formatElapsedTime(totalMilliseconds: number): string {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function calculateHomeLevel(
  elapsedTimeMs: number,
  levels: TournamentStructure[]
) {
  let accumulatedTime = 0;
  let currentLevel = null;
  let previousLevel = null; // 이전 LEVEL을 추적하기 위한 변수
  let remainingTimeInCurrentLevelMs = 0;
  let timeUntilNextBreakMs: number | null = null;
  let breakFound = false;

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const levelTimeMs = level.time * 60000;

    accumulatedTime += levelTimeMs;

    // 이전 레벨이 "LEVEL" 타입이면 추적
    if (level.type !== "BREAK") {
      previousLevel = level;
    }

    // 현재 레벨 설정
    if (elapsedTimeMs < accumulatedTime && currentLevel === null) {
      currentLevel = level;
      remainingTimeInCurrentLevelMs = accumulatedTime - elapsedTimeMs;
    }

    // 다음 BREAK까지 남은 시간 계산
    if (currentLevel && level.type === "BREAK") {
      if (!breakFound) {
        timeUntilNextBreakMs = accumulatedTime - elapsedTimeMs - levelTimeMs;
        breakFound = true;

        // 현재 레벨이 BREAK일 때 이전 LEVEL로 설정
        if (currentLevel.type === "BREAK" && previousLevel !== null) {
          currentLevel = previousLevel;
        }
      }
    }
  }

  // 모든 레벨을 초과한 경우, 마지막 레벨로 설정
  if (currentLevel === null && levels.length > 0) {
    currentLevel = levels[levels.length - 1];
    remainingTimeInCurrentLevelMs = 0;
  }

  return {
    currentLevel,
    remainingTimeInCurrentLevelMs,
    timeUntilNextBreakMs,
  };
}

export function controlLevel(
  count: number,
  levels: TournamentStructure[],
  current_level: TournamentStructure
): number {
  if (!current_level.ord) return -1;
  if (count < 0 && current_level.ord === 1) return -1;
  if (count > 0 && current_level.ord === levels.length) return -1;

  const result_level = levels[current_level.ord - 1 + count];
  if (!result_level.ord) return -1;
  let playTime = 0;
  for (let i = 0; i < result_level.ord - 1; i++) {
    playTime += levels[i].time * 60000;
  }

  return playTime;
}

export function calculateLevel(
  elapsedTimeMs: number,
  levels: TournamentStructure[]
) {
  let accumulatedTime = 0;
  let overStack = 0;
  let currentLevel: TournamentStructure = levels[levels.length - 1];
  let nextLevel: TournamentStructure = levels[levels.length - 1];
  let remainingTimeInCurrentLevelMs = 0;
  let elapsedTimeInCurrentLevelMs = 0;
  let timeUntilNextBreakMs: number | null = null;
  const lastLevel =
    levels.length < 1 ? emptyStructure() : levels[levels.length - 1];

  // 모든 레벨의 총 지속 시간 계산
  const totalDuration = levels.reduce(
    (sum, level) => sum + level.time * 60000,
    0
  );
  const lastLevelDuration = lastLevel.time * 60000;

  // overStack 계산 및 elapsedTimeMs 조정
  if (elapsedTimeMs > totalDuration) {
    overStack = Math.floor((elapsedTimeMs - totalDuration) / lastLevelDuration);
    elapsedTimeMs =
      ((elapsedTimeMs - totalDuration) % lastLevelDuration) +
      (totalDuration - lastLevelDuration);
  }

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const levelTimeMs = level.time * 60000;
    const levelStartTime = accumulatedTime;
    const levelEndTime = accumulatedTime + levelTimeMs;

    if (elapsedTimeMs >= levelStartTime && elapsedTimeMs < levelEndTime) {
      currentLevel = level;
      nextLevel = i < levels.length - 1 ? levels[i + 1] : level;
      remainingTimeInCurrentLevelMs = levelEndTime - elapsedTimeMs;
      elapsedTimeInCurrentLevelMs = elapsedTimeMs - levelStartTime;
    } else if (i === levels.length - 1 && elapsedTimeMs >= levelEndTime) {
      // 마지막 레벨 반복
      currentLevel = level;
      nextLevel = level;
      const adjustedElapsedTime =
        (elapsedTimeMs - levelStartTime) % levelTimeMs;
      remainingTimeInCurrentLevelMs = levelTimeMs - adjustedElapsedTime;
      elapsedTimeInCurrentLevelMs = adjustedElapsedTime;
    }

    if (
      level.type === "BREAK" &&
      levelStartTime > elapsedTimeMs &&
      timeUntilNextBreakMs === null
    ) {
      timeUntilNextBreakMs = levelStartTime - elapsedTimeMs;
    }

    accumulatedTime += levelTimeMs;
  }

  // 반복되는 마지막 레벨에 대한 timeUntilNextBreakMs 조정
  if (overStack > 0 && timeUntilNextBreakMs === null) {
    const nextBreakIndex = levels.findIndex(
      (level, index) => index > 0 && level.type === "BREAK"
    );
    if (nextBreakIndex !== -1) {
      const timeToNextBreak = levels
        .slice(0, nextBreakIndex)
        .reduce((sum, level) => sum + level.time * 60000, 0);
      timeUntilNextBreakMs = timeToNextBreak - elapsedTimeInCurrentLevelMs;
    }
  }

  if (timeUntilNextBreakMs !== null && timeUntilNextBreakMs <= 0) {
    timeUntilNextBreakMs = 0;
  }

  return {
    currentLevel,
    nextLevel,
    remainingTimeInCurrentLevelMs,
    elapsedTimeInCurrentLevelMs,
    timeUntilNextBreakMs,
    overStack,
  };
}

function formatMilliseconds(ms: number): string {
  if (ms < 0) {
    ms = 0;
  }

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toString().padStart(2, "0");

  return `${minutesStr}분${secondsStr}초`;
}

export function calculateTimesWithoutDto(
  elapsedTimeMs: number,
  levels: TournamentStructure[]
): TimerInfoState {
  if (elapsedTimeMs === 0) {
    return {
      elapsedTimeMs,
      elapsedTime: "00:00:00",
      currentLevel:
        levels.length < 1 ? emptyStructure() : levels[levels.length - 1],
      nextLevel:
        levels.length < 1 ? emptyStructure() : levels[levels.length - 1],
      remainingTimeInCurrentLevel: "00:00",
      timeUntilNextBreak: "00:00",
      elapsedTimeInCurrentLevel: "00분00초",
      progress: 0,
      overStack: 0,
    };
  }

  const {
    currentLevel,
    nextLevel,
    remainingTimeInCurrentLevelMs,
    elapsedTimeInCurrentLevelMs,
    timeUntilNextBreakMs,
    overStack,
  } = calculateLevel(elapsedTimeMs, levels);

  const remainingMinutes = Math.floor(remainingTimeInCurrentLevelMs / 60000);
  const remainingSeconds = Math.floor(
    (remainingTimeInCurrentLevelMs % 60000) / 1000
  );

  const nextBreakMinutes = timeUntilNextBreakMs
    ? Math.floor(timeUntilNextBreakMs / 60000)
    : 0;

  const nextBreakSeconds = timeUntilNextBreakMs
    ? Math.floor((timeUntilNextBreakMs % 60000) / 1000)
    : 0;

  const elapsedTimeInCurrentLevel = formatMilliseconds(
    elapsedTimeInCurrentLevelMs
  );
  const total = currentLevel.time * 60;
  const remain = remainingMinutes * 60 + remainingSeconds;
  const progress = (remain / total) * 100;
  return {
    elapsedTimeMs,
    elapsedTime: formatElapsedTime(elapsedTimeMs),
    currentLevel,
    nextLevel,
    remainingTimeInCurrentLevel: formatRemainingTime(
      remainingMinutes,
      remainingSeconds
    ),
    timeUntilNextBreak: timeUntilNextBreakMs
      ? formatRemainingTime(nextBreakMinutes, nextBreakSeconds)
      : "00:00",
    elapsedTimeInCurrentLevel,
    progress,
    overStack,
  };
}

export function calculateTimes(
  timerData: TimerDto,
  levels: TournamentStructure[]
): TimerInfoState | null {
  const now = new Date();
  const updatedAt = new Date(timerData.updatedAt);

  let elapsedTimeMs = timerData.playTime;

  if (!timerData.isStop) {
    elapsedTimeMs = now.getTime() - updatedAt.getTime() + timerData.playTime;
  } else if (now.getTime() - updatedAt.getTime() > 2 * 60 * 60 * 1000) {
    return null;
  }

  return calculateTimesWithoutDto(elapsedTimeMs, levels);
}

export function calculateTimeAtStart(
  startTime: Date,
  createdAt: Date,
  level1: TournamentStructure,
  level2: TournamentStructure
): TimerInfoState {
  const now = new Date();

  let elapsedTimeMs = startTime.getTime() - now.getTime();
  const elapsedSeconds = Math.floor(elapsedTimeMs / 1000);
  const remainingMinutes = Math.floor(elapsedSeconds / 60);
  const remainingSeconds = elapsedSeconds % 60;
  const remainingHours = Math.floor(elapsedSeconds / 3600);
  const total = (startTime.getTime() - createdAt.getTime()) / 1000 / 60;
  const remain = remainingMinutes * 60 + remainingSeconds;
  const progress = (remain / total) * 100;
  return {
    elapsedTimeMs,
    elapsedTime: formatElapsedTime(elapsedTimeMs),
    currentLevel: {
      type: "READY",
      level: 0,
      time: 0,
      smallBlind: level1.smallBlind,
      bigBlind: level1.bigBlind,
      ante: level1.ante,
      removeChip: level1.removeChip,
      id: 0,
      ord: 0,
    },
    nextLevel: level2,
    remainingTimeInCurrentLevel:
      elapsedTimeMs <= 0
        ? "00:00"
        : remainingHours > 0
        ? `${remainingHours}hour`
        : formatRemainingTime(remainingMinutes, remainingSeconds),
    timeUntilNextBreak: "00:00",
    elapsedTimeInCurrentLevel: formatRemainingTime(
      remainingMinutes,
      remainingSeconds
    ),
    progress,
    overStack: 0,
  };
}

function emptyStructure() {
  return {
    type: "EMPTY",
    level: 0,
    time: 0,
    smallBlind: 0,
    bigBlind: 0,
    ante: 0,
    removeChip: 0,
    id: 0,
    ord: 0,
  };
}
