import { useHistory, useParams } from "react-router-dom";
import {
  CommunityHeader,
  CommunityTabItem,
  CommunityTabWrapper,
  CommunityWrapper,
} from "./style";
import { useEffect, useState } from "react";
import HandBoard from "./handBoard";
import useUserInfo from "../../../hooks/useUserInfo";
import { enqueueSnackbar } from "notistack";
import RecruitPage from "./Recruit";
import SecondHandMarket from "./SecondHandMarket";

const Community = () => {
  const history = useHistory();

  const { user } = useUserInfo();
  const [selectTab, setSelectTab] = useState("hand-board");
  const { tab }: { tab: string } = useParams();
  const handleIsSelected = (tab: string) => {
    return selectTab === tab;
  };
  useEffect(() => {
    if (tab) setSelectTab(tab);
  }, []);

  return (
    <CommunityWrapper>
      <CommunityHeader>
        <img
          onClick={() => {
            history.replace("/");
          }}
          src="/image-web/Icon/Back.svg"
          id="커뮤니티 뒤로가기"
          alt="close"
        />
        <span>커뮤니티</span>
      </CommunityHeader>

      <CommunityTabWrapper>
        <CommunityTabItem
          isSelected={handleIsSelected("hand-board")}
          onClick={() => {
            setSelectTab("hand-board");
            history.replace("/community/hand-board/all");
          }}
        >
          <img
            src={`/image-web/community/tab/${
              handleIsSelected("hand-board") ? "select-" : ""
            }hand-board.png`}
            alt="tab"
          />
          <span>
            핸드
            <br /> 게시판
          </span>
        </CommunityTabItem>
        <CommunityTabItem
          isSelected={handleIsSelected("dealer-board")}
          onClick={() => {
            if (
              user?.role === "ROLE_DEALER" ||
              user?.role === "ROLE_ADMIN" ||
              user?.role === "ROLE_SUPER_ADMIN"
            ) {
              setSelectTab("dealer-board");
              history.replace("/community/dealer-board/all");
            } else {
              enqueueSnackbar("접근 불가능한 게시판입니다.");
            }
          }}
        >
          <img
            src={`/image-web/community/tab/${
              handleIsSelected("dealer-board") ? "select-" : ""
            }dealer-board.png`}
            alt="tab"
          />
          <span>
            딜러
            <br /> 게시판
          </span>
        </CommunityTabItem>
        <CommunityTabItem
          isSelected={handleIsSelected("pub-board")}
          onClick={() => {
            if (
              user?.role === "ROLE_SELLER" ||
              user?.role === "ROLE_ADMIN" ||
              user?.role === "ROLE_SUPER_ADMIN"
            ) {
              setSelectTab("pub-board");
              history.replace("/community/pub-board/all");
            } else {
              enqueueSnackbar("접근 불가능한 게시판입니다.");
            }
          }}
        >
          <img
            src={`/image-web/community/tab/${
              handleIsSelected("pub-board") ? "select-" : ""
            }pub-board.png`}
            alt="tab"
          />
          <span>
            업주
            <br /> 게시판
          </span>
        </CommunityTabItem>
        <CommunityTabItem
          isSelected={handleIsSelected("job-board")}
          onClick={() => {
            setSelectTab("job-board");
            history.replace("/community/job-board");
          }}
        >
          <img
            src={`/image-web/community/tab/${
              handleIsSelected("job-board") ? "select-" : ""
            }job-board.png`}
            alt="tab"
          />
          <span>
            실시간
            <br /> 채용
          </span>
        </CommunityTabItem>
        <CommunityTabItem
          isSelected={handleIsSelected("market-board")}
          onClick={() => {
            setSelectTab("market-board");
            history.replace("/community/market-board");
          }}
        >
          <img
            src={`/image-web/community/tab/${
              handleIsSelected("market-board") ? "select-" : ""
            }market-board.png`}
            alt="tab"
          />
          <span>
            홀덤
            <br /> 중고장터
          </span>
        </CommunityTabItem>
      </CommunityTabWrapper>

      {selectTab === "hand-board" && <HandBoard boardType="ROLE_USER" />}
      {selectTab === "dealer-board" &&
        (user?.role === "ROLE_DEALER" ||
          user?.role === "ROLE_ADMIN" ||
          user?.role === "ROLE_SUPER_ADMIN") && (
          <HandBoard boardType="ROLE_DEALER" />
        )}
      {selectTab === "pub-board" &&
        (user?.role === "ROLE_SELLER" ||
          user?.role === "ROLE_ADMIN" ||
          user?.role === "ROLE_SUPER_ADMIN") && (
          <HandBoard boardType="ROLE_SELLER" />
        )}
      {selectTab === "job-board" && (
        <div style={{ flex: 1, overflow: "hidden" }}>
          <RecruitPage />
        </div>
      )}
      {selectTab === "market-board" && <SecondHandMarket />}
    </CommunityWrapper>
  );
};

export default Community;
