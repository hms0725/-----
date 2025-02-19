import instance from "../utils/network";
export interface IYoutube {
  id: number;
  url: string;
  ord: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  recommend: boolean;
  type: string;
  youtubeChannel: IYoutubeChannel;
}
export interface IYoutubeChannel {
  id: number;
  url: string;
  ord: number;
  name: string;
  type: string;
  profileUrl: string;
  createdAt: string;
}
export function getYoutubeList(type: string): Promise<IYoutube[]> {
  return instance.get(`/youtube/list?type=${type}`);
}

export function getYoutubeChannelList(): Promise<IYoutubeChannel[]> {
  return instance.get(`/youtube-channel/list`);
}
