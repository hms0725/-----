import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Job, UserJob, jobDetail, userJobDetail } from "../../../api/job";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import {
  getGenderLabel,
  getRecruitStateLabel,
  getRecruitTypeLabel,
} from "../../../utils/constants";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import useUserInfo from "../../../hooks/useUserInfo";
import { useRecoilState } from "recoil";
import { reportState } from "../../../recoil/report";
import RegisterRecruit from "../Community/Recruit/RegisterRecruit";
import RegisterUserRecruit from "../Community/Recruit/RegisterUserRecruit";

const RecruitDetailWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  max-width: 500px;
  width: 100%;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 10;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media ${MEDIA_DESKTOP} {
    position: static;
    max-width: unset;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    padding: 0;
  }
  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
    `
      : `
      overflow-y: scroll;
    `}
  > .header {
    z-index: 101;
    transition: all 0.1s ease-in-out;
    top: 0;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20px;
    gap: 8px;
    background: white;

    > .edit {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      cursor: pointer;
    }
    @media ${MEDIA_DESKTOP} {
      display: none;
      position: static;
      bottom: unset;
      right: unset;
      left: unset;
      top: unset;
      transform: unset;
      height: unset;
      padding: 0;
    }
    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      transition: all 0.1s ease-in-out;
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    > .button {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      cursor: pointer;
      color: var(--Black-200, #b7b7b7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
    }
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
const HorizontalBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--Black-100, #f0f0f0);
  @media ${MEDIA_DESKTOP} {
    height: 1px;
    margin: 40px 0;
  }
`;

const ReportButtonWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  > .button {
    display: flex;
    flex-direction: row;
    gap: 6px;
    align-items: center;
    padding: 9px 19.5px;
    border-radius: 8px;
    background: rgba(217, 24, 24, 0.1);

    > span {
      color: #d91818;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
    }
  }
`;
const BasicBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px 16px 30px;
  gap: 20px;
  @media ${MEDIA_DESKTOP} {
    padding-top: 0;
    padding-bottom: 0;
  }

  > .title {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      font-size: 18px;
    }
  }

  > .description {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    letter-spacing: -0.28px;
    white-space: pre-wrap; /* 줄바꿈 적용을 위해 추가 */
    width: 100%; /* 컨테이너 너비에 맞추기 */
    word-break: break-word; /* 긴 텍스트 줄바꿈 */
    @media ${MEDIA_DESKTOP} {
      font-size: 16px;
    }
  }

  > .list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      gap: 20px;
    }
    > .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;

      > .title {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.28px;
        @media ${MEDIA_DESKTOP} {
          font-size: 16px;
        }
      }

      > .value {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.28px;
        @media ${MEDIA_DESKTOP} {
          font-size: 16px;
        }
      }
    }
  }
`;
const StoreInfoBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px 16px 30px;
  @media ${MEDIA_DESKTOP} {
    padding-bottom: 0;
  }
  > .info {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    background: var(--Purple-100, #f0eaff);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;

    > svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      @media ${MEDIA_DESKTOP} {
        width: 20px;
        height: 20px;
      }
    }

    > .text {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
      @media ${MEDIA_DESKTOP} {
        font-size: 16px;
      }
    }
  }

  > .top {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    > .badge-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;

      > .badge {
        padding: 4px 6px;
        border-radius: 16.667px;
        border: 1px solid var(--Purple-100, #f0eaff);
        color: var(--Purple-300, #6436e7);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        @media ${MEDIA_DESKTOP} {
          font-size: 16px;
          padding: 4px 8px;
        }
      }
    }

    > .createdAt {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.26px;
      @media ${MEDIA_DESKTOP} {
        font-size: 16px;
      }
    }
  }
  > .top-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    @media ${MEDIA_DESKTOP} {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
    > .title-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 6px;
      > .title {
        margin-top: 12px;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        @media ${MEDIA_DESKTOP} {
          font-size: 32px;
        }
      }

      > .address {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }
    }
    > .button {
      width: 100%;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
      border-radius: 8px;
      border: 1px solid var(--Black-100, #f0f0f0);
      margin-bottom: 20px;
      height: 48px;
      @media ${MEDIA_DESKTOP} {
        width: 155px;
        height: 48px;
      }
      > .arrow {
        width: 20px;
        height: 20px;
      }
    }
  }

  > .info-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      margin-top: 40px;
      flex-direction: row;
      gap: 60px;
    }
    > .item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 12px;

      > .icon {
        width: 24px;
        height: 24px;
      }

      > .info-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;
        @media ${MEDIA_DESKTOP} {
          gap: 6px;
        }
        > .title {
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          letter-spacing: -0.28px;
          @media ${MEDIA_DESKTOP} {
            font-size: 16px;
          }
        }

        > .value {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.28px;
          @media ${MEDIA_DESKTOP} {
            font-size: 16px;
          }
        }
      }
    }
  }
