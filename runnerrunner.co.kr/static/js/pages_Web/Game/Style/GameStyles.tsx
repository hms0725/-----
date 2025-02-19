import styled from "styled-components";
export * from "./GameLobbyStyles";
export * from "./GamePopupStyles";
export * from "./GameRankingStyles";
export * from "./GameNavigatorStyles";

export const GameWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;

  background-image: url(/image-web/game/game_back.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  > .dim {
    background-color: rgba(0, 0, 0, 0.8);
    position: fixed;
    width: 100vw;
    height: 100vh;
    animation: twinkle 5s infinite;
    animation-direction: alternate;
  }
`;

export const GameLayoutWrapper = styled.div``;

export const GameHeaderWrapper = styled.div`
  top: 2px;
  width: 100%;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  height: 50px;
  color: white;
  align-items: center;
  .tier-nick {
    color: #fff;
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    background-color: rgba(67, 67, 67, 0.6);
    border-radius: 45px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 17px 0px 12px;
    gap: 5px;
    img {
      height: 30px;
      width: 30px;
    }
  }
  .game-point {
    width: 151px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0px 12px 0px 17px;
    color: #fff;

    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    span {
      position: relative;
      float: right;
    }
    img {
      width: 22px;
      height: 22px;
      position: relative;
      margin-right: 5px;
      float: right;
    }
  }
`;

export const GameBannerWrapper = styled.div`
  margin-top: 17px;
  width: 100%;
  position: relative;
  padding: 0px 16px;

  > img {
    width: 100%;
  }

  > .title {
    position: absolute;
    left: 31px;
    bottom: 47px;
    color: #fff;

    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  > .description {
    position: absolute;
    left: 31px;
    bottom: 30px;
    color: #fff;

    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
  }

  > .progress-dots {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    gap: 10px;
    > .dot {
      border-radius: 10.5px;
      opacity: 0.9;
      background: #fff;
      width: 10px;
      height: 10px;
      transition: all 0.4s ease;
    }

    > .dot.active {
      width: 31px;
      height: 10px;
      border-radius: 10.5px;
      background: #ffd200;
      transition: all 0.4s ease;
    }
  }
`;

export const GameMainWrapper = styled.div`
  width: 100%;
  padding: 46px 0px;
  height: 100vh;
  overflow-y: auto;
  @media (max-height: 750px) {
    padding-bottom: 150px;
  }
`;

export const GameMyPageWrapper = styled.div`
  height: 100vh;
  overflow-y: auto;
  width: 100%;
  padding: 67px 16px 120px;
  > .wrapper {
    position: relative;
    width: 100%;
    border-radius: 8px;
    background-color: rgba(31, 33, 39, 0.6);
    padding: 24px 16px;
    > .profile-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 20px;
      align-items: center;
      > .profile-row {
        width: 84px;
        height: 84px;
        position: relative;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        > .edit {
          position: absolute;
          width: 24px;
          height: 24px;
          background-image: url(/image-web/Icon/Edit-Profile-Img.svg);
          bottom: 0;
          right: 0;
        }
      }

      > .info-row {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: flex-start;
        > .name {
          color: #fff;
          font-family: Pretendard;
          font-size: 20px;
          font-style: normal;
          font-weight: 800;
          line-height: normal;
          letter-spacing: -0.4px;
        }

        > .tier {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          padding: 4px 8px;
          border-radius: 8px;
          color: #fff;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.24px;
        }

        > .tier.BRONZE {
          background: linear-gradient(
              90deg,
              #ffa071 1.27%,
              #a04e25 63.84%,
              #d69555 122.1%
            ),
            #fff;
        }
        > .tier.SILVER {
          background: linear-gradient(
            90deg,
            #c9d1d6 1.27%,
            #a9b0b5 63.84%,
            #767d82 122.1%
          );
        }
        > .tier.GOLD {
          background: linear-gradient(
            90deg,
            #ffcd57 1.27%,
            #e0ad35 63.84%,
            #b68411 122.1%
          );
        }
        > .tier.PLATINUM {
          background: linear-gradient(
            90deg,
            #bef7ff 1.27%,
            #57cfe0 63.84%,
            #1ca8e1 122.1%
          );
        }
        > .tier.DIAMOND {
          background: linear-gradient(
            90deg,
            #f1e5fd 1.27%,
            #543482 63.84%,
            #bd97fa 122.1%
          );
        }
        > .tier.MASTER {
          background: linear-gradient(
            90deg,
            #aeff02 1.27%,
            #543482 63.84%,
            #f00 122.1%
          );
        }
      }
    }
  }
`;

export const GameButtonSlideWrapper = styled.div`
  padding-top: 20px;
  position: relative;
  width: 100%;

  > .title {
    width: 100%;
    color: #fff;
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    letter-spacing: -0.4px;
    margin-bottom: 12px;
  }
  padding-left: 16px;
  .swiper {
    padding-right: 16px;
    gap: 10px;
  }
  .swiper-slide {
    width: 264px;
  }
`;

export const GameButtonSlideItem = styled.div`
  width: 264px;
  height: 166px;
  position: relative;
  > img {
    width: 100%;
    height: 100%;
  }

  > .title {
    width: 80%;
    position: absolute;
    top: 16px;
    left: 16px;
    color: #fff;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.32px;
  }

  > .entry {
    position: absolute;
    bottom: 16px;
    left: 16px;
    color: #fff;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    > .title {
      color: #fff;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .button {
    position: absolute;
    bottom: 16px;
    right: 16px;
    border-radius: 8px;
    background: var(--Purple-300, #6436e7);
    width: 121px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.165px;
  }
`;

export const GameCategoryWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  padding: 20px 16px 0;
  gap: 10px;
  > .item {
    width: 100px;
    height: 120px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;

    > .icon {
      > .background {
        width: 72px;
        height: 72px;
        border-radius: 12px;
        border: 0.5px solid rgba(255, 219, 85, 0.5);
        background: #1e1e1e;
        box-shadow: 0px 0px 4px 0px #ffdb55;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    > .title {
      display: flex;
      align-items: center;
      margin-top: 5px;
      color: #ffdb55;
      height: 32px;
      text-align: center;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }
`;
