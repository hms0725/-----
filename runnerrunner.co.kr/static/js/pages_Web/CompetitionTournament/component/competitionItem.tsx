import moment from "moment";
import {
  CompetitionTournamentDto,
  TournamentState,
} from "../../../../api/competition";
import { CompetitionItemWrapper } from "../styles/competitionItem";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";

const CompetitionItem = ({ data }: { data: CompetitionTournamentDto }) => {
  const history = useHistory();
  const getStatusText = useCallback((state: TournamentState) => {
    if (state === TournamentState.진행중) return "진행중";
    if (state === TournamentState.진행예정) return "진행예정";
    return "마감";
  }, []);

  const formatLocation = (value: string) => {
    const [country, city, pub] = value.split(",");
    return `${pub} (${country}, ${city})`;
  };

  return (
    <CompetitionItemWrapper
      onClick={() => {
        history.push(`/competition-detail/${data.id}`);
      }}
    >
      <img src={data.thumbnail} alt="썸네일" />
      <div className="info-wrapper">
        <div className="header">
          <div className="title">{data.title}</div>
          <div className="doing">
            {getStatusText(data.state)}
            <img src="/image-web/Icon/rightArrow.svg" alt="화살표" />
          </div>
        </div>

        <div className="info-row">
          <div className="place">{formatLocation(data.location)}</div>
          <div className="date">
            {moment(data.startDate).format("YYYY년 MM월 DD일")} ~{" "}
            {moment(data.endDate).format("YYYY년 MM월 DD일")}
          </div>
        </div>
      </div>
    </CompetitionItemWrapper>
  );
};

export default CompetitionItem;
