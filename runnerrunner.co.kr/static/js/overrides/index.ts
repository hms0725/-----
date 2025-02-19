export {};

declare global {
  interface Window {
    initializeVersion: (version: string, platform: string) => void;
    isApp: () => boolean;
    waitNativeLoad: () => Promise<boolean>;
    linkAppInstall: () => void;
    safe: { top: number; bottom: number };
    share: (text: string, noUrl?: boolean) => void;
    copy: (text: string) => Promise<void>;
    openUrl: (text: string) => Promise<void>;

    goBack: (history: any) => void;

    native: {
      showQRScanner: () => Promise<{ code: string }>;

      setSafeArea: () => Promise<void>;
      removeSafeArea: () => Promise<void>;

      openUrl: (url: string) => Promise<void>;
      openWebView: (url: string) => Promise<void>;
      targetWebView: (url: string, targetUrl: string) => Promise<void>;

      isDebugMode: () => Promise<void>;
      getSafeArea: () => Promise<{ top: number; bottom: number }>; // ios only

      gcCheckLogin: () => Promise<any>;
      gcListEvent: (
        calendarId: string,
        startDate: number,
        endDate: number
      ) => Promise<any>;
      gcSignin: () => Promise<any>;

      googleSignin: () => Promise<any>;
      twitterSignin: () => Promise<any>;
      facebookSignin: () => Promise<any>;
      appleSignin: () => Promise<any>;
      getFCMToken: () => Promise<any>;
      signOut: () => Promise<any>;

      getImageFromGallery: () => Promise<{ base64: string; mime: string }>;

      shareLink: (title: string) => Promise<any>;
      copyText: (text: string) => Promise<void>;
    } | null;
  }
}

window.native = null;
window.waitNativeLoad = function (): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (window.isApp() == false) return resolve(false);

    while (window.native == null) {
      await new Promise((r) => setTimeout(r, 200));
    }

    resolve(true);
  });
};

window.initializeVersion = function (version: string, platform: string) {};
window.isApp = function (): boolean {
  return window.navigator.userAgent.indexOf("Runner2App") >= 0;
};
window.linkAppInstall = function () {};

window.safe = {
  top: 0,
  bottom: 0,
};
window.waitNativeLoad().then(() => {
  window.native?.getSafeArea().then((e) => {
    window.safe.top = e.top;
    window.safe.bottom = e.bottom;
  });
});

window.copy = async (text: string) => {
  if (window.isApp()) {
    await window.native?.copyText(text);
  } else {
    await window.navigator.clipboard.writeText(text);
  }
};

window.openUrl = async (text: string) => {
  if (window.isApp()) {
    window.native?.openUrl(text);
  } else {
    window.open(text, "_blank");
  }
};

window.goBack = (history) => {
  history.goBack();
};
