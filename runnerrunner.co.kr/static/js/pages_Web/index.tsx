import styled from "styled-components";
import { useEffect, useState } from "react";
import Login from "./Login";
import { Redirect, Route, Switch } from "react-router-dom";
import SnsLogin from "./SnsLogin";
import Main from "./Main";
import StoreDetail from "./StoreDetail";
import EventPage from "./Event";
import EventDetail from "./EventDetail";
import EventTournamentDetail from "./EventTournamentDetail";
import Recruit from "./Community/Recruit";
import TournamentSchedule from "./TournamentSchedule";
import RecruitDetail from "./RecruitDetail";
import TournamentDetail from "./TournamentDetail";
import HoldemGuide from "./HoldemGuide";
import Ranking from "./Ranking";
import useScreenOrientation, {
  MEDIA_DESKTOP,
} from "../../hooks/useScreenOrientation";
import Youtube from "./Youtube";
import OpenChatList from "./OpenChat";
import OddsCalc from "./OddsCalc";
import SecondHandMarket from "./Community/SecondHandMarket";
import SecondHandMarketDetail from "./SecondHandMarketDetail";
import NewsDetail from "./NewsDetail";
import NewsAndSchedule from "./NewsAndSchedule";
import Community from "./Community";
import ArticleDetail from "./ArticleDetail";
import Game from "./Game/index";
import { PopupProvider } from "../../provider/PopupContext";
import ReservationLandingPage from "./ReservationLandingPage";
import { CompetitionProvider } from "./CompetitionTournament/hook/competitionContext";
import CompetitionTournamentDetail from "./CompetitionTournamentDetail";
import RedirectPage from "./RedirectPage";

const WebWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;

  > .inner {
    position: relative;
    height: 100%;
    width: 100%;
    max-width: 500px;
    @media ${MEDIA_DESKTOP} {
      max-width: unset;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
  }
`;
const Web = () => {
  const orientation = useScreenOrientation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Init iamport
    if (window.IMP) {
      window.IMP.init(process.env.REACT_APP_IAMPORT_USER_CODE!);
    }

    setInitialized(true);
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <PopupProvider>
      <WebWrapper>
        <div className="inner">
          <Switch>
            <Route
              path="/mobile/:path*"
              render={({ location }) => (
                <Redirect to={location.pathname.replace("/mobile/", "/")} />
              )}
            />
            <Route path="/redirect">
              <RedirectPage />
            </Route>
            <Route path={"/"} exact>
              <Main />
            </Route>
            <Route path={"/home"} exact>
              <Main />
            </Route>

            <Route path={"/search"} exact>
              <Main />
            </Route>
            <Route path={"/name"} exact>
              <Main />
            </Route>
            <Route path={"/wallet"} exact>
              <Main />
            </Route>
            <Route path={"/mypage"} exact>
              <Main />
            </Route>
            <Route path={"/login"} exact>
              <Login />
            </Route>
            <Route path={"/snslogin/:type"} exact>
              <SnsLogin />
            </Route>
            <Route path={"/logout"} exact>
              <Redirect to="/" />
            </Route>
            <Route path={"/event/list"} exact>
              <EventPage />
            </Route>
            <Route path={"/event/detail/:id"} exact>
              <EventDetail />
            </Route>
            <Route path={"/event/tournament/detail/:groupId"} exact>
              <EventTournamentDetail />
            </Route>
            <Route path={"/tournamentSchedule"} exact>
              <TournamentSchedule />
            </Route>
            <Route path={"/openChat"} exact>
              <OpenChatList />
            </Route>
            <Route path={"/reservation/:id"} exact>
              <ReservationLandingPage />
            </Route>
            <Route path={"/holdem/guide"} exact>
              <HoldemGuide />
            </Route>
            <Route path={"/ranking"} exact>
              <Ranking />
            </Route>
            <Route path={"/youtube"} exact>
              <Youtube />
            </Route>
            <Route path={"/holdemNow"} exact>
              <Main />
            </Route>

            <Route path={"/game"} exact>
              <Game />
            </Route>
            <Route path={"/tournament/detail/:type/:id"} exact>
              <TournamentDetail />
            </Route>
            <Route path={"/calc"} exact>
              <OddsCalc />
            </Route>
            <Route path={"/signup"} exact>
              <Login />
            </Route>
            <Route path={"/like"} exact>
              <Main />
            </Route>
            <Route path={"/recruit"} exact>
              <Recruit />
            </Route>
            <Route path={"/recruit/detail/:id/:type"} exact>
              <RecruitDetail />
            </Route>
            <Route path={`/store/:id`} exact>
              <StoreDetail />
            </Route>
            <Route path={`/mobile/store/:id`} exact>
              <StoreDetail />
            </Route>
            <Route path={"/second-hand-market"} exact>
              <SecondHandMarket />
            </Route>
            <Route path={"/second-hand-market/detail/:id"} exact>
              <SecondHandMarketDetail />
            </Route>
            <Route path={"/news-detail/:id"} exact>
              <NewsDetail />
            </Route>
            <Route path={"/community/:tab?/:subTab?"} exact>
              <Community />
            </Route>
            <Route path={"/article/detail/:role/:id"} exact>
              <ArticleDetail />
            </Route>
            <CompetitionProvider>
              <Route path={"/news"} exact>
                <NewsAndSchedule />
              </Route>
              <Route path={"/competition-detail/:id"} exact>
                <CompetitionTournamentDetail />
              </Route>
            </CompetitionProvider>
          </Switch>
        </div>
      </WebWrapper>
    </PopupProvider>
  );
};

export default Web;
