import { CouponResponse } from "../../../../../api/coupon";
import { CouponDetailWrapper } from "./style";

const CouponDetailPopup = ({
  onClose,
  coupon,
}: {
  onClose: () => void;
  coupon: CouponResponse;
}) => {
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
  return (
    <CouponDetailWrapper>
      <div className="header">
        <div className="title">{coupon.title}</div>
        <img src="/image-web/coupon/close.svg" onClick={() => onClose()} />
      </div>
      <img src={coupon.imageUrl} />
      <div className="info-wrapper">
        <div className="type">{reverseTypeToKorean(coupon.type)}</div>
        <div className="close-at">
          사용기한 <span>{formatDate(coupon.closeAt)}</span>
        </div>
      </div>

      <div className="notice-wrapper" style={{ marginTop: "10px" }}>
        <div className="title">사용방법</div>
        <div className="description">{coupon.description}</div>
      </div>
      <div className="notice-wrapper">
        <div className="title">주의사항</div>
        <div className="description">{coupon.warning}</div>
      </div>
    </CouponDetailWrapper>
  );
};

export default CouponDetailPopup;
