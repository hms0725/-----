import instance from "../utils/network";
import { ArticleRequest, CommentRequest } from "./article";
import { ArticleResponse } from "./dashboard";
export interface IOpenChat {
  id: number;
  url: string;
  ord: number;
  title: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface HandBoardMainResponse {
  best: ArticleResponse[];
  list: ArticleResponse[];
}

export interface HandBoardReportRequest {
  articleId: number;
  type: string;
  description: string;
}

export interface HandBoardUserBlockRequest {
  blockUserId: number;
}

export interface HandBoardCommentReportRequest {
  commentId: number;
  type: string;
  description: string;
}
export function getOpenChatList(): Promise<IOpenChat[]> {
  return instance.get(`/community/open-chat`);
}

export function getHandBoardFilter(
  route: string,
  type?: string | null
): Promise<HandBoardMainResponse> {
  return instance.get(
    `/nest/community/${route}-board/filter${type ? `?type=${type}` : ""}`
  );
}

export function registerBoard(
  body: ArticleRequest,
  route: string
): Promise<{ code: number; message: string }> {
  return instance.post(`/nest/community/${route}-board`, body);
}

export function getHandBoardDetail(
  id: number,
  route: string
): Promise<ArticleResponse> {
  return instance.get(`/nest/community/${route}-board/detail/${id}`);
}

export function addComment(
  body: CommentRequest
): Promise<{ code: number; message: string }> {
  return instance.post(`/nest/community/hand-board/comment`, body);
}

export function updateComment(
  id: number,
  body: CommentRequest
): Promise<{ code: number; message: string }> {
  return instance.put(`/nest/community/hand-board/comment/${id}`, body);
}

export function removeComment(
  id: number
): Promise<{ code: number; message: string }> {
  return instance.delete(`/nest/community/hand-board/comment/${id}`);
}

export function removeHandBoard(
  id: number
): Promise<{ code: number; message: string }> {
  return instance.delete(`/nest/community/hand-board/${id}`);
}

export function uploadBoardImage(formData: FormData) {
  return instance.post("/nest/community/hand-board/upload", formData);
}

export function updateHandBoard(body: ArticleRequest, id: number) {
  return instance.put(`/nest/community/hand-board/${id}`, body);
}

export function blockBoardUser(request: HandBoardUserBlockRequest) {
  return instance.post("/nest/community/hand-board/block", request);
}

export function reportHandBoard(body: HandBoardReportRequest) {
  return instance.put(`/nest/community/hand-board/board/report`, body);
}

export function reportHandBoardComment(body: HandBoardCommentReportRequest) {
  return instance.put(`/nest/community/hand-board/comment/report`, body);
}
