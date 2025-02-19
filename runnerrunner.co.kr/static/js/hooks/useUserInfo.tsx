import { useRecoilState } from "recoil";
import { userState } from "../recoil/auth";
import { useCallback, useEffect } from "react";
import { authDetail } from "../api/auth";
import { useHistory } from "react-router-dom";
import { hasCredential, LOCAL_STORAGE_ACCESS_KEY } from "../utils/network";
import { enqueueSnackbar } from "notistack";

function useUserInfo(required?: boolean) {
  const history = useHistory();
  const [user, setUser] = useRecoilState(userState);

  const refreshUser = useCallback(async () => {
    return authDetail()
      .then((res) => {
        setUser(res);
        localStorage.setItem(
          LOCAL_STORAGE_ACCESS_KEY,
          `Bearer ${res.accessToken}`
        );
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar("로그인에 실패 했습니다.", {
          variant: "error",
        });
        if (e.statusCode !== 200) {
          setUser(undefined); // 로그아웃 상태로 변경
          history.replace("/login", { redirect: window.location.href });
        }
      });
  }, []);

  useEffect(() => {
    if (hasCredential()) {
      if (!user) {
        refreshUser();
      }
    } else if (required) {
      history.replace("/login", { redirect: window.location.href });
    }
  }, [required]);

  return {
    user,
    setUser,
    refreshUser,
  };
}

export default useUserInfo;
