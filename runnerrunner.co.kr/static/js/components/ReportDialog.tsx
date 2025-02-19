import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { reportState } from "../recoil/report";
import {
  Report24HourWrapper,
  ReportMainWrapper,
  ReportWrapper,
} from "./style/ReportDialog";
import useDialog from "../hooks/useDialog";
import { reportBoard, reportComment } from "../api/article";
import { useState } from "react";
import { loadingState } from "../recoil/app";
import { reportMarket, reportMarketComment } from "../api/second-hand-market";
import { reportJob } from "../api/job";
import { reportHandBoard, reportHandBoardComment } from "../api/community";

const reportList = [
  { type: "ABUSIVE", value: "욕설" },
  { type: "ADVERTISING", value: "상업적 광고" },
  { type: "OBSCENE", value: "음란물" },
  { type: "VIOLENCE", value: "폭력성" },
  { type: "OTHER", value: "기타" },
];

const ReportDialog = () => {
  const [report, setReport] = useRecoilState(reportState);
  if (!report) return <></>;
  const setLoading = useSetRecoilState(loadingState);
  const { title, type, description, reportId, reportType, afterReport } =
    report;
  const [isComplete, setIsComplete] = useState(false);
  const updateType = (newType: string) => {
    setReport({
      ...report,
      type: newType,
    });
  };

  const handleConfirm = async () => {
    switch (reportType) {
      case "article":
        const article_request = {
          articleId: +reportId,
          type: report.type,
          description: report.description,
        };
        setLoading(true);
        try {
          await reportHandBoard(article_request);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setReport(null);
        }

        break;
      case "article-comment":
        const article_comment_request = {
          commentId: +reportId,
          type: report.type,
          description: report.description,
        };
        setLoading(true);
        try {
          await reportHandBoardComment(article_comment_request);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setReport(null);
        }
        break;

      case "market":
        const market_request = {
          marketId: reportId,
          type: report.type,
          description: report.description,
        };
        setLoading(true);
        try {
          await reportMarket(market_request);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setReport(null);
        }
        break;
      case "market-comment":
        const market_comment_request = {
          commentId: reportId,
          type: report.type,
          description: report.description,
        };
        setLoading(true);
        try {
          await reportMarketComment(market_comment_request);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setReport(null);
        }
        break;
      case "job":
        const job_request = {
          jobId: reportId,
          type: report.type,
          description: report.description,
        };
        setLoading(true);
        try {
          await reportJob(job_request);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          setReport(null);
        }
        break;
      default:
        break;
    }
    setIsComplete(true);
  };
  return (
    <>
      <ReportMainWrapper />
      {isComplete ? (
        <Report24HourWrapper>
          <span>
            신고가 접수되었습니다.
            <br />
            검토까지는 최대 24시간 소요됩니다.
          </span>
          <div
            className="button"
            onClick={() => {
              afterReport();
              setReport(null);
            }}
          >
            확인
          </div>
        </Report24HourWrapper>
      ) : (
        <ReportWrapper>
          <div className="title">{title}</div>
          <div className="description">
            누적 신고횟수가 3회 이상인 유저는 <br />
            게시물 작성을 할 수 없게 됩니다.
          </div>
          <div className="report-list-wrapper">
            {reportList.map((item, index) => (
              <div className="item" onClick={() => updateType(item.type)}>
                <img
                  src={`/image-web/report/${
                    type !== item.type ? "un-" : ""
                  }select.svg`}
                />
                <span>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="input-box">
            <textarea
              placeholder="신고할 내용을 입력해주세요"
              value={description}
              onChange={(e) => {
                setReport({
                  ...report,
                  description: e.target.value,
                });
              }}
            />
          </div>
          <div className="button-wrapper">
            <div
              className="cancel-button"
              onClick={() => {
                setReport(null);
              }}
            >
              취소
            </div>
            <div
              className="report-button"
              onClick={async () => {
                handleConfirm();
              }}
            >
              신고하기
            </div>
          </div>
        </ReportWrapper>
      )}
    </>
  );
};

export default ReportDialog;
