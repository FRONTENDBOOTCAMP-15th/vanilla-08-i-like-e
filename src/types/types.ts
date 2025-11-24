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
  post: {
    extra: { subtitle: string };
    image: string;
    title: string;
    type: string;
    user: {
      _id: number;
      name: string;
      image: string;
    };
  };
  bookmarkedBy: { users: number; userItems: userItems };
};

type userItems = {
  _id: number;
  type: string;
  target_id: number;
  user: ReplyUser;
  reatedeAt: Date;
  updateAt: Date;
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

export type BookmarkItem = {
  _id: number; // 북마크 자체의 id
  user_id: number; // 북마크 만든 사람(로그인 유저) id
  target_id: number; // 구독한 대상(작가) id. 북마크 타입이 포스트면 게시글 북마크. 구독은 유저.
  user: user;
};

type user = {
  _id: number;
  name: string;
  image: string;
  email: string;
};

export type BookmarkListResponse = {
  ok: number;
  item: BookmarkItem;
};
export type BookmarkListResponse2 = {
  ok: number;
  item: BookmarkItem[];
};
