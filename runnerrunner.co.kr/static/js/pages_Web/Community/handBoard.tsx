import { useEffect, useState, useCallback, useMemo } from "react";
import {
  CommunityCommonBannerWrapper,
  CommunityCommonListWrapper,
  CommunityCommonSubTabWrapper,
} from "./style";
import { HandBoardWrapper, WriteButton } from "./style/hand-board";
import { ArticleResponse } from "../../../api/dashboard";
import BoardItem from "./component/board-item";
import { extractFirstImageSrc } from "../../../utils/html";
import Best from "./component/best";
import { getHandBoardFilter } from "../../../api/community";
import WritePage from "./component/write";
import useUserInfo from "../../../hooks/useUserInfo";
import { enqueueSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";
import { isEdited } from "../../../utils/date";

const TABS = {
  ALL: "전체",
  NORMAL: "핸드스토리",
  DAILY: "일상",
  BEST: "베스트",
  NOTICE: "공지",
} as const;

type TabType = keyof typeof TABS;

interface HandBoardProps {
  boardType?: "ROLE_USER" | "ROLE_DEALER" | "ROLE_SELLER";
}

const HandBoard = ({ boardType = "ROLE_USER" }: HandBoardProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType | null>(null);
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [bestList, setBestList] = useState<ArticleResponse[]>([]);
  const [showWrite, setShowWrite] = useState(false);
  const { user } = useUserInfo();
  let { subTab }: { subTab: string } = useParams();
  const history = useHistory();
  const [subTabUpper, setSubTabUpper] = useState<string | null>(null);

  useEffect(() => {
    if (subTab) {
      const subTabUpperString = subTab.toUpperCase();
      setSubTabUpper(subTabUpperString);
      if (
        ["ALL", "NORMAL", "DAILY", "BEST", "NOTICE"].includes(subTabUpperString)
      ) {
        setSelectedTab(subTabUpperString as TabType);
      }
    }
  }, [subTab]);
  const route =
    boardType === "ROLE_USER"
      ? "hand"
      : boardType === "ROLE_DEALER"
      ? "dealer"
      : "seller";
  // 동적으로 TABS 생성
  const filteredTabs = useMemo(() => {
    if (boardType === "ROLE_USER") {
      return TABS; // "ROLE_USER"일 경우 전체 TABS 반환
    }

    // "핸드스토리" 제거된 새 객체 생성
    return Object.fromEntries(
      Object.entries(TABS)
        .filter(([key]) => key !== "NORMAL")
        .filter(([key]) => key !== "DAILY")
    ) as typeof TABS;
  }, [boardType]);

  const fetchArticles = useCallback(
    async (tab: string) => {
      try {
        const response = await getHandBoardFilter(
          route,
          tab === "ALL" ? null : tab
        );

        setArticles(response.list);
        setBestList(response.best);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    },
    [boardType, showWrite]
  );

  useEffect(() => {
    if (subTabUpper) fetchArticles(subTabUpper);
  }, [selectedTab, fetchArticles, subTabUpper]);

  const getTabClassName = (tab: TabType) => {
    return `item ${tab === selectedTab ? "select" : ""}`.trim();
  };

  const TabItem = ({ tab, label }: { tab: TabType; label: string }) => (
    <div
      className={getTabClassName(tab)}
      onClick={() => {
        console.log(tab);
        setSelectedTab(tab);
        setSubTabUpper(tab);
        const currentPath = window.location.pathname;
        const basePath = currentPath.split("/").slice(0, -1).join("/");
        history.push(`${basePath}/${tab}`);
      }}
    >
      {label}
    </div>
  );

  // Best 게시물을 위한 필터링
  const bestArticles = useMemo(() => bestList.slice(0, 5), [bestList]);

  const CommunityBanner = () => (
    <CommunityCommonBannerWrapper>
      <div className="banner">
        <span>
          러너러너
          <br />
          커뮤니티 가이드
        </span>
        <img src="/image-web/community/banner-book.png" alt="banner-icon" />
      </div>
    </CommunityCommonBannerWrapper>
  );

  return (
    <HandBoardWrapper>
      <CommunityCommonSubTabWrapper>
        {Object.entries(filteredTabs).map(([key, value]) => (
          <TabItem key={key} tab={key as TabType} label={value} />
        ))}
      </CommunityCommonSubTabWrapper>

      <div className="scrollable-content">
        {/* <CommunityBanner /> */}

        {boardType !== "ROLE_USER" && bestList.length > 0 && (
          <Best hotArticles={bestArticles} boardType={boardType} />
        )}

        <CommunityCommonListWrapper>
          {articles.map((article) => (
            <BoardItem
              key={article.id}
              type={filteredTabs[article.type as TabType]}
              content={article.content}
              link={`/article/detail/${route}/${article.id}`}
              title={article.title}
              nickname={article.authorNickname}
              viewCount={article.viewCount}
              commentCount={article.commentCount}
              date={article.createdAt}
              isEdited={isEdited(article)}
              thumbnail={extractFirstImageSrc(article.content)}
            />
          ))}
        </CommunityCommonListWrapper>
      </div>
      {user && (
        <WriteButton
          onClick={() => {
            if (user?.validate) {
              setShowWrite(true);
            } else {
              enqueueSnackbar("본인인증이 필요한 서비스입니다.", {
                variant: "error",
              });
            }
          }}
        >
          <img src="/image-web/market/write.svg" alt="글 작성" />
        </WriteButton>
      )}

      {showWrite && <WritePage onClose={setShowWrite} boardType={boardType} />}
    </HandBoardWrapper>
  );
};

export default HandBoard;
