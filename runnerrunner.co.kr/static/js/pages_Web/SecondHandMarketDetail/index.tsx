import styled from "styled-components";
import { RefObject, useEffect, useRef, useState } from "react";
import useDialog from "../../../hooks/useDialog";
import { useHistory, useParams } from "react-router-dom";
import { shareURL } from "../../../utils/common";
import { enqueueSnackbar } from "notistack";
import Loading from "../../../components/Loading";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import useScreenOrientation, {
  MEDIA_DESKTOP,
} from "../../../hooks/useScreenOrientation";
import useUserInfo from "../../../hooks/useUserInfo";
import moment from "moment";
import ImageViewer from "../../../components/ImageViewer";
import { LOCAL_STORAGE_ACCESS_KEY } from "../../../utils/network";
import {
  addMarketComment,
  cancelLikeMarket,
  exitMarketComment,
  getMarketComment,
  getMarketDetail,
  likeMarket,
  SecondHandMarketCommentResponse,
  SecondHandMarketResponse,
  updateMarketComment,
} from "../../../api/second-hand-market";
import { Swiper, SwiperSlide } from "swiper/react";
import WriteMarket from "../Community/SecondHandMarket/WriteBox";
import { reportState } from "../../../recoil/report";

import { ReportNavigate } from "../../../components/ReportNavigate";
import { blockBoardUser } from "../../../api/community";

