import styled from "styled-components";
import { InfoBoxWrapper } from "../../../components/common/InfoBoxWrapper";
import { useState } from "react";
import { ReviewDataResponse } from "../../../api/types";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import moment from "moment";
import ImageViewer from "../../../components/ImageViewer";
import StarDisplay from "../../../components/StarDisplay";
import { userState } from "../../../recoil/auth";
import { useRecoilValue } from "recoil";

const HoldemItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 16px;
  gap: 10px;
  cursor: pointer;
  @media ${MEDIA_DESKTOP} {
    border-radius: 12px;
    border: 1px solid var(--Black-100, #f0f0f0);
    background: #fff;
  }

  > .info-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    width: 100%;

    > .thumbnail {
      width: 40px;
      height: 40px;
      background: gray;
      border-radius: 4px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    > .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;
      flex-grow: 1;
      > .title-top {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        > .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.32px;
          gap: 4px;

          > img {
            width: 16px;
            height: 16px;
            object-fit: contain;
          }
        }
        > .edit {
          font-size: 12px;
          color: gray;
        }
      }

      > .title-bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        > .createdAt {
          margin-left: 7px;
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }
    }
  }

  > .content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;

    > .content {
      width: 100%;
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 19.6px */
      letter-spacing: -0.28px;
      display: -webkit-box;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      white-space: pre-wrap;
    }

    > .images {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      background: #e5e5e5;
    }
  }

  > .bottom {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;

    > .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 19.6px */
      letter-spacing: -0.28px;

      > img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }
    }
  }
`;

const ReviewBox = styled(InfoBoxWrapper)`
  align-items: center;
  justify-content: center;
  padding-bottom: 80px;

  > .title-row {
    > .title-box {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      > .count {
        color: var(--Black-200, #b7b7b7);
        font-family: Pretendard;
        font-size: 15px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        margin-left: 6px;
        margin-bottom: 2px;
      }
    }
  }

  > .list {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
  }

  > .show-more {
    margin-top: 20px;
    padding: 10px 20px;
    border: 1px solid var(--Purple-300, #6436e7);
    background: var(--Purple-100, #f0eaff);
    color: var(--Purple-300, #6436e7);
    border-radius: 8px;
    cursor: pointer;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 500;
  }
`;

const ImageGrid = styled.div<{
  length: number;
}>`
  width: 100%;
  > .grid-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    > img {
      object-fit: cover;
      aspect-ratio: 1;
      border-radius: 8px;
      background: #e5e5e5;
      width: 100%;
    }
    > .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      fontsize: 14px;
    }
  }

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  ${(p) =>
    p.length >= 4
      ? `
    > img:nth-child(1) {
      grid-column: 1 / -1;
      aspect-ratio: 2 / 1;
    }
  `
      : ``}
`;
interface ReviewProps {
  closeWrite: any;
  openWrite: any;
  setEditReview: any;
  setEditReviewData: any;
  reviewData: ReviewDataResponse[];
  pubId: number;
  todayReviewPhotoAdd: boolean;
  boxRef: any;
}
const Review = ({
  boxRef,
  closeWrite,
  openWrite,
  reviewData,
  todayReviewPhotoAdd,
  setEditReview,
  setEditReviewData,
}: ReviewProps) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const [imageList, setImageList] = useState<string[]>([]);
  const user = useRecoilValue(userState);
  const showMoreItems = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <ReviewBox ref={boxRef}>
      {selectedImageIndex !== -1 && (
        <ImageViewer
          images={imageList || []}
          defaultIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
      <div className="title-row">
        <div className="title-box">
          <div className="count">({reviewData.length})</div>
        </div>
        {user &&
          !reviewData.some((review) => review.userName === user.nickname) && (
            <span
              className="button"
              onClick={() => {
                openWrite();
              }}
            >
              리뷰 작성
            </span>
          )}
      </div>
      <div className="list">
        {reviewData.slice(0, visibleCount).map((item, idx) => {
          return (
            <HoldemItem key={idx}>
              <div className="info-wrapper">
                <div className="thumbnail">
                  {item.userProfile ? (
                    <img src={item.userProfile} />
                  ) : (
                    <img src="https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png" />
                  )}
                </div>
                <div className="info">
                  <div className="title-top">
                    <div className="title">{item.userName}</div>
                    {item.userName === user?.nickname && (
                      <div
                        className="edit"
                        onClick={() => {
                          setEditReview(true);
                          setEditReviewData(item);
                        }}
                      >
                        편집
                      </div>
                    )}
                  </div>

                  <div className="title-bottom">
                    <StarDisplay rating={item.score} />
                    <div className="createdAt">
                      {moment(item.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-wrapper">
                <div className="content">{item.message}</div>
                <ImageGrid length={item.imageList.length}>
                  {item.imageList.slice(0, 4).map((url, i) => (
                    <div className="grid-box" key={url} style={{}}>
                      <img
                        className="images"
                        src={url}
                        onClick={() => {
                          setSelectedImageIndex(i);
                          setImageList(item.imageList);
                        }}
                      />
                      {i === 3 && (
                        <div
                          onClick={() => {
                            setSelectedImageIndex(3);
                            setImageList(item.imageList);
                          }}
                          className="overlay"
                        >
                          더보기 ..
                        </div>
                      )}
                    </div>
                  ))}
                </ImageGrid>
              </div>
            </HoldemItem>
          );
        })}
      </div>
      {visibleCount < reviewData.length && (
        <div className="show-more" onClick={showMoreItems}>
          더보기
        </div>
      )}
    </ReviewBox>
  );
};

export default Review;
