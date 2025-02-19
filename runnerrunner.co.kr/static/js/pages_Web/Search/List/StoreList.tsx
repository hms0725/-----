import { StoreListWrapper } from "../Style/SearchStyles";
import EmptyView from "../../../../components/common/EmptyView";
import { useSearchContext } from "../Hook/SearchContext";
import { StoreItem } from "./StoreItem";
import React from "react";
import { useUI } from "../Hook/UIContext";

export const StoreList = React.memo(() => {
  const { showStoreList } = useUI();
  const { storeList } = useSearchContext();
  return (
    <StoreListWrapper show={showStoreList} empty={storeList.length === 0}>
      {!showStoreList && <div className="line"></div>}

      <div className="list">
        {storeList.length === 0 && (
          <EmptyView>조건에 해당하는 펍이 지도 주변에 없습니다.</EmptyView>
        )}
        {storeList.map((item, index) => (
          <StoreItem key={index} item={item} />
        ))}
      </div>
    </StoreListWrapper>
  );
});
