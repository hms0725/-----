import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import News from "../News";
import MTournamentSchedule from "../TournamentSchedule/m_index";
import { useCompetitionContext } from "../CompetitionTournament/hook/competitionContext";
import CompetitionTournament from "../CompetitionTournament";

// location.state를 위한 타입 정의
interface LocationState {
  fromNewsDetail?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;

  @media ${MEDIA_DESKTOP} {
    position: static;
    height: auto;
    max-width: 1060px;
    margin: 0 auto;
    padding: 40px 0;
  }

  > .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 10px 0px 0px;
    > .item {
      flex: 1;
      text-align: center;
      color: #dedede;
      height: 27px;
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      border-bottom: 1px solid rgb(222, 222, 222);
    }
    > .item.selected {
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      border-bottom: 1px solid black;
    }
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: white;
  z-index: 11;

  @media ${MEDIA_DESKTOP} {
    position: static;
    padding: 0;
  }

  .close {
    cursor: pointer;
    width: 24px;
    height: 24px;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  }

  .title {
    margin-left: 5px;
    color: #444;
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 600;

    @media ${MEDIA_DESKTOP} {
      font-size: 24px;
      font-weight: 700;
    }
  }
`;

const NewsAndSchedule = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [selectedMenu, setSelectedMenu] = useState("tournament");
  useEffect(() => {
    // location.state에서 fromNewsDetail 값을 확인
    if (location.state?.fromNewsDetail) {
      setSelectedMenu("news");
      history.replace(location.pathname, undefined);
    }
  }, [location]);

  return (
    <Wrapper>
      <Header>
        <div
          className="close"
          onClick={() => {
            history.push("/");
          }}
        >
          <img
            src="/image-web/Icon/Back.svg"
            id="홀덤뉴스 뒤로가기"
            alt="close"
          />
        </div>
        <div className="title">토너먼트 스케줄 & 뉴스</div>
      </Header>
      <div className="header">
        <div
          className={`item ${selectedMenu === "tournament" ? "selected" : ""}`}
          onClick={() => setSelectedMenu("tournament")}
        >
          토너먼트 스케줄
        </div>
        <div
          className={`item ${selectedMenu === "news" ? "selected" : ""}`}
          onClick={() => setSelectedMenu("news")}
        >
          포커 뉴스
        </div>
      </div>
      {selectedMenu === "news" && <News />}
      {selectedMenu === "tournament" && <CompetitionTournament />}
    </Wrapper>
  );
};

export default NewsAndSchedule;
