import styled from "styled-components";

export const CompetitionTournamentDetailWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  > .header {
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    padding: 12px 20px 14px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
`;
export const CompetitionTournamentPosterWrapper = styled.div`
  padding-top: 50px;

  width: 100%;
  position: relative;
  .swiper-container {
    width: 100%;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    img {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }
  }
  .progress-dots {
    z-index: 9;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 9px;
  }

  .dot {
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 10.5px;
    transition: all 0.4s ease;
  }

  .dot.active {
    border-radius: 10.5px;
    width: 31px;
    background: var(--Purple-300, #6436e7);
    transition: all 0.4s ease;
  }
`;

export const CompetitionEventListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px;
  gap: 20px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 12px;

    > .date {
      color: var(--kakao-logo, #000);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }
  }

  > .base-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;

    > .status {
      max-width: 60px;
      display: flex;
      padding: 4px 6px;
      height: 19px;
      justify-content: center;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
      border-radius: 16.667px;
      border: 1px solid var(--Purple-100, #f0eaff);
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }

    > .location {
      color: #808080;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.26px;
    }

    > .date {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }
`;

export const CompetitionEventItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  > .item {
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
    > .info-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      > .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;

        > .item {
          display: flex;
          flex-direction: row;
          gap: 5px;
          > .value {
            font-weight: 600;
          }
        }
      }
    }
    > .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.32px;
      }

      > .doing {
        display: flex;
        padding: 4px 6px;
        height: 19px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        flex-shrink: 0;
        border-radius: 16.667px;
        border: 1px solid var(--Purple-100, #f0eaff);
        color: var(--Purple-300, #6436e7);
        font-family: Pretendard;
        font-size: 11px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        > img {
          stroke-width: 1.2px;
          stroke: var(--Purple-300, #6436e7);
        }
      }
    }
  }
`;
