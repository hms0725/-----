import styled from "styled-components";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import LocationSheet from "../../../components/web/LocationSheet";
import { useSetRecoilState } from "recoil";
import { navigationTargetState } from "../../../recoil/store";
import {
  getMajorTournamentDetail,
  getMinorTournamentDetail,
  TournamentScheduleItemInterface,
} from "../../../api/tournament";
import { loadingState } from "../../../recoil/app";
import moment from "moment/moment";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import { openNewWindow } from "../../../utils/common";
import ImageViewerModal from "../../../components/common/ImageViewerModal";

const TournamentDetailWrapper = styled.div<{ scrollLock: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
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

  ${(p) =>
    p.scrollLock
      ? `
      overflow-y: hidden;
  `
      : `
     overflow-y: scroll;
  `};
  @media ${MEDIA_DESKTOP} {
    position: static;
    top: unset;
    left: unset;
    height: unset;
    transform: unset;
    overflow-y: unset;
    max-width: 500px;
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
      display: none;
    }

    > .close {
      cursor: pointer;
      width: 24px;
      height: 24px;
    }

    > .title {
      color: ${(p) => p.theme.color.black400};
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }

  > .inner {
    width: 100%;
    flex-grow: 1;
    overflow-y: scroll;

    > .list {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      padding: 0 16px 56px;
    }
  }
`;
const HorizontalBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${(p) => p.theme.color.black100};
  @media ${MEDIA_DESKTOP} {
    display: none;
  }
`;
const TournamentTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  background: white;

  > .time {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    position: absolute;
    top: 16px;
    padding: 8px 0;
    text-align: center;
    width: calc(100% - 32px);
    color: var(--Black-400, #444);
    left: 50%;
    transform: translateX(-50%);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;
    border-radius: 8px;
    background: var(--Purple-100, #f0eaff);
    @media ${MEDIA_DESKTOP} {
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.32px;
    }
  }

  > .thumbnail {
    width: 100%;
    aspect-ratio: 360/324;
    background: gray;
    object-fit: cover;
    @media ${MEDIA_DESKTOP} {
      width: 500px;
      height: 500px;
      aspect-ratio: 1;
    }
  }

  > .info-wrapper {
    padding: 20px 16px 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 6px;

    > .badge {
      padding: 4px 6px;
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      border-radius: 16.667px;
      border: 1px solid var(--Purple-100, #f0eaff);
      @media ${MEDIA_DESKTOP} {
        color: var(--Purple-300, #6436e7);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }

    > .title {
      margin-top: 2px;
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
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.64px;
      }
    }

    > .store-name {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.26px;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.32px;
      }
    }

    > .date {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: -0.26px;
      @media ${MEDIA_DESKTOP} {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.32px;
      }
    }
  }
`;
const InfoBoxWrapper = styled.div`
  padding: 20px 16px 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;

  > .button-link {
    text-align: center;
    width: 100%;

    cursor: pointer;
    margin-top: 16px;
    padding: 15px;
    border-radius: 8px;
    background: var(--Purple-300, rgba(100, 54, 231, 1));
    color: white;
    font-family: Pretendard;
    font-size: 15px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: -0.16500000655651093px;
    text-align: center;
  }

  > .button-link:active {
    background: var(--Purple-300, rgba(100, 54, 231, 1));
  }

  > .button {
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--Black-100, #f0f0f0);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.28px;

    > img {
      width: 20px;
      height: 20px;
    }
    @media ${MEDIA_DESKTOP} {
      display: none;
    }
  }

  > .title {
    color: var(--Black-400, #444);
    font-family: Pretendard;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    @media ${MEDIA_DESKTOP} {
      color: var(--Black-400, #444);
      font-family: Pretendard;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      letter-spacing: -0.36px;
    }
  }
  > .pc-address-row {
    width: 100%;
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px;
    @media ${MEDIA_DESKTOP} {
      display: flex;
    }
    > .address {
      color: var(--Black-300, #808080);
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 22.4px */
      letter-spacing: -0.32px;
    }
    > .button {
      color: var(--Purple-300, #6436e7);
      font-family: Pretendard;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: -0.28px;
      width: 80px;
      height: 40px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--Purple-100, #f0eaff);
    }
  }
  > #map {
    width: 100%;
    height: 240px;
    @media ${MEDIA_DESKTOP} {
      height: 288px;
      border-radius: 8px;
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
      display: none;
    }

    > .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 4px;

      > img {
        width: 16px;
        height: 16px;
        object-fit: contain;
      }

      > span {
        color: var(--Black-300, #808080);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }

      > .bold {
        color: var(--Black-400, #444);
        font-weight: 600;
      }
    }
  }

  > .tournament-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;

    > .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      > .title {
        color: var(--Black-400, #444);
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: -0.28px;
        @media ${MEDIA_DESKTOP} {
          color: var(--Purple-400, #402295);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          letter-spacing: -0.32px;
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
          color: var(--Purple-300, #6436e7);
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.32px;
        }
      }
    }
  }

  > .extra-info {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    @media ${MEDIA_DESKTOP} {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--Black-100, #f0f0f0);
      height: 168px;
      grid-template-columns: unset;
    }
    > .item {
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--Black-100, #f0f0f0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      @media ${MEDIA_DESKTOP} {
        flex-direction: row;
        padding: 0;
        justify-content: flex-start;
      }

      > .title {
        color: var(--Black-500, #202020);
        text-align: center;
        font-family: Pretendard;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%; /* 18.2px */
        letter-spacing: -0.26px;
        @media ${MEDIA_DESKTOP} {
          color: var(--Black-500, #202020);
          text-align: justify;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 140%; /* 22.4px */
          letter-spacing: -0.32px;
        }
      }

      > .value {
        color: var(--Black-400, #444);
        text-align: center;
        font-family: Pretendard;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 140%; /* 22.4px */
        letter-spacing: -0.32px;
        @media ${MEDIA_DESKTOP} {
          color: var(--Black-400, #444);
          text-align: justify;
          font-family: Pretendard;
          font-size: 16px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.32px;
        }
      }
    }
  }
`;

interface TournamentDetailProps {
  onClose?: () => void;
}

const TournamentDetailPage = ({ onClose }: TournamentDetailProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const params = useParams<{
    id?: string;
    type?: string;
  }>();
  const history = useHistory();
  const [map, setMap] = useState<any>(null);
  const innerLocation = {
    lat: 37.5244536,
    lng: 127.0414906,
  };
  const [tournamentData, setTournamentData] =
    useState<TournamentScheduleItemInterface | null>(null);
  const setNavigationTarget = useSetRecoilState(navigationTargetState);
  const [gameStatus, setGameStatus] = useState("");
  useEffect(() => {
    if (params.id && params.type) {
      let getTournamentDetail;
      if (params.type === "major") {
        getTournamentDetail = getMajorTournamentDetail;
      } else if (params.type === "minor") {
        getTournamentDetail = getMinorTournamentDetail;
      } else {
        history.push("/");
      }
      if (getTournamentDetail) {
        setLoading(true);
        getTournamentDetail({ tournamentId: Number(params.id) })
          .then((res) => {
            setTournamentData(res);
            let innerGameStatus = "";
            if (moment(res.startAt).isAfter(moment())) {
              innerGameStatus = "예정";
            } else if (moment(res.endAt).isBefore(moment())) {
              innerGameStatus = "종료";
            } else {
              innerGameStatus = "진행중";
            }
            setGameStatus(innerGameStatus);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      history.push("/");
    }
  }, [params.id, params.type]);

  const [showSheet, setShowSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  return tournamentData ? (
    <>
      <LocationSheet />
      <TournamentDetailWrapper scrollLock={false}>
        <div className="header">
          <div className="close" onClick={handleClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">토너먼트 상세</div>
        </div>
        <div className="inner">
          <TournamentTitleWrapper>
            <div className="time">
              {moment(tournamentData.endAt).isBefore(moment())
                ? "마감"
                : `마감까지 남은 시간: ${moment(tournamentData.endAt).diff(
                    moment(),
                    "days"
                  )}일 
            ${moment(tournamentData.endAt).diff(moment(), "hours") % 24}시간 
            ${moment(tournamentData.endAt).diff(moment(), "minutes") % 60}분`}
            </div>
            <img
              src={tournamentData.image}
              className="thumbnail"
              onClick={() => setSelectedImage(tournamentData.image)}
            />
            <div className="info-wrapper">
              <div className="badge">{gameStatus}</div>
              <div className="title">{tournamentData.title}</div>
              <div className="store-name">{tournamentData.place}</div>
              <div className="date">
                {moment(tournamentData.startAt).format("YY/MM/DD HH:mm")} ~{" "}
                {moment(tournamentData.endAt).format("YY/MM/DD HH:mm")}
              </div>
            </div>
          </TournamentTitleWrapper>
          {tournamentData?.webUrl && (
            <InfoBoxWrapper>
              <div
                className="button-link"
                onClick={() => {
                  openNewWindow(tournamentData.webUrl!!);
                }}
              >
                토너먼트 정보 보러가기
              </div>
            </InfoBoxWrapper>
          )}
        </div>
        <ImageViewerModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage || ""}
        ></ImageViewerModal>
      </TournamentDetailWrapper>
    </>
  ) : (
    <></>
  );
};

export default TournamentDetailPage;
