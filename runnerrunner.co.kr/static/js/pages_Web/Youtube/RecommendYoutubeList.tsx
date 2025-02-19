import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { openNewWindow } from "../../../utils/common";
import { IYoutube } from "../../../api/youtube";

const YoutubeWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  background: white;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;

  @media ${MEDIA_DESKTOP} {
    gap: 20px;
  }
  > .title-row {
    width: 100%;
    display: flex;
    margin-left: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      color: black;
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      letter-spacing: -0.4px;
    }

    > .more {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      cursor: pointer;

      > img {
        width: 16px;
        height: 16px;
      }

      > span {
        color: var(--Black-200, #b7b7b7);
        text-align: right;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.26px;
      }
    }
  }

  .swiper {
    width: calc(100% - 16px); // 전체 너비에서 왼쪽 패딩 16px를 뺌
    margin-left: 16px; // left 대신 margin-left 사용
    padding-right: 16px; // 오른쪽 여백 16px 추가
    overflow: visible;
  }

  .swiper-slide {
  }
`;
const CardItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  border-radius: 8px;

  > .top {
    width: 100%;
    position: relative;
    
    > .thumbnail {
      width: 100%;
      height: 160px;
      border-radius: 8px;
      position: relative;
      background: gray;
      overflow: hidden;

      > iframe {
        width: 100%;
        height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      > .overlay {
        width: 100%;
        height: 101%;
        top: 0;
        left: 0;
        position: absolute;
        z-index: 2;
        background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 0) 71.43%,
          #000 96.36%
        );
      }
    }

    > .channel-row {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      position: absolute;
      height: 30px;
      top: 8px;
      left: 8px;
      padding: 9px 12px 9px 12px;
      border-radius: 15px;
      background: #00000080;

      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
      .name {
        color: #fff;
        font-family: Pretendard;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }

  > .title-row {
    width: 100%;
    display: flex;
    margin: 10px 0px 16px;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 4px;

    > .title {
      width: calc(100% - 32px);
      height: 32px;
      font-family: Pretendard;
      font-size: 13px;
      font-weight: 400;
      line-height: 15.51px;
      letter-spacing: -0.02em;
      text-align: left;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .count {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.28px;
    }
  }

    > .info {
      margin-top: 6px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.28px;
    }
    > .info-bottom {
      width: 100%;
      position: absolute;
      bottom: 0;
      margin-top: 6px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.28px;
      > .prize {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;
const RecommendYoutubeList = ({ list }: { list: IYoutube[] }) => {
  if (list.length === 0) {
    return null;
  }

  return (
    <YoutubeWrapper>
      <div className="title-row">
        <div className="title">HOT</div>
      </div>
      <Swiper
        slidesPerView={1.15}
        centeredSlides={false}
        className="mySwiper"
        spaceBetween={10}
      >
        {list.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <CardItemWrapper onClick={() => openNewWindow(item.url)}>
                <div className="top">
                  <div className="thumbnail">
                    <img alt="썸네일" src={item.thumbnailUrl} />
                  </div>

                  <div className="channel-row">
                    <img alt="채널" src={item.youtubeChannel.profileUrl}></img>
                    <div className="name">{item.youtubeChannel.name}</div>
                  </div>
                </div>
                <div className="title-row">
                  <div className="title">{item.title}</div>
                </div>
              </CardItemWrapper>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </YoutubeWrapper>
  );
};

export default RecommendYoutubeList;
