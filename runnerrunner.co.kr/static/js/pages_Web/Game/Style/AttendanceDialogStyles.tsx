import styled from "styled-components";

export const AttendanceDialogWrapper = styled.div`
  position: fixed;
  top: 0px;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;

  > .content {
    position: fixed;
    width: 308px;
    height: 491px;

    border: 2px solid transparent;
    box-shadow: 0px 0px 8px 0px #dbc5ba;
    border-radius: 12px;
    background-image: url("/image-web/game/popup/attendance/attendance-background.png"),
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
      padding: 22px 17px 20px;

      > .description {
        width: 100%;
        text-align: center;
        color: #fff;
        text-align: center;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%; /* 18.2px */
        margin-bottom: 20px;
        > span {
          font-weight: 700;
        }
      }
    }
  }
`;
export const AttendanceDialogHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  > .title {
    margin-top: 3px;
    color: #fff;
    text-align: center;
    font-family: Pretendard;
    font-size: 30px;
    font-style: normal;
    font-weight: 800;
    line-height: 140%; /* 42px */
  }
  > img {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
  }
`;
export const AttendanceRewardListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  justify-items: center;
  align-items: center;
  width: 100%;

  & > :nth-last-child(1):nth-child(3n + 1) {
    grid-column: 2 / span 1;
  }
`;

export const AttendanceRewardItem = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  text-align: center;
  font-family: Pretendard;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 18.2px */
  position: relative;

  > img {
    width: 100px;
    height: 100px;
  }

  > .label.check {
    color: #fff;
    background: none;
  }

  > .label {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 83px;
    height: 20px;

    margin-top: 7.5px;
    color: #fff;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
  }
`;
