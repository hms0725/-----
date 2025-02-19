import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import moment from "moment";
import { ArticleResponse } from "../../../../api/dashboard";
import { userState } from "../../../../recoil/auth";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  > .header {
    margin-top: 16px;
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    > .title {
      color: #000;
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      letter-spacing: -0.4px;
    }
  }

  > .list {
    width: 100%;
    padding: 12px 16px;

    .swiper-slide {
      width: 200px !important;
    }
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  width: 200px;
  color: white;
  padding: 16px;
  border-radius: 8px;

  .top {
    .title {
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 700;
      line-height: 19.09px;
      letter-spacing: -0.02em;
      text-align: left;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      max-height: 38.18px;
    }
  }

  .bottom {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    > .profile {
      position: relative;
      border-radius: 30px;
      width: 30px;
      height: 30px;
    }

    > .info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      > .name {
        color: white;
        font-family: Pretendard;
        font-size: 12px;
        font-weight: 700;
        line-height: 14.32px;
        letter-spacing: -0.02em;
        text-align: left;
        text-overflow: ellipsis;
      }

      > .time {
        color: var(--Black-300, #ffffff);
        font-family: Pretendard;
        font-size: 10px;
        font-weight: 400;
        line-height: 11.93px;
        letter-spacing: -0.02em;
        text-align: left;
      }
    }
    > .arrow {
      position: relative;
      width: 20px;
      height: 20px;
    }
  }
`;

const HotDealer = styled(Item)`
  background: #5f46a7;
`;

const HotSeller = styled(Item)`
  background: #8e0808;
`;

const DEFAULT_PROFILE_IMAGE =
  "https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png";
const ARROW_IMAGE = "/image-web/button/arrow/black_right_circle.svg";

interface BestProps {
  hotArticles: ArticleResponse[];
  boardType: string;
}

const Best = ({ hotArticles = [], boardType = "ROLE_DEALER" }: BestProps) => {
  const history = useHistory();
  const [user] = useRecoilState(userState);

  const HotItem = boardType === "ROLE_DEALER" ? HotDealer : HotSeller;

  return (
    <Wrapper>
      <div className="header">
        <div className="title">{user?.nickname}님을 위한</div>
        <div className="title">가장 뜨거운 베스트 게시물 ‍🔥</div>
      </div>
      <Swiper
        slidesPerView="auto"
        spaceBetween={8}
        className="list"
        loop={hotArticles.length > 1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        {hotArticles.map((hotArticle) => (
          <SwiperSlide key={hotArticle.id}>
            <HotItem
              onClick={() => {
                history.push(
                  `/article/detail/${
                    boardType === "ROLE_DEALER" ? "dealer" : "seller"
                  }/${hotArticle.id}`
                );
              }}
            >
              <div className="top">
                <div className="title">{hotArticle.title}</div>
              </div>
              <div className="bottom">
                <img
                  className="profile"
                  alt="프로필 이미지"
                  src={hotArticle.userProfile || DEFAULT_PROFILE_IMAGE}
                />
                <div className="info">
                  <div className="name">{hotArticle.authorNickname}</div>
                  <div className="time">
                    {moment(hotArticle.createdAt).fromNow()}
                  </div>
                </div>
                <img className="arrow" alt="바로가기" src={ARROW_IMAGE} />
              </div>
            </HotItem>
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  );
};

export default Best;
