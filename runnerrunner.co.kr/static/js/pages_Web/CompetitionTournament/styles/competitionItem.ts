import styled from "styled-components";

export const CompetitionItemWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
  > img {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }

  > .info-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    > .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
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

    > .info-row {
      display: flex;
      flex-direction: column;
      > .place {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 700;
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
  }
`;
