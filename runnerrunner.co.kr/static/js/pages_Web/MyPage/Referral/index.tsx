import { useEffect, useState } from "react";
import Receive from "./Receive";
import { gameGetJoinSetting } from "../../../../api/game";
import useUserInfo from "../../../../hooks/useUserInfo";

import { useSetRecoilState } from "recoil";
import { loadingState } from "../../../../recoil/app";
import {
  DashBar,
  EventColWrapper,
  EventImageRowWrapper,
  EventImageWrapper,
  EventRewardWrapper,
  EventTitleWrapper,
} from "./styles/index";
import {
  ContentWrapper,
  EventInfoContentWrapper,
  EventInfoWrapper,
  ReferralWrapper,
  ShareButton,
} from "./styles";
import { getReferralUrl, shareURL } from "../../../../utils/common";

interface RPHistoryProps {
  onClose: () => void;
}

export interface IJoinSetting {
  name: string;
  value: string;
}

const RPHistory = ({ onClose }: RPHistoryProps) => {
  const setLoading = useSetRecoilState(loadingState);
  const { user } = useUserInfo(true);
  const [rewardGP, setRewardGP] = useState(0);

  useEffect(() => {
    if (user) {
      setLoading(true);
      gameGetJoinSetting()
        .then((res) => {
          const data = res;
          const fgm = data.find(
            (o: IJoinSetting) => o.name === "gamePointReward"
          );

          if (fgm) {
            setRewardGP(parseInt(fgm.value));
          }
        })
        .catch((e) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setLoading, user]);

  return (
    <>
      <ReferralWrapper scrollLock={true}>
        <div className="header">
          <div className="close" onClick={onClose}>
            <img src="/image-web/Icon/Back.svg" alt="close" />
          </div>
          <div className="title">친구 초대 이벤트</div>
        </div>
        <EventInfoWrapper>
          <DashBar></DashBar>
          <EventInfoContentWrapper>
            <EventTitleWrapper>
              친구도 나도 {rewardGP.toLocaleString()} GP ! 보너스
            </EventTitleWrapper>
            <EventImageRowWrapper>
              <EventColWrapper>
                <EventImageWrapper>
                  <div className="image-box">
                    <img
                      alt="러너기본"
                      src="https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png"
                    ></img>
                  </div>
                </EventImageWrapper>
                <EventRewardWrapper>
                  {rewardGP.toLocaleString()} GP
                </EventRewardWrapper>
              </EventColWrapper>
              <EventColWrapper>
                <EventImageWrapper>
                  <div className="image-box">
                    <img
                      alt="러너기본"
                      src="https://dfesoodpx4jgd.cloudfront.net/user/default_profile.png"
                    ></img>
                  </div>
                </EventImageWrapper>
                <EventRewardWrapper>
                  {rewardGP.toLocaleString()} GP
                </EventRewardWrapper>
              </EventColWrapper>
            </EventImageRowWrapper>
          </EventInfoContentWrapper>
        </EventInfoWrapper>
        {user && (
          <ShareButton
            onClick={() => {
              shareURL(getReferralUrl(user.nickname));
            }}
          >
            초대링크 공유하기
          </ShareButton>
        )}
        <ContentWrapper>
          <Receive />
        </ContentWrapper>
      </ReferralWrapper>
    </>
  );
};

export default RPHistory;
