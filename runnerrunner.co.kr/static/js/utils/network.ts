import axios, { CancelTokenSource, AxiosRequestConfig } from "axios";
import { ACCOUNT_EXIT, ACCOUNT_SUSPENDED, TOKEN_EXPIRED } from "../api/code";

export const LOCAL_STORAGE_ACCESS_KEY = "runner_access_token";

const network = axios.create({
  baseURL: process.env.REACT_APP_WEB_API_HOST + "",
});

// 체크용
interface PendingRequest {
  cancelTokenSource: CancelTokenSource;
  timer: NodeJS.Timeout;
}

const pendingRequests: { [key: string]: PendingRequest } = {};
const DEBOUNCE_DELAY = 100; //0.1 초 안에 들어오면 앞에 거 취소

// 요청의 고유 키를 생성하는 함수
function getRequestKey(config: AxiosRequestConfig): string {
  return `${config.method}:${config.url}`;
}

network.interceptors.request.use(async (config) => {
  const requestKey = getRequestKey(config);

  // 이전 같은 요청이 있다면 취소
  if (pendingRequests[requestKey]) {
    pendingRequests[requestKey].cancelTokenSource.cancel(
      "Duplicate request canceled"
    );
    clearTimeout(pendingRequests[requestKey].timer);
  }

  // 새로운 CancelToken 생성
  const cancelTokenSource = axios.CancelToken.source();
  config.cancelToken = cancelTokenSource.token;

  // 취소 로직
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      const headers = config.headers;
      const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
      if (accessToken !== null) {
        headers["Authorization"] = accessToken;
      }
      delete pendingRequests[requestKey]; // 요청이 시작되면 pending 목록에서 제거
      resolve(config);
    }, DEBOUNCE_DELAY);

    pendingRequests[requestKey] = { cancelTokenSource, timer };
  });
});

network.interceptors.response.use(
  async (res) => {
    const requestKey = getRequestKey(res.config);
    delete pendingRequests[requestKey]; // 응답이 오면 pending 목록에서 제거

    if (res.data) {
      if (res.data.code && res.data.code !== 200) {
        throw res.data;
      }

      if (res.data.tokenType && res.data.accessToken && res.data.refreshToken) {
        localStorage.setItem(
          LOCAL_STORAGE_ACCESS_KEY,
          `${res.data.tokenType} ${res.data.accessToken}`
        );
      }

      return res.data;
    }
  },
  async (e: any) => {
    if (axios.isCancel(e)) {
      console.log("Request canceled:", e.message);
      return;
    }

    const requestKey = e.config ? getRequestKey(e.config) : null;
    if (requestKey) {
      delete pendingRequests[requestKey]; // 에러 발생 시에도 pending 목록에서 제거
    }

    let errorMsg = e.message;

    if (e.response) {
      if (e.response.status === 400) {
        if (e.response.data) {
          if (e.response.data.message) {
            errorMsg = `(${e.response.data.code}) ${e.response.data.message}`;
          }

          switch (e.response.data.code) {
            case TOKEN_EXPIRED:
              localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_WEB_API_HOST}/auth/refresh-token`,
                  null,
                  {
                    withCredentials: true,
                  }
                );
                if (
                  response &&
                  response.status === 200 &&
                  response.data &&
                  response.data.tokenType
                ) {
                  localStorage.setItem(
                    LOCAL_STORAGE_ACCESS_KEY,
                    `${response.data.tokenType} ${response.data.accessToken}`
                  );
                  window.location.href = "/";
                }
              } catch (e) {}

              break;
            case ACCOUNT_SUSPENDED:
              localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);
              break;
            case ACCOUNT_EXIT:
              localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);
              break;
          }
        }
      }
    } else {
      throw e;
    }

    throw {
      ...e,
      statusCode: e.response.status,
      code: e.response.data?.code,
      message: errorMsg,
      payload: e.response.data?.payload,
    };
  }
);

export function hasCredential() {
  return localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY) !== null;
}

export function clearCredential() {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_KEY);
}

export default network;
