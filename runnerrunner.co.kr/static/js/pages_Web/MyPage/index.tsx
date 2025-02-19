import { useCallback, useEffect, useState } from "react";
import ModifyProfile from "./ModifyProfile";
import ModifyPassword from "./ModifyPassword";
import { useHistory, useLocation } from "react-router-dom";
import useDialog from "../../../hooks/useDialog";
import Notice from "./Notice";
import FAQ from "./FAQ";
import Referral from "./Referral";
import {
  clearCredential,
  LOCAL_STORAGE_ACCESS_KEY,
} from "../../../utils/network";
import { updateProfileImage } from "../../../api/auth";
import { enqueueSnackbar } from "notistack";
import useUserInfo from "../../../hooks/useUserInfo";

import ManagePub from "../ManagePub";
import ManageRecruit from "../ManageRecruit";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loadingState } from "../../../recoil/app";
import useQueryParams from "../../../hooks/useQueryParams";
import RegisterPreminumPubInfo from "../Search/Components/RegisterPreminumPubInfo";
import { openNewWindow } from "../../../utils/common";
import MarketNotice from "./MarketNotice";
import useNativeApp, { isApp } from "../../../hooks/useNativeApp";

import Adjust from "@adjustcom/adjust-web-sdk";

import {
  ButtonRowWrapper,
  CustomerButtonWrapper,
  CustomerServiceWrapper,
  LogoutWrapper,
  MyPageHeader,
  MyPageWrapper,
  MyProfileWrapper,
  NoticeWrapper,
  TopButtonWrapper,
} from "./styles";
import useCities from "../../../hooks/useCities";
import { geoCoordState } from "../../../recoil/geo";
import { NoticeData, noticeList } from "../../../api/notice";
import Coupon from "./Coupon";
import ModifyNickname from "./ModifyNickname";

type MenuType =
  | "profile"
  | "password"
  | "point"
  | "notice"
  | "market-notice"
  | "faq"
  | "referral"
  | "manage-pub"
  | "manage-recruit"
  | "coupon"
  | "nickname"
  | null;
