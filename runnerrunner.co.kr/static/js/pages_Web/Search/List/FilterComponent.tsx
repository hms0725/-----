import { FilterWrapper } from "../Style/SearchStyles";
import {
  PubSortTypeLabels,
  getPubSortLabel,
} from "../../../../utils/constants";
import { useSearchContext } from "../Hook/SearchContext";
import { useEffect, useState } from "react";
import { useUI } from "../Hook/UIContext";

export const FilterComponent = () => {
  const { setShowFilter } = useUI();
  const { premiumList, isSelectedSortType, filter, setSortType } =
    useSearchContext();

  const [selectedSortType, selectSortType] = useState<string>("distance");
  const [showSortFilter, setShowSortFilter] = useState(false);

  useEffect(() => {
    selectSortType(filter.sort ? filter.sort : "distance");
  }, [filter]);
  return (
    <FilterWrapper show={premiumList.length > 0}>
      <div className="title">
        내 주변 홀덤펍을
        <br />
        찾아보세요!
      </div>
      <div className="type-row">
        <div className="sort-box">
          <div
            className="sort-wrapper"
            onClick={() => {
              setShowSortFilter(!showSortFilter);
            }}
          >
            <span
              className={`title ${
                getPubSortLabel(selectedSortType).length > 5 && "long"
              }`}
            >
              {showSortFilter ? "정렬기준" : getPubSortLabel(selectedSortType)}
            </span>
            <img src="/image-web/Icon/Arrow%20down.svg" alt="Arrow down" />
            {showSortFilter && (
              <div className="sort-popup">
                {PubSortTypeLabels.map(({ type, label }, i) => (
                  <div
                    className={`item ${
                      isSelectedSortType(type) ? "selected" : ""
                    }`}
                    key={i}
                    onClick={() => setSortType(type)}
                  >
                    {label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <img
            id="상세"
            alt="상세"
            className="detail"
            src={`/image-web/search/detail.svg`}
            onClick={() => setShowFilter(true)}
          />
        </div>
      </div>
    </FilterWrapper>
  );
};
