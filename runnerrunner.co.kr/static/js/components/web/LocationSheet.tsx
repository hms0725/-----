import Sheet from "react-modal-sheet";
import styled from "styled-components";
import useQuickButtons from "../../hooks/useQuickButtons";
import { isMobile } from "react-device-detect";
import { useRecoilState } from "recoil";
import { navigationTargetState } from "../../recoil/store";
import { useCallback, useMemo } from "react";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Darkens the background */
  z-index: 1001; /* Below the MapModal's z-index */
`;

const MapModal = styled.div`
  width: 90%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 480px;
  display: flex;
  padding: 30px 15px 40.5px 15px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  border-radius: 12px;
  background: #fff;
  z-index: 1002;

  > .close {
    cursor: pointer;
    position: absolute;
    object-fit: contain;
    width: 20px;
    height: 20px;
    top: 30px;
    right: 15px;
  }

  > .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;

    > .title {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 140%; /* 22.4px */
      margin-bottom: 8px;
    }

    > .map-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      > .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: var(--Pro2, 72px);
        height: var(--Pro2, 72px);
        flex-shrink: 0;
        border-radius: 8px;
        border: 1px solid var(--Black-100, #f0f0f0);

        > img {
          width: 24px;
          height: 24px;
        }

        > .title {
          color: var(--Black-500, #202020);
          text-align: center;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }
    }

    > .address {
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
  }
`;

const LocationSheet = () => {
  const [navigationTarget, setNavigationTarget] = useRecoilState(
    navigationTargetState
  );
  const { openMap } = useQuickButtons();

  const show = useMemo(() => {
    return navigationTarget !== undefined;
  }, [navigationTarget]);

  const address = useMemo(() => {
    return navigationTarget?.newAddress + " " + navigationTarget?.detailAddress;
  }, [navigationTarget]);

  const handleClose = useCallback(() => {
    setNavigationTarget(undefined);
  }, []);

  const handleClick = useCallback(
    (app: string) => {
      if (navigationTarget) {
        openMap(app, navigationTarget);
      }
      handleClose();
    },
    [navigationTarget]
  );

  return show ? (
    <>
      <Overlay />
      <MapModal>
        <img
          className="close"
          onClick={handleClose}
          src="/image-web/Holdem%20Now/Icon/Close.svg"
        />
        <div className="info">
          <div className="title">길 안내 앱 선택</div>
          <div className="map-row">
            <div className="item" onClick={() => handleClick("naver")}>
              <img src="/image-web/store/Location/Navermap.png" />
              <div className="title">네이버 지도</div>
            </div>
            <div className="item" onClick={() => handleClick("kakao")}>
              <img src="/image-web/store/Location/Kakaomap.png" />
              <div className="title">카카오맵</div>
            </div>
            {isMobile && (
              <div className="item" onClick={() => handleClick("tmap")}>
                <img src="/image-web/store/Location/Tmap.png" />
                <div className="title">티맵</div>
              </div>
            )}
            <div className="item" onClick={() => handleClick("copy")}>
              <img src="/image-web/store/Location/Copy.png" />
              <div className="title">주소복사</div>
            </div>
          </div>
          <div className="address">
            <img src="/image-web/store/Map%20pin/small.png" />
            {address}
          </div>
        </div>
      </MapModal>
    </>
  ) : (
    <></>
  );
};

export default LocationSheet;
