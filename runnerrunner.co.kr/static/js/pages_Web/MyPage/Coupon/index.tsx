import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import { useEffect, useState } from "react";
import { CouponResponse, getCoupons } from "../../../../api/coupon";
import {
  CouponItem,
  CouponListWrapper,
  CouponTabItem,
  CouponTabWrapper,
  CouponWrapper,
} from "./style";
import CouponDetailPopup from "./component/couponDetailPopup";
import { CouponDetailOverlay } from "./component/style";
import { enqueueSnackbar } from "notistack";

interface CouponProps {
  onClose: () => void;
}
const Coupon = ({ onClose }: CouponProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const [list, setList] = useState<CouponResponse[]>([]);
  const [sort, setSort] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [coupon, setCoupon] = useState<CouponResponse | null>(null);

  const getCoupon = async () => {
    const res = await getCoupons(sort);
    setList(res);
  };

  const reverseTypeToKorean = (type: string) => {
    switch (type) {
      case "COUPON":
        return "쿠폰";
      case "DISCOUNT":
        return "할인권";
    }
  };

  function formatDate(datetimeStr: string): string {
    return datetimeStr.split("T")[0];
  }

  useEffect(() => {
    getCoupon();
  }, [sort]);
  return (
    <>
      <CouponWrapper>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">쿠폰함</div>
        </div>
        <CouponTabWrapper>
          <CouponTabItem isSelected={sort === 0} onClick={() => setSort(0)}>
            전체
          </CouponTabItem>
          <CouponTabItem isSelected={sort === 1} onClick={() => setSort(1)}>
            쿠폰
          </CouponTabItem>
          <CouponTabItem
            isSelected={sort === 2}
            onClick={() => {
              enqueueSnackbar("준비중입니다.");
            }}
          >
            할인권
          </CouponTabItem>
        </CouponTabWrapper>
        <CouponListWrapper>
          {list.map((item, index) => (
            <CouponItem
              key={index}
              onClick={() => {
                setIsDetailOpen(true);
                setCoupon(item);
              }}
            >
              <div className="left-box">
                <div className="type">{reverseTypeToKorean(item.type)}</div>
                <div className="title">{item.title}</div>
                <div className="date-title">사용기한</div>
                <div className="date">{formatDate(item.closeAt)}</div>
              </div>
              <div className="right-box">
                <img src={item.couponImageUrl} />
                <div className="dot-wrapper">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </div>
            </CouponItem>
          ))}
        </CouponListWrapper>
      </CouponWrapper>
      {isDetailOpen && coupon && (
        <CouponDetailPopup
          onClose={() => setIsDetailOpen(false)}
          coupon={coupon}
        />
      )}
      {isDetailOpen && <CouponDetailOverlay />}
    </>
  );
};

export default Coupon;
