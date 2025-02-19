import styled from "styled-components";
import WebSnackbar from "./components/web/WebSnackbar";
import ModalContainer from "./components/common/ModalContainer";
import Dialog from "./components/Dialog";
import Loading from "./components/Loading";
import { SnackbarProvider } from "notistack";
import useDialog from "./hooks/useDialog";
import { useRecoilValue } from "recoil";
import { loadingState } from "./recoil/app";
import useUserInfo from "./hooks/useUserInfo";
import { MEDIA_DESKTOP } from "./hooks/useScreenOrientation";
import Web from "./pages/Web";
import React from "react";
import { reportState } from "./recoil/report";
import ReportDialog from "./components/ReportDialog";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: var(--Black-500, #202020);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  > .inner {
    width: 100%;
    max-width: 500px;
    height: 100svh;
    max-height: 100svh;
    overscroll-behavior: none;
    overflow: hidden;
    background: #fff;
    @media ${MEDIA_DESKTOP} {
      max-width: unset;
      overflow: unset;
      max-height: unset;
    }
  }
`;

function Container() {
  const { dialogs } = useDialog();
  const loading = useRecoilValue(loadingState);
  const report = useRecoilValue(reportState);
  useUserInfo();

  return (
    <>
      <Wrapper>
        <div className="inner">
          <Web />
          {dialogs.map((dialog) => (
            <ModalContainer
              key={dialog.id}
              show={dialog.visibility}
              onBackdropClick={dialog.onBackdropClick}
              type={dialog.type}
              confirm={dialog.confirm}
            >
              <Dialog dialog={dialog} />
            </ModalContainer>
          ))}
          {loading && <Loading full />}
        </div>
      </Wrapper>
      <SnackbarProvider
        maxSnack={1}
        Components={{
          success: WebSnackbar,
          error: WebSnackbar,
          info: WebSnackbar,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={2000}
      ></SnackbarProvider>
      {report && <ReportDialog />}
    </>
  );
}

export default Container;
