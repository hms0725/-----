import { PremiumStoreListWrapper } from "../Style/PremiumStoreStyle";
import { useSearchContext } from "../Hook/SearchContext";
import { PremiumStoreItem } from "./PremiumStoreItem";
import { useUI } from "../Hook/UIContext";

export const VipStoreList = () => {
  const { showStoreList } = useUI();
  const { vipList } = useSearchContext();
  return (
    <PremiumStoreListWrapper show={showStoreList} isTop={true}>
      <div className="title">프리미엄 홀덤펍</div>
      <div className="list">
        <div className="inner">
          {vipList.slice(0, 5).map((item, index) => (
            <PremiumStoreItem key={index} item={item}></PremiumStoreItem>
          ))}
        </div>
      </div>
      <div className="bar" />
    </PremiumStoreListWrapper>
  );
};
