export type ApiPost = {
  _id: number;
  type: string;
  title: string;
  content: string;
  image?: string;
  views?: number;
  user: { _id: number; name: string; image?: string };
  extra?: { subTitle: string; writer: string };
};

export type ApiPostsResponse = {
  item: ApiPost[];
  // page: 3;
};
