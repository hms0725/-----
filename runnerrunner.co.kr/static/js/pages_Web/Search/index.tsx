import React, { useEffect, useRef } from "react";
import { SearchProvider } from "./Hook/SearchContext";
import SearchContent from "./SearchContent";
import HeaderContent from "./HeaderContent";
import StoreListContent from "./StoreListContent";

import { usePubSearch } from "./Hook/usePubSearch";
import useGeoLocation from "../../../hooks/useGeoLocation";
import { UIProvider } from "./Hook/UIContext";
import { StoreProvider } from "./Hook/StoreContext";

interface SearchProps {
  initialShowSearch?: boolean;
}

const Search: React.FC<SearchProps> = ({ initialShowSearch = false }) => {
  const initSearch = useRef(false);
  const { handleSearch } = usePubSearch();
  const { latitude, longitude } = useGeoLocation();
  useEffect(() => {
    if (!initSearch.current) {
      initSearch.current = true;
      handleSearch({ lat: latitude, lon: longitude, km: 10 });
    }
  }, [initSearch]);

  return (
    <>
      <UIProvider initialShowSearch={initialShowSearch}>
        <HeaderContent />
        <StoreProvider>
          <SearchProvider>
            <SearchContent />
            <StoreListContent />
          </SearchProvider>
        </StoreProvider>
      </UIProvider>
    </>
  );
};

export default Search;
