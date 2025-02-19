export enum ROOM_JOIN_STATUS {
  OBSERVE, // JUST JOINER // can leave room
  BUYIN_READY, // buyin, // can not leave room forcely
  PLAYING, // play in game // can not leave room forcely
  FOLD, // playing status but now die // can not leave room forcely
}

export enum RAKE_TYPE {
  NONE,
  POT_RAKE,
  HAND_RAKE,
}

export enum PROFIT_TYPE {
  NONE,
  POT_RAKE,
  HAND_RAKE,
  LEAVEROOM_HAND_LOSS,
}

export enum ROOM_STATUS {
  READY,
  INGAME,
}

export enum ROOM_TYPE {
  TOURNAMENT,
  RING,
}

export enum TOURNAMENT_TYPE {
  DAILY,
  PRIZE_DAILY,
}

export type CreateRingRoomInterface = {
  type: ROOM_TYPE.RING;
  buyIn: number;
  smallBlind: number;
  bigBlind: number;
  blind: number[];
  endDate: string;
  minBuyin: number;
  maxBuyin: number;
  maxTableMember: number;
  isStraddle: boolean;
  isAnte: boolean;
  ante: number;
  rakeType: RAKE_TYPE;
  rake: number;
};

export interface CreateTournamentRoomInterface {
  type: ROOM_TYPE.TOURNAMENT;
  buyIn: number;
  smallBlind: number;
  bigBlind: number;
  blindStructure: (number|string)[][];
  name: string;
  startedAt: string;
  buyinPrice: number;
  addonPrice: number;
  beginChip: number;
  rebuyinChip: number;
  addOnChip: number;
  preRegisterBenefitTimeMinutes: number;
  preRegisterBenefitChip: number;
  isGtd: boolean,
  isOverGtd: boolean,
  totalPrize: number,
  gtdRatio: number,
  overPrize: number[],
  prize: number[];
  availableRegisterLevel: number;
  minTotalMember: number;
  maxTotalMember: number;
  maxTableMember: number;
  finalTableMember: number;
  rebuyinLimit: number;
  handforhand:number,
  timeStructure: {
    playTimeSeconds: number;
    restTimeSeconds: number;
  }; // 플레이 시간 구조
  isAnte: boolean;
  isStraddle: boolean;
  rakeType: RAKE_TYPE;
}

export type AddRoomInterface =
  | CreateRingRoomInterface
  | CreateTournamentRoomInterface;

export enum GAME_STATUS {
  NO_PLAYING,
  BETTING,
  FLAP_CARD,
  CHOOSE_WINNER,
}

export enum BET_TYPE {
  BLIND,
  CHECK,
  CALL,
  FOLD,
  RAISE,
  ALLIN,
  BET,
  SB,
  BB,
  STR,
  ANTE,
}

export interface Text {
  ko: string;
  en: string;
}

export interface MyInfo {
  userId: number;
  money: number;
  nickname: string;
  profileImg: string;
}

export interface GamePlayer {
  status: ROOM_JOIN_STATUS;
  userId: number;
  nickname: string;
  profileImg: string;
  seat: number;
  buyin: number;
  stackSize: number;
  prevStackSize: number;
  handsCount: number;
  bet: number;
  ante: number;
  rake: number;
  blindWait: boolean;
  lastAction: BET_TYPE;
  left: boolean;
  leaveRoomTime: string;
  waitGame: boolean;
  vpip: number;
}

export interface SimpleTournamentUser {
  userId: number;
  stackSize: number;
  nickname: string;
  profileImg: string;
  ranking: number;
}

export interface GroupInfo {
  groupId: number;
  type: ROOM_TYPE;
  data: any;
  isOpen: boolean;
  isEnd: boolean;
  addedAt: string;
  tableCount: number;

  totalPlayerCount: number;
  totalRegisterCount: number;
  isRegister: boolean;
  ranking: number;
  stackSize: number;
}

export interface RoomStatus {
  roomId: number;
  groupId: number;
  gameName: string;
  roomStatus: ROOM_STATUS;
  gameStatus: GAME_STATUS;
  groupData: any;
}

