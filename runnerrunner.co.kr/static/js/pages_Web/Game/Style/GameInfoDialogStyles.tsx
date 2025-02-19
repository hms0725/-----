import styled from "styled-components";

export const GameInfoDialogWrapper = styled.div`
  position: fixed;
  top: 0px;
  z-index: 100;
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
      > .tab-wrapper {
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        > .tab {
          display: flex;
          width: 133px;
          height: 30px;
          justify-content: center;
          align-items: center;
          border-radius: 15px;
          border: 1px solid #c4c4c4;
          color: #c4c4c4;
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
        }

        > .tab.selected {
          color: #fff;
          background: var(--Purple-300, #6436e7);
          border: none;
        }
      }
    }
  }
`;
export const GameInfoPrizeWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;

  > .item {
    display: flex;
    flex-direction: row;
    > span {
      flex: 1;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

export const GameInfoPlayersWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;

  > .header {
    display: flex;
    flex-direction: row;
    > span {
      flex: 1;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .body {
    width: 100%;
    overflow-y: auto;
    height: 450px;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    > .item {
      display: flex;
      flex-direction: row;
      > span {
        flex: 1;
        color: #fff;
        text-align: center;
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
`;

export const GameInfoBlindWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;

  > .header {
    display: flex;
    flex-direction: row;
    > span {
      flex: 1;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  > .body {
    width: 100%;
    overflow-y: auto;
    height: 450px;
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
    > .item {
      display: flex;
      flex-direction: row;
      > span {
        flex: 1;
        color: #fff;
        text-align: center;
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
    > .extra-item {
      padding: 5px 0;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      width: 100%;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      background: rgba(31, 33, 39, 0.9);
    }
  }
`;
