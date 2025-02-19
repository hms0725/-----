import React from "react";
import { useSearchContext } from "./Hook/SearchContext";
import { FilterPopup, LocationFilter, SearchPopup } from "./Components";
import { useUI } from "./Hook/UIContext";
import { useHistory } from "react-router-dom";

const SearchContent: React.FC = () => {
  const history = useHistory();
  const {
    showSearch,
    showFilter,
    setShowFilter,
    showLocationFilter,
    setShowSearch,
    setShowLocationFilter,
  } = useUI();
  const {
    filter,
    provinces,
    cities,
    handleTextSearch,
    handleSelectCity,
    handleClickResult,
    setFilter,
  } = useSearchContext();

  return (
    <>
      {showSearch && (
        <SearchPopup
          onSearchText={handleTextSearch}
          onClickResult={handleClickResult}
          onClose={() => {
            setShowSearch(false);
          }}
        />
      )}
      {showFilter && (
        <FilterPopup
          currentFilter={filter}
          onApplyFilter={setFilter}
          onClose={() => setShowFilter(false)}
        />
      )}
      {showLocationFilter && (
        <LocationFilter
          provinces={provinces}
          cities={cities}
          onSelected={handleSelectCity}
          onClose={() => setShowLocationFilter(false)}
        />
      )}
    </>
  );
};

export default SearchContent;
