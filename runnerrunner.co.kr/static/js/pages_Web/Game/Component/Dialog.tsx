import { useGameContext } from "../Hook/GameContext";
import { GameDialogProps } from "../Hook/useGame";
import { GameCommonPopupWrapper } from "../Style/GameStyles";

const GameDialog = (props: { data: GameDialogProps }) => {
  const data = props.data;
  const { closeDialog } = useGameContext();
  return (
    <GameCommonPopupWrapper>
      <div className="content">
        <div className="wrapper">
          <div className="cancel">
            <img
              alt="취소"
              src="/image-web/game/cancel.svg"
              onClick={() => {
                closeDialog();
              }}
            />
          </div>
          <div className="title">{data.text}</div>
          <div
            className="button"
            onClick={() => {
              data.onConfirm && data.onConfirm();
            }}
          >
            {data.buttonText}
          </div>
        </div>
      </div>
    </GameCommonPopupWrapper>
  );
};

export default GameDialog;
