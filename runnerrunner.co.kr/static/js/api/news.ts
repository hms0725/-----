import instance from "../utils/network";

export interface NewsResponse {
  id: number | null;
  title: string | null;
  contentHtml: string;
  mainImageKey: string;
  category: string | null;
  authorName: string | null;
  isPublished: boolean | null;
  views: number | null;
  createdAt: string;
  link: string | null;
}

export interface HotAndPagedNewsResponse {
  hotNews: NewsResponse[];
  news: NewsResponse[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

export interface NewsCategory {
  name: string;
  id: number;
}

export function getNews(
  page: number,
  size: number,
  hot?: number,
  category?: number
): Promise<HotAndPagedNewsResponse> {
  return instance.get(
    `/news?page=${page}&size=${size}&hot=${hot ? hot : ""}&category=${
      category ? category : ""
    }`
  );
}

export function getNewsById(id: string): Promise<NewsResponse> {
  return instance.get(`/news/${id}`);
}

export function getNewsCategory(): Promise<NewsCategory[]> {
  return instance.get(`/news-category`);
}

export function shareNews(id: number) {
  return instance.patch(`/news/${id}`);
}
