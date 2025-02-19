import { useGameContext } from "../Hook/GameContext";
import { GameRankingPopupWrapper } from "../Style/GameRankingPopupStyles";

const RankingDialog = () => {
  const { closeRankingDialog } = useGameContext();

  return (
    <GameRankingPopupWrapper>
      <div className="content">
        <div className="wrapper">
          <div className="header">
            <div className="title">누적 랭킹 티어</div>
            <img
              src="/image-web/game/popup/cancel.svg"
              onClick={() => closeRankingDialog()}
            />
          </div>

          <div className="tier-wrapper">
            <div className="item bronze">
              <div className="tier-box">
                <img src="/image-web/game/tier/BRONZE.png" />
                <div className="tier">BRONZE</div>
              </div>
              <div className="point-wrapper">
                <div className="point">1~300</div>
                <div className="rp">RP</div>
              </div>
            </div>
            <div className="item silver">
              <div className="tier-box">
                <img src="/image-web/game/tier/SILVER.png" />
                <div className="tier">SILVER</div>
              </div>
              <div className="point-wrapper">
                <div className="point">301~700</div>
                <div className="rp">RP</div>
              </div>
            </div>
            <div className="item gold">
              <div className="tier-box">
                <img src="/image-web/game/tier/GOLD.png" />
                <div className="tier">GOLD</div>
              </div>
              <div className="point-wrapper">
                <div className="point">701~1500</div>
                <div className="rp">RP</div>
              </div>
            </div>
            <div className="item platinum">
              <div className="tier-box">
                <img src="/image-web/game/tier/PLATINUM.png" />
                <div className="tier">PLATINUM</div>
              </div>
              <div className="point-wrapper">
                <div className="point">1501~2500</div>
                <div className="rp">RP</div>
              </div>
            </div>
            <div className="item diamond">
              <div className="tier-box">
                <img src="/image-web/game/tier/DIAMOND.png" />
                <div className="tier">DIAMOND</div>
              </div>
              <div className="point-wrapper">
                <div className="point">2501~</div>
                <div className="rp">RP</div>
              </div>
            </div>
            <div className="item master">
              <div className="tier-box">
                <img src="/image-web/game/tier/MASTER.png" />
                <div className="tier">MASTER</div>
              </div>
              <div className="point-wrapper" style={{ width: "54px" }}>
                <div className="point">상위 랭커 5위~</div>
                <div className="rp">RP</div>
              </div>
            </div>
          </div>

          <div className="ranking-point-wrapper">
            <div className="title">랭킹 포인트 획득 방법</div>
            <div className="tournament-wrapper">
              <div className="item">
                <div className="image">
                  <img src="/image-web/game/popup/ranking-tournament1.png" />
                  <div className="tournament">프리 토너먼트</div>
                </div>
                <div className="bottom">
                  <div className="wrapper">
                    <div className="item">
                      <div className="rank">
                        <img src="/image-web/game/myPage/first.png" />
                      </div>
                      <div className="rp">
                        300<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <img src="/image-web/game/myPage/second.png" />
                      </div>
                      <div className="rp">
                        250<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <img src="/image-web/game/myPage/third.png" />
                      </div>
                      <div className="rp">
                        200<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <div>4위 - 10위</div>
                      </div>
                      <div className="rp">
                        150<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <div>11위 - 20위</div>
                      </div>
                      <div className="rp">
                        100<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <div>21위 - 30위</div>
                      </div>
                      <div className="rp">
                        30<span>RP</span>
                      </div>
                    </div>
                  </div>
                  <div className="description">토너먼트 참여 10 RP</div>
                </div>
              </div>
              <div className="item">
                <div className="image">
                  <img src="/image-web/game/popup/ranking-tournament2.png" />
                  <div className="tournament">토너먼트</div>
                </div>
                <div className="bottom">
                  <div className="wrapper">
                    <div className="item">
                      <div className="rank">
                        <img src="/image-web/game/myPage/first.png" />
                      </div>
                      <div className="rp">
                        200<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <img src="/image-web/game/myPage/second.png" />
                      </div>
                      <div className="rp">
                        150<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <img src="/image-web/game/myPage/third.png" />
                      </div>
                      <div className="rp">
                        100<span>RP</span>
                      </div>
                    </div>
                    <div className="item">
                      <div className="rank">
                        <div>4위 - 10위</div>
                      </div>
                      <div className="rp">
                        50<span>RP</span>
                      </div>
                    </div>
                  </div>
                  <div className="description">토너먼트 참여 10 RP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameRankingPopupWrapper>
  );
};

export default RankingDialog;
