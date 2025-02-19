import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getNewsById, NewsResponse, shareNews } from "../../../api/news";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import styled from "styled-components";
import { openNewWindow, shareURL } from "../../../utils/common";

const NewsWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: white;

  @media ${MEDIA_DESKTOP} {
    position: static;
    height: auto;
    max-width: 1060px;
    margin: 0 auto;
    padding: 40px 0;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 15px 20px 56px;
  > .header {
    > .title {
      font-size: 17px;
      font-weight: 700;
      @media ${MEDIA_DESKTOP} {
        font-size: 32px;
      }
    }

    > .bottom {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .left {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        gap: 9px;
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }
      .right {
        margin-right: 16px;
        display: none;
        img {
          width: 20px;
          height: 20px;
        }
        @media ${MEDIA_DESKTOP} {
          display: flex;
        }
      }
    }
  }
  > .content {
    @media ${MEDIA_DESKTOP} {
      font-size: 20px;
    }
    & img {
      width: 100%;
    }
    > p {
      margin: 0;
      letter-spacing: 0.3px;
      line-height: 24px;
      > strong {
        > a {
          color: #379339;
          text-decoration: underline;
        }
      }
    }
  }

  > .button {
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #6436e7;
    padding: 16px;
    border-radius: 8px;
    color: #fff;

    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.32px;
  }
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  z-index: 11;
  flex-direction: row;

  @media ${MEDIA_DESKTOP} {
    display: none;
  }
  .left {
    display: flex;
    align-items: center;
    .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    .title {
      margin-left: 5px;
      color: #444;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 600;

      @media ${MEDIA_DESKTOP} {
        font-size: 24px;
        font-weight: 700;
      }
    }
  }
  .right {
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const NewsDetail = () => {
  const [data, setData] = useState<NewsResponse | null>(null);
  const params = useParams<{
    id: string;
  }>();
  const location = useLocation<{ fromNews?: boolean }>();
  const { Kakao } = window;

  const history = useHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const getNewsDetail = async () => {
    const news = await getNewsById(params.id);
    if (news.createdAt) {
      news.createdAt = formatDate(news.createdAt);
    }
    setData(news);
  };
  useEffect(() => {
    getNewsDetail();
  }, []);

  const handleBack = () => {
    // /news에서 왔을 경우에만 state와 함께 이동
    if (location.state?.fromNews) {
      history.push("/news", { fromNewsDetail: true });
    } else {
      history.goBack();
    }
  };

  const kakaoShare = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
    }
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: data?.title,
        description: "러너러너에서 최신 포커 뉴스를 확인해보세요!",
        imageUrl: data?.mainImageKey,
        link: {
          mobileWebUrl:
            process.env.REACT_APP_HOST_URL + `/news-detail/${data?.id}`,
          webUrl: process.env.REACT_APP_HOST_URL + `/news-detail/${data?.id}`,
        },
      },
      buttons: [
        {
          title: "플레이스토어 설치",
          link: {
            mobileWebUrl:
              "https://play.google.com/store/apps/details?id=com.runnersoft.runnerrunner",
            webUrl:
              "https://play.google.com/store/apps/details?id=com.runnersoft.runnerrunner",
          },
        },
        {
          title: "앱스토어 설치",
          link: {
            mobileWebUrl:
              "https://apps.apple.com/kr/app/%EB%9F%AC%EB%84%88%EB%9F%AC%EB%84%88/id6469495456",
            webUrl:
              "https://apps.apple.com/kr/app/%EB%9F%AC%EB%84%88%EB%9F%AC%EB%84%88/id6469495456",
          },
        },
      ],
    });
  };
  return (
    <NewsWrapper>
      <Header>
        <div className="left">
          <div
            className="close"
            onClick={() => {
              handleBack();
            }}
          >
            <img
              src="/image-web/Icon/Back.svg"
              id="홀덤뉴스 뒤로가기"
              alt="close"
            />
          </div>
          <div className="title">포커 뉴스</div>
        </div>
        <div className="right">
          <img
            alt="공유"
            src="/image-web/news/share.svg"
            onClick={() => {
              if (data && data.id) {
                shareNews(data.id);
              }
              shareURL(window.location.href);
            }}
          />
        </div>
      </Header>
      <Content>
        <div className="header">
          <span className="title">{data?.title}</span>
          <div className="bottom">
            <div className="left">
              <div className="createdAt">{data?.createdAt}</div>
              <div>·</div>
              <div>조회수 {data?.views}</div>
              <div>·</div>
              <div className="writer"> {data?.authorName}</div>
            </div>
            <div className="right">
              <img
                src="/image-web/store/Share.svg"
                onClick={() => {
                  if (data && data.id) {
                    shareNews(data.id);
                  }
                  shareURL(window.location.href);
                }}
              />
            </div>
          </div>
        </div>
        {data && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: data.contentHtml }}
          />
        )}
        {data?.link && (
          <div
            className="button"
            onClick={() => openNewWindow(data.link || "")}
          >
            뉴스 원문 보기
          </div>
        )}
      </Content>
    </NewsWrapper>
  );
};
export default NewsDetail;
