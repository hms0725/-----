import styled from "styled-components";
import useScreenOrientation, {
  MEDIA_DESKTOP,
} from "../../../../hooks/useScreenOrientation";
import { useEffect, useRef, useState } from "react";
import useDialog from "../../../../hooks/useDialog";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../../../recoil/auth";
import { loadingState } from "../../../../recoil/app";
import {
  UserJobUpdateParams,
  userJobDelete,
  userJobDetail,
  userJobRegister,
  userJobUpdate,
} from "../../../../api/job";
import { enqueueSnackbar } from "notistack";

const Dim = styled.div`
  @media ${MEDIA_DESKTOP} {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background: #000;
    z-index: 110;
  }
`;
const RegisterRecruitWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  z-index: 12;
  background: white;
  transition: all 0.5s ease-in-out;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  @media ${MEDIA_DESKTOP} {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 111;
    width: 720px;
    max-width: 720px;
    max-height: 80vh;
    border-radius: 12px;
    background: #fff;
    padding: 20px;
    align-items: center;
  }

  ${(p) =>
    p.scrollLock
      ? `
    overflow-y: hidden;
  `
      : `
    overflow-y: scroll;
  `}
  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
    @media ${MEDIA_DESKTOP} {
      padding: 30px 0;
    }

    > .content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 20px 16px 140px;
      gap: 30px;
      @media ${MEDIA_DESKTOP} {
        padding: 0;
      }
    }
  }

  > .floating-button-wrapper {
    background: white;
    position: fixed;
    max-width: 500px;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    padding: 30px 24px 48px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      position: static;
      transform: none;
      inset: unset;
      padding: 0;
      border-top: 1px solid #b7b7b7;
      max-width: unset;
      padding-top: 30px;
    }

    > .button {
      cursor: pointer;
      flex: 1;
      color: #fff;
      text-align: center;
      font-family: Pretendard;
      font-size: 15px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.165px;
      border-radius: 8px;
      text-align: center;
      padding: 15px 0;
      background: var(--Purple-300, #6436e7);
    }

    > .button:active {
      background: #502bb5;
    }

    > .button.delete {
      color: #d91818;
      background: rgba(217, 24, 24, 0.1);
    }
    > .button.change {
      color: #6436e7;
      background: rgba(100, 54, 231, 0.1);
    }
  }

  > .header {
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
    justify-content: space-between;
    padding: 0 20px;
    z-index: 11;
    background: white;
    @media ${MEDIA_DESKTOP} {
      position: static;
      transform: none;
      inset: unset;
      max-width: unset;
      justify-content: center;
      padding-bottom: 30px;
      border-bottom: 2px solid #444;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
      @media ${MEDIA_DESKTOP} {
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }

    > .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      @media ${MEDIA_DESKTOP} {
        position: static;
        transform: none;
        inset: unset;
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    > .button {
      cursor: pointer;
      color: var(--Purple-300, #6436e7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }
  }
`;

const DefaultInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  gap: 16px;
  @media ${MEDIA_DESKTOP} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0;
    padding: 0 60px;
  }

  > .title-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    @media ${MEDIA_DESKTOP} {
      width: 156px;
      height: 47px;
      flex-shrink: 0;
      justify-content: center;
    }

    > .title {
      width: 100%;
      text-align: left;
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
      }
    }

    > .sub-title {
      width: 100%;
      word-break: keep-all;
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.24px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }
  }
`;

const InputBoxWrapper = styled(DefaultInfoWrapper)<{ center?: boolean }>`
  ${(p) =>
    p.center
      ? `
  @media ${MEDIA_DESKTOP} {
    align-items: center;
   
  }
  `
      : ``}
  > textarea {
    min-height: 100px;
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    color: var(--Black-500, #202020);
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    outline: none;
    text-align: left;
    resize: none;
    @media ${MEDIA_DESKTOP} {
      width: 312px;
    }

    &::placeholder {
      color: var(--Black-200, #b7b7b7);
    }
  }

  .input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    padding: 10px 12px;
    position: relative;
    @media ${MEDIA_DESKTOP} {
      width: 312px;
      padding: 15px 12px;
    }

    > .search-list {
      position: absolute;
      left: 0;
      top: 48px;
      width: 100%;
      max-height: 375px;
      overflow: auto;
      padding: 16px 12px;
      border-radius: 8px;
      background: #fff;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      z-index: 3;

      > .item {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 8px;

        > .title {
          color: var(--Black-500, #202020);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;

          > .match {
            color: var(--Purple-300, #6436e7);
          }
        }

        > .address {
          color: var(--Black-300, #808080);
          font-family: Pretendard;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          letter-spacing: -0.24px;
        }
      }

      > .horizontal-bar {
        width: 100%;
        height: 1px;
        background: var(--Black-100, #f0f0f0);
      }
    }

    > input {
      outline: none;
      border: none;
      color: var(--Black-500, #202020);
      text-align: left;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      max-width: 200px;
      @media ${MEDIA_DESKTOP} {
        max-width: 312px;
        width: 312px;
        flex-grow: unset;
        font-size: 14px;
      }
    }

    > .badge {
      cursor: pointer;
      padding: 3px 10px;
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 26px;
      background: var(--Purple-100, #f0eaff);
      width: 63.2px;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }
  }
  > .badge-pc {
    display: none;
    margin-left: 12px;
    flex-shrink: 0;
    width: 120px;
    padding: 15px 12px;
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid var(--Purple-300, #6436e7);
    background: white;
    color: var(--Purple-300, #6436e7);
    text-align: center;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.28px;
    @media ${MEDIA_DESKTOP} {
      display: block;
    }
  }
  .input-wrapper.disabled {
    background: var(--Black-100, #f0f0f0);

    > input {
      color: var(--Black-200, #b7b7b7);
    }
  }

  .checkbox-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
    @media ${MEDIA_DESKTOP} {
      width: 312px;
    }

    > .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      cursor: pointer;

      > span {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > .checkbox {
        > rect {
          transition: all 0.3s;
          fill: white;
          stroke: #b7b7b7;
          width: 19px;
          height: 19px;
          x: 0.5;
          y: 0.5;
        }

        > path {
          transition: all 0.3s;
        }
      }

      > .checkbox.selected {
        > rect {
          fill: #8359f7;
          width: 20px;
          height: 20px;
          x: 0;
          y: 0;
          stroke: none;
        }

        > path {
          stroke: white;
        }
      }
    }
  }

  > .radio-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 20px;
    @media ${MEDIA_DESKTOP} {
      width: 312px;
      gap: 12px;
    }

    > .radio-row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 30px;

      > .item {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;

        > .text {
          color: var(--Black-400, #444);
          font-family: Pretendard;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.28px;
        }

        .border {
          transition: all 0.3s;
          stroke: ${(p) => p.theme.color.black200};
        }

        .inner {
          transition: all 0.3s;
          fill: transparent;
        }
      }

      > .item.selected {
        .border {
          stroke: ${(p) => p.theme.color.purple300};
        }

        .inner {
          fill: ${(p) => p.theme.color.purple300};
        }
      }
    }
  }
  > .subtitle-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    @media ${MEDIA_DESKTOP} {
      gap: 10px;
    }
    > .sub-title {
      display: none;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        display: block;
      }
    }
  }
`;

interface RegisterRecruitProps {
  mode: "write" | "edit";
  update: () => void;
  onClose: () => void;
  recruitId?: number;
}
type GenderType = "MALE" | "FEMALE" | "NO_MATTER";
const RegisterUserRecruit = ({
  mode,
  update,
  recruitId,
  onClose,
}: RegisterRecruitProps) => {
  const orientation = useScreenOrientation();
  const { openDialog } = useDialog();
  const [recruitKindOf, setRecruitKindOf] = useState({
    type: "",
    value: "",
  });

  const [gender, setGender] = useState<GenderType>("NO_MATTER");
  const [age, setAge] = useState<{
    20: boolean;
    30: boolean;
    40: boolean;
  }>({
    20: false,
    30: false,
    40: false,
  });
  const formRef = useRef<HTMLFormElement>(null);
  const user = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const handleRecruitEnd = () => {
    if (!formRef.current) return;
    if (recruitKindOf.type === "") return;
    if (recruitId === undefined || recruitId <= 0) return;

    const ageLimits = [];
    if (age[20]) ageLimits.push(20);
    if (age[30]) ageLimits.push(30);
    if (age[40]) ageLimits.push(40);

    const form = new FormData(formRef.current);
    const data: UserJobUpdateParams = {
      id: recruitId || 0,
      cafeName: (form.get("cafeName") as string) || "",
      ageLimits: ageLimits,
      userId: user ? user.id : 0,
      state: "EMPLOYING",
      gender: gender,
      recruitType: recruitKindOf.type,
      recruitTypeEtc: (form.get("recruitTypeEtc") as string) || "",
      additionalInfo: (form.get("additionalInfo") as string) || "",
      benefits: (form.get("benefits") as string) || "",
      contactInfo: (form.get("contactInfo") as string) || "",
      email: (form.get("email") as string) || "",
      hourlyPay: Number(form.get("hourlyPay") || ""),
      place: (form.get("place") as string) || "",
      workingDaysTime: (form.get("workingDaysTime") as string) || "",
    };

    if (data.recruitType !== "ETC") {
      delete data.recruitTypeEtc;
    }

    data.state = "DONE";

    openDialog({
      type: "web",
      text: "해당 채용 등록 건을<br/>채용 완료 처리하시겠습니까?",
      confirmText: "채용완료",
      onConfirm: () => {
        setLoading(true);
        userJobUpdate(data).finally(() => {
          setLoading(false);
          enqueueSnackbar("채용 완료 처리되었습니다.", { variant: "success" });
          update();
          onClose();
        });
      },
      confirm: true,
    });
  };
  const handleSubmit = () => {
    if (!formRef.current) return;
    if (recruitKindOf.type === "") return;

    const ageLimits = [];
    if (age[20]) ageLimits.push(20);
    if (age[30]) ageLimits.push(30);
    if (age[40]) ageLimits.push(40);
    const form = new FormData(formRef.current);
    const data: UserJobUpdateParams = {
      id: recruitId || 0,
      cafeName: form.get("cafeName") as string,
      ageLimits: ageLimits,
      userId: user ? user.id : 0,
      state: "EMPLOYING",
      gender: gender,
      recruitType: recruitKindOf.type,
      recruitTypeEtc: (form.get("recruitTypeEtc") as string) || "",
      additionalInfo: (form.get("additionalInfo") as string) || "",
      benefits: (form.get("benefits") as string) || "",
      contactInfo: (form.get("contactInfo") as string) || "",
      email: (form.get("email") as string) || "",
      hourlyPay: Number(form.get("hourlyPay") || ""),
      place: (form.get("place") as string) || "",
      workingDaysTime: (form.get("workingDaysTime") as string) || "",
    };

    if (data.recruitType !== "ETC") {
      delete data.recruitTypeEtc;
    }

    let promise;
    if (mode === "edit") {
      if (!data.id) {
        return;
      }
      promise = userJobUpdate(data);
    } else {
      promise = userJobRegister(data);
    }

    setLoading(true);
    promise
      .then(() => {
        update();
        if (mode === "write") {
          enqueueSnackbar("채용정보가 등록되었습니다.", { variant: "success" });
        } else {
          enqueueSnackbar("채용정보가 수정되었습니다.", { variant: "success" });
        }
        onClose();
      })
      .catch((e: any) => {
        enqueueSnackbar(e.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    openDialog({
      title: "삭제하기",
      type: "web",
      text: "해당 채용 등록 건을<br/>삭제하시겠습니까?",
      confirmText: "삭제하기",
      onConfirm: () => {
        if (!recruitId) {
          return;
        }

        setLoading(true);

        userJobDelete(recruitId)
          .then(() => {
            update();
            enqueueSnackbar("채용정보가 삭제되었습니다.", {
              variant: "success",
            });
            onClose();
          })
          .catch((e: any) => {
            enqueueSnackbar(e.message, { variant: "error" });
          })
          .finally(() => {
            setLoading(false);
          });
      },
      confirm: true,
    });
  };

  useEffect(() => {
    if (mode === "edit" && recruitId && recruitId > 0) {
      userJobDetail(recruitId)
        .then((res) => {
          //TODO: 기존 데이터 가져와서 폼에 넣기
          if (formRef && formRef.current) {
            const cafeNameInput = document.getElementById("cafeName");
            if (cafeNameInput) {
              (cafeNameInput as HTMLInputElement).value = res.cafeName;
            }
            const cafeAddressInput = document.getElementById("cafeAddress");
            if (cafeAddressInput) {
              (cafeAddressInput as HTMLInputElement).value = res.place;
            }
            const workingDaysTimeInput = document.querySelector(
              'input[name="workingDaysTime"]'
            );
            if (workingDaysTimeInput) {
              (workingDaysTimeInput as HTMLInputElement).value =
                res.workingDaysTime;
            }

            const hourlyPayInput = document.querySelector(
              'input[name="hourlyPay"]'
            );
            if (hourlyPayInput) {
              (hourlyPayInput as HTMLInputElement).value =
                res.hourlyPay.toString();
            }
            const benefitsInput = document.querySelector(
              'input[name="benefits"]'
            );
            if (benefitsInput) {
              (benefitsInput as HTMLTextAreaElement).value = res.benefits;
            }
            const emailInput = document.querySelector('input[name="email"]');
            if (emailInput) {
              (emailInput as HTMLInputElement).value = res.email;
            }
            const contactInfoInput = document.querySelector(
              'input[name="contactInfo"]'
            );
            if (contactInfoInput) {
              (contactInfoInput as HTMLInputElement).value = res.contactInfo;
            }
            const additionalInfoInput = document.querySelector(
              'textarea[name="additionalInfo"]'
            );
            if (additionalInfoInput) {
              (additionalInfoInput as HTMLTextAreaElement).value =
                res.additionalInfo;
            }

            setGender(res.gender as GenderType);
            setAge({
              20: res.ageLimits.includes(20),
              30: res.ageLimits.includes(30),
              40: res.ageLimits.includes(40),
            });

            setRecruitKindOf({
              type: res.recruitType,
              value: res.recruitTypeEtc || "",
            });
          }
        })
        .catch((e: any) => {
          enqueueSnackbar("채용 정보를 가져오지 못했습니다: " + e.message, {
            variant: "error",
          });
        });
    }
  }, [mode, recruitId, formRef]);
  return (
    <form ref={formRef}>
      <RegisterRecruitWrapper scrollLock={false}>
        <div className="header">
          <div className="close" onClick={onClose}>
            {orientation === "landscape" ? (
              <img src="/image-web/Holdem Now/Icon/Close.svg" alt="close" />
            ) : (
              <img src="/image-web/Icon/Back.svg" alt="close" />
            )}
          </div>
          <div className="title">
            {mode === "edit" ? "채용 수정" : "채용 등록"}
          </div>
          {mode === "edit" && (
            <div className="button" onClick={handleSubmit}>
              수정하기
            </div>
          )}
        </div>
        <div className="horizontal-bar" />
        <div className="inner">
          <div className="content">
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">1. 상호</div>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="cafeName"
                  name="cafeName"
                  placeholder="상호명을 입력해주세요."
                />
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">2. 주소</div>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="place"
                  id="cafeAddress"
                  placeholder="주소를 입력해주세요."
                  autoComplete="off"
                />
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">3. 채용 분야</div>
              </div>
              <div className="radio-wrapper">
                <div className="radio-row">
                  <div
                    className={
                      "item " +
                      (recruitKindOf.type === "DEALER" ? "selected" : "")
                    }
                    onClick={() =>
                      setRecruitKindOf((p) => {
                        return {
                          value: "딜러",
                          type: "DEALER",
                        };
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">딜러</div>
                  </div>
                  <div
                    className={
                      "item " +
                      (recruitKindOf.type === "PRACTICE_DEALER"
                        ? "selected"
                        : "")
                    }
                    onClick={() =>
                      setRecruitKindOf((p) => {
                        return {
                          value: "연습딜러",
                          type: "PRACTICE_DEALER",
                        };
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">연습딜러</div>
                  </div>
                  <div
                    className={
                      "item " +
                      (recruitKindOf.type === "SERVANT" ? "selected" : "")
                    }
                    onClick={() =>
                      setRecruitKindOf((p) => {
                        return {
                          value: "서버",
                          type: "SERVANT",
                        };
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">서버</div>
                  </div>
                </div>
                <div className="radio-row">
                  <div
                    className={
                      "item " + (recruitKindOf.type === "ETC" ? "selected" : "")
                    }
                    onClick={() =>
                      setRecruitKindOf((p) => {
                        return {
                          value: "",
                          type: "ETC",
                        };
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">직접 입력</div>
                  </div>
                </div>
                <div
                  className={
                    "input-wrapper " +
                    (recruitKindOf.type === "ETC" ? "" : "disabled")
                  }
                >
                  <input
                    type="text"
                    name="recruitTypeEtc"
                    placeholder="직접 입력"
                    disabled={recruitKindOf.type !== "ETC"}
                  />
                </div>
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">4. 근무 요일 및 시간</div>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="workingDaysTime"
                  placeholder="근무 요일 및 시간을 입력해주세요."
                />
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper center={true}>
              <div className="title-wrapper">
                <div className="title">5. 성별</div>
              </div>
              <div className="radio-wrapper">
                <div className="radio-row">
                  <div
                    className={
                      "item " + (gender === "NO_MATTER" ? "selected" : "")
                    }
                    onClick={() => setGender("NO_MATTER")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">무관</div>
                  </div>
                  <div
                    className={"item " + (gender === "MALE" ? "selected" : "")}
                    onClick={() => setGender("MALE")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">남성</div>
                  </div>
                  <div
                    className={
                      "item " + (gender === "FEMALE" ? "selected" : "")
                    }
                    onClick={() => setGender("FEMALE")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <circle
                        className="border"
                        cx="10"
                        cy="10"
                        r="9.5"
                        fill="white"
                      />
                      <circle className="inner" cx="10" cy="10" r="6" />
                    </svg>
                    <div className="text">여성</div>
                  </div>
                </div>
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">6. 나이제한</div>
                <div className="sub-title">
                  ※ 선택하지 않는 경우, “무관”으로 표시됩니다.
                </div>
              </div>
              <div className="subtitle-wrapper">
                <div className="checkbox-row">
                  <div
                    className="item"
                    onClick={() =>
                      setAge({
                        20: !age["20"],
                        30: age["30"],
                        40: age["40"],
                      })
                    }
                  >
                    <svg
                      className={"checkbox " + (age["20"] ? "selected" : "")}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <rect width="20" height="20" rx="3" />
                      <path
                        d="M6 10L8.96296 12.5L13.6667 7.5"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>20대</span>
                  </div>
                  <div
                    className="item"
                    onClick={() =>
                      setAge({
                        20: age["20"],
                        30: !age["30"],
                        40: age["40"],
                      })
                    }
                  >
                    <svg
                      className={"checkbox " + (age["30"] ? "selected" : "")}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <rect width="20" height="20" rx="3" />
                      <path
                        d="M6 10L8.96296 12.5L13.6667 7.5"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>30대</span>
                  </div>
                  <div
                    className="item"
                    onClick={() =>
                      setAge({
                        20: age["20"],
                        30: age["30"],
                        40: !age["40"],
                      })
                    }
                  >
                    <svg
                      className={"checkbox " + (age["40"] ? "selected" : "")}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <rect width="20" height="20" rx="3" />
                      <path
                        d="M6 10L8.96296 12.5L13.6667 7.5"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>40대</span>
                  </div>
                </div>
                <div className="sub-title">
                  ※ 선택하지 않는 경우, “무관”으로 표시됩니다.
                </div>
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">7. 시급</div>
                <div className="sub-title">※ 2025년 최저 시급 : 10,030원</div>
              </div>
              <div className="subtitle-wrapper">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="hourlyPay"
                    placeholder="시급을 입력해주세요."
                  />
                </div>
                <div className="sub-title">※ 2025년 최저 시급 : 10,030원</div>
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">8. 복리후생</div>
                <div className="sub-title">
                  ※ 선택 및 입력하지 않는 경우, “없음”으로 표시됩니다.
                </div>
              </div>
              <div className="subtitle-wrapper">
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="benefits"
                    placeholder="복리후생을 입력해주세요."
                  />
                </div>
                <div className="sub-title">
                  ※ 선택 및 입력하지 않는 경우, “없음”으로 표시됩니다.
                </div>
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">9. 연락처</div>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="contactInfo"
                  placeholder="연락처를 입력해주세요."
                />
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">10. 이메일</div>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="email"
                  placeholder="이메일을 입력해주세요."
                />
              </div>
            </InputBoxWrapper>
            <InputBoxWrapper>
              <div className="title-wrapper">
                <div className="title">11. 상세 내용</div>
              </div>
              <textarea
                name="additionalInfo"
                placeholder="불쾌감을 주거나 광고성,음란성 컨텐츠를 포함한 게시물은 제재를 받을 수 있습니다."
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "1px";
                  target.style.height = target.scrollHeight + "px";
                }}
              />
            </InputBoxWrapper>
          </div>
        </div>
        <div className="floating-button-wrapper">
          {mode === "edit" ? (
            <>
              <div className="button delete" onClick={handleDelete}>
                삭제하기
              </div>
              <div className="button" onClick={handleRecruitEnd}>
                채용완료
              </div>
              {orientation === "landscape" ? (
                <div className="button change" onClick={handleSubmit}>
                  수정하기
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="button" onClick={handleSubmit}>
              등록하기
            </div>
          )}
        </div>
      </RegisterRecruitWrapper>
      <Dim />
    </form>
  );
};
export default RegisterUserRecruit;
