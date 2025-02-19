import instance from "../utils/network";
export interface CouponResponse {
  id: number;
  userId: number;
  userNickname: string;
  title: string;
  type: string;
  closeAt: string;
  description: string;
  warning: string;
  imageUrl: string;
  couponImageUrl: string;
}

export function getCoupons(sort: number): Promise<CouponResponse[]> {
  return instance.get(`/coupon/${sort}`);
}
