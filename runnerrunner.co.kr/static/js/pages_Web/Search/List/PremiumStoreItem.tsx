import {
  PremiumStoreCircle,
  PremiumStoreInfoBottomWrapper,
  PremiumStoreInfoTopWrapper,
  PremiumStoreInfoWrapper,
  PremiumStoreTournamentInfoWrapper,
} from "../Style/PremiumStoreStyle";
import { useSearchContext } from "../Hook/SearchContext";
import { Cafe, TimerInfoState } from "../../../../api/types";
import { getDistanceKm } from "../../../../utils/common";
import { calculateTimes } from "../../../../utils/timer";
import { useEffect, useState } from "react";
import { useUI } from "../Hook/UIContext";
import { useRecoilValue } from "recoil";
import { geoCoordState } from "../../../../recoil/geo";
interface PremiumStoreItemProps {
  item: Cafe;
}

export const PremiumStoreItem: React.FC<PremiumStoreItemProps> = ({ item }) => {
  const { showStoreList } = useUI();
  const { latitude, longitude } = useRecoilValue(geoCoordState);
  const { history, handleMoreOption, currentTime } = useSearchContext();
  const [timer, setTimer] = useState<TimerInfoState | null>(null);
  const handleMoreOptions = (e: React.MouseEvent) => {
    handleMoreOption(item);
    e.stopPropagation(); // 이벤트 버블링 방지
  };
  const radius = 28.5;
  const circumference = 2 * Math.PI * radius;
  useEffect(() => {
    if (!item.pubTournamentList) return;
    if (item.pubTournamentList.length < 1) return;
    if (!item.pubTournamentList[0].timerDto) return;
    setTimer(
      calculateTimes(
        item.pubTournamentList[0].timerDto!,
        item.pubTournamentList[0].structure
      )
    );
  }, [currentTime]);

  return (
    <PremiumStoreInfoWrapper
      onClick={() => {
        if (showStoreList) {
          history.push(`/store/${item.id}?type=PREMIUM`);
        }
      }}
    >
      <div className="thumbnail">
        <img
          alt="cover"
          className="cover"
          src={
            item?.images[0]
              ? item.images[0].imageUrl
              : "https://dfesoodpx4jgd.cloudfront.net/cafe/default.png"
          }
        />
      </div>
      <PremiumStoreInfoTopWrapper>
        <div className="info">
          <div className="title-row">
            <div className="name">{item.cafeName} </div>
            <img
              src="/image-web/search/Icon/more.svg"
              alt="more"
              onClick={handleMoreOptions}
            />
          </div>
          <div className="review-box">
            <img
              alt="premium mark"
              className="premium"
              src="/image-web/store/premium.png"
            />
            <div className="review-score">
              {item.score && (item.score === 0 ? 0 : item.score.toFixed(1))}
            </div>
            <div className="review-count">{`리뷰 ${item.reviewCount}`}</div>
          </div>
        </div>
      </PremiumStoreInfoTopWrapper>
      <PremiumStoreInfoBottomWrapper>
        {!timer && <div className="state">게임준비중</div>}
        {timer && <div className="state">현재진행중</div>}
        <div className="info">
          <div className="address">
            {item.newAddress} {item.detailAddress}
          </div>
          <div className="info-row">
            <div className="item">
              <img
                alt="icon"
                className="icon"
                src="/image-web/Icon/Heart/small-white.svg"
              />
              <span className="text">{item.likeCount}</span>
            </div>
            <div className="item">
              <img
                alt="icon"
                className="icon"
                src="/image-web/Icon/Map%20pin/small-white.svg"
              />
              <span className="text">
                {getDistanceKm(latitude, longitude, item.lat, item.lon)} km
              </span>
            </div>
          </div>
        </div>
        <PremiumStoreTournamentInfoWrapper isIng={timer ? true : false}>
          {timer && (
            <PremiumStoreCircle>
              <circle className="background" r={28.5} cx="28.5" cy="28.5" />
              <circle
                className="progress"
                r={28.5}
                cx="28.5"
                cy="28.5"
                stroke="url(#gradient)"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={
                  timer.currentLevel && timer.progress
                    ? (circumference * (100 - timer.progress)) / 100
                    : 0
                }
              />
              <defs>
                <radialGradient
                  id="gradient"
                  cx="-50%"
                  cy="50%"
                  r="100%"
                  fx="-25%"
                  fy="50%"
                >
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#7012CE" />
                </radialGradient>
              </defs>
            </PremiumStoreCircle>
          )}
          {timer &&
            (timer.currentLevel.type === "LEVEL" ? (
              <div className="timer-info">
                <div className="lv"> {`${timer.currentLevel.level}LV`}</div>
                <div className="time">{timer.remainingTimeInCurrentLevel}</div>
              </div>
            ) : (
              <div className="timer-info">
                <div className="lv"> {`BREAK`}</div>
                <div className="time">{timer.remainingTimeInCurrentLevel}</div>
              </div>
            ))}
          {!timer && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="57"
                height="57"
                viewBox="0 0 57 57"
                fill="none"
              >
                <path
                  d="M28.5 57C12.7599 57 -1.9338e-06 44.2401 -1.24577e-06 28.5C-5.57752e-07 12.7599 12.7599 -1.9338e-06 28.5 -1.24577e-06C44.2401 -5.57752e-07 57 12.7599 57 28.5C57 44.2401 44.2401 57 28.5 57ZM28.5 4.56C15.2783 4.56 4.56 15.2783 4.56 28.5C4.56 41.7217 15.2783 52.44 28.5 52.44C41.7217 52.44 52.44 41.7217 52.44 28.5C52.44 15.2783 41.7217 4.56 28.5 4.56Z"
                  fill={`url(#paint0_radial_${item.id})`}
                />
                <defs>
                  <radialGradient
                    id={`paint0_radial_${item.id}`}
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(49.1625 81.225) rotate(-137.231) scale(77.6462)"
                    spreadMethod="pad"
                  >
                    <stop offset="0" stopColor="white" stopOpacity="1" />
                    <stop offset="1" stopColor="#7D7D7D" stopOpacity="1" />
                  </radialGradient>
                </defs>
              </svg>
              <span>OFF</span>
            </>
          )}
        </PremiumStoreTournamentInfoWrapper>
      </PremiumStoreInfoBottomWrapper>
    </PremiumStoreInfoWrapper>
  );
};
