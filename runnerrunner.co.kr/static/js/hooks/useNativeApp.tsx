import {useCallback, useEffect, useRef} from "react";
import {useSnackbar} from "notistack";

export const isApp = Boolean(window.ReactNativeWebView);

function useNativeApp() {
  const {enqueueSnackbar} = useSnackbar();
  const handlersRef = useRef<any[]>([]);

  const sendMessageToNative = useCallback((func: string, topic: string, data: any = {}) => {
    return new Promise((resolve) => {
      if (!isApp) {
        enqueueSnackbar("앱에서만 이용할 수 있는 기능입니다.", {variant: 'error'});
        return;
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({
        id: 'ID_' + Date.now(),
        func: func,
        data: data
      }));

      if (!topic) {
        resolve(null);
        return;
      }

      const handler = (e: any) => {
        if (!e.data) {
          return;
        }

        const res = JSON.parse(e.data);
        if (res.func === topic) {
          window.removeEventListener('message', handler);
          document.removeEventListener('message', handler);
          handlersRef.current = handlersRef.current.filter(x => x !== handler);
          resolve(res.data);
        }
      }

      window.addEventListener('message', handler);
      document.addEventListener('message', handler);
      handlersRef.current.push(handler);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (handlersRef.current) {
        for (let handler of handlersRef.current) {
          window.removeEventListener('message', handler);
          document.removeEventListener('message', handler);
        }
      }
    }
  }, [])

  return {
    sendMessageToNative,
  }
}

export default useNativeApp;