`;
const HelpWrapper = styled.div`
  display: none;
  @media ${MEDIA_DESKTOP} {
    margin-top: 20px;
    width: 100%;
    display: block;
    padding: 12px;
    border-radius: 8px;
    background: var(--Black-100, #f0f0f0);
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */
    letter-spacing: -0.28px;
  }
`;

function RecruitDetailPage() {
  const history = useHistory();
  const params = useParams<{
    id?: string;
    type: string;
  }>();
  const { user } = useUserInfo();
  const [data, setData] = useState<Job>();
  const [userData, setUserData] = useState<UserJob>();
  const [report, setReport] = useRecoilState(reportState);
  const [showEditUser, setShowEditUser] = useState<boolean>(false);
  const [showEditCafe, setShowEditCafe] = useState<boolean>(false);

  const getPubRecruit = async () => {
    jobDetail(Number(params.id), user?.id)
      .then((res) => {
        setData(res);
      })
      .catch((e: any) => {
        history.goBack();
      });
  };

  const getUserRecruit = async () => {
    userJobDetail(Number(params.id), user?.id)
      .then((res) => {
        setUserData(res);
      })
      .catch((e: any) => {
        history.goBack();
      });
  };
  useEffect(() => {
    if (params.id) {
      if (params.type === "pub") {
        getPubRecruit();
      } else {
        getUserRecruit();
      }
    } else {
      enqueueSnackbar("잘못된 접근 경로입니다.", { variant: "error" });
    }
  }, []);

  const handleClickShowInfo = useCallback(() => {
    if (data?.cafeId) {
      history.push("/store/" + data.cafeId);
    }
  }, [data]);

  const handleClose = () => {
    if (history.action === "PUSH") {
      history.goBack();
    } else {
      history.replace("/");
    }
  };

  return (
    <>
      {showEditCafe && (
        <RegisterRecruit
          mode="edit"
          recruitId={data?.id}
          update={getPubRecruit}
          onClose={() => setShowEditCafe(false)}
        />
      )}
      {showEditUser && (
        <RegisterUserRecruit
          mode="edit"
          recruitId={userData?.id}
          update={getUserRecruit}
          onClose={() => setShowEditUser(false)}
        />
      )}
      {params.type === "pub" ? (
        <RecruitDetailWrapper scrollLock={false}>
          <div className="header">
            <div className="close" onClick={handleClose}>
              <img src="/image-web/Icon/Back.svg" alt="close" />
            </div>
            <div className="title">채용 상세 정보</div>
            {data?.owner && (
              <div className="edit" onClick={() => setShowEditCafe(true)}>
                <img src="/image-web/Icon/edit.svg" alt="edit" />
              </div>
            )}
          </div>
          <div className="inner">
            <ContentWrapper>
              <StoreInfoBox>
                <div className="info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8ZM8 5C7.72386 5 7.5 5.22386 7.5 5.5C7.5 5.77614 7.72386 6 8 6H8.01C8.28614 6 8.51 5.77614 8.51 5.5C8.51 5.22386 8.28614 5 8.01 5H8ZM8.5 8C8.5 7.72386 8.27614 7.5 8 7.5C7.72386 7.5 7.5 7.72386 7.5 8V11C7.5 11.2761 7.72386 11.5 8 11.5C8.27614 11.5 8.5 11.2761 8.5 11V8Z"
                      fill="#444444"
                    />
                  </svg>
                  <div className="text">
                    채용을 희망하시는 분은 하단의 전화나 이메일로 문의하시기
                    바랍니다.
                  </div>
                </div>
                <div className="top">
                  <div className="badge-row">
                    <div className="badge">
                      {getRecruitStateLabel(data?.state)}
                    </div>
                    <div className="badge">
                      {getRecruitTypeLabel(
                        data?.recruitType,
                        data?.recruitTypeEtc
                      )}
                    </div>
                  </div>
                  <div className="createdAt">
                    {moment(data?.createdAt).fromNow()}
                  </div>
                </div>
                <div className="top-wrapper">
                  <div className="title-wrapper">
                    <div className="title">{data?.cafeName}</div>
                    <div className="address">{data?.place}</div>
                  </div>
                  <div className="button" onClick={handleClickShowInfo}>
                    업체정보 보기{" "}
                    <img
                      className="arrow"
                      src="/image-web/Icon/Arrow-right.svg"
                    />
                  </div>
                </div>
                <div className="info-list">
                  <div className="item">
                    <img className="icon" src="/image-web/recruit/Money.svg" />
                    <div className="info-wrapper">
                      <div className="title">시급</div>
                      <div className="value">
                        {data?.hourlyPay?.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <img
                      className="icon"
                      src="/image-web/recruit/Schedule.svg"
                    />
                    <div className="info-wrapper">
                      <div className="title">근무 요일 및 시간</div>
                      <div className="value">{data?.workingDaysTime}</div>
                    </div>
                  </div>
                </div>
              </StoreInfoBox>
              <HorizontalBar />
              <BasicBoxWrapper>
                <div className="title">모집조건</div>
                <div className="list">
                  <div className="item">
                    <div className="title">채용 분야</div>
                    <div className="value">
                      {getRecruitTypeLabel(
                        data?.recruitType,
                        data?.recruitTypeEtc
                      )}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">성별</div>
                    <div className="value">{getGenderLabel(data?.gender)}</div>
                  </div>
                  <div className="item">
                    <div className="title">나이제한</div>
                    <div className="value">
                      {data?.ageLimits.map((age) => age + "대")}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">복리후생</div>
                    <div className="value">{data?.benefits || "없음"}</div>
                  </div>
                  <div className="item">
                    <div className="title">연락처</div>
                    <div className="value">{data?.contactInfo}</div>
                  </div>
                  <div className="item">
                    <div className="title">이메일</div>
                    <div className="value">{data?.email}</div>
                  </div>
                </div>
              </BasicBoxWrapper>
              <HorizontalBar />
              <BasicBoxWrapper>
                <div className="title">상세내용</div>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: data?.additionalInfo ?? "",
                  }}
                />
              </BasicBoxWrapper>
            </ContentWrapper>
            <HelpWrapper>
              <li>러너러너 회원이면 누구나 채용등록 가능합니다.</li>
              <li>
                각 채용 항목들에 대해서 러너 소프트에 책임과 권한이 없음을
                알려드립니다.
              </li>
            </HelpWrapper>
          </div>
        </RecruitDetailWrapper>
      ) : (
        <RecruitDetailWrapper scrollLock={false}>
          <div className="header">
            <div className="close" onClick={handleClose}>
              <img src="/image-web/Icon/Back.svg" alt="close" />
            </div>
            <div className="title">채용 상세 정보</div>
            {userData?.owner && (
              <div className="edit" onClick={() => setShowEditUser(true)}>
                <img src="/image-web/Icon/edit.svg" alt="edit" />
              </div>
            )}
          </div>
          <div className="inner">
            <ContentWrapper>
              <StoreInfoBox>
                <div className="info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8ZM8 5C7.72386 5 7.5 5.22386 7.5 5.5C7.5 5.77614 7.72386 6 8 6H8.01C8.28614 6 8.51 5.77614 8.51 5.5C8.51 5.22386 8.28614 5 8.01 5H8ZM8.5 8C8.5 7.72386 8.27614 7.5 8 7.5C7.72386 7.5 7.5 7.72386 7.5 8V11C7.5 11.2761 7.72386 11.5 8 11.5C8.27614 11.5 8.5 11.2761 8.5 11V8Z"
                      fill="#444444"
                    />
                  </svg>
                  <div className="text">
                    채용을 희망하시는 분은 하단의 전화나 이메일로 문의하시기
                    바랍니다.
                  </div>
                </div>
                <div className="top">
                  <div className="badge-row">
                    <div className="badge">
                      {getRecruitStateLabel(userData?.state)}
                    </div>
                    <div className="badge">
                      {getRecruitTypeLabel(
                        userData?.recruitType,
                        userData?.recruitTypeEtc
                      )}
                    </div>
                  </div>
                  <div className="createdAt">
                    {moment(userData?.createdAt).fromNow()}
                  </div>
                </div>
                <div className="top-wrapper">
                  <div className="title-wrapper">
                    <div className="title">{userData?.cafeName}</div>
                    <div className="address">{userData?.place}</div>
                  </div>
                </div>
                <div className="info-list">
                  <div className="item">
                    <img className="icon" src="/image-web/recruit/Money.svg" />
                    <div className="info-wrapper">
                      <div className="title">시급</div>
                      <div className="value">
                        {userData?.hourlyPay?.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                  <div className="item">
                    <img
                      className="icon"
                      src="/image-web/recruit/Schedule.svg"
                    />
                    <div className="info-wrapper">
                      <div className="title">근무 요일 및 시간</div>
                      <div className="value">{userData?.workingDaysTime}</div>
                    </div>
                  </div>
                </div>
              </StoreInfoBox>
              <HorizontalBar />
              <BasicBoxWrapper>
                <div className="title">모집조건</div>
                <div className="list">
                  <div className="item">
                    <div className="title">채용 분야</div>
                    <div className="value">
                      {getRecruitTypeLabel(
                        userData?.recruitType,
                        userData?.recruitTypeEtc
                      )}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">성별</div>
                    <div className="value">
                      {getGenderLabel(userData?.gender)}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">나이제한</div>
                    <div className="value">
                      {userData?.ageLimits.map((age) => age + "대")}
                    </div>
                  </div>
                  <div className="item">
                    <div className="title">복리후생</div>
                    <div className="value">{userData?.benefits || "없음"}</div>
                  </div>
                  <div className="item">
                    <div className="title">연락처</div>
                    <div className="value">{userData?.contactInfo}</div>
                  </div>
                  <div className="item">
                    <div className="title">이메일</div>
                    <div className="value">{userData?.email}</div>
                  </div>
                </div>
              </BasicBoxWrapper>
              <HorizontalBar />
              <BasicBoxWrapper>
                <div className="title">상세내용</div>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: userData?.additionalInfo ?? "",
                  }}
                />
              </BasicBoxWrapper>
              {user && userData?.nickname !== user.nickname && (
                <ReportButtonWrapper>
                  <div
                    className="button"
                    onClick={() => {
                      setReport({
                        title: "해당 공고문을 신고하시겠습니까?",
                        description: "",
                        type: "ABUSIVE",
                        reportType: "job",
                        reportId: params.id ? +params.id : 0,
                        afterReport: () => {
                          history.goBack();
                        },
                      });
                    }}
                  >
                    <img src="/image-web/recruit/report.svg" />
                    <span>채용정보 신고</span>
                  </div>
                </ReportButtonWrapper>
              )}
            </ContentWrapper>
            <HelpWrapper>
              <li>러너러너 가맹점주만 채용 등록이 가능합니다.</li>
              <li>
                각 채용 항목들에 대해서 러너 소프트에 책임과 권한이 없음을
                알려드립니다.
              </li>
            </HelpWrapper>
          </div>
        </RecruitDetailWrapper>
      )}
    </>
  );
}
export default RecruitDetailPage;
