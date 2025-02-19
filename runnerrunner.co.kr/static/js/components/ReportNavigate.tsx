import { useState } from "react";
import {
  ReportNavigateWrapper,
  ReportNavigationOverlay,
  ReportPopupWrapper,
} from "./style/ReportNavigate";
import { useHistory } from "react-router-dom";

export interface ReportNavigateProps {
  blockTitle: string;
  block: any;
  report: any;
  setClose: any;
  blockUserId: number;
}

export const ReportNavigate = ({
  blockTitle,
  block,
  report,
  setClose,
  blockUserId,
}: ReportNavigateProps) => {
  const [step, setStep] = useState("navigate");
  const history = useHistory();
  return (
    <>
      <ReportNavigationOverlay />
      {step === "navigate" && (
        <ReportNavigateWrapper>
          <div
            className="button block"
            onClick={() => {
              setStep("block");
            }}
          >
            작성자 차단하기
          </div>
          <div
            className="button report"
            onClick={() => {
              report();
              setClose();
            }}
          >
            신고하기
          </div>
          <div
            className="button close"
            onClick={() => {
              setClose();
            }}
          >
            닫기
          </div>
        </ReportNavigateWrapper>
      )}
      {step === "block" && (
        <ReportPopupWrapper>
          <span>
            작성자를
            <br /> 차단 하시겠습니까?
          </span>
          <div className="button-wrapper">
            <div className="button cancel" onClick={() => setClose()}>
              취소
            </div>
            <div
              className="button red"
              onClick={async () => {
                await block(blockUserId);
                setStep("complete");
              }}
            >
              차단
            </div>
          </div>
        </ReportPopupWrapper>
      )}
      {step === "complete" && (
        <ReportPopupWrapper>
          <span>
            작성자를
            <br /> 차단했습니다.
          </span>
          <div className="button-wrapper">
            <div
              className="button red"
              onClick={async () => {
                history.goBack();
              }}
            >
              확인
            </div>
          </div>
        </ReportPopupWrapper>
      )}
    </>
  );
};
