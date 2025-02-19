import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreData } from "./useStoreData";
import { enqueueSnackbar } from "notistack";
import { ReviewDataResponse, PubType } from "../../api/types";
import { useRecoilValue } from "recoil";
import { currentTimeState } from "../../recoil/app";

export const useStoreDetail = (id: string) => {
  const history = useHistory();
  const currentTime = useRecoilValue(currentTimeState);
  const { data, fetchData } = useStoreData({
    cafeName: "로딩중",
    images: [],
    pubType: "NORMAL",
    createAt: "",
    updatedAt: "",
    id: 0,
    ownerUserId: 0,
    ownerName: "",
    employerId: "",
    phoneNumber: "",
    oldAddress: "",
    newAddress: "",
    areaProvince: "",
    areaCity: "",
    areaStreet: "",
    areaProvinceId: 0,
    areaCityId: 0,
    areaStreetId: 0,
    distance: null,
    detailAddress: "",
    directions: "",
    informationUse: "",
    email: "",
    lat: 0,
    lon: 0,
    facilities: [],
    reviewCount: 0,
    reviewPoint: 0,
    likeCount: 0,
    like: false,
    operatingHours: null,
    operatingDays: null,
    operatingStartTime: null,
    operatingEndTime: null,
    openChatUrl: null,
    vcn: null,
    exit: false,
    recommended: false,
    agree: false,
    blindUp: 0,
    blindUpMax: 0,
    buyIn: null,
    buyInMax: null,
    prize: null,
    prizeMax: null,
    gameTypes: [],
    restaurant: [],
    events: [],
    todayReviewPhotoAdd: false,
    myCafe: false,
    reviewImages: [],
    remainingReviewCount: 0,
    reviewData: [],
    pubTournamentList: [],
    holdemNowList: [],
  });
  const [rate, setRate] = useState(0);
  const [hasOpenChat, setHasOpenChat] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showWrite, setShowWrite] = useState(false);
  const [editReviewData, setEditReviewData] =
    useState<ReviewDataResponse | null>(null);

  const handleUpdate = useCallback(() => {
    if (id) {
      const cafeId = Number(id);
      fetchData(cafeId)
        .then((res) => {
          if (res.reviewData.length > 0) {
            const totalScore = res.reviewData.reduce(
              (sum, review) => sum + review.score,
              0
            );
            setRate(totalScore / res.reviewData.length);
          }
          setHasOpenChat(!!res.openChatUrl);
        })
        .catch((e: any) => {
          enqueueSnackbar("펍 정보를 가져올 수 없습니다: " + e.message, {
            variant: "error",
          });
          history.goBack();
        });
    } else {
      history.goBack();
    }
  }, [id, fetchData, history]);

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  return {
    data,
    rate,
    hasOpenChat,
    showEdit,
    setShowEdit,
    showWrite,
    setShowWrite,
    editReviewData,
    setEditReviewData,
    handleUpdate,
    currentTime,
  };
};
