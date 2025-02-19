import styled from "styled-components";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IYoutube,
  IYoutubeChannel,
  getYoutubeChannelList,
  getYoutubeList,
} from "../../../api/youtube";
import YoutubeList from "./YoutubeList";
import RecommendYoutubeList from "./RecommendYoutubeList";
import YoutubeChannelList from "./YoutubeChannelList";
import CartoonList from "./CartoonList";

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden auto;
  padding-bottom: 69px;
  width: 100%;
  .divider {
    width: 100%;
    height: 3px;
    background: var(--Black-100, rgba(240, 240, 240, 1));

    position: relative;
    margin: 12px 0px;
    text-align: center;
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;

  padding: 0px 20px;
  background: white;
  z-index: 11;
  flex-direction: row;

  @media ${MEDIA_DESKTOP} {
    position: static;
    padding: 0;
  }

  .close {
    cursor: pointer;
    width: 24px;
    height: 24px;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  }

  .title {
    color: #444;
    margin-left: 5px;
    font-family: Pretendard;
    font-size: 16px;
    font-weight: 600;

    @media ${MEDIA_DESKTOP} {
      font-size: 24px;
      font-weight: 700;
    }
  }
`;

const Content = styled.div`
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  left: 16px;
  width: calc(100% - 32px);

  @media ${MEDIA_DESKTOP} {
    padding: 0 16px 56px;
  }
`;

const YoutubePage = () => {
  const history = useHistory();
  const [youtubeList, setYoutubeList] = useState<IYoutube[]>([]);
  const [cartoonList, setCartoonList] = useState<IYoutube[]>([]);
  const [recommendYoutubeList, setRecommendYoutubeList] = useState<IYoutube[]>(
    []
  );
  const [youtubeChannelList, setYoutubeChannelList] = useState<
    IYoutubeChannel[]
  >([]);

  const handleClose = () => {
    history.push("/");
  };

  const getList = async () => {
    const youtube = await getYoutubeList("YOUTUBE");
    const cartoon = await getYoutubeList("CARTOON");
    const recommended = youtube
      .concat(cartoon)
      .filter((item) => item.recommend)
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    const channels = await getYoutubeChannelList();
    setYoutubeChannelList(channels);
    setRecommendYoutubeList(recommended);
    setYoutubeList(youtube);
    setCartoonList(cartoon);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Wrapper>
      <Header>
        <div className="close" onClick={handleClose}>
          <img src="/image-web/Icon/Back.svg" alt="close" />
        </div>
        <div className="title">러튜브</div>
      </Header>
      <RecommendYoutubeList list={recommendYoutubeList} />
      <YoutubeChannelList list={youtubeChannelList} />
      <div className="divider"></div>
      <Content>
        <YoutubeList list={youtubeList} />
        <CartoonList list={cartoonList} />
      </Content>
    </Wrapper>
  );
};

export default YoutubePage;
