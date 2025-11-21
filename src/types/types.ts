export type ApiPost = {
  _id: number;
  type: string;
  title: string;
  content: string;
  image?: string;
  views?: number;
  user: { _id: number; name: string; image?: string };
  extra?: { subTitle: string; writer: string };
  createdAt: Date;
  like: string;
  replies: Reply[];
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
export type ApiPostDetailRes = {
  ok: number;
  item: ApiPost;
};

export type ReplyUser = {
  _id: number;
  name: string;
  email: string;
  image: string;
};

export type Reply = {
  _id: number;
  user_id: number;
  user: ReplyUser;
  content: string;
  like: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiBookmark = {
  _id: number;
  user_id: number;
  memo?: string;
  createdAt: string;

  post?: ApiPost | null;
  user?: ApiUser | null; // ★★ 이거 반드시 있어야 함
};
