import styled from "styled-components";

export const BoardItemWrapper = styled.div<{ $hasThumbnail: boolean }>`
  display: flex;
  padding-bottom: 12px;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  .thumbnail {
    flex-shrink: 0;
    width: 79px;
    height: 79px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #f8f9fa;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    flex: 1;
    min-width: 0; // flexbox에서 텍스트 말줄임을 위해 필요
    display: flex;
    flex-direction: column;
    height: 79px;
    justify-content: space-between;
    .header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: ${(props) => (props.$hasThumbnail ? "8px" : "12px")};

      .type-badge {
        max-width: max-content;
        display: inline-block; /* 내용 크기에 맞게 동작 */
        flex-shrink: 0;
        padding: 2px 12px;
        border-radius: 15px;
        color: #fff;
        font-family: Pretendard;
        font-size: 9px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }

      .title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: var(--Black-400, #444);
        text-overflow: ellipsis;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.24px;
      }
    }

    .meta {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      > .info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
        .nickname {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.24px;
        }

        .time {
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.2px;
        }
      }

      .stats {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
        gap: 3px;
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 10px;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 14px */
        letter-spacing: -0.2px;
        span {
          display: flex;
          align-items: center;
          gap: 2px;

          svg {
            color: #999;
          }
        }
      }
    }
  }
`;
