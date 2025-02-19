// components/ThumbnailSection.tsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";
import { Autoplay } from "swiper/modules";
import { Cafe } from "../../../../api/types";
import useGeoLocation from "../../../../hooks/useGeoLocation";
import PremiumStoreInfo from "./PremiumStoreInfo";
const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;

const ImageView = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  height: 370px;
  &::after {
    z-index: 2;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 52.93%,
      rgba(0, 0, 0, 0.225597) 60.95%,
      #000000 88.48%
    );

    pointer-events: none;
  }
  .swiper {
    height: 100%;
  }

  img.content {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media ${MEDIA_DESKTOP} {
    position: relative;
  }
`;
const ArrowButton = styled.div<{
  direction: "left" | "right";
}>`
  cursor: pointer;
  @media ${MEDIA_DESKTOP} {
    display: block;
  }
  width: 44px;
  height: 44px;
  position: absolute;
  border-radius: 22px;
  padding: 10px;
  top: 50%;
  ${(props) => (props.direction === "left" ? "left: 6px;" : "right: 6px;")}
  transform: translateY(-50%);

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    ${(props) =>
      props.direction === "left" ? "transform: rotate(180deg);" : ""}
  }

  z-index: 11;
`;
const Indicator = styled.div`
  position: absolute;
  right: 16px;
  bottom: 24px;
  border-radius: 12px;
  padding: 4px 16px;
  color: var(--Black-200, rgba(183, 183, 183, 1));

  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  z-index: 20;
  background: rgba(255, 255, 255, 0.2);

  gap: 3px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > .white {
    color: #fff;
    font-weight: 600;
  }

  @media ${MEDIA_DESKTOP} {
    display: flex;
  }
`;
interface ThumbnailSectionProps {
  data: Cafe;
  rate: number;
  defaultIndex?: number;
  onImageClick: (index: number) => void;
}

const PremiumThumbnailSection: React.FC<ThumbnailSectionProps> = ({
  data,
  rate,
  defaultIndex,
  onImageClick,
}) => {
  const mainSwiperRef = useRef<SwiperRef>();
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex || 0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { latitude, longitude } = useGeoLocation(true);

  useEffect(() => {
    if (mainSwiperRef.current) {
      mainSwiperRef.current?.swiper.slideTo(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <ThumbnailWrapper>
      <ImageView>
        <Swiper
          ref={mainSwiperRef}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={0}
          loop={true}
          autoplay={{ delay: 3000 }}
          modules={[Autoplay]}
          onRealIndexChange={(swiper: any) => setCurrentIndex(swiper.realIndex)}
        >
          {data.images.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                alt="메인"
                className="content"
                src={
                  data.images[index]
                    ? data.images[index].imageUrl
                    : "https://dfesoodpx4jgd.cloudfront.net/cafe/default.png"
                }
                onClick={() => onImageClick(0)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <ArrowButton
          direction="left"
          onClick={() => {
            setSelectedIndex(
              (selectedIndex - 1 + data.images.length) % data.images.length
            );
          }}
        >
          <img alt="left" src="/image-web/store/Btn/arrow-right.svg" />
        </ArrowButton>
        <ArrowButton
          direction="right"
          onClick={() => {
            setSelectedIndex((selectedIndex + 1) % data.images.length);
          }}
        >
          <img alt="right" src="/image-web/store/Btn/arrow-right.svg" />
        </ArrowButton>
        <Indicator>
          <span className="white">{currentIndex + 1}</span>
          <span>/</span>
          <span>{data.images.length}</span>
        </Indicator>
      </ImageView>
      <PremiumStoreInfo
        data={data}
        rate={rate}
        latitude={latitude}
        longitude={longitude}
      />
    </ThumbnailWrapper>
  );
};

export default PremiumThumbnailSection;
