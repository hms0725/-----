import React, { useState } from "react";
import styled from "styled-components";
import { openNewWindow } from "../../../utils/common";
import { IYoutubeChannel } from "../../../api/youtube";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { Swiper, SwiperSlide } from "swiper/react";
const YoutubeWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  background: white;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
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
    }
  }

  .channel-list {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* Four items per row */
    gap: 16px;
    width: 100%;
  }
`;

const CardItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;

  > .thumbnail {
    width: 100%;
    max-width: 50px;
    height: 50px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  > .info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > .title-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      > .title {
        white-space: nowrap; //5글자 이상이면 2줄
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
      }
    }
  }
`;

const YoutubeChannelList = ({ list }: { list: IYoutubeChannel[] }) => {
  return (
    <YoutubeWrapper>
      <Swiper className="channel-list" slidesPerView={5.5}>
        {list.map((item, index) => (
          <SwiperSlide>
            <CardItemWrapper
              key={index}
              onClick={() => openNewWindow(item.url)}
            >
              <div className="thumbnail">
                <img src={item.profileUrl} alt={item.name} />
              </div>
              <div className="info">
                <div className="title-row">
                  <div className="title">{item.name}</div>
                </div>
              </div>
            </CardItemWrapper>
          </SwiperSlide>
        ))}
      </Swiper>
    </YoutubeWrapper>
  );
};

export default YoutubeChannelList;
