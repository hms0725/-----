import styled from "styled-components";

export const RecruitSortWrapper = styled.div`
  width: 100%;
  padding: 0px 16px;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  > .item {
    width: 115px;
    padding: 9px 8px 9px 12px;
    display: flex;
    flex-direction: row;
    gap: 2px;
    border-radius: 15px;
    justify-content: center;
    border: 1px solid var(--Black-200, #b7b7b7);
    align-items: center;
    position: relative;
    > span {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .sort-popup {
      position: absolute;
      z-index: 2;
      top: 42px;

      padding: 12px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      gap: 4px;

      > .item {
        border-radius: 15px;
        border: 1px solid var(--Black-100, #f0f0f0);
        padding: 8px 12px;
        color: var(--Black-500, #202020);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        text-align: center;
      }

      > .item.selected {
        color: #fff;
        background: var(--Purple-300, #6436e7);
        border: none;
      }
    }
  }
`;
