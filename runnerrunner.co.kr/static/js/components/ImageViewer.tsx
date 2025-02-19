import styled from 'styled-components';

import {Swiper, SwiperRef, SwiperSlide} from 'swiper/react';
import {useCallback, useEffect, useRef, useState} from "react";
import type {Swiper as SwiperClass} from "swiper/types";
import useScreenOrientation, {MEDIA_DESKTOP} from "../hooks/useScreenOrientation";
import {ReviewImageInterface} from "./ImageViewDndItem";
import {isMobile} from "react-device-detect";

const Dim = styled.div`
  @media ${MEDIA_DESKTOP} {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background: #000;
    z-index: 110;
  }
`
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: #000;
  display: flex;
  flex-direction: column;
  @media ${MEDIA_DESKTOP} {
    width: 900px;
    height: 674px;
    border-radius: 20px;
    background: var(--Black-100, #F0F0F0);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
`;

const Header = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  > .title {
    display: none;
    @media ${MEDIA_DESKTOP} {
      display: block;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.4px;
    }
  }

  @media ${MEDIA_DESKTOP} {
    width: 100%;
    height: 64px;
    background: #FFF;
    padding: 0 20px;
  }

  .close {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 20px;

    > img {
      width: 24px;
      height: 24px;
      line-height: 1;
    }
  }

  .indicator {
    display: flex;
    gap: 2px;
    padding: 0 20px;
    align-items: center;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }

    span {
      font-size: 16px;
      color: var(--Black-300, #808080);
    }

    span:first-child {
      color: #FFF;
      font-weight: 600;
    }

    > .toggle-mode {
      display: flex;
      width: 54px;
      height: 36px;
      padding: 9px 14px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      border-radius: 8px;
      background: var(--Purple-300, #6436E7);
      color: #FFF;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      margin-left: 12px;
    }
  }

`;

const ImageView = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;

  .swiper {
    height: 100%;
  }

  img.content {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media ${MEDIA_DESKTOP} {
    position: relative;
  }
`;
const ArrowButton = styled.div<{
  direction: 'left' | 'right'
}>`
  cursor: pointer;
  display: none;
  @media ${MEDIA_DESKTOP} {
    display: block;
  }
  width: 44px;
  height: 44px;
  position: absolute;
  border-radius: 22px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 26px;' : 'right: 26px;'}
  transform: translateY(-50%);

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
    ${props => props.direction === 'left' ? 'transform: rotate(180deg);' : ''}
  }

  z-index: 11;
`

const PreviewWrapper = styled.div`
  width: 100%;
  @media ${MEDIA_DESKTOP} {
    padding: 12px 0;
    background: #FFF;
  }

  .swiper {
    height: 100%;

    .swiper-slide {
      width: auto;
      height: auto;
    }
  }

  .thumbnail {
    position: relative;
    width: 122px;
    height: 90px;
    @media ${MEDIA_DESKTOP} {
      width: 86px;
      height: 86px;
      flex-shrink: 0;
    }

    .delete {
      cursor: pointer;
      position: absolute;
      top: 6px;
      right: 6px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;

      img {
        width: 30px;
        height: 30px;
      }
    }

    &[data-selected="true"] {
      &::after {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        content: ' ';
        box-shadow: 0 0 0 2px var(--Purple-300, #6436E7) inset;
        pointer-events: none;
        user-select: none;
        @media ${MEDIA_DESKTOP} {
          border-radius: 12px;
        }
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      @media ${MEDIA_DESKTOP} {
        border-radius: 12px;
      }
    }

  }
`;
const Indicator = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  display: none;
  border-radius: 12px 0px 0px 0px;
  background: rgba(0, 0, 0, 0.50);
  padding: 4px 16px;
  color: var(--Black-200, #B7B7B7);
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  z-index: 20;

  > .white {
    color: #FFF;
    font-weight: 600;
  }

  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
  @media ${MEDIA_DESKTOP} {
    display: flex;
  }
`
const ModeIndicator = styled.div`
  display: none;
  flex-direction: row;
  border-radius: 8px;
  background: var(--Black-100, #F0F0F0);
  overflow: hidden;

  > .item {
    cursor: pointer;
    transition: all 0.3s;
    padding: 7px 12px;
    border-radius: 8px;
    color: var(--Black-300, #808080);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.28px;
  }

  > .item.selected {
    color: #FFF;
    background: var(--Purple-300, #6436E7);
  }

  @media ${MEDIA_DESKTOP} {
    display: flex;

  }
`

interface ImageViewerProps {
  images: string[]
  reviewImages?: ReviewImageInterface[]
  defaultIndex?: number
  onClose: () => void
  canEdit?: boolean;
  onChangeOrder?: (images: string[]) => void
  onDeleteImage?: (index: number) => void
  onClickEdit?: () => void
}

function ImageViewer({
                       images,
                       defaultIndex,
                       onClose,
                       canEdit,
                       reviewImages,
                       onChangeOrder,
                       onDeleteImage,
                       onClickEdit,
                     }: ImageViewerProps) {
  const orientation = useScreenOrientation();
  const mainSwiperRef = useRef<SwiperRef>();
  const previewSwiperRef = useRef<SwiperRef>();
  const [mode, setMode] = useState<'normal' | 'edit'>('normal');
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex || 0);

  const handleSlide = useCallback((e: SwiperClass) => {
    setSelectedIndex(e.activeIndex);

    if (previewSwiperRef.current) {
      previewSwiperRef.current?.swiper.slideTo(e.activeIndex);
    }
  }, []);

  const handleClickPreview = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClickEdit = () => {
    onClickEdit && onClickEdit();
  }

  useEffect(() => {
    if (mainSwiperRef.current) {
      mainSwiperRef.current?.swiper.slideTo(selectedIndex);
    }
    if (previewSwiperRef.current) {
      previewSwiperRef.current?.swiper.slideTo(selectedIndex);
    }
  }, [selectedIndex])

  return <>
    <Wrapper>
      <Header>
        <div className="title">사진 상세보기</div>
        {
          canEdit && <ModeIndicator>
            <div className={`item ${mode === 'normal' ? 'selected' : ''}`} onClick={() => setMode('normal')}>일반 모드</div>
            <div className={`item ${mode === 'edit' ? 'selected' : ''}`} onClick={() => setMode('edit')}>편집 모드</div>
          </ModeIndicator>
        }
        <div className="close" onClick={onClose}>
          {
            orientation === 'landscape' ?
              <img src="/image-web/Icon/Close_gray.svg" alt="close"/> :
              <img src="/image-web/Icon/Back_white.svg" alt="close"/>
          }
        </div>
        <div className="indicator">
          <span>{selectedIndex + 1}</span>
          <span>/</span>
          <span>{images.length}</span>
          {
            (isMobile && canEdit) && (
              <div className="button toggle-mode" onClick={handleClickEdit}>편집</div>
            )
          }
        </div>
      </Header>
      <ImageView>
        <Swiper
          ref={mainSwiperRef}
          slidesPerView={'auto'}
          centeredSlides={true}
          spaceBetween={0}
          onSlideChange={handleSlide}
        >
          {
            images.map((url, index) => (
              <SwiperSlide key={index}>
                <img className="content" src={url}/>
              </SwiperSlide>
            ))
          }
        </Swiper>
        <ArrowButton direction="left" onClick={() => {
          setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
        }}>
          <img src='/image-web/Icon/Arrow-right.svg'/>
        </ArrowButton>
        <ArrowButton direction="right" onClick={() => {
          setSelectedIndex((selectedIndex + 1) % images.length)
        }}>
          <img src='/image-web/Icon/Arrow-right.svg'/>
        </ArrowButton>
        <Indicator>
          <span className="white">{selectedIndex + 1}</span>
          <span>/</span>
          <span>{images.length}</span>
        </Indicator>
      </ImageView>
      <PreviewWrapper>
        <Swiper
          ref={previewSwiperRef}
          slidesPerView={'auto'}
          centeredSlides={true}
          spaceBetween={orientation === 'landscape' ? 12 : 4}
        >
          {
            images.map((url, index) =>
              <SwiperSlide key={index}>
                <div className="thumbnail"
                     data-selected={index === selectedIndex}
                     onClick={() => handleClickPreview(index)}
                >
                  <img src={url}/>
                </div>
              </SwiperSlide>
            )
          }
        </Swiper>
      </PreviewWrapper>
      {/*
      <ImageViewDndItem
        images={reviewImages || []}
        selectedIndex={selectedIndex}
        onOrderChange={(newImages) => {
          console.log(newImages)
        }}
        handleClickPreview={handleClickPreview}
        mode={mode}/>*/}
    </Wrapper>
    <Dim/>
  </>
}

export default ImageViewer
