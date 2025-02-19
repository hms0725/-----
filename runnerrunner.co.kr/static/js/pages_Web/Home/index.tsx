import styled, { keyframes } from "styled-components";

import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useGeoLocation from "../../../hooks/useGeoLocation";
import { dashboard, DashboardResponse } from "../../../api/dashboard";
import { enqueueSnackbar } from "notistack";
import { openNewWindow } from "../../../utils/common";
import { MEDIA_DESKTOP } from "../../../hooks/useScreenOrientation";
import useDialog from "../../../hooks/useDialog";
import { Autoplay } from "swiper/modules";
import { getPopupNoticeList, PopupNoticeData } from "../../../api/notice";
import PopupNotice from "../../../components/common/PopupNotice";
import {
  clearCredential,
  LOCAL_STORAGE_ACCESS_KEY,
} from "../../../utils/network";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../../recoil/auth";
import useNativeApp, { isApp } from "../../../hooks/useNativeApp";
import { getAppUpdate } from "../../../api/app-update";
import { scheduleState } from "../../../recoil/schedule";
import { pushRegister } from "../../../api/push";
import ImageContainer from "../../../components/common/ImageContainer";
import GameLoading from "./GameLoading";
import { usePubSearch } from "../Search/Hook/usePubSearch";
import useCities from "../../../hooks/useCities";
import ChangeForKakao from "../../../components/changeForKakao";
import useUserInfo from "../../../hooks/useUserInfo";

const MainWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;

  > .inner {
    width: 100%;
    @media ${MEDIA_DESKTOP} {
      max-width: 1060px;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .banner_title {
      z-index: 999;
      position: absolute;
      bottom: 51px;
      left: 16px;
      display: flex;
      flex-direction: column;
      .title {
        color: #fff;

        font-family: Pretendard;
        font-size: 24px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: -0.48px;
      }
      .description {
        color: #fff;
        margin-top: 10px;
        font-family: Pretendard;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -0.28px;
      }
    }
    .progress-dots {
      z-index: 100;
      position: absolute;
      bottom: 24px;
      left: 16px;
      display: flex;
      gap: 9px;
    }
    .dot {
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 10.5px;
      transition: all 0.4s ease;
    }

    .dot.active {
      border-radius: 10.5px;
      width: 31px;
      background: var(--Purple-300, #6436e7);
      transition: all 0.4s ease;
    }
    .banner-swiper-wrapper {
      width: 100%;
      position: relative;
    }
    .banner-swiper {
      width: 100%;
    }
  }
`;

const BannerWrapper = styled.div<{ bg?: string }>`
  width: 100%;

  .banner {
    position: relative;
    width: 100%;
  }

  .banner img {
    width: 100%;
  }

  .banner::after {
    content: "";
    position: absolute;
    top: 5px;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 70.38%,
      #fff 98.41%
    );
    pointer-events: none;
  }
`;
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const TournamentWrapper = styled.div`
  width: 100%;
  height: 200px;
  padding: 0 20px;
  position: relative;
  > img {
    width: 100%;
  }
  .tournament-back {
    height: 100%;
  }
  > .gtd {
    position: absolute;
    display: flex;
    left: 36px;
    top: 6px;
    font-family: Vina Sans;
    font-size: 45px;
    font-weight: 400;
    line-height: 40px;
    letter-spacing: -0.02em;
    text-align: left;

    background: linear-gradient(
      93deg,
      #9f6927 0%,
      #e2a433 14.57%,
      #e9ae38 27.26%,
      #fff9c8 47.01%,
      #f8c145 70.51%,
      #8c7e00 94.01%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  > .title {
    position: absolute;
    left: 36px;
    top: 48px;
    text-align: left;

    background: linear-gradient(
      94deg,
      #fff59f 0.63%,
      #ffe500 46.78%,
      #fff9c8 72.04%,
      #fbec64 97.78%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 800;
    line-height: 25px;
    letter-spacing: -0.3px;
  }

  > .description {
    position: absolute;
    left: 36px;
    bottom: 70px;
    display: flex;
    flex-direction: column;
    color: #fff;

    font-family: Pretendard;
    font-size: 12px;
    font-weight: 700;
    line-height: 14.32px;
    letter-spacing: -0.02em;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
  > .trophy {
    position: absolute;
    width: 145px;
    height: 178px;
    right: 6px;
    bottom: 15px;
    animation: ${float} 1.5s ease-in-out infinite;
  }

  > .button {
    position: absolute;
    left: 36px;
    bottom: 17px;
    display: flex;
    flex-direction: row;
    width: 183px;
    height: 44px;
    padding: 15px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background: var(--Purple-300, #6436e7);
    color: #fff;
    text-align: center;
    font-family: Pretendard;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -0.165px;
  }
`;
const HotKeyMenuWrapper = styled.div`
  width: 100%;
  padding: 16px 0px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .menus {
    padding: 0 16px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 12px;
    justify-items: center;
    justify-content: center;

    > .item {
      width: 80px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: background-color 0.2s ease-in-out;
      position: relative;
      transition: transform 0.1s ease;

      &:active {
        transform: scale(0.95);
      }

      > .background {
        width: 65px;
        height: 65px;
        border-radius: 17px;
        background: rgba(211, 211, 211, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        > .icon {
          width: 45px;
          height: 45px;
          object-fit: contain;
        }
      }

      > .title {
        pointer-events: none;
        margin-top: 6px;
        color: #000;

        text-align: center;
        font-family: Pretendard;
        font-size: 12px;
        font-style: normal;
        font-weight: 800;
        line-height: normal;
      }

      > .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 80%;
        // background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        border: none;
        font-size: 15px;

        > .ribbon {
          border-radius: 5px;
          width: 75%;
          height: 18px;
          background: red;
          color: white;
          text-align: center;
        }
      }
    }
  }
`;

const SkeletonBanner = styled.div`
  width: 100%;
  padding-top: 70.56%; // Maintains 360:254 aspect ratio
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const Home = () => {
  const { openDialog } = useDialog();
  const history = useHistory();
  const [currenBannerIndex, setCurrentBannerIndex] = useState(0);
  const [dashboardData, setDashboardData] = useState<DashboardResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const { latitude, longitude } = useGeoLocation();
  const [popupNoticeData, setPopupNoticeData] = useState<PopupNoticeData[]>([]);
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const user = useRecoilValue(userState);
  const { setUser } = useUserInfo();
  const { sendMessageToNative } = useNativeApp();
  const setSchedule = useSetRecoilState(scheduleState);
  const [gameLoading, setGameLoading] = useState(false);
  const { handleFirstSearch, handleSearch, searchResults } = usePubSearch();
  const { cities, findClosestCity } = useCities();

  const isAdult = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age >= 18;
  };
  const compareVersions = (
    currentVersion: string,
    latestVersion: string
  ): boolean => {
    const versionTuple = (version: string): number[] => {
      return version.split(".").map((num) => parseInt(num, 10));
    };

    const currentVersionTuple = versionTuple(currentVersion);
    const latestVersionTuple = versionTuple(latestVersion);

    for (
      let i = 0;
      i < Math.max(currentVersionTuple.length, latestVersionTuple.length);
      i++
    ) {
      const current = currentVersionTuple[i] || 0;
      const latest = latestVersionTuple[i] || 0;

      if (current < latest) {
        return true;
      } else if (current > latest) {
        return false;
      }
    }

    return false; // Versions are the same
  };

  const appCheck = () => {
    sendMessageToNative("basicInfo", "basicInfoCallback", {}).then(
      async (res: any) => {
        if (!res) {
          return;
        }
        const updateData = await getAppUpdate();
        const androidRequired = updateData.find((e) => e.os === "android");
        const iosRequired = updateData.find((e) => e.os === "ios");
        if (res.os === "android" && androidRequired) {
          const valid = compareVersions(res.version, androidRequired?.version);
          if (valid) {
            openDialog({
              title: "앱 업데이트",
              text: "최신 버전으로 업데이트를 해주세요",
              confirm: !androidRequired.update,
              confirmText: "업데이트",
              type: "app-update",
              disableAutoClose: androidRequired.update,
              onConfirm: () => {
                const url = `https://play.google.com/store/apps/details?id=${androidRequired.appId}`;
                openNewWindow(url);
              },
            });
          }
        } else {
          if (!iosRequired) {
            return;
          }
          const valid = compareVersions(res.version, iosRequired.version);
          if (valid) {
            openDialog({
              title: "앱 업데이트",
              text: "최신 버전으로 업데이트를 해주세요",
              confirm: !iosRequired.update,
              confirmText: "업데이트",
              type: "app-update",
              disableAutoClose: iosRequired.update,
              onConfirm: () => {
                const url = `https://apps.apple.com/app/${iosRequired.appId}`;
                openNewWindow(url);
              },
            });
          }
        }
      }
    );
  };

  const getPushInfo = () => {
    sendMessageToNative("getPushInfo", "setPushInfo", {}).then(
      async (res: any) => {
        if (!res) {
          return;
        }
        console.log(res);
        res.userId = user?.id;
        res.isAllowRequired = res.pushYn;
        res.lat = latitude;
        res.lon = longitude;

        pushRegister(res).then((regRes) => console.log(regRes));
      }
    );
  };

  const searchCheck = useCallback(() => {
    if (searchResults.length < 1) {
      const closestCity = findClosestCity(latitude, longitude);
      if (closestCity) {
        handleFirstSearch(closestCity.provinceId!!, closestCity.id).catch(
          (e) => {
            console.error("Error in initial search:", e);
          }
        );
      } else {
        handleSearch({ lat: latitude, lon: longitude, km: 10 }).catch((e) => {
          console.error("Error in initial search:", e);
        });
      }
    }
  }, [
    findClosestCity,
    handleFirstSearch,
    handleSearch,
    latitude,
    longitude,
    searchResults.length,
  ]);
  useEffect(() => {
    if (latitude !== 37.496486063) {
      getPushInfo();
    }
  }, [latitude]);
  useEffect(() => {
    if (isApp) {
      appCheck();
    }

    getPopupNoticeList().then((res) => {
      const filteredData = res.filter((x) => {
        //localStorage.setItem(`popup_notice_${data.id}`, new Date().toISOString());
        //위 코드는 오늘하루 보지 않기 처리
        //오늘 하루 보지않기 처리된것들 제외
        const prevData = localStorage.getItem(`popup_notice_${x.id}`);
        if (!prevData) {
          return true;
        } else {
          const prevDate = new Date(prevData);
          const now = new Date();
          return now.getDate() !== prevDate.getDate();
        }
      });
      setPopupNoticeData(filteredData);
    });
  }, []);

  useEffect(() => {
    searchCheck();
  }, [cities, searchCheck]);

  useEffect(() => {
    setIsLoading(true);
    dashboard()
      .then((res) => {
        setDashboardData(res);
        setIsLoading(false);
      })
      .catch((e) => {
        enqueueSnackbar("데이터를 불러올 수 없습니다: " + e.message, {
          variant: "error",
        });
        setIsLoading(false);
      });
  }, [latitude, longitude]);

  const [isKakao, setIsKakao] = useState(false);

  const isKakaoUser = () => {
    if (!user) return;
    if (user.kakaoId && user.textId.includes("@")) {
      setIsKakao(true);
    }
  };

  useEffect(() => {
    isKakaoUser();
  }, [user]);

  return (
    <MainWrapper>
      {popupNoticeData.length > 0 && (
        <PopupNotice
          data={popupNoticeData[0]}
          onClose={() => {
            setPopupNoticeData(popupNoticeData.slice(1));
          }}
        />
      )}
      {gameLoading && <GameLoading></GameLoading>}
      <div className="inner">
        <div className="banner-swiper-wrapper">
          {isLoading ? (
            <SkeletonBanner />
          ) : dashboardData ? (
            <Swiper
              className="banner-swiper"
              onRealIndexChange={(swiper: any) =>
                setCurrentBannerIndex(swiper.realIndex || 0)
              }
              loop={
                dashboardData?.runnerEventBanner &&
                dashboardData?.runnerEventBanner.length > 1
              }
              autoplay={{ delay: 4000 }}
              modules={[Autoplay]}
            >
              {dashboardData?.runnerEventBanner.map((item, i) => (
                <SwiperSlide key={i}>
                  <BannerWrapper
                    onClick={() => {
                      if (item.description.includes("http")) {
                        openNewWindow(item.description);
                      } else {
                        history.push(item.description);
                      }
                    }}
                    bg={item.backgroundColor}
                  >
                    <div className="banner">
                      <ImageContainer
                        ratio={360 / 210}
                        alt="배너"
                        src={item.url}
                      />
                    </div>
                  </BannerWrapper>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
          <div className="progress-dots">
            {dashboardData?.runnerEventBanner.map((_, i) => (
              <div
                key={i}
                className={`dot ${currenBannerIndex === i ? "active" : ""}`}
              />
            ))}
          </div>
        </div>

        <HotKeyMenuWrapper>
          <div className="menus">
            {[
              {
                icon: "/image-web/Hot_Icon/홀덤펍찾기.svg",
                title: "홀덤펍 찾기",
                onClick: () => history.push("/search"),
                process: true,
              },

              {
                icon: "/image-web/Hot_Icon/토너먼트 뉴스.svg",
                title: "토너먼트 소식",
                onClick: () => {
                  setSchedule(0);
                  history.push("/news");
                },
              },
              {
                icon: "/image-web/Hot_Icon/커뮤니티.svg",
                title: "커뮤니티",
                onClick: () => history.push("/community/hand-board/all"),
                process: true,
              },
              {
                icon: "/image-web/Hot_Icon/진행중이벤트.svg",
                title: "이벤트",
                onClick: () => history.push("/event/list"),
                process: true,
              },
              {
                icon: "/image-web/Hot_Icon/러튜브.svg",
                title: "러튜브",
                onClick: () => history.push("/youtube"),
                process: true,
              },
              {
                icon: "/image-web/Hot_Icon/지역별오픈채팅.svg",
                title: "지역별\n오픈채팅",
                onClick: () => history.push("/openChat"),
                process: true,
              },
              {
                icon: "/image-web/Hot_Icon/홀덤 계산기.svg",
                title: "홀덤 계산기",
                onClick: () => history.push("/calc"),
                process: true,
              },
              {
                icon: "/image-web/Hot_Icon/홀덤가이드.svg",
                title: "홀덤 가이드",
                onClick: () => history.push("/holdem/guide"),
                process: true,
              },
            ].map((item, index) => (
              <div
                className="item"
                key={index}
                onClick={item.onClick}
                id={item.title}
              >
                <div className="background">
                  <img src={item.icon} alt="icon" className="icon" />
                </div>
                <span className="title">{item.title}</span>
              </div>
            ))}
          </div>
        </HotKeyMenuWrapper>
        <TournamentWrapper>
          <img
            alt="토너먼트"
            className="tournament-back"
            src="/image-web/game/tournament.png"
          />
          <div className="gtd">10,000,000 GTD</div>
          <div className="title">매일 무료 토너먼트</div>

          <div className="description">
            러너 홀덤에서
            <br />
            다양한 홀덤 게임을 즐기세요.
          </div>
          <div
            className="button"
            onClick={() => {
              if (accessToken) {
                if (user?.birthday && !isAdult(user?.birthday)) {
                  enqueueSnackbar(
                    "성인인증을 받은 회원만 참여하실 수 있습니다.",
                    {
                      variant: "error",
                    }
                  );
                  return;
                }
                if (user?.validate) {
                  setGameLoading(true);
                  setTimeout(() => {
                    setGameLoading(false);
                    history.push(`/game`);
                  }, 3000);
                } else {
                  enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
                    variant: "error",
                  });
                  history.push("/mypage?menu=profile");
                }
              } else {
                enqueueSnackbar("로그인이 필요합니다.", {
                  variant: "error",
                });
                history.push(`/login`);
              }
            }}
          >
            게임 입장
          </div>
          <img
            className="trophy"
            alt="trophy"
            src="/image-web/game/trophy.png"
          />
        </TournamentWrapper>
      </div>
      {isKakao && (
        <ChangeForKakao
          onClose={() => {
            setIsKakao(false);
            clearCredential();
            setUser(undefined);
            history.replace("/login", { redirect: window.location.href });
          }}
        />
      )}
    </MainWrapper>
  );
};

export default Home;
