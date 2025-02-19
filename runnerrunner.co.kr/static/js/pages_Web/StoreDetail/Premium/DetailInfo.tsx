import { RefObject, useContext, useEffect, useState } from "react";
import { StoreContext } from "../StoreContext";
import {
  BoxWrapper,
  DetailInfoBox,
  EventBoxWrapper,
  EventImageWrapper,
} from "./styles/DetailInfo";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageViewerModal from "../../../../components/common/ImageViewerModal";
interface InfoBoxProps {
  boxRef: RefObject<HTMLDivElement>;
}

const DetailInfo = ({ boxRef }: InfoBoxProps) => {
  const { data } = useContext(StoreContext);
  const [isFold, setIsFold] = useState(true);
  const [infoUseRef, setInfoUseRef] = useState<HTMLDivElement | null>(null);
  const [showFoldButton, setShowFoldButton] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    if (infoUseRef) {
      new ResizeObserver(() => {
        const scrollHeight = infoUseRef.scrollHeight;
        const offsetHeight = infoUseRef.offsetHeight;
        setShowFoldButton(!isFold || scrollHeight > offsetHeight);
      }).observe(infoUseRef);
    }
  }, [infoUseRef, isFold]);

  return (
    <DetailInfoBox ref={boxRef}>
      {data.events.length > 0 && (
        <EventBoxWrapper>
          <div className="title">매장 이벤트</div>
          <Swiper
            slidesPerView={1.1}
            centeredSlides={true}
            spaceBetween={12}
            className="swiper"
          >
            {data.events.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <EventImageWrapper
                    onClick={() => setSelectedImage(item.imageUrl)}
                  >
                    <img alt="event" src={item.imageUrl}></img>
                  </EventImageWrapper>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </EventBoxWrapper>
      )}
      <ImageViewerModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ""}
      />
      <BoxWrapper>
        <div className="title">매장 이용 안내</div>
        <div className="box-wrapper-outer">
          <div className={"box-wrapper " + (isFold ? "fold" : "")}>
            <div
              ref={setInfoUseRef}
              className="content"
              dangerouslySetInnerHTML={{
                __html: data.informationUse.replace(/\n/g, "<br/>"),
              }}
            />
            {showFoldButton && (
              <img
                src="/image-web/store/Arrow%20down.svg"
                className="button"
                onClick={() => setIsFold(!isFold)}
              />
            )}
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="title">업체 정보</div>
        <div className="box-wrapper-outer">
          <div className="box-wrapper">
            <div className="content">
              상호: {data.cafeName}
              <br />
              주소: {data.newAddress} {data.detailAddress}
              <br />
              전화번호: {data.vcn}
              <br />
              사업자번호: {data.employerId || "-"}
            </div>
          </div>
        </div>
      </BoxWrapper>
    </DetailInfoBox>
  );
};
export default DetailInfo;
