import instance from "../utils/network";
import { ArticleResponse } from "./dashboard";

export interface ArticleRequest {
  title: string;
  content: string;
  type?: string;
}

export interface CommentRequest {
  parentId?: number | null;
  content: string;
  articleId?: number | null;
}

export interface ArticleMainResponse {
  articles: ArticleResponse[];
  notices: ArticleResponse[];
}

export interface ArticleReportRequest {
  articleId: number;
  type: string;
  description: string;
}

export interface ArticleBlockRequest {
  blockUserId: number;
}

export interface ArticleCommentReportRequest {
  commentId: number;
  type: string;
  description: string;
}
export function uploadArticleImage(formData: FormData) {
  return instance.post("/board/upload", formData);
}

export function blockArticleUser(request: ArticleBlockRequest) {
  return instance.post("/board/block", request);
}

export function uploadBoard(
  body: ArticleRequest
): Promise<{ code: number; message: string }> {
  return instance.post("/board/articles", body);
}

export function updateBoard(body: ArticleRequest, id: number) {
  return instance.put(`/board/articles/${id}`, body);
}

export function updateComment(body: CommentRequest, id: number) {
  return instance.put(`/board/comments/${id}`, body);
}

export function reportBoard(body: ArticleReportRequest) {
  return instance.put(`/board/articles/report`, body);
}

export function reportComment(body: ArticleCommentReportRequest) {
  return instance.put(`/board/articles-comment/report`, body);
}

export function removeComment(id: number) {
  return instance.delete(`/board/comments/${id}`);
}

export function registerComment(
  id: number,
  body: CommentRequest
): Promise<{ code: number; message: string }> {
  return instance.post(`/board/articles/${id}/comments`, body);
}
export function removeBoard(id: number) {
  return instance.delete(`/board/articles/${id}`);
}

export function getBoardMain(
  selectedTab?: string,
  boardType?: string
): Promise<ArticleMainResponse> {
  return instance.get("/board/articles");
}

export function getBoardBest(): Promise<ArticleResponse[]> {
  return instance.get("/board/articles/best");
}

export function getBoardDetail(id: number): Promise<ArticleResponse> {
  return instance.get(`/board/articles/${id}`);
}

export function getNotices(): Promise<ArticleResponse[]> {
  return instance.get("/board/articles/notices");
}
