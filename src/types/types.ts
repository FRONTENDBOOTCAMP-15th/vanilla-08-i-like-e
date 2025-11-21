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

export type BookmarkUser = {
  _id: number;
  user_id: number;
  name: string;
  email: string;
  image: string;
  user: { user_id: number };
};

export type BookmarkItem = {
  _id: number;
  type: 'post';
  user_id: number; // 글쓴 사람
  target_id: number; // 게시글 ID
  user: BookmarkUser; // 북마크 한 사람
  memo: string;
  createdAt: string;
  updatedAt: string;
};

export type BookmarkResponse = {
  ok: number;
  item: BookmarkItem;
};

export type BookmarkResponse2 = {
  ok: number;
  item: BookmarkItem2;
};

export type BookmarkItem2 = [
  {
    _id: number;
    type: 'post';
    user_id: number; // 글쓴 사람
    target_id: number; // 게시글 ID
    user: BookmarkUser; // 북마크 한 사람
    memo: string;
    createdAt: string;
    updatedAt: string;
  },
];
export type ApiBookmark = {
  _id: number;
  user_id: number;
  memo?: string;
  createdAt: string;

  post?: ApiPost | null;
  user?: ApiUser | null; // ★★ 이거 반드시 있어야 함
};
