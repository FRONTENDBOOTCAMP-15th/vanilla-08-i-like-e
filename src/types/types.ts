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
};
export type ApiusersResponse = {
  item: ApiUser[];
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
  postViews: number;
  posts?: number;
  bookmarkedBy: { users: number };
};

export type ApiUserDetailRes = {
  ok: number;
  item: ApiUser;
};
