import { PremiumStoreListWrapper } from "../Style/PremiumStoreStyle";
import { useSearchContext } from "../Hook/SearchContext";
import { PremiumStoreItem } from "./PremiumStoreItem";
import { useUI } from "../Hook/UIContext";

export const PremiumStoreList = () => {
  const { showStoreList } = useUI();
  const { premiumList, vipList } = useSearchContext();
  return (
    <PremiumStoreListWrapper show={showStoreList} isTop={vipList.length === 0}>
      <div className="title">추천 홀덤펍</div>
      <div className="list">
        <div className="inner">
          {premiumList.slice(0, 5).map((item, index) => (
            <PremiumStoreItem key={index} item={item}></PremiumStoreItem>
          ))}
        </div>
      </div>
      <div className="bar" />
    </PremiumStoreListWrapper>
  );
};
