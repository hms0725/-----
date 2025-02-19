import { useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import { likeAdd, likeDelete, likeHasItems, LikeType } from "../api/like";
import useUserInfo from "./useUserInfo";
import { Cafe } from "../api/types";
import { isMobile } from "react-device-detect";
import { copyClipboard } from "../utils/common";
import { useHistory } from "react-router-dom";
import useDialog from "./useDialog";
import { NavigationTarget } from "../recoil/store";

function useQuickButtons() {
  const { openDialog } = useDialog();
  const history = useHistory();
  const { user } = useUserInfo();

  const openPhoneCall = useCallback((title: string, phoneNumber: string) => {
    openDialog({
      title: title,
      text:
        "개인 정보 보호를 위해 고객님의 전화번호에<br/>" +
        "발신번호 표시 제한이 적용됩니다.",
      type: "call",
      phone: phoneNumber,
      onConfirm: () => {
        window.open("tel:" + phoneNumber.replace(/-/g, ""));
      },
      confirm: true,
      confirmText: "전화 걸기",
    });
  }, []);

  const toggleLike = useCallback(
    async (itemId: number, type: LikeType) => {
      if (!user) {
        history.push("/login", { redirect: window.location.href });
        enqueueSnackbar("로그인이 필요합니다.", { variant: "error" });
        return;
      }

      let liked = false;
      try {
        const { hasLike } = await likeHasItems(itemId);

        if (!hasLike) {
          await likeAdd(itemId);
          liked = true;
          enqueueSnackbar("즐겨찾기에 추가되었습니다.", { variant: "success" });
        } else {
          await likeDelete(itemId);
          enqueueSnackbar("즐겨찾기에서 삭제되었습니다.", {
            variant: "success",
          });
          liked = false;
        }
      } catch (e) {}

      return liked;
    },
    [user]
  );

  const openMap = useCallback(
    (app: string, cafe: NavigationTarget) => {
      const addr = `${cafe.newAddress} ${cafe.detailAddress}`;
      if (app === "naver") {
        if (isMobile) {
          const url = `nmap://route/public?dlat=${cafe.lat}&dlng=${cafe.lon}&dname=${addr}`;
          const FUNC_OBJ = {
            func: "navermap",
            data: {
              data: url,
            },
          };
          const reqCmdJsonString = JSON.stringify(FUNC_OBJ);
          (window as any).ReactNativeWebView.postMessage(reqCmdJsonString);
        } else {
          window.open(
            `https://map.naver.com/index.nhn?elat=${cafe.lat}&elng=${cafe.lon}&showMap=true&etext=${addr}&menu=route`,
            "_blank"
          );
        }
      } else if (app === "kakao") {
        if (isMobile) {
          const url = `kakaomap://look?p=${cafe.lat},${cafe.lon}`;
          const FUNC_OBJ = {
            func: "kakaomap",
            data: {
              data: url,
            },
          };
          const reqCmdJsonString = JSON.stringify(FUNC_OBJ);
          (window as any).ReactNativeWebView.postMessage(reqCmdJsonString);
        } else {
          window.open(
            `https://map.kakao.com/link/to/${addr},${cafe.lat},${cafe.lon}`
          );
        }
      } else if (app === "tmap") {
        if (isMobile) {
          const url = `tmap://route?goalname=${addr}&goalx=${cafe.lon}&goaly=${cafe.lat}`;
          const FUNC_OBJ = {
            func: "tmap",
            data: {
              data: url,
            },
          };
          const reqCmdJsonString = JSON.stringify(FUNC_OBJ);
          (window as any).ReactNativeWebView.postMessage(reqCmdJsonString);
        }
      } else if (app === "copy") {
        copyClipboard(addr);
      }
    },
    [isMobile]
  );

  const shareLink = useCallback((link?: string) => {
    const url = link || location.href;
    if (navigator.share) {
      navigator
        .share({
          title: "러너러너",
          url: url,
        })
        .then(() => {})
        .catch((e: any) => {
          console.error(e);
        });
    } else {
      copyClipboard(link || location.href);
    }
  }, []);

  return {
    openPhoneCall,
    toggleLike,
    openMap,
    shareLink,
  };
}

export default useQuickButtons;
