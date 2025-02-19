import { useMemo, useState } from "react";
import { GameRankListWrapper, GameRankItemWrapper } from "../Style/GameStyles";
import { useGameContext } from "../Hook/GameContext";
import GamePagination from "../../../../components/web/GamePaination";

export const GameRankList = () => {
  const ITEM_PER_PAGE = 7;
  const { seasonRanking, getSeasonRanking } = useGameContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const paginatedList = useMemo(() => {
    setTotalPages(
      Math.ceil((seasonRanking?.totalOtherRanks ?? 0) / ITEM_PER_PAGE)
    );
    return seasonRanking?.otherRanks ?? [];
  }, [seasonRanking]);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showSeasonFilter, setShowSeasonFilter] = useState(false);
  const [season, setSeason] = useState(3);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const category = ["통합"];
  const imageUrl = "/image-web/game/";
  const tierUrl = imageUrl + "tier/";

  return (
    <GameRankListWrapper>
      <div className="filter">
        <div
          className="sort-wrapper"
          onClick={() => {
            setShowSeasonFilter(false);
            setShowCategoryFilter(!showCategoryFilter);
          }}
        >
          <span>{`${category[categoryIndex]}`}</span>
          <img src="/image-web/game/downArrow.svg" />
          {showCategoryFilter && (
            <div className="sort-popup">
              {category.map((item, index) => (
                <div
                  className={`item ${index === categoryIndex && "selected"}`}
                  onClick={() => {
                    setCategoryIndex(index);
                  }}
                >
                  {`${item}`}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="sort-wrapper"
          onClick={() => {
            setShowSeasonFilter(!showSeasonFilter);
            setShowCategoryFilter(false);
          }}
        >
          <span>{`시즌 ${season}`}</span>
          <img src="/image-web/game/downArrow.svg" />
          {showSeasonFilter && (
            <div className="sort-popup">
              {[3].map((item, index) => (
                <div
                  className={`item ${season === item && "selected"}`}
                  onClick={() => {
                    setSeason(item);
                  }}
                >
                  {`시즌 ${item}`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="inner">
        <div className="list">
          {paginatedList.length > 0 ? (
            paginatedList.map((item, i) => {
              return (
                <GameRankItemWrapper key={i}>
                  <div className="item no">{item.rank}위</div>

                  <div className="item nickname">
                    <img
                      className="profile"
                      alt="프로필"
                      src={item.profile ?? "/image-web/default_profile.png"}
                    ></img>
                    {item.nickName}
                  </div>

                  <div className="item point">
                    {item.point.toLocaleString()} <span>RP</span>
                  </div>
                  <div className="tier">
                    <img
                      alt="티어"
                      src={`${tierUrl}${item.tier || "BRONZE"}.png`}
                    />
                    <span>{item.tier}</span>
                  </div>
                </GameRankItemWrapper>
              );
            })
          ) : (
            <div className="no-data">데이터 준비 중 입니다.</div>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <GamePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            getSeasonRanking(page - 1);
          }}
        />
      )}
    </GameRankListWrapper>
  );
};
