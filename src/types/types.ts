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
export type ApiusersResponse = {
  item: ApiUser[];
  // page: 3;
};

export type ApiUser = {
  _id: number;
  email: string;
  name: string;
  image?: string;
  extra?: {
    job: string;
    biography: string;
    keyword: Array<string>;
  };
  refreshToken: string;
};
