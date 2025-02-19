import styled from "styled-components";

export const CommunityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

export const CommunityHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  gap: 8px;

  > img {
    margin-left: 20px;
  }

  > span {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export const CommunityTabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 70px 16px 20px;
`;
export const CommunityTabItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;

  > img {
    width: 55px;
    height: 55px;
  }

  > span {
    color: ${({ isSelected }) => (isSelected ? "#121212" : "#a4a4a4")};
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

export const CommunityCommonBannerWrapper = styled.div`
  width: 100%;
  padding: 12px 16px 20px;

  > .banner {
    width: 100%;
    border-radius: 12px;
    background: #6436e7;
    padding: 5px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    > span {
      color: #fff;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
`;

export const CommunityCommonListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 16px 20px;
  width: 100%;
  gap: 12px;
`;

export const CommunityCommonSubTabWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #f0f0f0;

  > .item {
    padding: 12px 0px;
    flex: 1;
    text-align: center;
    color: #a4a4a4;
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    border-bottom: 1px solid #f0f0f0;
  }

  > .item.select {
    color: var(--Black-400, #444);
    border-bottom: 1px solid #121212;
  }
`;
