import styled from "styled-components";

export const CompetitionTournamentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;

  > .banner-swiper {
    position: relative;
    > .page-wrapper {
      z-index: 2;
      position: absolute;
      bottom: 12px;
      right: 16px;
      padding: 3px 8px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.2);
      color: var(--Black-200, #b7b7b7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.24px;
      > span {
        color: #fff;
      }
    }
  }
`;

export const CompetitionTournamentMainBanner = styled.img`
  width: 100%;
  aspect-ratio: 144 / 30;
  object-fit: cover;
`;

export const CompetitionTournamentHeader = styled.div`
  padding: 20px 16px 12px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  > .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      color: var(--kakao-logo, #000);
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 25.771px; /* 128.857% */
    }

    > .date-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
    }
  }
`;

export const CompetitionTournamentSelector = styled.div`
  padding: 9px 8px 9px 12px;
  border-radius: 15px;
  border: 1px solid var(--Black-200, #b7b7b7);
  gap: 2px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  > .value {
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  > img {
    width: 14px;
    height: 14px;
  }
`;

export const CompetitionTournamentTypeWrapper = styled.div`
  width: 100%;
  padding: 5px 5.5px;
  display: flex;
  flex-direction: row;
  gap: 5px;
  border-radius: 18px;
  background: #f0f0f0;

  > .item {
    padding: 8px 0px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--Black-200, #b7b7b7);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  > .item.active {
    border-radius: 15px;
    border: 1px solid #6436e7;
    background: #6436e7;
    color: #fff;
  }
`;

export const CompetitionTournamentDropDownBox = styled.div`
  z-index: 2;
  position: absolute;
  top: 40px;
  left: -10px;
  max-height: 350px;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
  > .item {
    text-align: center;
    width: 68px;
    padding: 8px 0px;
    border-radius: 15px;
    border: 1px solid var(--Black-100, #f0f0f0);
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  > .item.active {
    color: white;
    border: none;
    background: var(--Purple-300, #6436e7);
  }
`;

export const CompetitionHorizontalBar = styled.div`
  width: 100%;
  padding-top: 3px;
  color: var(--Black-100, #f0f0f0);
  background: var(--Black-100, #f0f0f0);
  display: block;
`;

export const CompetitionBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px 16px;
  gap: 12px;

  > .header {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    > .description {
      color: #828282;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 25.771px; /* 214.762% */

      > span {
        font-weight: 700;
      }
    }
  }

  > .list-wrapper {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;
