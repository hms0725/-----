import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "../Hook/GameContext";
import { GameMyPageWrapper } from "../Style/GameStyles";
import {
  MyRankResponse,
  SeasonHistoryResponse,
} from "../../../../api/tournament";
import {
  GameMyPageHistoryWrapper,
  GameMyPageRankingPointWrapper,
  GameMyPageRanksWrapper,
} from "../Style/GameMyPageStyle";

export const GameMyPage = () => {
  const {
    rankingPoint,
    getMyPoint,
    getMyHistory,
    getMyRanks,
    tier,
    nextLevel,
    user,
    openRankingDialog,
  } = useGameContext();
  const [myHistory, setMyHistory] = useState<SeasonHistoryResponse | null>(
    null
  );
  const [myRanks, setMyRanks] = useState<MyRankResponse | null>(null);

  const [showYearFilter, setShowYearFilter] = useState(false);
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const [gameType, setGameType] = useState("전체");

  const yearList = [2024, 2025, 2026];
  const monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const gameTypeList = ["전체", "토너먼트", "프리 토너먼트"];

  const setData = async () => {
    const rank_res = await getMyRanks();
    setMyRanks(rank_res);
  };
  useEffect(() => {
    getMyPoint();
    setData();
  }, []);

  const getHistory = async () => {
    const req_type =
      gameType === "전체"
        ? null
        : gameType === "토너먼트"
        ? "TOURNAMENT"
        : "FREE_TOURNAMENT";
    const history_res = await getMyHistory(year, month, req_type);
    setMyHistory(history_res);
  };

  useEffect(() => {
    getHistory();
  }, [year, month, gameType]);

  const getWidth = useCallback(() => {
    if (tier) {
      let point = rankingPoint;
      let max = rankingPoint + nextLevel;
      switch (tier) {
        case "SILVER":
          max -= 301;
          point -= 301;
          break;
        case "GOLD":
          max -= 701;
          point -= 701;
          break;
        case "PLATINUM":
          max -= 1501;
          point -= 1501;
          break;
        case "DIAMOND":
          return 100;
        case "MASTER":
          return 100;
      }
      const progressPercentage = (point / max) * 100;
      return progressPercentage.toFixed(2);
    }
    return 0;
  }, [rankingPoint]);

  return (
    <GameMyPageWrapper>
      <div className="wrapper">
        <div className="profile-wrapper">
          <div className="profile-row">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} />
            ) : (
              <img src="https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png" />
            )}
          </div>
          <div className="info-row">
            <div className="name">{user?.nickname}</div>
            <span className={`tier ${tier}`}>{tier}</span>
          </div>
        </div>
        <GameMyPageRankingPointWrapper>
          <div className="header">
            <div className="title">랭킹 포인트</div>
            <img
              src="/image-web/game/info.svg"
              onClick={() => openRankingDialog()}
            />
          </div>
          <div className="bar-wrapper">
            <div
              className={`bar ${tier}`}
              style={{ width: `${getWidth()}%` }}
            />
          </div>
          <div className="bottom">
            <div className="point">
              {rankingPoint.toLocaleString() + " RP" || 0 + " RP"}
            </div>
            <div className="description">
              다음 레벨까지 필요한 <span>RP {nextLevel}</span>
            </div>
          </div>
        </GameMyPageRankingPointWrapper>
        <GameMyPageRanksWrapper>
          <div className="title">토너먼트 기록</div>
          <div className="rank-wrapper">
            <div className="item">
              <img src="/image-web/game/myPage/first.png" />
              <div className="count">{`${
                myRanks?.first.toLocaleString() || 0
              }회`}</div>
            </div>
            <div className="item">
              <img src="/image-web/game/myPage/second.png" />
              <div className="count">{`${
                myRanks?.second.toLocaleString() || 0
              }회`}</div>
            </div>
            <div className="item">
              <img src="/image-web/game/myPage/third.png" />
              <div className="count">{`${
                myRanks?.third.toLocaleString() || 0
              }회`}</div>
            </div>
            <div className="item">
              <div className="other">4위 - 10위</div>
              <div className="count">{`${
                myRanks?.other.toLocaleString() || 0
              }회`}</div>
            </div>
          </div>
        </GameMyPageRanksWrapper>
        <GameMyPageHistoryWrapper>
          <div className="title">HISTORY</div>
          <div className="filter">
            <div
              className="sort-wrapper"
              onClick={() => {
                setShowTypeFilter(!showTypeFilter);
                setShowMonthFilter(false);
                setShowYearFilter(false);
              }}
            >
              <span>{gameType}</span>
              <img src="/image-web/game/downArrow.svg" />
              {showTypeFilter && (
                <div className="sort-popup">
                  {gameTypeList.map((item, index) => (
                    <div
                      className={`item ${gameType === item && "selected"}`}
                      onClick={() => {
                        setGameType(item);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="sort-wrapper"
              onClick={() => {
                setShowYearFilter(!showYearFilter);
                setShowMonthFilter(false);
                setShowTypeFilter(false);
              }}
            >
              <span>{`${year}년`}</span>
              <img src="/image-web/game/downArrow.svg" />
              {showYearFilter && (
                <div className="sort-popup">
                  {yearList.map((item, index) => (
                    <div
                      className={`item ${year === item && "selected"}`}
                      onClick={() => {
                        setYear(item);
                      }}
                    >
                      {`${item}년`}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="sort-wrapper"
              onClick={() => {
                setShowMonthFilter(!showMonthFilter);
                setShowYearFilter(false);
                setShowTypeFilter(false);
              }}
            >
              <span>{`${month}월`}</span>
              <img src="/image-web/game/downArrow.svg" />
              {showMonthFilter && (
                <div className="sort-popup">
                  {monthList.map((item, index) => (
                    <div
                      className={`item ${month === item && "selected"}`}
                      onClick={() => {
                        setMonth(item);
                      }}
                    >
                      {`${item}월`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="history-wrapper">
            {myHistory &&
              myHistory.histories.map((item, index) => (
                <div className="item">
                  <div className="info">
                    <div className="date">{item.createdAt.split("T")[0]}</div>
                    <div className="result-wrapper">
                      {item.type === "TOURNAMENT" ? (
                        <img src="/image-web/game/category/tournament.png" />
                      ) : (
                        <img src="/image-web/game/category/freeTournament.png" />
                      )}
                      <div className="result">
                        <div className="rank">
                          {item.rank ? item.rank + "위" : "참가"}
                        </div>
                        <div className="title">
                          {item.type === "TOURNAMENT"
                            ? "토너먼트"
                            : "프리 토너먼트"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="point">
                    {`${item.point} `}
                    <span>RP</span>
                  </div>
                </div>
              ))}
          </div>
        </GameMyPageHistoryWrapper>
      </div>
    </GameMyPageWrapper>
  );
};
