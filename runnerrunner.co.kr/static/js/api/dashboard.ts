import instance from "../utils/network";
import { Cafe, HoldemNowType } from "./types";
import { RunnerEvent } from "./event";
import { IYoutubeChannel } from "./youtube";
import { Job } from "./job";
import { SecondHandMarketResponse } from "./second-hand-market";
import { TournamentInfoInterface } from "./game";

export interface DashboardPopup {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  displayOrder: number;
  webImage: string;
  appImage: string;
  webUrl: string;
  appUrl: string;
}

export interface DashboardCity {
  province: {
    id: number;
    code: number;
    name: string;
    centerLat: number;
    centerLon: number;
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  };
  city: {
    id: number;
    code: number;
    name: string;
    provinceId: number;
    centerLat: number;
    centerLon: number;
    minLat: number;
    minLon: number;
    maxLat: number;
    maxLon: number;
  };
  street: {
    id: number;
    code: number;
    name: string;
    cityId: number;
    centerLat: number;
    centerLon: number;
  };
}

export interface DashboardTournament {
  id: number;
  groupId: number;
  imageUrl: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string | null;
  tournamentGroup: string;
  isOpen: boolean;
}
export interface DashboardDailyTournament {
  id: number;
  groupId: number;
  imageUrl: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string | null;
  tournamentGroup: string;
  isOpen: boolean;
  tournamentInfo: TournamentInfoInterface;
}

export interface DashboardMajorTournament {
  id: number;
  image: string;
  title: string;
  description: string | null;
  lat: null;
  lon: null;
  prize: number;
  prizeUnit: string;
  place: string;
  phone: string | null;
  event: any;
  webUrl: string;
  startAt: string;
  endAt: string;
}

export interface DashBoardYoutube {
  id: number;
  url: string;
  ord: number;
  thumbnailUrl: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  youtubeChannel: IYoutubeChannel;
}

export interface DashboardResponse {
  popup: DashboardPopup[];
  runnerEventBanner: RunnerEvent[];
}

export interface ArticleComment {
  id: number;
  content: string;
  authorNickname: string;
  createdAt: string;
  parentId?: number;
  comments: ArticleComment[];
}
export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  userId: number;
  userProfile?: string;
  authorId: number;
  authorNickname: string;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  comments: ArticleComment[];
  type: string;
}

export interface CommunityDashboardResponse {
  holdemNowList: HoldemNowType[];
  jobOpeningList: Job[];
  secondHandList: SecondHandMarketResponse[];
  articleList: ArticleResponse[];
  hotSecondHandMarket?: SecondHandMarketResponse;
  hotArticle?: ArticleResponse;
  hotJobOpening?: Job;
}

export function communityDashboard(): Promise<CommunityDashboardResponse> {
  return instance.get("/dashboard/community/7");
}
export function dashboard(): Promise<DashboardResponse> {
  return instance.get("/dashboard");
}
