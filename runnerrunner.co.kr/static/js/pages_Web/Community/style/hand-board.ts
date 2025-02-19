import styled from "styled-components";
import { CommunityCommonBannerWrapper, CommunityCommonSubTabWrapper } from ".";

export const HandBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; // 뷰포트 전체 높이 사용
  overflow: hidden; // 내부 스크롤을 위해 외부 오버플로우 숨김

  > .scrollable-content {
    flex: 1; // 남은 공간 모두 차지
    overflow-y: auto; // 세로 스크롤
    -webkit-overflow-scrolling: touch; // iOS 스크롤 부드럽게

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }

  // 탭과 배너는 고정
  ${CommunityCommonSubTabWrapper}, ${CommunityCommonBannerWrapper} {
    flex-shrink: 0; // 크기 고정
  }
`;

export const WriteButton = styled.div`
  z-index: 2;
  position: fixed;
  right: 16px;
  bottom: 50px;
  width: 50px;
  height: 50px;
  background-color: var(--Purple-300, #6436e7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    position: absolute;
    width: 70%;
    height: 70%;
  }
`;
