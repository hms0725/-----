import { StoreInfoWrapper } from "../Style/SearchStyles";
import { useSearchContext } from "../Hook/SearchContext";
import { Cafe } from "../../../../api/types";
import { getDistanceKm } from "../../../../utils/common";
import React, { useCallback } from "react";
import { useUI } from "../Hook/UIContext";
import { useRecoilValue } from "recoil";
import { geoCoordState } from "../../../../recoil/geo";
import { useHistory } from "react-router-dom";
interface StoreItemProps {
  item: Cafe;
}

export const StoreItem = React.memo<StoreItemProps>(({ item }) => {
  const history = useHistory();
  const { latitude, longitude } = useRecoilValue(geoCoordState);
  const { showStoreList } = useUI();
  const handleClick = useCallback(() => {
    if (showStoreList) {
      history.push(`/store/${item.id}`);
    }
  }, [showStoreList, history, item.id]);
  return (
    <StoreInfoWrapper onClick={handleClick}>
      <div className="cover">
        {item.images[0] ? (
          <img className="img" alt="cover" src={item.images[0].imageUrl} />
        ) : (
          <img
            className="img"
            alt="cover"
            src="https://dfesoodpx4jgd.cloudfront.net/cafe/default.png"
          />
        )}
      </div>
      <div className="bottom">
        <div className="title">{item.cafeName}</div>
        <div className="address">
          {item.newAddress} {item.detailAddress}
        </div>
        <div className="info-row">
          <div className="item">
            <img className="icon" src="/image-web/Icon/Heart/small.svg" />
            <span className="text">{item.likeCount}</span>
          </div>
          <div className="item">
            <img className="icon" src="/image-web/Icon/Map%20pin/small.svg" />
            <span className="text">
              {getDistanceKm(latitude, longitude, item.lat, item.lon)} km
            </span>
          </div>
        </div>
      </div>
    </StoreInfoWrapper>
  );
});
