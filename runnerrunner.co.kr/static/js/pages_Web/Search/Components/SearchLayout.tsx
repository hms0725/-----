import React from "react";
import { SearchWrapper } from "../Style/SearchStyles";
import { useStore } from "../Hook/StoreContext";
import { useRecoilValue } from "recoil";
import {
  premiumStoreListState,
  regularStoreListState,
} from "../../../../recoil/search";

interface SearchLayoutProps {
  children: React.ReactNode;
  showFilter: boolean;
  showLocationFilter: boolean;
  setShowLocationFilter: (show: boolean) => void;
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({
  children,
  showFilter,
  showLocationFilter,
  setShowLocationFilter,
}) => {
  const premiumList = useRecoilValue(premiumStoreListState);
  const storeList = useRecoilValue(regularStoreListState);
  const { setSelectedStore, cityText } = useStore();
  return (
    <SearchWrapper scrollLock={showFilter || showLocationFilter}>
      <div
        id="map"
        onClick={() => {
          setSelectedStore(null);
        }}
      >
        <div
          className="location"
          id="city"
          onClick={() => {
            setShowLocationFilter(true);
            setSelectedStore(null);
          }}
        >
          {cityText}
          <img src="/image-web/search/Icon/down_arrow.svg" />
        </div>
      </div>
      <div className="count">{`${
        storeList.length + premiumList.length
      }개 운영중`}</div>
      {children}
    </SearchWrapper>
  );
};