const DetailWrapper = styled.div<{
  scrollLock: boolean;
  isScroll: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
  
  `} @media ${MEDIA_DESKTOP} {
    right: 0;
    padding: 0;
    height: 100%;
  }
  > .header {
    ${(p) => p.isScroll && "background-color: #fff;"}
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    padding: 12px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    img {
      filter: ${(p) =>
        p.isScroll ? "brightness(0) invert(0)" : "brightness(0) invert(1)"};
      width: 24px;
    }

    > .progress-wrapper {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }

  > .floating-button-wrapper {
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    padding: 12px 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border-top: 1px solid var(--Black-100, #f0f0f0);
    background: #fff;
    box-shadow: 0px -4px 4px 0px rgba(0, 0, 0, 0.15);
    @media ${MEDIA_DESKTOP} {
      display: none;
    }

    > textarea {
      outline: none;
      border: none;
      resize: none;
      flex-grow: 1;
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 19.6px */
      height: 20px;
      max-height: 100px;

      &::placeholder {
        color: var(--Black-300, #808080);
      }
    }

    > .button {
      cursor: pointer;
      width: 52px;
      height: 32px;
      color: #fff;
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
      border-radius: 6px;
      background: var(--Purple-300, #6436e7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    > .button:active {
      background: #502bb5;
    }
    .button.disable {
      cursor: not-allowed;
      color: var(--Black-200, #b7b7b7);
      background: var(--Black-100, #f0f0f0);
    }
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
    @media ${MEDIA_DESKTOP} {
      border-radius: 12px;
      border: 1px solid var(--Black-100, #f0f0f0);
      background: #fff;
    }

    > .comment-wrapper {
      margin-top: 16px;
      padding: 0 16px 100px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      > .title {
        margin-bottom: 4px;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      > .item {
        padding: 16px 16px;
        width: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background: var(--Black-100, #f0f0f0);
        > .top {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          > .info-box {
            display: flex;
            flex-direction: row;
            gap: 5px;
            align-items: center;
            > .name {
              color: var(--Black-400, #444);
              font-family: Pretendard;
              font-size: 14px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
              letter-spacing: -0.28px;
            }
            > img {
              width: 30px;
              height: 30px;
              border-radius: 30px;
            }
            > .item {
              color: var(--Black-300, #808080);
              font-family: Pretendard;
              font-size: 9px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              letter-spacing: -0.18px;
            }
          }
        }

        > .bottom {
          margin-top: 5px;
          width: 100%;
          > .middle {
            color: var(--Black-500, #202020);
            font-family: Pretendard;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 140%; /* 19.6px */
            letter-spacing: -0.28px;
          }

          > .bottom {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            margin-top: 10px;
            gap: 8px;

            > .button {
              display: flex;
              padding: 6px 16px;
              justify-content: center;
              align-items: center;
              border-radius: 4px;
              border: 1px solid var(--Black-200, #b7b7b7);
              color: var(--Black-500, #202020);
              font-family: Pretendard;
              font-size: 12px;
              font-style: normal;
              font-weight: 600;
              line-height: normal;
            }
          }
        }
        > .bottom.edit {
          display: flex;
          padding: 10px 12px;
          flex-direction: column;
          border-radius: 4px;
          border: 1px solid #bbb;

          background: #fff;
          > textarea {
            width: 100%;
            outline: none;
            border: none;
            resize: none;
          }
        }
      }
    }
  }
`;

const HorizontalBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--Black-100, #f0f0f0);
  @media ${MEDIA_DESKTOP} {
    height: 1px;
    width: calc(100% - 40px);
    margin: 0 20px;
  }
`;

const HorizontalBar2 = styled.div`
  width: 100%;
  height: 2px;
  background: var(--Black-100, #f0f0f0);
  @media ${MEDIA_DESKTOP} {
    height: 1px;
    width: calc(100% - 40px);
    margin: 0 20px;
  }
`;
const CommentWrapper = styled.div`
  margin-top: 4px;
  padding: 16px;
  padding-bottom: 60px;
  > .title {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  > .list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-items: flex-start;
    margin: 16px 0px;
    background: white;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      padding-bottom: 0;
    }
  }
`;
const CommentItemWrapper = styled.div`
  padding: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--Black-100, rgba(240, 240, 240, 1));
  &:last-child {
    border-bottom: none;
  }

  > .profile-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;

    > .profile {
      width: 34px;
      height: 34px;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    > .info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;

      > .author-row {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-items: flex-start;
        gap: 4px;

        > .author {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 15px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.28px;
        }
      }

      .createdAt {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.2px;
      }
    }
  }

  > .content {
    margin-top: 10px;
    width: 100%;
    text-align: left;
    color: #000;

    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: -0.26px;

    > .edited {
      color: var(--Black-200, #b7b7b7);
    }
  }

  > .fix-row {
    margin-top: 8px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;

    > .button {
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      cursor: pointer;
      width: 53px;
      height: 26px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid var(--Black-200, #b7b7b7);
    }
  }
`;

const EmptyWrapper = styled.div`
  padding: 60px 0 220px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  @media ${MEDIA_DESKTOP} {
    display: none;
  }

  > .empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;

    > img {
      width: 180px;
      object-fit: contain;
      filter: grayscale(10%) brightness(95%);
    }

    > .empty-text {
      width: 100%;
      color: var(--Black-300, #808080);
      text-align: center;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

const PCCommentWriteWrapper = styled.div`
  display: none;
  @media ${MEDIA_DESKTOP} {
    width: calc(100% - 40px);
    padding: 16px;
    margin: 20px;
    border-radius: 12px;
    background: var(--Black-100, #f0f0f0);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
    > .edit-wrapper {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 16px;
      width: 100%;

      > .profile {
        width: 42px;
        height: 42px;
        object-fit: cover;
        border-radius: 50%;
        flex-shrink: 0;
      }

      > textarea {
        margin-top: 10px;
        height: 20px;
        resize: none;
        background: transparent;
        border: none;
        outline: none;
        flex-grow: 1;
        color: var(--Black-500, #202020);
        text-align: justify;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%; /* 19.6px */
        letter-spacing: -0.28px;

        &::placeholder {
          color: var(--Black-300, #808080);
        }
      }
    }

    > .button {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 32px;
      color: var(--Black-200, #b7b7b7);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
    }
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  padding 20px 16px;
  
  > .title {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 19px;
  letter-spacing: -0.02em;
  color: #444444;
  }

  .middle {
    margin-top :6px;
    display: flex;
    flex-direction: row;
    gap: 6px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 17px;
    letter-spacing: -0.02em;
    color: #808080;
  }

  .bottom {
    margin-top: 26px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    > .price {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.32px;
    }
    > .icon-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;

        > .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;

          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%; /* 19.6px */
          letter-spacing: -0.28px;

          > img {
            width: 16px;
            height: 16px;
            object-fit: contain;
          }
        }
    }
  }
`;

const HoldemItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 10px;
  background: white;
  @media ${MEDIA_DESKTOP} {
    padding: 24px 20px;
  }

  > .content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;

    > .images {
      width: 100%;
      position: relative;
      background: #e5e5e5;
      padding-top: 100%;
      overflow: hidden;

      .swiper-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .like-wrapper {
        z-index: 9;
        position: absolute;
        bottom: 20px;
        right: 20px;

        img {
          width: 40px;
          height: 40px;
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
    }
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 28px 16px;
  gap: 10px;
  > .cover_image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  > .profile {
    display: flex;
    flex-direction: column;

    > .tag-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;

      > .tag {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2px;
        border-radius: 2px;
        padding: 4px;
        border: 1px solid ${(p) => p.theme.color.purple100};

        > img {
          width: 16px;
        }

        color: ${(p) => p.theme.color.purple300};
        text-align: right;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.24px;
      }
    }
    > .user_name {
      flex: 1;
      display: flex;
      align-items: center;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 18px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
      letter-spacing: -0.36px;
    }
  }
`;

const InfoWrapper = styled.div`
  margin-top: 12px;
  margin-left: 16px;
  width: calc(100% - 32px);
  display: flex;
  flex-direction: column;
  > .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    > .title {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .report {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 14px */
      letter-spacing: -0.2px;
    }
  }

  > .info_box {
    padding: 16px;
    border-radius: 8px;
    margin: 16px 0px 20px;
    color: #000;
    background: var(--Black-100, rgba(240, 240, 240, 1));

    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: -0.26px;
  }
`;

interface DetailPageProps {
  onClose?: () => void;
}

const SecondHandMarketDetail = ({ onClose }: DetailPageProps) => {
  const { user } = useUserInfo();
  const { openDialog } = useDialog();
  const setLoading = useSetRecoilState(loadingState);
  const history = useHistory();
  const inputRefMobile = useRef<HTMLTextAreaElement | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const param = useParams();
  const detailId = (param as any).id;
  const [report, setReport] = useRecoilState(reportState);
  const [commentList, setCommentList] = useState<
    SecondHandMarketCommentResponse[]
  >([]);
  const [data, setData] = useState<SecondHandMarketResponse | null>(null);
  const [refreshCommentList, setRefreshCommentList] = useState(
    new Date().getTime()
  );
  const [selectedEditCommentId, setSelectedEditCommentID] = useState<
    number | null
  >(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const [comment, setComment] = useState<string>("");

  const [recommendation, setRecommendation] = useState(false);
  const [recommendationCount, setRecommendationCount] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [editId, setEditId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string | null>(
    null
  );
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    if (detailId) {
      setLoading(true);
      getMarketDetail(detailId)
        .then((res) => {
          setData(res);
          setRecommendation(res.like);
          setRecommendationCount(res.likeCount);
        })
        .catch((err) => {
          if (err.code === 9001) {
            enqueueSnackbar("해당 게시글이 존재하지 않습니다.", {
              variant: "error",
            });
            history.replace("/second-hand-market");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [detailId, showEdit]);

  useEffect(() => {
    if (!data) return;
    getMarketComment(detailId).then((res) => {
      setCommentList(res);
    });
  }, [data, refreshCommentList]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (history.action === "PUSH") {
        history.goBack();
      } else {
        history.replace("/second-hand-market");
      }
    }
  };

  const blockUser = async (blockUserId: number) => {
    await blockBoardUser({ blockUserId });
  };
  const ReportDialogOpen = async () => {
    setReport({
      title: "해당 게시글을 신고하시겠습니까?",
      description: "",
      type: "ABUSIVE",
      reportType: "market",
      reportId: detailId,
      afterReport: () => {
        history.goBack();
      },
    });
  };
  const handleAddComment = async () => {
    if (!user?.validate) {
      enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
        variant: "error",
      });
      return;
    }

    let inputRef: RefObject<HTMLTextAreaElement>;
    inputRef = inputRefMobile;
    if (data) {
      if (editId) {
        if (!editCommentContent || editCommentContent === "") return;
        openDialog({
          text: "해당 댓글을 수정하시겠습니까?",
          confirm: true,
          confirmText: "수정하기",
          type: "web",
          onConfirm: () => {
            if (inputRef && inputRef.current) {
              setLoading(true);
              const message = editCommentContent;
              updateMarketComment({
                message,
                id: editId,
              })
                .then(() => {
                  enqueueSnackbar("댓글이 수정되었습니다.", {
                    variant: "success",
                  });
                  setEditCommentContent("");
                  setRefreshCommentList(new Date().getTime());
                  setEditId(null);

                  if (inputRef.current) {
                    inputRef.current.value = "";
                  }
                })
                .catch((e: any) => {
                  enqueueSnackbar(e.message, { variant: "error" });
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          },
        });
      } else {
        if (inputRef && inputRef.current && inputRef.current.value === "")
          return;
        if (!accessToken) {
          enqueueSnackbar("로그인이 필요한 서비스입니다.", {
            variant: "error",
          });
          history.push("/login");
          return;
        }
        openDialog({
          text: "댓글을 등록하시겠습니까?",
          confirm: true,
          confirmText: "등록하기",
          type: "web",
          onConfirm: () => {
            if (inputRef && inputRef.current) {
              setLoading(true);
              const message = inputRef.current.value;
              addMarketComment({
                message,
                marketId: detailId,
              })
                .then(() => {
                  enqueueSnackbar("댓글이 등록되었습니다.", {
                    variant: "success",
                  });
                  setRefreshCommentList(new Date().getTime());
                  setComment("");
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          },
        });
      }
    }
  };

  const recommendPost = async () => {
    if (!accessToken) {
      history.push("/login");
      enqueueSnackbar("로그인이 필요한 서비스입니다.", {
        variant: "error",
      });
      return;
    }

    if (recommendation) {
      try {
        const result = await cancelLikeMarket(detailId);
        if (result.code === 200) {
          setRecommendation(false);
          setRecommendationCount(recommendationCount - 1);
        }
      } catch (e) {}
    } else {
      try {
        const result = await likeMarket(detailId);
        if (result.code === 200) {
          setRecommendation(true);
          setRecommendationCount(recommendationCount + 1);
        }
      } catch (e) {}
    }
  };

  const removeComment = (commentId: number) => {
    setLoading(true);
    exitMarketComment(commentId)
      .then(() => {
        enqueueSnackbar("댓글이 삭제되었습니다.", {
          variant: "success",
        });
        getMarketComment(detailId).then((res) => {
          setCommentList(res);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      const innerElement = innerRef.current;

      if (innerElement) {
        const scrollTop = innerElement.scrollTop;
        const windowWidth = window.innerWidth;
        if (scrollTop >= windowWidth) {
          setIsScroll(true);
        } else {
          setIsScroll(false);
        }
      }
    };

    const innerElement = innerRef.current;
    if (innerElement) {
      innerElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (innerElement) {
        innerElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [innerRef.current]);

  return (
    <>
      {showEdit && (
        <WriteMarket
          onClose={() => setShowEdit(false)}
          mode={"edit"}
          marketData={data ? data : undefined}
        />
      )}
      {selectedImageIndex !== -1 && (
        <ImageViewer
          images={data?.imageList || []}
          defaultIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(-1)}
        />
      )}
      {data ? (
        <DetailWrapper scrollLock={showEdit} isScroll={isScroll}>
          <div className="header">
            <div className="close" onClick={() => history.goBack()}>
              <img src="/image-web/Icon/Back.svg" alt="close" />
            </div>
            <div className="progress-wrapper">
              {data.mine && (
                <img
                  src="/image-web/Icon/edit.png"
                  onClick={() => setShowEdit(true)}
                />
              )}
              <img
                src="/image-web/Icon/share.png"
                onClick={() => shareURL(window.location.href)}
              />
            </div>
          </div>
          <div className="inner" ref={innerRef}>
            <HoldemItem>
              <div className="content-wrapper">
                <div className="images">
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    className="swiper-container"
                    onSlideChange={(swiper: any) =>
                      setCurrentIndex(swiper.realIndex)
                    }
                  >
                    {data.imageList.map((url, i) => (
                      <SwiperSlide key={i} className="swiper-slide">
                        <img
                          src={url}
                          alt={`Slide ${i}`}
                          onClick={() => setSelectedImageIndex(i)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="progress-dots">
                    {data.imageList.map((_, i) => (
                      <div
                        key={i}
                        className={`dot ${currentIndex === i ? "active" : ""}`}
                      />
                    ))}
                  </div>

                  <div
                    className="like-wrapper"
                    onClick={() => {
                      recommendPost();
                    }}
                  >
                    {recommendation ? (
                      <img src="/image-web/Icon/like.png" />
                    ) : (
                      <img src="/image-web/Icon/unlike.png" />
                    )}
                  </div>
                </div>
              </div>
            </HoldemItem>

            <InfoBox>
              <span className="title">{data.title}</span>
              <div className="middle">
                <span className="area">
                  {data.areaProvinceName + " " + data.areaCityName}
                </span>
                ·
                <span className="date">{moment(data.createdAt).fromNow()}</span>
              </div>
              <div className="bottom">
                <span className="price">{data.price.toLocaleString()} 원</span>
                <div className="icon-wrapper">
                  <div className="item">
                    <img
                      src="/image-web/Icon/Heart/small-gray.svg"
                      alt="좋아요"
                    />
                    <span>{data.likeCount.toLocaleString()}</span>
                  </div>
                  <div className="item">
                    <img src="/image-web/Holdem%20Now/Icon/comment/small-line.svg" />
                    <span>{data.commentCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </InfoBox>
            <HorizontalBar />
            <ProfileWrapper>
              <img
                className="cover_image"
                src={
                  data.userProfile
                    ? data.userProfile
                    : "https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png"
                }
              />
              <div className="profile">
                <div className="tag-row">
                  {data?.validate && (
                    <div className="tag">
                      <img src="/image-web/Icon/Certified/small.svg" />
                      <span>본인 인증 완료</span>
                    </div>
                  )}
                </div>

                <div className="user_name">{data.username}</div>
              </div>
            </ProfileWrapper>

            <InfoWrapper>
              <div className="header">
                <div className="title">상품 정보</div>
                {user && data?.username !== user.nickname && (
                  <div
                    className="report"
                    onClick={() => {
                      setIsReportOpen(true);
                    }}
                  >
                    신고하기
                  </div>
                )}
              </div>

              <div
                className="info_box"
                dangerouslySetInnerHTML={{
                  __html: data.message.replace(/\n/g, "<br />"),
                }}
              ></div>
            </InfoWrapper>
            <HorizontalBar2 />
            {commentList.length === 0 ? (
              <EmptyWrapper>
                <div className="empty-wrapper">
                  <img src="/image-web/None.png" />
                  <div className="empty-text">
                    아직 댓글이 없습니다.
                    <br />첫 댓글을 남겨보세요!
                  </div>
                </div>
              </EmptyWrapper>
            ) : (
              <div className="comment-wrapper">
                <div className="title">댓글</div>
                {commentList.length > 0 ? (
                  commentList.map((data, index) =>
                    !data.exit ? (
                      <div key={index} className="item">
                        <div className="top">
                          <div className="info-box">
                            <img
                              className="profile"
                              src={
                                data.userProfile ||
                                "https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png"
                              }
                              alt="profile"
                            />
                            <div className="name">{data.userNickName}</div>
                            <div className="item">
                              {moment(data.createdAt).fromNow()}
                            </div>
                          </div>

                          {user?.nickname &&
                            data.userNickName !== user.nickname && (
                              <img
                                src="/image-web/report/report.svg"
                                onClick={() => {
                                  setReport({
                                    title: "해당 댓글을 신고하시겠습니까?",
                                    description: "",
                                    type: "ABUSIVE",
                                    reportType: "market-comment",
                                    reportId: data.id,
                                    afterReport: () => {
                                      getMarketDetail(detailId);
                                    },
                                  });
                                }}
                              />
                            )}
                        </div>
                        <div
                          className={`bottom ${editId === data.id && "edit"}`}
                        >
                          {editId === data.id ? (
                            <textarea
                              placeholder="수정할 내용을 입력하세요."
                              value={
                                editCommentContent ? editCommentContent : ""
                              }
                              onChange={(e) =>
                                setEditCommentContent(e.target.value)
                              }
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "1px";
                                target.style.height =
                                  target.scrollHeight + "px";
                              }}
                            />
                          ) : (
                            <div className="middle">{data.message}</div>
                          )}

                          {data.userNickName === user?.nickname && (
                            <div className="bottom">
                              <div
                                className="button"
                                onClick={() => {
                                  if (editId === null) {
                                    setEditId(data.id);
                                    setEditCommentContent(data.message);
                                  } else {
                                    handleAddComment();
                                  }
                                }}
                              >
                                수정
                              </div>
                              {!editId && (
                                <div
                                  className="button"
                                  onClick={() => {
                                    openDialog({
                                      text: "해당 댓글을 삭제하시겠습니까?",
                                      confirm: true,
                                      confirmText: "삭제하기",
                                      type: "web",
                                      confirmColor: "#D91818",
                                      onConfirm: async () => {
                                        setLoading(true);
                                        try {
                                          await removeComment(data.id);
                                          setLoading(false);
                                        } catch (e) {
                                          setLoading(false);
                                        }
                                      },
                                    });
                                  }}
                                >
                                  삭제
                                </div>
                              )}
                              {editId === data.id && (
                                <div
                                  className="button"
                                  onClick={() => {
                                    setEditId(null);
                                    setEditCommentContent(null);
                                  }}
                                >
                                  취소
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )
                ) : (
                  <EmptyWrapper>
                    <div className="empty-wrapper">
                      <img src="/image-web/None.png" />
                      <div className="empty-text">
                        아직 댓글이 없습니다.
                        <br />첫 댓글을 남겨보세요!
                      </div>
                    </div>
                  </EmptyWrapper>
                )}
              </div>
            )}
          </div>
          <div className="floating-button-wrapper">
            <textarea
              ref={inputRefMobile}
              placeholder="댓글을 남겨주세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "1px";
                target.style.height = target.scrollHeight + "px";
              }}
            />
            <div
              className={`button ${comment === "" ? "disable" : ""}`}
              onClick={handleAddComment}
            >
              {selectedEditCommentId ? "수정" : "등록"}
            </div>
          </div>
        </DetailWrapper>
      ) : (
        <Loading full />
      )}
      {isReportOpen && (
        <ReportNavigate
          blockTitle="사용자 차단하기"
          block={blockUser}
          report={ReportDialogOpen}
          setClose={() => setIsReportOpen(false)}
          blockUserId={data?.userId || 0}
        />
      )}
    </>
  );
};

export default SecondHandMarketDetail;
