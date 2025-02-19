import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { ArticleResponse } from "../../../api/dashboard";
import { getBoardDetail } from "../../../api/article";
import moment from "moment";
import useUserInfo from "../../../hooks/useUserInfo";
import useDialog from "../../../hooks/useDialog";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import { enqueueSnackbar } from "notistack";
import EditPage from "./edit";
import { shareURL } from "../../../utils/common";
import { reportState } from "../../../recoil/report";
import { ReportNavigate } from "../../../components/ReportNavigate";
import {
  addComment,
  getHandBoardDetail,
  updateComment,
  removeComment,
  removeHandBoard,
  blockBoardUser,
} from "../../../api/community";
import { isEdited, isEditedComment } from "../../../utils/date";
const Header = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  z-index: 11;
  flex-direction: row;

  .left {
    display: flex;
    align-items: center;
    .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    .title {
      margin-left: 5px;
      color: #444;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .right {
    color: var(--Black-200, #b7b7b7);
    text-align: right;
    font-family: Pretendard;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.26px;
    img {
      width: 20px;
      height: 20px;
    }
  }
`;
const Wrapper = styled.div`
  padding-top: 68px;
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 70px;
  > .content-wrapper {
    padding: 0 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    > .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      > .info-wrapper {
        display: flex;
        flex-direction: row;
        gap: 12px;
        > .thumbnail {
          > img {
            border-radius: 40px;
            width: 40px;
            height: 40px;
          }
        }

        > .info {
          display: flex;
          flex-direction: column;
          gap: 4px;

          > .name {
            color: var(--Black-400, #444);
            font-family: Pretendard;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            letter-spacing: -0.32px;
          }

          > .time {
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

    > .title {
      margin-top: 20px;
      color: #000;

      font-family: Pretendard;
      font-size: 17.181px;
      font-style: normal;
      font-weight: 600;
      line-height: 25.771px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .content {
      margin-top: 10px;
      color: var(--Black-500, #202020);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 19.6px */
      letter-spacing: -0.28px;
      & img {
        width: 100%;
      }
      > p {
        margin: 0;
        letter-spacing: 0.3px;
        line-height: 24px;
        > strong {
          > a {
            color: #379339;
            text-decoration: underline;
          }
        }
      }
    }
  }

  > .bar {
    margin-top: 10px;
    width: 100%;
    height: 2px;
    background: var(--Black-100, #f0f0f0);
  }

  > .comment-wrapper {
    margin-top: 20px;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    > .title {
      margin-bottom: 16px;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    > .item {
      padding: 8px 16px;
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
        border: 1px #bbb;

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
`;

const BottomWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  > .item-col {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2px;
    > .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 2px;
      color: var(--Black-300, #808080);

      font-family: Pretendard;
      font-size: 10px;
      font-weight: 500;
      line-height: 14px;
      letter-spacing: -0.02em;
      text-align: left;

      > img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }
    }
  }

  > .button-col {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    > .report {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 14px */
      letter-spacing: -0.2px;
    }
    > .button {
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid var(--Black-200, rgba(183, 183, 183, 1));

      padding: 6px 16px;

      font-family: Pretendard;
      font-size: 12px;
      font-weight: 600;
      line-height: 14.4px;
      text-align: left;
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

  > .empty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;

    > img {
      width: 180px;
      object-fit: contain;
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

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
`;

const ArticleDetail = () => {
  const param = useParams();
  const detailId = (param as any).id;
  const role = (param as any).role;
  const history = useHistory();
  const [report, setReport] = useRecoilState(reportState);
  const { openDialog } = useDialog();
  const setLoading = useSetRecoilState(loadingState);
  const [comment, setComment] = useState("");
  const user = useUserInfo();
  const [editId, setEditId] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState<string | null>(
    null
  );
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [showWrite, setShowWrite] = useState(false);
  const [data, setData] = useState<ArticleResponse | null>(null);

  const getDetail = async () => {
    setLoading(true);
    try {
      if (!detailId) {
        history.goBack();
      }
      const res = await getHandBoardDetail(detailId, role);
      setData(res);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      history.goBack();
    }
  };

  const EditComment = async () => {
    if (editCommentContent === null || editId === null) {
      enqueueSnackbar("수정에 실패하였습니다.", {
        variant: "error",
      });
      setEditCommentContent(null);
      setEditId(null);
      return;
    }
    if (editCommentContent === "") {
      enqueueSnackbar("수정하실 내용을 입력해주세요.", {
        variant: "error",
      });
    }
    try {
      await updateComment(editId, { content: editCommentContent });
      setEditCommentContent(null);
      setEditId(null);
      getDetail();
    } catch (e) {
      setEditCommentContent(null);
      setEditId(null);
    }
  };

  const uploadComment = async () => {
    if (!user.user?.validate) {
      enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
        variant: "error",
      });
      return;
    }

    if (comment === "" || !data) {
      enqueueSnackbar("등록하실 댓글을 입력해주세요.", {
        variant: "error",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await addComment({
        articleId: data.id,
        content: comment,
      });
      if (res.code === 200) {
        getDetail();
      }
      setComment("");
      setLoading(false);
    } catch (e: any) {
      if (e.code === 405) {
        enqueueSnackbar(e.message, {
          variant: "error",
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showWrite) getDetail();
  }, [showWrite]);

  const remove = async () => {
    if (!data) return;
    try {
      openDialog({
        text: "해당 게시글을 삭제하시겠습니까?",
        confirm: true,
        confirmText: "삭제하기",
        type: "web",
        confirmColor: "#D91818",
        onConfirm: async () => {
          setLoading(true);
          try {
            await removeHandBoard(data.id);
            setLoading(false);
            history.goBack();
          } catch (e) {
            setLoading(false);
          }
        },
      });
    } catch (e) {
      enqueueSnackbar("게시물 삭제에 실패하였습니다.", {
        variant: "error",
      });
      setLoading(false);
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
      reportType: "article",
      reportId: detailId,
      afterReport: () => {
        history.goBack();
      },
    });
  };

  return (
    <Wrapper>
      {showWrite && data && (
        <EditPage onClose={setShowWrite} data={data} onRemove={remove} />
      )}
      <Header>
        <div className="left">
          <div
            className="close"
            onClick={() => {
              history.goBack();
            }}
          >
            <img
              src="/image-web/Icon/Back.svg"
              id="핸드게시판 뒤로가기"
              alt="close"
            />
          </div>
          <div className="title">핸드게시판</div>
        </div>
      </Header>
      {data && (
        <div className="content-wrapper">
          <div className="header">
            <div className="info-wrapper">
              <div className="thumbnail">
                <img
                  alt="프로필 이미지"
                  src={
                    data.userProfile ||
                    "https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png"
                  }
                />
              </div>
              <div className="info">
                <div className="name">{data?.authorNickname}</div>
                <div className="time">
                  {moment(data?.createdAt).fromNow() + " "}
                  {isEdited(data) && <span>(수정됨)</span>}
                </div>
              </div>
            </div>
            <img
              alt="공유"
              src="/image-web/Icon/share-button.svg"
              onClick={() => {
                shareURL(window.location.href);
              }}
            />
          </div>
          <div className="title">
            {data.type === "NOTICE" && "[공지] "}
            {data?.title}
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
          <BottomWrapper>
            <div className="item-col">
              <div className="item">
                <img src="/image-web/Holdem%20Now/Icon/view/small.svg" />
                <span>{data?.viewCount.toLocaleString()}</span>
              </div>
              <div className="item">·</div>
              <div className="item" id="종아요" onClick={() => {}}>
                <img src="/image-web/Icon/Heart/small-gray.svg" alt="좋아요" />
                <span>{data?.likeCount}</span>
              </div>
              <div className="item">·</div>
              <div className="item">
                <img src="/image-web/Holdem%20Now/Icon/comment/small.svg" />
                <span>{data?.commentCount.toLocaleString()}</span>
              </div>
            </div>
            <div className="button-col">
              {data?.authorNickname === user.user?.nickname && (
                <div className="button" onClick={() => setShowWrite(true)}>
                  수정
                </div>
              )}
              {data?.authorNickname === user.user?.nickname && (
                <div className="button" onClick={() => remove()}>
                  삭제
                </div>
              )}
              {user.user && data?.authorNickname !== user.user?.nickname && (
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
          </BottomWrapper>
        </div>
      )}
      <div className="bar" />

      <div className="comment-wrapper">
        <div className="title">댓글</div>
        {data && data?.comments.length > 0 ? (
          data.comments.map((comment, index) => (
            <div key={index} className="item">
              <div className="top">
                <div className="info-box">
                  <div className="name">{comment.authorNickname}</div>
                  <div className="item">
                    {moment(comment.createdAt).fromNow() + " "}
                    {isEditedComment(comment) && <span>(수정됨)</span>}
                  </div>
                </div>
                {user.user?.nickname &&
                  comment.authorNickname !== user.user?.nickname && (
                    <img
                      src="/image-web/report/report.svg"
                      onClick={() => {
                        setReport({
                          title: "해당 댓글을 신고하시겠습니까?",
                          description: "",
                          type: "ABUSIVE",
                          reportType: "article-comment",
                          reportId: comment.id,
                          afterReport: () => {
                            getBoardDetail(detailId);
                          },
                        });
                      }}
                    />
                  )}
              </div>
              <div className={`bottom ${editId === comment.id && "edit"}`}>
                {editId === comment.id ? (
                  <textarea
                    placeholder="수정할 내용을 입력하세요."
                    value={editCommentContent ? editCommentContent : ""}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "1px";
                      target.style.height = target.scrollHeight + "px";
                    }}
                  />
                ) : (
                  <div className="middle">{comment.content}</div>
                )}

                {comment.authorNickname === user.user?.nickname && (
                  <div className="bottom">
                    <div
                      className="button"
                      onClick={() => {
                        if (editId === null) {
                          setEditId(comment.id);
                          setEditCommentContent(comment.content);
                        } else {
                          EditComment();
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
                                await removeComment(comment.id);
                                getDetail();
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

                    {editId === comment.id && (
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
          ))
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
      <div className="floating-button-wrapper">
        <textarea
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
          onClick={() => {
            uploadComment();
          }}
        >
          등록
        </div>
      </div>
      {isReportOpen && (
        <ReportNavigate
          blockTitle="사용자 차단하기"
          block={blockUser}
          report={ReportDialogOpen}
          setClose={() => setIsReportOpen(false)}
          blockUserId={data?.userId || 0}
        />
      )}
    </Wrapper>
  );
};

export default ArticleDetail;