export interface RoomInfo extends RoomStatus {
  type: ROOM_TYPE;
  players: GamePlayer[];
  buttonPosition: number;
  cards: number[];
  pots: number[];
  minRaise: number;
  handNumber: number;
  currentBet: number;
  currentRound: string;
  observeCount: number;
}

export interface MyPlayStatus extends GamePlayer {}

export interface winnerListModel {
  userId: number;
  nickname: string;
}

export interface winnerModel {
  userId: number;
  amount: number;
}

export interface userCardModel {
  userId: number;
  cards: Array<number>;
}

export interface tournamentParticipateModel {
  roomId: number;
  userIds: Array<number>;
}

export interface emitAfterBetModel {
  lastBetStatus: {
    userId: number;
    type: BET_TYPE;
    bet: number;
  };
  playerBettings: Array<PlayersBettings>;
  pots: Array<{
    amount: number;
    eligiblePlayers: Array<number>;
  }>;
  myStatus: MyPlayStatus;
  isAllIn: boolean;
}

export interface PlayersBettings {
  id: number;
  bet: number;
  ante: number;
  rake: number;
  stackSize: number;
  prevStackSize: number;
  folded: boolean;
}

export interface requestBetModel {
  roomId: number;
  leftSec: number;
  lastPlayer: number;
  userId: number;
  insertId: number;
  legalAct: string[];
}

export interface handHistoryModel {
  betId: number;
  groupId: number;
  roomId: number;
  game: number;
  round: number;
  userId: number;
  type: BET_TYPE;
  bet: number;
  fold: boolean;
  bettedAt: string;
  nickname: string;
  profileImg: string;
  seat: number;
  position: string;
  lastGameData: {
    cards: Array<{
      userId: number;
      cards: Array<number>;
    }>;
    winners: Array<{
      userId: number;
      amount: number;
    }>;
    communityCards: Array<number>;
    pots: Array<{
      amount: number;
      eligiblePlayers: Array<number>;
    }>;
  } | null;
}

export interface userProfileModel {
  userId: number;
  nickname: string;
  profileImg: string;
  handCount: number;
  vpip: number;
  winRate: number;
  pfr: number;
  bet3: number;
  ats: number;
}

export interface searchDataModel {
  roomId: number;
  userList: Array<{ userId: number; nickname: string }>;
}

export interface tournamentRankingModel {
  userId: number;
  stackSize: number;
  ranking: number;
}

export const CARD_INFO = [
  "2c",
  "3c",
  "4c",
  "5c",
  "6c",
  "7c",
  "8c",
  "9c",
  "Tc",
  "Jc",
  "Qc",
  "Kc",
  "Ac",
  "2d",
  "3d",
  "4d",
  "5d",
  "6d",
  "7d",
  "8d",
  "9d",
  "Td",
  "Jd",
  "Qd",
  "Kd",
  "Ad",
  "2h",
  "3h",
  "4h",
  "5h",
  "6h",
  "7h",
  "8h",
  "9h",
  "Th",
  "Jh",
  "Qh",
  "Kh",
  "Ah",
  "2s",
  "3s",
  "4s",
  "5s",
  "6s",
  "7s",
  "8s",
  "9s",
  "Ts",
  "Js",
  "Qs",
  "Ks",
  "As",
];

export enum TournamentType {
  Tournament = "TOURNAMENT",
  Daily = "DAILY",
}

export enum ReBuyInType {
  INDIVIDUAL = "INDIVIDUAL",
  SHARE = "SHARE",
}

export enum EarlyChipSettingType {
  NONE = "NONE",
  USER_LIMIT = "USER_LIMIT",
  LEVEL_LIMIT = "LEVEL_LIMIT",
}

export enum PrizeType {
  FREE_TICKET = "FREE_TICKET",
  MONEY = "MONEY",
}

export enum StructureType {
  LEVEL = "LEVEL",
  BREAK = "BREAK",
}
