import { getKoreanNumber } from "../../../../../utils/common";
import { GameInfoPrizeWrapper } from "../../Style/GameInfoDialogStyles";

export const Prize = (props: { data: number[] | undefined }) => {
  const data: number[] | undefined = props.data;
  const filteredData = data ? data.filter((item) => item !== 0) : undefined;
  const points = [300, 250, 200, 150, 150, 150, 150, 150, 150];
  let newData: number[][] = [];
  if (filteredData !== undefined) {
    newData = filteredData.map((item, index) => {
      return [item, points[index]];
    });
  }

  return (
    <GameInfoPrizeWrapper>
      <div className="item">
        <span>순위</span>
        <span>게임 포인트</span>
        <span>랭킹 포인트</span>
      </div>
      {filteredData !== undefined &&
        newData.map((item, index) => (
          <div className="item" key={index}>
            <span>{`${index + 1}위`}</span>
            <span>{getKoreanNumber(item[0])}</span>
            <span>{item[1]}</span>
          </div>
        ))}
    </GameInfoPrizeWrapper>
  );
};
