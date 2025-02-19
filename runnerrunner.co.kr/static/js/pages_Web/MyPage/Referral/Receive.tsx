import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  FriendRecommendItem,
  getFriendRecommendList,
} from "../../../../api/referral";
import useUserInfo from "../../../../hooks/useUserInfo";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import { MEDIA_DESKTOP } from "../../../../hooks/useScreenOrientation";

const ReceiveWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  line-height: 19.09px;
  letter-spacing: -0.02em;
  text-align: left;
  color: var(--Black-400, rgba(68, 68, 68, 1));
`;

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  > .inner {
    flex-grow: 1;
    margin-top: 10px;
    width: 100%;
    max-height: calc(100% - 1px);
    overflow-y: scroll;

    > .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 7px;
    }
  }

  > .pagination-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding-top: 25px;
    padding-bottom: 10px;
    @media ${MEDIA_DESKTOP} {
      width: 100%;
      border-top: 1px solid #b7b7b7;
    }

    > .button {
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid var(--Purple-100, #f0eaff);
      background: #fff;
      color: var(--Black-400, #444);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 142.857% */

      > svg {
        width: 20px;
        height: 20px;
      }
    }

    > .button.selected {
      border: 1px solid var(--Purple-300, #6436e7);
      color: var(--Purple-300, #6436e7);
      text-align: center;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px; /* 142.857% */
    }

    > .button.disabled {
      opacity: 0.2;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`;

const HistoryItemWrapper = styled.div`
  padding: 4px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media ${MEDIA_DESKTOP} {
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    &:last-child {
      border-bottom: none;
    }
  }
  > .item {
    color: var(--Black-400, rgba(68, 68, 68, 1));

    &.nickname {
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 400;
      line-height: 19.09px;
      text-align: left;
    }
    &.reward {
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 600;
      line-height: 19.09px;
      text-align: center;
    }
  }
`;
const LeftArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M12.5 15L7.5 10L12.5 5"
        stroke="#444444"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
const RightArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M7.5 15L12.5 10L7.5 5"
        stroke="#444444"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HISTORY_ITEM_PER_PAGE = 10;
const History = () => {
  const setLoading = useSetRecoilState(loadingState);
  const { user } = useUserInfo(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(10);
  const [history, setHistory] = useState<FriendRecommendItem[]>([]);
  useEffect(() => {
    if (user) {
      setLoading(true);
      getFriendRecommendList({
        userId: user.id,
      })
        .then((res) => {
          setHistory(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id]);

  useEffect(() => {
    const innerTotalCount = history.length;
    const arr = [];
    const maxPage = Math.ceil(innerTotalCount / HISTORY_ITEM_PER_PAGE);
    const innerStartPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const innerEndPage = Math.min(innerStartPage + 4, maxPage);
    setStartPage(innerStartPage);
    setEndPage(innerEndPage);
    //페이지는 최대 10개까지
    for (let i = innerStartPage; i <= innerEndPage; i++) {
      arr.push(i);
    }
    setPageArray(arr);
    setHasNextPage(innerEndPage < maxPage);
    setHasPrevPage(innerStartPage > 1);
  }, [currentPage, history.length]);

  return (
    <ReceiveWrapper>
      <Title>친구 초대 현황</Title>
      <ListWrapper>
        {history.length > 0 && (
          <>
            <div className="inner">
              <div className="list">
                {history.map((_, i) => {
                  return (
                    <HistoryItemWrapper key={i}>
                      <div className="item nickname">{_.userNickname}</div>
                      <div className="item reward">
                        +{_.gameMoney.toLocaleString()} GP
                      </div>
                    </HistoryItemWrapper>
                  );
                })}
              </div>
            </div>
            <div className="pagination-row">
              <div
                className={"button " + (!hasPrevPage ? "disabled" : "")}
                onClick={() => setCurrentPage(startPage - 1)}
              >
                <LeftArrow />
              </div>
              {
                //5개씩 페이징
                pageArray.map((_, i) => {
                  return (
                    <div
                      key={i}
                      className={
                        "button " + (currentPage === _ ? "selected" : "")
                      }
                      onClick={() => setCurrentPage(_)}
                    >
                      {_}
                    </div>
                  );
                })
              }
              <div
                className={"button " + (!hasNextPage ? "disabled" : "")}
                onClick={() => setCurrentPage(endPage + 1)}
              >
                <RightArrow />
              </div>
            </div>
          </>
        )}
      </ListWrapper>
    </ReceiveWrapper>
  );
};

export default History;
