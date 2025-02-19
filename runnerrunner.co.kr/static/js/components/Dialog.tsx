import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { DialogProps, dialogState } from "../recoil/dialog";
import React, { useCallback } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { shareURL } from "../utils/common";
import JoinSecretRoomPopup from "./common/JoinSecretRoomPopup";
import CreateSecretRoomPopup from "./common/CreateSecretRoomPopup";

const Wrapper = styled.div<{ paddingSize: number; type: string | undefined }>`
  width: 100%;
  padding: ${(p) => p.paddingSize}px;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 308px;
  min-height: 202px;
  border-radius: 12px;
  background: #fff;
  border: none;
`;

const WebContent = styled.div`
  flex: 1;
  color: var(--Black-500, #202020);
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 22.4px */
  padding: 24px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  word-break: break-word;
`;

const ButtonWrapper = styled.div<{ reverse?: boolean }>`
  display: flex;
  ${(p) =>
    p.reverse
      ? `
  flex-direction: row-reverse;
  `
      : ``}
  gap: 11px;
`;

const WebButton = styled.div<{
  cancel?: boolean;
  yellow?: boolean;
  confirmColor?: string;
}>`
  flex: 1;
  border-radius: 8px;
  background: var(--Purple-300, #6436e7);
  text-align: center;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.165px;
  ${(p) =>
    p.cancel
      ? `
  background: none;
  color: var(--Purple-300, #6436E7);
  `
      : `
  color: #FFF;
  `};
  padding: 14px;
  transition: all 0.1s linear;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${(p) =>
    p.confirmColor
      ? `
    background: ${p.confirmColor} !important;
  `
      : ``}
  &:hover {
    ${(p) =>
      p.cancel
        ? `
      background: var(--Black-100, #F0F0F0);
    `
        : `
      background: var(--Purple-400, #402295);
      ${
        p.confirmColor
          ? `
        background: ${p.confirmColor} !important;
      `
          : ``
      }
    `};
  }

  &:active {
    ${(p) =>
      p.cancel
        ? `
      background: var(--Black-100, #F0F0F0);
    `
        : `
      background: var(--Purple-400, #402295);
      ${
        p.confirmColor
          ? `
        background: ${p.confirmColor} !important;
      `
          : ``
      }
    `};
  }
`;

const WebPromptWrapper = styled.div`
  padding: 16px 0;

  > .title {
    color: var(--Black-500, #202020);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  > .content {
    margin-top: 24px;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 19.6px */
  }

  > .content.center {
    text-align: center;
  }

  > .phone {
    margin-top: 12px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;

    > img {
      width: 16px;
      height: 16px;
      object-fit: contain;
    }

    color: var(--Black-500, #202020);
    text-align: center;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%; /* 22.4px */
  }

  > textarea {
    margin-top: 12px;
    padding: 10px 12px;
    width: 100%;
    resize: none;
    border-radius: 4px;
    border: 1px solid var(--Black-100, #f0f0f0);
    color: var(--Black-400, #444);
    text-align: left;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    outline: none;

    &::placeholder {
      color: var(--Black-200, #808080);
    }
  }
`;

function Dialog({ dialog }: { dialog: DialogProps }) {
  const handleConfirm = useCallback(() => {
    dialog?.onConfirm && dialog.onConfirm();
  }, [dialog?.onConfirm]);
  const isEndOfTournament = dialog.title === "토너먼트 종료";
  return (
    <Wrapper type={dialog.type} paddingSize={isEndOfTournament ? 8 : 16}>
      {dialog.type === "web_join_secret_room" && (
        <>
          <JoinSecretRoomPopup/>
          <ButtonWrapper reverse={dialog.reverse}>
            {dialog.confirm && (
              <WebButton
                id={dialog.title + ":취소"}
                cancel
                onClick={dialog.onCancel}
              >
                {dialog.cancelText || "취소"}
              </WebButton>
            )}
            <WebButton
              id={dialog.title + ":확인"}
              confirmColor={dialog.confirmColor}
              onClick={handleConfirm}
            >
              {dialog.confirmText || "확인"}
            </WebButton>
          </ButtonWrapper>
        </>
      )}
      {dialog.type === "web_create_secret_room" && (
        <>
          <CreateSecretRoomPopup/>
          <ButtonWrapper reverse={dialog.reverse}>
            {dialog.confirm && (
              <WebButton
                id={dialog.title + ":취소"}
                cancel
                onClick={dialog.onCancel}
              >
                {dialog.cancelText || "취소"}
              </WebButton>
            )}
            <WebButton
              id={dialog.title + ":확인"}
              confirmColor={dialog.confirmColor}
              onClick={handleConfirm}
            >
              {dialog.confirmText || "확인"}
            </WebButton>
          </ButtonWrapper>
        </>
      )}
      {dialog.type === "web" && (
        <>
          <WebContent
            dangerouslySetInnerHTML={{ __html: dialog.text || "" }}
          ></WebContent>
          <ButtonWrapper reverse={dialog.reverse}>
            {dialog.confirm && (
              <WebButton
                id={dialog.title + ":취소"}
                cancel
                onClick={dialog.onCancel}
              >
                {dialog.cancelText || "취소"}
              </WebButton>
            )}
            <WebButton
              id={dialog.title + ":확인"}
              confirmColor={dialog.confirmColor}
              onClick={handleConfirm}
            >
              {dialog.confirmText || "확인"}
            </WebButton>
          </ButtonWrapper>
        </>
      )}
      {dialog.type === "prompt" && (
        <>
          <WebPromptWrapper>
            <div className="title">{dialog.title}</div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: dialog.text || "" }}
            />
            <textarea
              id="prompt-textarea"
              rows={4}
              placeholder="내용을 입력해주세요"
            />
          </WebPromptWrapper>
          <ButtonWrapper reverse={dialog.reverse}>
            {dialog.confirm && (
              <WebButton cancel onClick={dialog.onCancel}>
                {dialog.cancelText || "취소"}
              </WebButton>
            )}
            <WebButton
              confirmColor={dialog.confirmColor}
              onClick={handleConfirm}
            >
              {dialog.confirmText || "확인"}
            </WebButton>
          </ButtonWrapper>
        </>
      )}
      {dialog.type === "call" && (
        <>
          <WebPromptWrapper>
            <div className="title">{dialog.title}</div>
            <div className="phone">
              <img src="/image-web/store/Phone/small.svg" />
              {dialog.phone}
            </div>
            <div
              className="content center"
              dangerouslySetInnerHTML={{ __html: dialog.text || "" }}
            />
          </WebPromptWrapper>
          <ButtonWrapper reverse={dialog.reverse}>
            {dialog.confirm && (
              <WebButton cancel onClick={dialog.onCancel}>
                {dialog.cancelText || "취소"}
              </WebButton>
            )}
            <WebButton
              confirmColor={dialog.confirmColor}
              onClick={handleConfirm}
            >
              {dialog.confirmText || "확인"}
            </WebButton>
          </ButtonWrapper>
        </>
      )}
      {dialog.type === "app-update" && (
        <>
          <WebContent
            dangerouslySetInnerHTML={{ __html: dialog.text || "" }}
          ></WebContent>
          <ButtonWrapper reverse={dialog.reverse}>
            {dialog.confirm && (
              <WebButton
                id={dialog.title + ":취소"}
                cancel
                onClick={dialog.onCancel}
              >
                {dialog.cancelText || "취소"}
              </WebButton>
            )}
            <WebButton
              id={dialog.title + ":확인"}
              confirmColor={dialog.confirmColor}
              onClick={handleConfirm}
            >
              {dialog.confirmText || "확인"}
            </WebButton>
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Dialog;
