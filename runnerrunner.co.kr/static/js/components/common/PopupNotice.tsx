import styled from "styled-components";
import { PopupNoticeData } from "../../api/notice";
import { MEDIA_DESKTOP } from "../../hooks/useScreenOrientation";
import { useHistory } from "react-router-dom";
import { openNewWindow } from "../../utils/common";

const PopupNoticeWrapper = styled.div`
  > .dim {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background: #000;
    z-index: 110;
  }
  > .wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    @media ${MEDIA_DESKTOP} {
      width: 500px;
    }
    > .image-mobile {
      cursor: pointer;
      width: 300px;
      border-radius: 16px;
      object-fit: cover;
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }
    > .image-pc {
      display: none;
      cursor: pointer;
      width: 500px;
      border-radius: 16px;
      object-fit: cover;
      @media ${MEDIA_DESKTOP} {
        display: block;
      }
    }
    > .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      > .item {
        cursor: pointer;
        color: #fff;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.65px;
        @media ${MEDIA_DESKTOP} {
          font-size: 16px;
        }
      }
    }
  }
`;
interface PopupNoticeProps {
  data: PopupNoticeData;
  onClose: () => void;
}
const PopupNotice = ({ data, onClose }: PopupNoticeProps) => {
  const history = useHistory();
  return (
    <PopupNoticeWrapper>
      <div className="dim" />
      <div className="wrapper">
        <img
          className="image-mobile"
          onClick={() => {
            if (data.appUrl.includes("http")) {
              openNewWindow(data.appUrl);
            } else {
              history.push(data.appUrl);
            }
          }}
          src={data.appImage}
          alt="popup"
        />
        <img
          className="image-pc"
          src={data.webImage}
          alt="popup"
          onClick={() => {
            if (data.webUrl.includes("http")) {
              openNewWindow(data.webUrl);
            } else {
              history.push(data.webUrl);
            }
          }}
        />
        <div className="row">
          <span
            id={`popup_notice_${data.id}안보기`}
            className="item"
            onClick={() => {
              localStorage.setItem(
                `popup_notice_${data.id}`,
                new Date().toISOString()
              );
              onClose();
            }}
          >
            오늘 하루 보지 않기
          </span>
          <span
            id={`popup_notice_${data.id}닫기`}
            className="item"
            onClick={() => {
              onClose();
            }}
          >
            닫기
          </span>
        </div>
      </div>
    </PopupNoticeWrapper>
  );
};
export default PopupNotice;
