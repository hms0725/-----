import instance from "../utils/network";
import axios from "axios";

const GAME_API_ENDPOINT = process.env.REACT_APP_API_HOST + "/api";

const GAME_API_SERVER_ENDPOINT = process.env.REACT_APP_REST_API_HOST + "/api";

export interface TournamentInfoInterface {
  info: {
    groupId: number;
    type: number;
    data: {
      name: string;
      prize: number[];
      isAnte: boolean;
      rakeType: number;
      addOnChip: number;
      beginChip: number;
      startedAt: string;
      addonPrice: number;
      buyinPrice: number;
      isStraddle: number;
      rebuyinChip: number;
      rebuyinLimit: number;
      timeStructure: {
        playTimeSeconds: number;
        restTimeSeconds: number;
      };
      blindStructure: number[][];
      maxTableMember: number;
      maxTotalMember: number;
      minTotalMember: number;
      finalTableMember: number;
      tournamentType: number;
      availableRegisterLevel: number;
      preRegisterBenefitChip: number;
      preRegisterBenefitTimeMinutes: number;
    };
    isOpen: number;
    isStarted: number;
    isEnd: number;
    isRecord: number;
    addedAt: string;
    totalPlayerCount: null | number;
    totalRegisterCount: number;
    tableCount: number;
    isRegister: number;
    ranking: null | number;
    stackSize: number;
    tableIds: number[];
  };
}

export interface UserTicketInfoInterface {
  user: {
    userId: number;
    uid: string;
    point: number;
    rebuyinTicket: number;
  };
}

export interface TournamentMemberItemInterface {
  groupId: number;
  userId: number;
  buyinCount: number;
  stackSize: number;
  lastStackSize: number;
  addedAt: string;
  updatedAt: string | null;
  eliminatedAt: string | null;
  nickname: string;
}
export interface TournamentMembersInterface {
  list: TournamentMemberItemInterface[];
}

export interface RingGameItemInterface {
  groupId: number;
  type: number;
  data: {
    ante: number;
    rake: number;
    blind: number[];
    isAnte: boolean;
    endDate: string;
    maxBuyin: number;
    minBuyin: number;
    rakeType: number;
    isStraddle: boolean;
    maxTableMember: number;
  };
  isOpen: number;
  isStarted: number;
  isEnd: number;
  isRecord: number;
  addedAt: string;
  totalPlayerCount: string;
  tableCount: number;
}

export interface RingGameListInterface {
  list: {
    list: RingGameItemInterface[];
  };
}

interface PlayerInfoInterface {
  nickname: string;
  stackSize: number;
}
export interface TableInfoInterface {
  roomId: number;
  players: (PlayerInfoInterface | null)[];
  playerCount: number;
}
export interface TableInfoListInterface {
  list: TableInfoInterface[];
}

export function gameGetJoinSetting(): Promise<
  {
    name: string;
    value: any;
  }[]
> {
  return instance.get("/get_join_setting", {
    baseURL: GAME_API_ENDPOINT,
  });
}

export function gameAddRecommend(data: { token: string }): Promise<{
  result: number;
}> {
  return instance.post("/add_recommend", data, { baseURL: GAME_API_ENDPOINT });
}

//게임서버 통신 API
export function getTournamentInfo(data: {
  groupId: number;
  token: string;
}): Promise<{ data: TournamentInfoInterface }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_tournament", {
    params: data,
  });
}
export function getTournamentTableInfo(data: {
  groupId: number;
}): Promise<{ data: TableInfoListInterface }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_tournament_table_info", {
    params: data,
  });
}
export function getTournamentMembers(data: {
  groupId: number;
  token: string;
}): Promise<{ data: TournamentMembersInterface }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_tournament_members", {
    params: data,
  });
}

export function getUserTicketInfo(data: {
  userId: number;
}): Promise<{ data: UserTicketInfoInterface }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_user_ticket_info", {
    params: data,
  });
}

export function getTournamentWinners(data: {
  groupId: number;
}): Promise<{ data: any }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_tournament_winners", {
    params: data,
  });
}

export function getRingGameList(data: {
  token: string;
}): Promise<{ data: RingGameListInterface }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_ring_list", {
    params: data,
  });
}

export function checkAlreadyJoinRingRoom(data: { token: string }): Promise<{
  data: {
    result: number;
    groupId?: number;
    link?: string;
  };
}> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/check_already_join_ring_room", {
    params: data,
  });
}

export function joinRingRoom(data: {
  token: string;
  groupId: number;
  password?: string;
}): Promise<{ data: any }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/join_ring", { params: data });
}
export function joinTournament(data: {
  token: string;
  groupId: number;
  addPoint?: number;
}): Promise<{ data: any }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/join_tournament", {
    params: data,
  });
}

export function getUserBuyInInfo(data: {
  userId: number;
  groupId: number;
}): Promise<{ data: any }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/get_user_buyin_info", {
    params: data,
  });
}

export function getObserveLink(data: {
  groupId: number;
  roomId: number;
  token: string;
}): Promise<{ data: any }> {
  return axios.get(GAME_API_SERVER_ENDPOINT + "/observe", { params: data });
}

export function createPasswordRingRoom(data: {
  token: string;
  password: string;
  bb: number;
}): Promise<{ data: any }> {
  return axios.post(
    GAME_API_SERVER_ENDPOINT + "/create_password_ring_room",
    data
  );
}
