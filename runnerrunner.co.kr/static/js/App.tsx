import "./overrides";
import * as Sentry from "@sentry/react";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { RecoilRoot } from "recoil";
import theme from "./theme";
import Container from "./Container";
import Adjust from "@adjustcom/adjust-web-sdk";
import "swiper/css";
import TagManager from "react-gtm-module";
import { useUpdateCurrentTime } from "./hooks/useTime";
import { PerformanceWrapper } from "./components/common/PerformanceWrapper";

function TimeUpdater(): null {
  useUpdateCurrentTime();
  return null;
}

const App: React.FC = () => {
  if (process.env.REACT_APP_ENV === "production") {
    Sentry.init({
      dsn: "https://ea7319235bf48aade772da34989b08de@o4506292095746048.ingest.sentry.io/4506292140965888",
    });
    Adjust.initSdk({
      appToken: "s5487rkop4ao",
      environment: "production",
    });
    const tagManagerArgs = {
      gtmId: process.env.REACT_APP_GTM_ID || "",
    };
    if (tagManagerArgs.gtmId) {
      TagManager.initialize(tagManagerArgs);
    }

    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-PQ87TJVFHH";
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PQ87TJVFHH');
    `;
    document.head.appendChild(script2);

    Adjust.initSdk({
      appToken: "s5487rkop4ao",
      environment: "production",
    });
  }

  // ios에서 하단의 주소표시줄을 포함하지 않고 100% 적용
  useEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    window.addEventListener("resize", () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RecoilRoot>
          <PerformanceWrapper>
            <TimeUpdater />
            <Container />
          </PerformanceWrapper>
        </RecoilRoot>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
