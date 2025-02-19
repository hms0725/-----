import { useRef, useState, useEffect } from "react";
import { MapBannerWrapper } from "../Style/SearchStyles";
import { handleTouchEvents } from "../Hook/touchEventHandlers";
import { StoreList } from "../List/StoreList";
import { FilterComponent } from "../List/FilterComponent";
import { PremiumStoreList } from "../List/PremiumStoreList";
import { navigatorShadowState } from "../../../../recoil/navigator";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { VipStoreList } from "../List/VipStoreList";
import { useUI } from "../Hook/UIContext";
import { useStore } from "../Hook/StoreContext";
import {
  premiumStoreListState,
  vipStoreListState,
} from "../../../../recoil/search";

export const MapBanner = () => {
  const { setShowStoreList, showStoreList, setIsScrolled } = useUI();
  const { setSelectedStore } = useStore();
  const premiumList = useRecoilValue(premiumStoreListState);
  const vipList = useRecoilValue(vipStoreListState);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const setNavigatorShadow = useSetRecoilState(navigatorShadowState);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } =
    handleTouchEvents(startY, setStartY, setCurrentY, setIsDragging, () => {
      setSelectedStore(null);
      setTimeout(() => {
        setNavigatorShadow(true);
        setShowStoreList(true);
      }, 100);
    });

  useEffect(() => {
    if (!showStoreList && bannerRef.current) {
      bannerRef.current.scrollTop = 0;
    }
  }, [showStoreList]);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const scrollTop = bannerRef.current.scrollTop;
        if (scrollTop > 50) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    if (bannerRef.current) {
      bannerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (bannerRef.current) {
        bannerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  return (
    <MapBannerWrapper
      ref={bannerRef}
      onTouchStart={!showStoreList ? handleTouchStart : undefined}
      onTouchMove={!showStoreList ? handleTouchMove : undefined}
      onTouchEnd={!showStoreList ? handleTouchEnd : undefined}
      onMouseDown={!showStoreList ? handleTouchStart : undefined}
      onMouseMove={!showStoreList ? handleTouchMove : undefined}
      onMouseUp={(e) => {
        handleTouchEnd();
        if (currentY > 150) {
          setTimeout(() => {
            setShowStoreList(true);
          }, 500);
        }
      }}
      style={{
        transform: isDragging ? `translateY(-${currentY}px)` : "translateY(0)",
        transition: isDragging ? "transform 1s ease" : "top 0.7s ease",
        position: showStoreList ? "fixed" : "absolute",
        top: showStoreList ? "0" : `calc(100% - 90px)`,
        overflowY: showStoreList ? "auto" : "hidden",
      }}
    >
      {!showStoreList && (
        <>
          <div className="line"></div>
          <div className="image-row">
            <img alt="banner" src="/image-web/search/banner.png"></img>
          </div>
        </>
      )}
      {vipList && vipList.length > 0 && <VipStoreList />}
      {premiumList && premiumList.length > 0 && <PremiumStoreList />}

      <FilterComponent />
      <StoreList />
    </MapBannerWrapper>
  );
};
