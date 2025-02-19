import { useGameContext } from "./Hook/GameContext";
import { GamePage } from "./Hook/useGame";
import {
  GameNavigatorGameWrapper,
  GameNavigatorItemWrapper,
  GameNavigatorWrapper,
} from "./Style/GameStyles";
import "./index.scss";

export const GameNavigator = () => {
  const imageUrl = "/image-web/game/navigator/";
  const { history, gamePageState, setGamePageState, openDialog } =
    useGameContext();

  function isCurrentPage(page: GamePage) {
    return page === gamePageState;
  }

  return (
    <GameNavigatorWrapper className="fix-centered">
      <GameNavigatorItemWrapper
        style={{ float: "left", left: "10px" }}
        id="게임홈"
        className={`home ${isCurrentPage(GamePage.MAIN) ? "selected" : ""}`}
        onClick={() => setGamePageState(GamePage.MAIN)}
      >
        <img
          alt="아이콘"
          src={`${imageUrl}game_home${
            isCurrentPage(GamePage.MAIN) ? "_selected" : ""
          }.svg`}
        />
        HOME
      </GameNavigatorItemWrapper>
      <GameNavigatorItemWrapper
        style={{ float: "left", left: "10px" }}
        id="게임마이페이지"
        className={`my ${isCurrentPage(GamePage.MY_PAGE) ? "selected" : ""}`}
        onClick={() => setGamePageState(GamePage.MY_PAGE)}
      >
        <img
          alt="아이콘"
          src={`${imageUrl}game_mypage${
            isCurrentPage(GamePage.MY_PAGE) ? "_selected" : ""
          }.svg`}
        />
        MY
      </GameNavigatorItemWrapper>
      <GameNavigatorGameWrapper
        className="absolute-centered"
        id="게임"
        onClick={() => setGamePageState(GamePage.GAME)}
      >
        <img alt="아이콘" src={`${imageUrl}game_navi_game.png`} />
      </GameNavigatorGameWrapper>
      <GameNavigatorItemWrapper
        style={{ float: "right", right: "10px" }}
        id="게임나가기"
        className="exit"
        onClick={() => {
          openDialog({
            text: `게임을\n그만하시겠습니까?`,
            buttonText: "퇴장하기",
            onConfirm: () => {
              history.replace("/");
            },
          });
        }}
      >
        <img alt="아이콘" src={`${imageUrl}game_exit.svg`} />
        EXIT
      </GameNavigatorItemWrapper>
      <GameNavigatorItemWrapper
        style={{ float: "right", right: "10px" }}
        id="게임랭킹"
        className={`rank ${
          gamePageState === GamePage.RANKING ? "selected" : ""
        }`}
        onClick={() => setGamePageState(GamePage.RANKING)}
      >
        <img
          alt="아이콘"
          src={`${imageUrl}game_rank${
            isCurrentPage(GamePage.RANKING) ? "_selected" : ""
          }.svg`}
        />
        RANK
      </GameNavigatorItemWrapper>
    </GameNavigatorWrapper>
  );
};
