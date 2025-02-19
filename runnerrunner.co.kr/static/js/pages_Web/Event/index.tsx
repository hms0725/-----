import styled from "styled-components";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { RunnerEvent, runnerEventList } from "../../../api/event";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import useScreenOrientation, {
  MEDIA_DESKTOP,
} from "../../../hooks/useScreenOrientation";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";

const EventWrapper = styled.div<{
  scrollLock: boolean;
}>`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  height: 100svh;
  overscroll-behavior: none;
  max-height: 100svh;
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
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 1060px;
    max-height: unset;
    padding: 40px 0;
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
    justify-content: flex-start;
    padding: 0 20px;
    z-index: 11;
    background: white;
    gap: 8px;
    @media ${MEDIA_DESKTOP} {
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
      @media ${MEDIA_DESKTOP} {
        display: none;
      }
    }

    > .title {
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }

  > .list {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;
    @media ${MEDIA_DESKTOP} {
      display: none;
    }

    > .inner {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      padding: 0 16px 56px;

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }

      > .item-list {
        &:first-child {
          margin-top: 20px;
        }

        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 12px;
      }
    }
  }
`;

const EventItemWrapper = styled.div<{
  ended: boolean;
}>`
  cursor: pointer;
  width: 100%;
  aspect-ratio: 328/132;
  border-radius: 8px;
  padding: 20px;
  position: relative;

  ${(p) =>
    p.ended
      ? `
    opacity: 0.5;
  `
      : `
  
  `}
  > .thumbnail {
    width: 100%;
    height: 100%;
    background: #1e1e1e;
    border-radius: 12px;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  > .title {
    color: #fff;
    font-family: "yg-jalnan";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.4px;
  }

  > .date {
    margin-top: 6px;
    color: #fff;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.28px;
  }
`;
const HorizontalBar = styled.div`
  width: 100%;
  height: 1px;
  background: var(--Black-200, #b7b7b7);
`;

const PCEventWrapper = styled.div`
  width: 100%;
  display: none;
  @media ${MEDIA_DESKTOP} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  > .menu-wrapper {
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;
    > .item {
      position: relative;
      cursor: pointer;
      color: var(--Black-200, #b7b7b7);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    > .item.selected {
      color: #444;
      > .line {
        position: absolute;
        bottom: -18px;
        width: 100%;
        height: 2px;
        background: #444;
      }
    }
  }
  > .list {
    margin-top: 30px;
    width: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
`;

interface EventPageProps {
  onClose?: () => void;
}

const EventPage = ({ onClose }: EventPageProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const orientation = useScreenOrientation();
  const history = useHistory();
  const [ongoingEvents, setOngoingEvents] = useState<RunnerEvent[]>([]);
  const [endedEvents, setEndedEvents] = useState<RunnerEvent[]>([]);
  const [selectedEventList, setSelectedEventList] = useState<
    "전체" | "진행중" | "종료"
  >("전체");
  const [pcEventList, setPcEventList] = useState<RunnerEvent[]>([]);

  useEffect(() => {
    setLoading(true);
    if (selectedEventList === "전체") {
      runnerEventList({ endYn: "N", type: "EVENT" })
        .then((list) => {
          setOngoingEvents(list);
          setPcEventList(list);
        })
        .catch((e: any) => {
          enqueueSnackbar(e.message, { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (selectedEventList === "진행중") {
      runnerEventList({ endYn: "N", type: "EVENT" })
        .then((list) => {
          setPcEventList(list);
        })
        .catch((e: any) => {
          enqueueSnackbar(e.message, { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (selectedEventList === "종료") {
      runnerEventList({ endYn: "Y", type: "EVENT" })
        .then((list) => {
          setPcEventList(list);
        })
        .catch((e: any) => {
          enqueueSnackbar(e.message, { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedEventList]);
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      if (history.length > 1) {
        history.goBack();
      } else {
        history.push("/");
      }
    }
  };
  return (
    <>
      <EventWrapper scrollLock={false}>
        <div className="header">
          <div className="close" onClick={handleClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">
            {orientation === "landscape" ? "이벤트" : "이벤트 전체보기"}
          </div>
        </div>
        <div className="list">
          <div className="inner">
            <div className="item-list">
              {ongoingEvents.map((item, index) => {
                return (
                  <EventItemWrapper
                    key={index}
                    ended={false}
                    onClick={() => {
                      history.push(`/event/detail/${item.id}`);
                    }}
                  >
                    <div className="thumbnail">
                      {item.url && <img src={item.url} />}
                    </div>
                  </EventItemWrapper>
                );
              })}
            </div>
          </div>
        </div>
        <PCEventWrapper>
          <div className="menu-wrapper">
            {["전체", "진행중", "종료"].map((x) => {
              return (
                <div
                  className={`item ${
                    x === selectedEventList ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedEventList(x as any);
                  }}
                >
                  {x}
                  <div className="line" />
                </div>
              );
            })}
          </div>
          <div className="list">
            {pcEventList.map((item, index) => {
              return (
                <EventItemWrapper
                  key={index}
                  ended={false}
                  onClick={() => {
                    history.push(`/event/detail/${item.id}`);
                  }}
                >
                  <div className="thumbnail">
                    {item.url && <img src={item.url} />}
                  </div>
                </EventItemWrapper>
              );
            })}
          </div>
        </PCEventWrapper>
      </EventWrapper>
    </>
  );
};

export default EventPage;
