import styled from "styled-components";

export const InfoBoxWrapper = styled.div`
  width: 100%;
  padding: 20px 16px 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  > .title-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .button {
      cursor: pointer;
      color: var(--Black-200, #B7B7B7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }

  > .bottom-bar {
    margin-top: 40px;
    width: 100%;
    padding: 0 16px;
    border-bottom: 1px solid var(--Black-200, #B7B7B7);
  }
`
