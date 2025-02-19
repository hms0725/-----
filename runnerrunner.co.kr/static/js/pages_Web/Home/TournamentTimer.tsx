import { useEffect, useRef, useState } from "react";
import moment from "moment";

function TournamentTimer({
  start,
  end,
}: {
  start: string;
  end: number | undefined;
}) {
  const timerRef = useRef<NodeJS.Timer>();
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timerText, setTimerText] = useState("--:--:--");

  useEffect(() => {
    const update = () => {
      if (moment().isAfter(start)) {
        setStarted(true);
      }
      if (end === 1) {
        setEnded(true);

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }

      const diff = Math.max(0, moment(start).diff(moment()));
      setTimerText(moment.utc(diff).format("HH:mm:ss"));
    };

    timerRef.current = setInterval(() => {
      update();
    }, 1000);

    update();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [start, end]);

  if (ended) {
    return (
      <>
        <div className="time">종료</div>
      </>
    );
  } else if (started) {
    return (
      <>
        <div className="time">진행중</div>
      </>
    );
  }

  return (
    <>
      <div className="title">시작까지 남은 시간</div>
      <div className="time">{timerText}</div>
    </>
  );
}

export default TournamentTimer;
