import instance from "../utils/network";


export interface Faq {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}


export function getFAQList(): Promise<Faq[]> {
  return instance.get('/faq/list');
}
