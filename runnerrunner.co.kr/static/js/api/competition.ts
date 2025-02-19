import instance from "../utils/network";

export enum CompetitionType {
  DOMESTIC = "DOMESTIC",
  INTERNATIONAL = "INTERNATIONAL",
  PUB = "PUB",
}

export enum Region {
  SEOUL = "SEOUL",
  GYEONGGI = "GYEONGGI",
  INCHEON = "INCHEON",
  GANGWON = "GANGWON",
  JUNRA = "JUNRA",
  GYUNGNAM_BUSAN = "GYUNGNAM_BUSAN",
  GYUNGBUK_DAEGU = "DAEGU",
  CHUNGCHEONG = "CHUNGCHEONG",
  DAEJEON_SEJONG = "DAEJEON",
  JEJU = "JEJU",
  ASIA = "ASIA",
  AMERICA = "AMERICA",
  EUROPE = "EUROPE",
}

export enum KoreaRegion {
  ALL = "ALL",
  SEOUL = "SEOUL",
  GYEONGGI = "GYEONGGI",
  INCHEON = "INCHEON",
  GANGWON = "GANGWON",
  JUNRA = "JUNRA",
  GYUNGNAM_BUSAN = "GYUNGNAM_BUSAN",
  GYUNGBUK_DAEGU = "DAEGU",
  CHUNGCHEONG = "CHUNGCHEONG",
  DAEJEON_SEJONG = "DAEJEON",
  JEJU = "JEJU",
}

export enum WorldRegion {
  ALL = "ALL",
  ASIA = "ASIA",
  AMERICA = "AMERICA",
  EUROPE = "EUROPE",
}

export enum TournamentState {
  진행중,
  진행예정,
  마감,
}

export interface CompetitionTournamentDto {
  id: number;
  title: string;
  location: string;
  region: Region;
  type: CompetitionType;
  thumbnail: string;
  startDate: Date;
  endDate: Date;
  state: TournamentState;
}

export interface CompetitionTournamentListResponseDto {
  items: CompetitionTournamentDto[];
  total: number;
  page: number;
  lastPage: number;
}

export interface CompetitionTournamentRequest {
  page: number;
  limit: number;
  year: number;
  type: CompetitionType;
  month: number;
  region?: KoreaRegion | WorldRegion | null;
}

export interface CompetitionEventResponse {
  createdAt: string;
  id: number;
  name: string;
  buyIn: string;
  registrationEndLevelString: string;
  durations: string;
  startingStack: number;
  date: string;
}

export interface CompetitionTournamentDetailResponse
  extends CompetitionTournamentDto {
  posters: string[];
  competitionEvents: CompetitionEventResponse[];
}

export function getCompetitionTournament(
  params: CompetitionTournamentRequest
): Promise<CompetitionTournamentListResponseDto> {
  return instance.get(`/nest/competition-tournaments`, { params });
}

export function getCompetitionTournamentById(
  id: number
): Promise<CompetitionTournamentDetailResponse> {
  return instance.get(`/nest/competition-tournaments/${id}`);
}

export function getCompetitionEventByCompetitionId(
  id: number
): Promise<CompetitionEventResponse[]> {
  return instance.get(`/nest/competition-events/tournament/${id}`);
}
