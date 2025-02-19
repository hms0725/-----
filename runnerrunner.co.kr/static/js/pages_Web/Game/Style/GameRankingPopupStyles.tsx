import styled from "styled-components";

export const GameRankingPopupWrapper = styled.div`
  position: fixed;
  top: 0px;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;

  > .content {
    position: fixed;
    width: 308px;
    height: 620px;

    border: 2px solid transparent;
    box-shadow: 0px 0px 8px 0px #dbc5ba;
    border-radius: 12px;
    background-image: url("/image-web/game/popup/ranking-popup.png"),
      linear-gradient(
        to right,
        #ba643a 25%,
        #ffffff 50%,
        #7addeb 75%,
        #836623 100%
      );
    background-position: center;
    background-origin: border-box;
    background-clip: content-box, border-box;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    > .wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 24px 16px 40px;

      > .header {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        > .title {
          color: #fff;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 800;
          line-height: 140%; /* 22.4px */
        }
        > img {
          width: 24px;
          height: 24px;
        }
      }

      > .tier-wrapper {
        padding-top: 20px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        width: 100%;
        > .item {
          width: 135px;
          height: 50px;
          border-radius: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 0 5px;
          > .tier-box {
            display: flex;
            flex-direction: row;
            align-items: center;
            > img {
              width: 25px;
              height: 25px;
            }

            > .tier {
              color: #fff;
              text-align: center;
              font-family: Pretendard;
              font-size: 10px;
              font-style: normal;
              font-weight: 800;
              line-height: 140%; /* 14px */
            }
          }

          > .point-wrapper {
            width: 42px;
            display: flex;
            flex-direction: column;
            gap: 1px;
            justify-content: center;
            align-items: center;

            > .point {
              color: #fff;
              font-family: Pretendard;
              font-size: 8px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
              letter-spacing: -0.18px;
            }

            > .rp {
              color: #c9c9c9;
              text-align: center;
              font-family: Pretendard;
              font-size: 8px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
              letter-spacing: -0.16px;
            }
          }
        }
        > .item.bronze {
          background: linear-gradient(
            90deg,
            #ffa071 1.27%,
            #a04e25 63.84%,
            #d69555 122.1%
          );
        }
        > .item.silver {
          background: linear-gradient(
              90deg,
              #c9d1d6 1.27%,
              #a9b0b5 63.84%,
              #767d82 122.1%
            ),
            linear-gradient(
              90deg,
              #ffa071 1.27%,
              #a04e25 63.84%,
              #d69555 122.1%
            );
        }
        > .item.gold {
          background: linear-gradient(
              90deg,
              #ffcd57 1.27%,
              #e0ad35 63.84%,
              #b68411 122.1%
            ),
            linear-gradient(
              90deg,
              #ffa071 1.27%,
              #a04e25 63.84%,
              #d69555 122.1%
            );
        }
        > .item.platinum {
          background: linear-gradient(
              90deg,
              #bef7ff 1.27%,
              #57cfe0 63.84%,
              #1ca8e1 122.1%
            ),
            linear-gradient(
              90deg,
              #c9d1d6 1.27%,
              #a9b0b5 63.84%,
              #767d82 122.1%
            ),
            linear-gradient(
              90deg,
              #ffa071 1.27%,
              #a04e25 63.84%,
              #d69555 122.1%
            );
        }
        > .item.diamond {
          background: linear-gradient(
              90deg,
              #f1e5fd 1.27%,
              #543482 63.84%,
              #bd97fa 122.1%
            ),
            linear-gradient(
              90deg,
              #ffa071 1.27%,
              #a04e25 63.84%,
              #d69555 122.1%
            );
        }
        > .item.master {
          background: linear-gradient(
              90deg,
              #aeff02 1.27%,
              #543482 63.84%,
              #f00 122.1%
            ),
            linear-gradient(
              90deg,
              #c9d1d6 1.27%,
              #a9b0b5 63.84%,
              #767d82 122.1%
            ),
            linear-gradient(
              90deg,
              #ffa071 1.27%,
              #a04e25 63.84%,
              #d69555 122.1%
            );
        }
      }

      > .ranking-point-wrapper {
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: 12px;
        padding-top: 20px;
        > .title {
          color: #fff;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 800;
          line-height: 140%; /* 22.4px */
        }

        > .tournament-wrapper {
          width: 100%;
          display: flex;
          flex-direction: row;
          gap: 6px;

          > .item {
            > .image {
              width: 135px;
              height: 100px;
              position: relative;
              > img {
                width: 100%;
                height: 100%;
              }

              > .tournament {
                position: absolute;
                left: 5px;
                bottom: 5px;
                display: flex;
                width: 75px;
                height: 16px;
                justify-content: center;
                align-items: center;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.3);
                color: #fff;
                text-align: center;
                font-family: Pretendard;
                font-size: 10px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
                letter-spacing: -0.165px;
              }
            }
            > .bottom {
              width: 100%;
              height: 198px;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              background: rgba(255, 255, 255, 0.1);
              display: flex;
              flex-direction: column;
              padding: 10px;
              gap: 3px;

              > .wrapper {
                height: 165px;
                display: flex;
                flex-direction: column;
                gap: 3px;
                width: 100%;

                > .item {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: space-between;
                  > .rank {
                    height: 25px;
                    display: flex;
                    align-items: center;
                    > div {
                      color: #8f8f8f;
                      text-align: center;
                      font-family: Pretendard;
                      font-size: 9px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: normal;
                      letter-spacing: -0.18px;
                    }
                    > img {
                      width: 25px;
                      height: 25px;
                    }
                  }

                  > .rp {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    color: #fff;
                    font-family: Pretendard;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    letter-spacing: -0.28px;

                    > span {
                      margin-left: 2px;
                      color: #8f8f8f;
                      text-align: center;
                      font-family: Pretendard;
                      font-size: 9px;
                      font-style: normal;
                      font-weight: 600;
                      line-height: normal;
                      letter-spacing: -0.18px;
                    }
                  }
                }
              }

              > .description {
                width: 100%;
                color: #fff;
                font-family: Pretendard;
                font-size: 8px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                display: flex;
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
  }
`;
