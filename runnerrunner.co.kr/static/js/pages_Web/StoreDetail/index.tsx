import { useHistory, useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DetailInfo from "./Premium/DetailInfo";
import LocationInfo from "./LocationInfo";
import ReportInfo from "./ReportInfo";
import { isPremiumAndVIP, shareURL } from "../../../utils/common";
import LocationSheet from "../../../components/web/LocationSheet";
import { enqueueSnackbar } from "notistack";
import useGeoLocation from "../../../hooks/useGeoLocation";
import useQuickButtons from "../../../hooks/useQuickButtons";
import { useSetRecoilState } from "recoil";
import { navigationTargetState } from "../../../recoil/store";
import Loading from "../../../components/Loading";
import ImageViewer from "../../../components/ImageViewer";
import Review from "./Review";
import ReviewWrite from "./WriteReview";
import { usePopup } from "../../../provider/PopupContext";
import Header from "./Header";
import ThumbnailSection from "./ThumbnailSection";
import StoreInfo from "./StoreInfo";
import ExtraInfo from "./ExtraInfo";
import InfoMenu from "./InfoMenu";
import { StoreDetailWrapper, HorizontalBar } from "./StoreDetailStyles";
import { StoreContext } from "./StoreContext";
import { useStoreDetail } from "../../../hooks/store/useStoreDetail";
import PremiumThumbnailSection from "./Premium/PremiumThumbnailSection";
import PremiumInfoMenu, { InfoMenuType } from "./Premium/PremiumInfoMenu";
import NearbyRestaurants from "./Premium/NearByRestaurants";
import PremiumExtraInfo from "./Premium/PremiumExtraInfo";
import PubIntro from "./Premium/PubIntro";
import HomeInfo from "./Premium/HomeInfo";
import FloatingMenu from "./Premium/FloatingMenu";
import PremiumLocationInfo from "./Premium/PremiumLocationInfo";
import PremiumReview from "./Premium/PremiumReview";
import { LikeType } from "../../../api/like";
import Rank from "./Premium/Rank";

const StoreDetail: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const type = new URLSearchParams(search).get("type");
  const {
    data,
    rate,
    showEdit,
    setShowEdit,
    showWrite,
    setShowWrite,
    editReviewData,
    setEditReviewData,
    handleUpdate,
    currentTime,
  } = useStoreDetail(id);
  const [innerRef, setInnerRef] = useState<Element | null>(null);
  const [infoMenu, setInfoMenu] = useState<InfoMenuType>("detail");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const menuListRef = Array.from({ length: 4 }).map(() =>
    useRef<HTMLDivElement>(null)
  );
  const [showHeader, setShowHeader] = useState(true);
  const setNavigationTarget = useSetRecoilState(navigationTargetState);
  const { latitude, longitude } = useGeoLocation(true);
  const { openPhoneCall, toggleLike } = useQuickButtons();

  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<number, boolean>
  >({});

  // infoMenu 초기값을 data가 로드된 후에 업데이트
  useEffect(() => {
    if (data && infoMenu === "location") {
      setInfoMenu(isPremiumAndVIP(data.pubType) ? "detail" : "location");
    }
  }, [data]);

  const handleClose = () => {
    if (history.action === "PUSH") {
      history.goBack();
    } else {
      history.replace("/");
    }
  };

  const handleOpenCall = () => {
    if (!data) return;
    if (data.cafeName && data.vcn) {
      openPhoneCall(data.cafeName, data.vcn);
    } else {
      enqueueSnackbar("전화번호가 없습니다.", { variant: "error" });
    }
  };

  const handleClickMenu = (menu: InfoMenuType) => {
    setInfoMenu(menu);
  };

  useEffect(() => {
    if (!innerRef) return;
    const checkScroll = () => {
      if (innerRef.scrollTop > 300 || data.pubType === "NORMAL") {
        // 100px 스크롤되면 header 표시
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
    };
    checkScroll();
    if (!data) return;

    innerRef.addEventListener("scroll", checkScroll);

    return () => {
      if (innerRef) {
        innerRef.removeEventListener("scroll", checkScroll);
      }
    };
  }, [innerRef, data]);

  const handleOptimisticToggleLike = async (
    id: number,
    likeType: LikeType
  ): Promise<boolean> => {
    // Immediately update the UI
    const currentLikeState = optimisticLikes[id] ?? data?.like ?? false;
    const newLikeState = !currentLikeState;

    setOptimisticLikes((prev) => ({
      ...prev,
      [id]: newLikeState,
    }));

    try {
      // Make the actual API call
      const result = await toggleLike(id, likeType);

      // Ensure result is boolean
      const booleanResult = Boolean(result);

      // Update with the real result from the server
      setOptimisticLikes((prev) => ({
        ...prev,
        [id]: booleanResult,
      }));

      if (data) {
        data.like = booleanResult;
      }
      return booleanResult;
    } catch (error) {
      // If the API call fails, revert the optimistic update
      setOptimisticLikes((prev) => ({
        ...prev,
        [id]: currentLikeState,
      }));

      if (data) {
        data.like = currentLikeState;
      }

      enqueueSnackbar("좋아요 업데이트에 실패했습니다.", { variant: "error" });
      return currentLikeState;
    }
  };

  if (!data) {
    return <Loading full />;
  }

  const getCurrentLikeState = (id: number) => {
    return optimisticLikes[id] ?? data.like ?? false;
  };

  return (
    <StoreContext.Provider value={{ data, update: handleUpdate }}>
      {showWrite && (
        <ReviewWrite
          mode="write"
          onClose={() => {
            handleUpdate();
            setShowWrite(false);
          }}
          rate={5}
          pubId={data.id}
        />
      )}
      {showEdit && (
        <ReviewWrite
          mode="edit"
          onClose={() => {
            handleUpdate();
            setShowEdit(false);
          }}
          rate={editReviewData ? editReviewData.score : 5}
          reviewData={editReviewData || undefined}
          pubId={data.id}
        />
      )}

      {selectedImageIndex !== -1 && (
        <ImageViewer
          images={data.images.map((x) => x.imageUrl)}
          defaultIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
          canEdit={data.myCafe}
        />
      )}
      <LocationSheet />
      <StoreDetailWrapper ref={setInnerRef} scrollLock={false}>
        <Header
          show={showHeader}
          onClose={handleClose}
          title={data.cafeName}
          data={{
            ...data,
            like: getCurrentLikeState(data.id), // Use the optimistic state
          }}
          onToggleLike={handleOptimisticToggleLike}
        />
        {isPremiumAndVIP(data.pubType) && (
          <>
            <PremiumThumbnailSection
              rate={rate}
              data={data}
              onImageClick={setSelectedImageIndex}
            />
            <PremiumExtraInfo data={data} currentTime={currentTime} />
            <PremiumInfoMenu
              showRestaurantTab={false}
              currentMenu={infoMenu}
              onMenuClick={handleClickMenu}
              reviewCount={data.reviewData.length}
            />
            {infoMenu === "detail" && (
              <>
                <DetailInfo boxRef={menuListRef[1]} />
                <HomeInfo boxRef={menuListRef[0]} />
                <PubIntro
                  name={data.cafeName}
                  icon={"/image-web/search/Icon/pub_icon.svg"}
                  description={`안녕하세요 ${data.cafeName} 입니다!`}
                />
                <ReportInfo />
              </>
            )}
            {infoMenu === "rank" && <Rank />}
            {infoMenu === "location" && (
              <PremiumLocationInfo boxRef={menuListRef[3]} />
            )}
            {infoMenu === "review" && (
              <PremiumReview
                boxRef={menuListRef[4]}
                setEditReviewData={setEditReviewData}
                setEditReview={setShowEdit}
                openWrite={() => {
                  setShowWrite(true);
                }}
                closeWrite={() => {
                  setShowWrite(false);
                }}
                reviewData={data.reviewData}
                pubId={data.id}
                todayReviewPhotoAdd={data.todayReviewPhotoAdd}
              />
            )}
            <FloatingMenu
              data={{
                ...data,
                like: getCurrentLikeState(data.id), // Use the optimistic state
              }}
              onOpenCall={handleOpenCall}
              onShare={() => shareURL(window.location.href)}
              onNavigate={() => setNavigationTarget(data)}
            />
          </>
        )}

        {!isPremiumAndVIP(data.pubType) && (
          <>
            <ThumbnailSection
              images={data.images}
              onImageClick={setSelectedImageIndex}
            />
            <StoreInfo
              data={data}
              rate={rate}
              latitude={latitude}
              longitude={longitude}
            />
            <ExtraInfo
              data={{
                ...data,
                like: getCurrentLikeState(data.id), // Use the optimistic state
              }}
              onOpenCall={handleOpenCall}
              onToggleLike={handleOptimisticToggleLike}
              onShare={() => shareURL(window.location.href)}
              onNavigate={() => setNavigationTarget(data)}
            />
            <HorizontalBar />
            <InfoMenu
              pubType={data.pubType}
              currentMenu={infoMenu}
              onMenuClick={handleClickMenu}
            />
            {infoMenu === "location" && (
              <LocationInfo boxRef={menuListRef[3]} />
            )}
            {infoMenu === "review" && (
              <Review
                boxRef={menuListRef[4]}
                setEditReviewData={setEditReviewData}
                setEditReview={setShowEdit}
                openWrite={() => {
                  setShowWrite(true);
                }}
                closeWrite={() => {
                  setShowWrite(false);
                }}
                reviewData={data.reviewData}
                pubId={data.id}
                todayReviewPhotoAdd={data.todayReviewPhotoAdd}
              />
            )}
            <HorizontalBar />
            <ReportInfo />
          </>
        )}
      </StoreDetailWrapper>
    </StoreContext.Provider>
  );
};

export default StoreDetail;
