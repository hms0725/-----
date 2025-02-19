import { BoardItemWrapper } from "../style/board-item";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useHistory } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export interface BoardItemProps {
  type: string;
  content: string;
  link: string;
  title: string;
  nickname: string;
  viewCount: number;
  commentCount: number;
  date: string;
  thumbnail?: string;
  isEdited?: boolean;
}

// 게시판 타입별 색상 매핑
const TYPE_COLORS = {
  핸드스토리: "#7950F2", // 보라색
  일상: "#7950F2", // 보라색
  베스트: "#FF9500", // 주황색
  공지: "#2B2E4A", // 진한 회색
  // 다른 타입들 추가 가능
} as const;

type BoardType = keyof typeof TYPE_COLORS;

const BoardItem = ({
  type,
  content,
  link,
  title,
  nickname,
  viewCount,
  commentCount,
  date,
  thumbnail,
  isEdited = false,
}: BoardItemProps) => {
  const formattedDate = dayjs(date).fromNow();
  const bgColor = TYPE_COLORS[type as BoardType] || "#7950F2";
  const history = useHistory();
  const handleClick = () => {
    history.push(link);
  };

  return (
    <BoardItemWrapper onClick={handleClick} $hasThumbnail={!!thumbnail}>
      {thumbnail && (
        <div className="thumbnail">
          <img src={thumbnail} alt="" />
        </div>
      )}
      <div className="content">
        <div className="header">
          <div className="type-badge" style={{ backgroundColor: bgColor }}>
            {type}
          </div>
          <div className="title">{title}</div>
        </div>
        <div className="meta">
          <div className="info">
            <span className="nickname">{nickname}</span>
            <span className="time">
              {formattedDate + " "}
              {isEdited && <span>(수정됨)</span>}
            </span>
          </div>

          <div className="stats">
            <span className="views">
              <EyeIcon />
              {viewCount}
            </span>
            ·
            <span className="comments">
              <CommentIcon />
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </BoardItemWrapper>
  );
};

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M1.5 8.5C1.5 8.5 3.45 4 8 4C12.55 4 14.5 8.5 14.5 8.5C14.5 8.5 12.55 13 8 13C3.45 13 1.5 8.5 1.5 8.5Z"
      stroke="#808080"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 10.4286C9.07695 10.4286 9.95 9.56512 9.95 8.5C9.95 7.43488 9.07695 6.57143 8 6.57143C6.92304 6.57143 6.05 7.43488 6.05 8.5C6.05 9.56512 6.92304 10.4286 8 10.4286Z"
      stroke="#808080"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M13 10.6667C13 10.9614 12.8829 11.244 12.6746 11.4523C12.4662 11.6607 12.1836 11.7778 11.8889 11.7778H5.22222L3 14V5.11111C3 4.81643 3.11706 4.53381 3.32544 4.32544C3.53381 4.11706 3.81643 4 4.11111 4H11.8889C12.1836 4 12.4662 4.11706 12.6746 4.32544C12.8829 4.53381 13 4.81643 13 5.11111V10.6667Z"
      stroke="#808080"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default BoardItem;
