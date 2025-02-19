import styled from "styled-components";
import { InfoBoxWrapper } from "../../../components/common/InfoBoxWrapper";
import { useContext } from "react";
import useDialog from "../../../hooks/useDialog";
import { cafeReports } from "../../../api/cafe";
import { StoreContext } from "./StoreContext";
import { enqueueSnackbar } from "notistack";

const ReportInfoBox = styled(InfoBoxWrapper)`
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;

  > .title-row {
    > .count {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 12px;
      border: 1px solid var(--Purple-300, #6436e7);
      background: var(--Purple-100, #f0eaff);
      color: var(--Purple-300, #6436e7);
      text-align: right;
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      letter-spacing: -0.26px;
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
`;
const ReportButton = styled.div`
  width: 150px;
  height: 42px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  background: rgba(217, 24, 24, 0.1);

  > img {
    width: 24px;
    height: 24px;
  }

  > .title {
    color: #d91818;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.165px;
  }
`;
const ReportInfo = () => {
  const { openDialog } = useDialog();
  const { data } = useContext(StoreContext);

  const handleReport = () => {
    openDialog({
      title: "허위정보 신고",
      type: "prompt",
      text: "펍을 방문했는데 허위로 정보가 기재되어 있거나<br/>잘못 기재된 정보가 있다면 내용을 적어주세요.",
      confirm: true,
      confirmText: "보내기",
      onConfirm: () => {
        const textarea = document.getElementById(
          "prompt-textarea"
        ) as HTMLTextAreaElement;
        const value = textarea.value;

        cafeReports({
          cafeId: data.id,
          info: value,
        })
          .then(() => {
            enqueueSnackbar("허위정보 신고가 완료되었습니다.", {
              variant: "success",
            });
          })
          .catch((e: any) => {
            enqueueSnackbar(e.message, { variant: "error" });
          });
      },
    });
  };
  return (
    <ReportInfoBox>
      <ReportButton onClick={handleReport}>
        <img src="/image-web/store/Siren.svg" />
        <div className="title">허위 정보 신고</div>
      </ReportButton>
    </ReportInfoBox>
  );
};
export default ReportInfo;
