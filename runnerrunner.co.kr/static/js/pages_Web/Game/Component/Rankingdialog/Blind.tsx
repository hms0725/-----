import { GameInfoBlindWrapper } from "../../Style/GameInfoDialogStyles";

export const Blind = (props: {
  data: number[][] | undefined;
  rest: number | undefined;
  restTime: number | undefined;
}) => {
  const data = props.data;
  const restLevel = props.rest;
  const restTime = props.restTime;
  return (
    <GameInfoBlindWrapper>
      <div className="header">
        <span>레벨</span>
        <span>블라인드</span>
        <span>엔티</span>
        <span>레벨 업(초)</span>
      </div>
      <div className="body">
        {data !== undefined &&
          restLevel !== undefined &&
          restTime !== undefined &&
          data.map((item, index) => (
            <>
              <div className="item" key={index}>
                <span>{`${index + 1}`}</span>
                <span>{`${item[0]}/${item[1]}`}</span>
                <span>{item[2]}</span>
                <span>{item[3]}</span>
              </div>
              {(index + 1) % 4 === 0 && (
                <div className="extra-item">
                  <span>{`BREAK TIME (${restTime})`}</span>
                </div>
              )}
            </>
          ))}
      </div>
    </GameInfoBlindWrapper>
  );
};
