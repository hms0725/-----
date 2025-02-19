import React from "react";
import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { NewsResponse } from "../../../api/news";
import { useHistory } from "react-router-dom";

const YoutubeWrapper = styled.div`
  width: 100%;
  margin-top: 32px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
`;

const Title = styled.div`
  color: #000;

  font-family: Pretendard;
  font-size: 17.181px;
  font-style: normal;
  font-weight: 600;
  line-height: 25.771px; /* 150% */
  @media ${MEDIA_DESKTOP} {
    font-size: 24px;
  }
`;

const ChannelList = styled.div`
  padding: 8px 4px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;

  @media ${MEDIA_DESKTOP} {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const CardItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  height: 92px;
  cursor: pointer;
`;

const ThumbnailWrapper = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 8px;
`;

const Thumbnail = styled.img`
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 4px;
`;

const TextWrapper = styled.div`
  width: 100%;
  height: 92px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  > .view-wrapper {
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    > .views {
      text-align: center;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 19.6px */
      letter-spacing: -0.28px;
    }
    > img {
      width: 16px;
      height: 16px;
    }
  }
`;

const Text = styled.div`
  color: var(--Black-400, #444);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.32px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: 100%;

  @media ${MEDIA_DESKTOP} {
    font-size: 14px;
    letter-spacing: -0.28px;
  }
`;

const NormalNews = ({ list }: { list: NewsResponse[] }) => {
  const history = useHistory();
  if (list.length === 0) {
    return null;
  }

  return (
    <YoutubeWrapper>
      <Title>NEWS</Title>
      <ChannelList>
        {list.map((item) => (
          <CardItemWrapper
            key={item.id}
            onClick={() =>
              history.push(`/news-detail/${item.id}`, { fromNews: true })
            }
          >
            <ThumbnailWrapper>
              <Thumbnail src={item.mainImageKey} />
            </ThumbnailWrapper>
            <TextWrapper>
              <Text>{item.title}</Text>
              <div className="view-wrapper">
                <img src="/image-web/Holdem Now/Icon/view/small.svg" />
                <span className="views">{item.views}</span>
              </div>
            </TextWrapper>
          </CardItemWrapper>
        ))}
      </ChannelList>
    </YoutubeWrapper>
  );
};

export default NormalNews;