const Index = () => {
  const [showRegisterPremium, setShowRegisterPremium] = useState(false);
  const setLoading = useSetRecoilState(loadingState);
  const { openDialog } = useDialog();
  const history = useHistory();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState<MenuType>(null);
  const { user, setUser, refreshUser } = useUserInfo(true);

  const [cityText, setCityText] = useState("서울특별시 강남구");
  const { getAddressByCoord } = useCities();
  const { latitude, longitude } = useRecoilValue(geoCoordState);
  const { sendMessageToNative } = useNativeApp();
  const query = useQueryParams();

  const [notices, setNotices] = useState<NoticeData[]>([]);

  useEffect(() => {
    noticeList()
      .then((list) => {
        setNotices(list);
      })
      .catch((e: any) => {
        enqueueSnackbar("공지사항을 불러올 수 없습니다: " + e.message, {
          variant: "error",
        });
      });
  }, []);

  useEffect(() => {
    const menu = query.get("menu");
    if (menu) {
      setShowMenu(menu);
    }
    if (user?.areaCity) {
      setCityText(user.areaProvince + "" + user.areaCity);
    } else {
      setCityText(getAddressByCoord(latitude, longitude));
    }
  }, [getAddressByCoord, latitude, longitude, query, user]);

  // 프로필 이미지 수정
  const handleClickImage = useCallback(() => {
    if (!user) {
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      if (!input.files || !input.files[0]) {
        return;
      }

      const file = input.files[0];
      updateProfileImage(file, { id: user.id })
        .then(() => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const dataUri = reader.result;
            if (typeof dataUri !== "string") {
              return;
            }

            await refreshUser();
            enqueueSnackbar("프로필 사진이 변경되었습니다.", {
              variant: "success",
            });
          };
          reader.readAsDataURL(file);
        })
        .catch((e: any) => {
          enqueueSnackbar("프로필 사진을 변경하지 못했습니다: " + e.message, {
            variant: "error",
          });
        })
        .finally(() => {
          input.remove();
        });
    };
    input.click();
  }, [user]);

  const handleLogout = useCallback(() => {
    clearCredential();
    setUser(undefined);
    localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);
    history.replace("/logout");
  }, []);

  const handleSetMenu = (menu?: MenuType) => {
    if (menu) {
      setShowMenu(menu);
      query.set("menu", menu);
      history.replace({ search: query.toString(), state: location.state });
    } else {
      setShowMenu(null);
      history.replace({ search: "", state: location.state });
    }
  };

  return (
    <MyPageWrapper>
      {showMenu === "profile" && (
        <ModifyProfile
          onClose={() => handleSetMenu()}
          onPassword={() => {
            handleSetMenu("password");
          }}
          onNickname={() => {
            handleSetMenu("nickname");
          }}
        />
      )}
      {showMenu === "password" && (
        <ModifyPassword onClose={() => handleSetMenu("profile")} />
      )}
      {showMenu === "nickname" && (
        <ModifyNickname
          onClose={() => {
            handleSetMenu("profile");
          }}
          refreshUser={refreshUser}
        />
      )}
      {showMenu === "coupon" && <Coupon onClose={() => handleSetMenu()} />}
      {showMenu === "notice" && <Notice onClose={() => handleSetMenu()} />}
      {showMenu === "market-notice" && (
        <MarketNotice onClose={() => handleSetMenu()} />
      )}
      {showMenu === "faq" && <FAQ onClose={() => handleSetMenu()} />}
      {showMenu === "referral" && <Referral onClose={() => handleSetMenu()} />}
      {showMenu === "manage-pub" && (
        <ManagePub onClose={() => handleSetMenu()} />
      )}
      {showMenu === "manage-recruit" && (
        <ManageRecruit onClose={() => handleSetMenu()} />
      )}
      {showRegisterPremium && (
        <RegisterPreminumPubInfo
          onClose={() => setShowRegisterPremium(false)}
        />
      )}
      <div className="inner">
        <MyProfileWrapper scrollLock={showMenu !== null}>
          {showMenu === null && (
            <MyPageHeader>
              <div className="left">
                <div
                  className="close"
                  onClick={() => {
                    history.replace("/");
                  }}
                >
                  <img
                    src="/image-web/Icon/Back.svg"
                    id="마이페이지 뒤로가기"
                    alt="close"
                  />
                </div>
                <div className="title">MY</div>
              </div>
            </MyPageHeader>
          )}
          <div className="profile-row">
            <div className="profile" onClick={handleClickImage}>
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} />
              ) : (
                <img src="https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png" />
              )}
              <div className="edit" />
            </div>
            <div className="info">
              <div className="info-top">
                <div className="tag-row">
                  {user?.validate && (
                    <div className="tag">
                      <img src="/image-web/Icon/Certified/small.svg" />
                      <span>본인 인증 완료</span>
                    </div>
                  )}
                  {user?.role === "ROLE_SELLER" && (
                    <div className="tag">
                      <img src="/image-web/Icon/manager/small.svg" />
                      <span>홀덤펍 관리자</span>
                    </div>
                  )}
                </div>
                <div className="nickname">{user?.nickname}</div>
              </div>
              <div className="address">
                {cityText !== "로드 중..." && cityText}
              </div>
            </div>
          </div>
          <ButtonRowWrapper>
            <TopButtonWrapper
              className="item"
              onClick={() => {
                handleSetMenu("profile");
              }}
            >
              <img src="/image-web/mypage/setting.svg" />
              <span>내 정보 수정</span>
            </TopButtonWrapper>
            <div className="bar" />
            <TopButtonWrapper
              className="item"
              onClick={() => {
                handleSetMenu("referral");
              }}
            >
              <img src="/image-web/mypage/friend_add.svg" />
              <span>친구 초대</span>
            </TopButtonWrapper>
            <div className="bar" />
            <TopButtonWrapper
              className="item"
              onClick={() => {
                handleSetMenu("coupon");
              }}
            >
              <img src="/image-web/mypage/coupon.svg" />
              <span>쿠폰함</span>
            </TopButtonWrapper>
            <div className="bar" />
            <TopButtonWrapper
              className="item"
              onClick={() => {
                enqueueSnackbar("준비중입니다.");
              }}
            >
              <img src="/image-web/mypage/reservation.svg" />
              <span>예약 목록</span>
            </TopButtonWrapper>
          </ButtonRowWrapper>
        </MyProfileWrapper>
        <NoticeWrapper>
          <div className="header">
            <span>공지사항</span>
            <div
              className="more-button"
              onClick={() => {
                handleSetMenu("notice");
              }}
            >
              <img src="/image-web/home/more.svg" alt="more" />
              <span>더보기</span>
            </div>
          </div>
          <div className="list-wrapper">
            {notices.slice(0, 5).map((item, index) => (
              <div
                className="item"
                key={item.id}
                onClick={() => {
                  handleSetMenu("notice");
                  // URL에 noticeId를 쿼리 파라미터로 추가
                  query.set("menu", "notice");
                  query.set("noticeId", item.id.toString());
                  history.replace({
                    search: query.toString(),
                    state: {
                      ...((location.state as object) || {}),
                      scrollToNotice: true,
                    },
                  });
                }}
              >
                <div className="info-wrapper">
                  <div className="title">{item.title}</div>
                  <img src="/image-web/mypage/notice-more.svg" />
                </div>
                <div className="line" />
              </div>
            ))}
          </div>
        </NoticeWrapper>
        <CustomerServiceWrapper>
          <div className="title">고객센터</div>
          <div className="grid-wrapper">
            <CustomerButtonWrapper onClick={() => handleSetMenu("notice")}>
              <img
                alt="아이콘"
                className="icon"
                src="/image-web/Icon/mypage/notice.svg"
              />
              <span className="title">공지사항</span>
            </CustomerButtonWrapper>
            <CustomerButtonWrapper onClick={() => handleSetMenu("faq")}>
              <div className="icon-wrapper">
                <img
                  alt="아이콘"
                  className="icon"
                  src="/image-web/Icon/mypage/qa.svg"
                />
              </div>
              <div className="title">자주묻는 질문</div>
            </CustomerButtonWrapper>
            <CustomerButtonWrapper
              onClick={() => openNewWindow("https://t.me/RunnerRunner0")}
            >
              <div className="icon-wrapper">
                <img
                  alt="아이콘"
                  className="icon"
                  src="/image-web/Icon/mypage/event.svg"
                />
              </div>
              <div className="title">텔레그램 상담</div>
            </CustomerButtonWrapper>

            <CustomerButtonWrapper
              onClick={() => {
                openNewWindow("https://pf.kakao.com/_BxbmbG");
              }}
            >
              <div className="icon-wrapper">
                <img
                  alt="아이콘"
                  className="icon"
                  src="/image-web/Icon/mypage/talk.svg"
                />
              </div>
              <div className="title">채널 상담</div>
            </CustomerButtonWrapper>
            <CustomerButtonWrapper
              onClick={() => {
                openNewWindow(
                  "https://youtube.com/channel/UCTiNKTlz-KU82BqPqKhx3UQ?si=I1aWsYgGPSoUXTDO"
                );
              }}
            >
              <div className="icon-wrapper">
                <img
                  alt="아이콘"
                  className="icon"
                  src="/image-web/Icon/mypage/youtube.svg"
                />
              </div>
              <div className="title">공식 유튜브</div>
            </CustomerButtonWrapper>
            <CustomerButtonWrapper
              onClick={() => {
                openNewWindow(
                  "https://www.instagram.com/app.runner.official?igsh=MXMzZjR1NmhrajVkZw=="
                );
              }}
            >
              <div className="icon-wrapper">
                <img
                  alt="아이콘"
                  className="icon"
                  src="/image-web/Icon/mypage/instagram.svg"
                />
              </div>
              <div className="title">공식 인스타</div>
            </CustomerButtonWrapper>
          </div>
        </CustomerServiceWrapper>
        <LogoutWrapper
          className="row"
          onClick={() => {
            if (!user?.id) return;
            if (process.env.REACT_APP_ENV !== "production") {
              if (!isApp) {
                Adjust.trackEvent({
                  eventToken: "e543tc",
                  callbackParams: [
                    { key: "user_id", value: "" + user.id },
                    { key: "event_value", value: "logout" },
                  ],
                });
              } else {
                sendMessageToNative("adjustEvent", "", {
                  eventToken: "e543tc",
                  eventName: "test_mypage",
                  data: user.id!,
                  callbackParams: {
                    user_id: "" + user.id!,
                    event_value: "logout",
                  },
                });
              }
            }
            openDialog({
              type: "web",
              title: "로그아웃",
              text: "로그아웃을<br/>진행하시겠습니까?",
              onConfirm: handleLogout,
              confirmText: "로그아웃",
              confirm: true,
              confirmColor: "#D91818",
            });
          }}
        >
          <div className="title">
            <span>로그아웃</span>
          </div>
        </LogoutWrapper>
      </div>
    </MyPageWrapper>
  );
};

export default Index;
