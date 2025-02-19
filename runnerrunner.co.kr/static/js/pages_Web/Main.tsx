import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import Search from "./Search";
import Index from "./MyPage";
import { useHistory } from "react-router-dom";
import Favorite from "./Favorite";
import useScreenOrientation from "../../hooks/useScreenOrientation";
import { useRecoilState } from "recoil";
import { navigatorShadowState } from "../../recoil/navigator";
import UseCafe from "./useCafe";

const MainWrapper = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow-y: scroll;
  padding-bottom: 69px;
  -webkit-overflow-scrolling: touch;
`;

const BottomNavigationWrapper = styled.div<{ $isShadow?: boolean }>`
  position: fixed;
  width: 100%;
  max-width: 500px;
  background: white;
  bottom: 0;
  padding: 9px 16px 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ $isShadow = true }) =>
    $isShadow &&
    `
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 12px 0px;
  `}
  z-index: 120;

  > .item {
    width: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    > img {
      width: 24px;
      height: 24px;
    }
    > .icon-wrapper {
      position: relative;
      width: 24px;
      height: 24px;

      > .icon {
        position: absolute;
        width: 24px;
        height: 24px;
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      > .icon.selected {
        opacity: 1;
      }

      > .icon.unselected {
        opacity: 0;
      }
    }
  }
  > .item.selected {
    width: auto;
    display: flex;
    height: 38px;
    padding: 10px 15px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 999px;
    background: var(--Purple-300, #6436e7);
    transition: background 0s ease 0.5s;

    > .icon-wrapper {
      position: relative;
      width: 24px;
      height: 24px;

      > .icon {
        position: absolute;
        width: 24px;
        height: 24px;
        opacity: 0;
        transition: opacity 1.2s ease;
      }

      > .icon.selected {
        opacity: 1;
      }

      > .icon.unselected {
        opacity: 0;
      }
    }

    > span {
      color: #fff;
      font-feature-settings: "liga" off, "clig" off;
      font-family: Pretendard;
      font-size: 12px;
      font-style: normal;
      font-weight: 800;
      line-height: 150%; /* 18px */
    }
  }
`;

const Slider = styled.div<{ left: number; width: number }>`
  position: absolute;
  bottom: 28px;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  height: 38px;
  background-color: #6436e7;
  border-radius: 999px;
  transition: left 0.5s ease;
  z-index: -1;
`;

type MenuType = "home" | "like" | "search" | "mypage" | "wallet" | "name";
const Main = () => {
  const history = useHistory();
  const path = history.location.pathname;
  const [selectedMenu, setSelectedMenu] = useState<MenuType>();
  const [navigatorShadow, setNavigatorShadow] =
    useRecoilState(navigatorShadowState);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  let lastScrollTop = 0;
  const menuRef = useRef<{ [key in MenuType]: HTMLDivElement | null }>({
    home: null,
    like: null,
    search: null,
    mypage: null,
    wallet: null,
    name: null,
  });
  const [sliderLeft, setSliderLeft] = useState(25);
  const [sliderWidth, setSliderWidth] = useState(84);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      // home 메뉴일 때만 스크롤 제어
      if (selectedMenu !== "home") return;

      const element = e.target as HTMLElement;
      const st = element.scrollTop;
      // 아래로 스크롤 시도할 때
      if (st < 0 && st < lastScrollTop) {
        element.scrollTop = lastScrollTop;
      }

      lastScrollTop = st <= 0 ? 0 : st;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // home 메뉴일 때만 터치 제어
      if (selectedMenu !== "home") return;

      const element = mainWrapperRef.current;
      if (
        element &&
        element.scrollTop < 0 &&
        element.scrollTop >= element.scrollHeight - element.clientHeight
      ) {
        e.preventDefault();
      }
    };

    const mainWrapper = mainWrapperRef.current;
    if (mainWrapper) {
      mainWrapper.addEventListener("scroll", handleScroll);
      mainWrapper.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (mainWrapper) {
        mainWrapper.removeEventListener("scroll", handleScroll);
        mainWrapper.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [selectedMenu]);

  useEffect(() => {
    setNavigatorShadow(true);
    if (path === "/") {
      history.push("/home");
    } else {
      const tab = path.split("/")[1] as MenuType;
      setSelectedMenu(tab ? tab : "home");
    }
  }, [path]);

  useEffect(() => {
    if (menuRef.current[selectedMenu!]) {
      const selectedItem = menuRef.current[selectedMenu!];
      const selectedItemOffsetLeft = selectedItem?.offsetLeft || 0;
      const selectedItemWidth = selectedItem?.offsetWidth || 60;
      setSliderLeft(selectedItemOffsetLeft);
      setSliderWidth(selectedItemWidth);
    }
  }, [selectedMenu]);

  const onClickMenu = (menu: MenuType) => {
    if (selectedMenu === menu) {
      return;
    }

    const state: { [key: string]: any } = {};
    if (menu === "search") {
      state.mode = "query";
    }

    history.push(`/${menu}`, state);
  };

  return (
    <MainWrapper ref={mainWrapperRef}>
      {selectedMenu === "home" && <Home />}
      {selectedMenu === "search" && <Search />}
      {selectedMenu === "name" && <Search initialShowSearch={true} />}
      {selectedMenu === "mypage" && <Index />}
      {selectedMenu === "like" && <Favorite />}
      {selectedMenu === "wallet" && <UseCafe />}
      <BottomNavigationWrapper $isShadow={navigatorShadow}>
        <Slider left={sliderLeft} width={sliderWidth} />

        <div
          className={`item ${selectedMenu === "home" ? "selected" : ""}`}
          ref={(el) => (menuRef.current.home = el)}
        >
          <div className="icon-wrapper" onClick={() => onClickMenu("home")}>
            <img
              className={`icon ${
                selectedMenu === "home" ? "unselected" : "selected"
              }`}
              src="/image-web/bottom-nav/renewal/home.svg"
              alt="홈"
            />
            <img
              className={`icon ${
                selectedMenu === "home" ? "selected" : "unselected"
              }`}
              src="/image-web/bottom-nav/renewal/home-active.svg"
              alt="홈"
            />
          </div>
          {selectedMenu === "home" && <span>HOME</span>}
        </div>

        <div
          className={`item ${
            selectedMenu === "search" || selectedMenu === "name"
              ? "selected"
              : ""
          }`}
          ref={(el) => (menuRef.current.search = el)}
        >
          <div className="icon-wrapper" onClick={() => onClickMenu("search")}>
            <img
              className={`icon ${
                selectedMenu === "search" || selectedMenu === "name"
                  ? "unselected"
                  : "selected"
              }`}
              src="/image-web/bottom-nav/renewal/search.svg"
              alt="검색"
            />
            <img
              className={`icon ${
                selectedMenu === "search" || selectedMenu === "name"
                  ? "selected"
                  : "unselected"
              }`}
              src="/image-web/bottom-nav/renewal/search-active.svg"
              alt="검색"
            />
          </div>
          {(selectedMenu === "search" || selectedMenu === "name") && (
            <span>SEARCH</span>
          )}
        </div>

        <div
          className={`item ${selectedMenu === "like" ? "selected" : ""}`}
          ref={(el) => (menuRef.current.like = el)}
        >
          <div className="icon-wrapper" onClick={() => onClickMenu("like")}>
            <img
              className={`icon ${
                selectedMenu === "like" ? "unselected" : "selected"
              }`}
              src="/image-web/bottom-nav/renewal/like.svg"
              alt="즐겨찾기"
            />
            <img
              className={`icon ${
                selectedMenu === "like" ? "selected" : "unselected"
              }`}
              src="/image-web/bottom-nav/renewal/like-active.svg"
              alt="즐겨찾기"
            />
          </div>
          {selectedMenu === "like" && <span>PUB</span>}
        </div>

        <div
          className={`item ${selectedMenu === "wallet" ? "selected" : ""}`}
          ref={(el) => (menuRef.current.wallet = el)}
        >
          <div className="icon-wrapper" onClick={() => onClickMenu("wallet")}>
            <img
              className={`icon ${
                selectedMenu === "wallet" ? "unselected" : "selected"
              }`}
              src="/image-web/bottom-nav/renewal/wallet.svg"
              alt="내지갑"
            />
            <img
              className={`icon ${
                selectedMenu === "wallet" ? "selected" : "unselected"
              }`}
              src="/image-web/bottom-nav/renewal/wallet-active.svg"
              alt="내지갑"
            />
          </div>
          {selectedMenu === "wallet" && <span>WALLET</span>}
        </div>

        <div
          className={`item ${selectedMenu === "mypage" ? "selected" : ""}`}
          ref={(el) => (menuRef.current.mypage = el)}
        >
          <div className="icon-wrapper" onClick={() => onClickMenu("mypage")}>
            <img
              className={`icon ${
                selectedMenu === "mypage" ? "unselected" : "selected"
              }`}
              src="/image-web/bottom-nav/renewal/my.svg"
              alt="마이페이지"
            />
            <img
              className={`icon ${
                selectedMenu === "mypage" ? "selected" : "unselected"
              }`}
              src="/image-web/bottom-nav/renewal/my-active.svg"
              alt="마이페이지"
            />
          </div>
          {selectedMenu === "mypage" && <span>MY</span>}
        </div>
      </BottomNavigationWrapper>
    </MainWrapper>
  );
};
export default Main;
