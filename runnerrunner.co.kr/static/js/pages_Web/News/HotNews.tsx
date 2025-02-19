import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHistory } from "react-router-dom";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { NewsResponse } from "../../../api/news";

const NewsWrapper = styled.div`
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
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 18px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      letter-spacing: -0.4px;
      @media ${MEDIA_DESKTOP} {
        font-size: 24px;
      }
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
    width: 100%;
    padding-left: 20px;
    overflow: visible;
  }

  .swiper-slide {
    width: 294px;
  }
`;
const CardItemWrapper = styled.div`
  display: flex;
  width: 295px;
  height: 327px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 12px;
  position: relative;

  > .thumbnail {
    width: 100%;
    height: 327px;
    border-radius: 8px;
    position: relative;
    &:after {
      display: block;
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 8px;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 53.52%,
        #000000 119.72%
      );
    }
  }

  > .info {
    z-index: 1;
    width: 100%;
    padding: 0 16px;
    bottom: 16px;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    > .title-row {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 5px;

      > .title {
        color: #fff;

        font-family: Pretendard;
        font-size: 17.181px;
        font-style: normal;
        font-weight: 600;
        line-height: 25.771px; /* 150% */
        letter-spacing: -0.28px;
        -webkit-line-clamp: 2;
      }
      .today {
        color: #fff;

        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }
    }
  }
`;
const HotNews = ({ list }: { list: NewsResponse[] }) => {
  const history = useHistory();

  if (list.length === 0) {
    return null;
  }

  return (
    <NewsWrapper>
      <Swiper
        slidesPerView={"auto"}
        centeredSlides={false}
        spaceBetween={10}
        className="mySwiper"
      >
        {list.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <CardItemWrapper
                onClick={() =>
                  history.push(`/news-detail/${item.id}`, { fromNews: true })
                }
              >
                <div
                  className="thumbnail"
                  style={{
                    backgroundImage: `url('${item.mainImageKey}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="info">
                  <div className="title-row">
                    <div className="today">오늘의 뉴스</div>
                    <div className="title">{item.title}</div>
                  </div>
                </div>
              </CardItemWrapper>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </NewsWrapper>
  );
};

export default HotNews;
