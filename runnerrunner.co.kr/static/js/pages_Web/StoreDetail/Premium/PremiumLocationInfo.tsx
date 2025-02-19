import styled from "styled-components";
import { InfoBoxWrapper } from "../../../../components/common/InfoBoxWrapper";
import { RefObject, useContext, useEffect, useState } from "react";
import { StoreContext } from "../StoreContext";
import { useSetRecoilState } from "recoil";
import { navigationTargetState } from "../../../../recoil/store";
import { renderToString } from "react-dom/server";
import StoreMarker from "../../../../components/StoreMarker";

const LocationInfoBox = styled(InfoBoxWrapper)`
  padding-bottom: 150px;
  > .title {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 700;
    line-height: 23.87px;
    letter-spacing: -0.02em;
    text-align: left;
  }

  #map {
    margin-top: 12px;
    width: 100%;
    height: 240px;
    border-radius: 8px;
  }

  > .address {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.28px;

    > img {
      width: 16px;
      height: 16px;
    }
  }

  > .button {
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    background: rgba(100, 54, 231, 1);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: white;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;

    > img {
      width: 20px;
      height: 20px;
    }
  }
`;

interface InfoBoxRef {
  boxRef: RefObject<HTMLDivElement>;
}

const PremiumLocationInfo = ({ boxRef }: InfoBoxRef) => {
  const { data } = useContext(StoreContext);
  const setNavigationTarget = useSetRecoilState(navigationTargetState);

  const [map, setMap] = useState<any>(null);
  useEffect(() => {
    const mapDiv = document.getElementById("map") as HTMLDivElement;

    const NaverMaps = window.naver.maps;
    const map = new NaverMaps.Map(mapDiv, {
      center: new NaverMaps.LatLng(data.lat, data.lon),
      tileSpare: 3,
    });
    setMap(map);

    new NaverMaps.Marker({
      position: new NaverMaps.LatLng(data.lat, data.lon),
      map: map,
      title: data.cafeName,
      icon: {
        content: renderToString(
          <StoreMarker
            selected
            pubType={data.pubType}
            buyInFrom={data.buyIn}
            buyInTo={data.buyInMax}
            name={data.cafeName}
          />
        ),
        anchor: new NaverMaps.Point(0, 30),
      },
    });
  }, []);

  return (
    <LocationInfoBox ref={boxRef}>
      <div className="title">매장 위치</div>
      <div id="map" />
      <div className="address">
        <img src="/image-web/store/Map%20pin/small.png" />
        {data.newAddress} {data.detailAddress}
      </div>
      <div className="button" onClick={() => setNavigationTarget(data)}>
        <img src="/image-web/Icon/Navigation-white.svg" />
        길안내
      </div>
    </LocationInfoBox>
  );
};
export default PremiumLocationInfo;
