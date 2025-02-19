import React from "react";
import {
  SearchLayout,
  MapView,
  MapBanner,
  PubMore,
  MapPub,
} from "./Components";
import { useUI } from "./Hook/UIContext";
import { useStore } from "./Hook/StoreContext";

const StoreListContent: React.FC = () => {
  const {
    showFilter,
    showSearch,
    showLocationFilter,
    setShowLocationFilter,
    showStoreList,
  } = useUI();
  const { selectedStore } = useStore();
  return (
    <>
      <SearchLayout
        showFilter={showFilter}
        showLocationFilter={showLocationFilter}
        setShowLocationFilter={setShowLocationFilter}
      >
        {!showStoreList && <MapView />}
        {!showSearch && <MapBanner />}
      </SearchLayout>
      {showStoreList && selectedStore && <PubMore cafe={selectedStore} />}
      {!showStoreList && selectedStore && <MapPub cafe={selectedStore} />}
    </>
  );
};

export default StoreListContent;
