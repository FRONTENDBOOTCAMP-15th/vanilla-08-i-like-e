import type {
  ApiPostDetailRes,
  ApiPostsResponse,
  ApiUserDetailRes,
  ApiusersResponse,
  BookmarkListResponse,
  BookmarkListResponse2,
} from '../../types/types';
import { getAxios } from '../../utils/axios';

const axios = getAxios();

const params = new URLSearchParams(window.location.search);
const page_id = params.get('id'); //게시글의 아이디

const userString = localStorage.getItem('user');
if (!userString) {
  throw new Error('로그인 정보 없음');
}

const userData = JSON.parse(userString);
const loginUserId: number = userData._id; // 로그인한 내 아이디

const yesSubBtn = document.querySelector<HTMLElement>(
  '.yes_sub',
) as HTMLElement;
const noSubBtn = document.querySelector<HTMLElement>('.no_sub') as HTMLElement;

const likeOff = document.getElementById('like_off') as HTMLElement;
const likeOn = document.getElementById('like_on') as HTMLElement;

const post_get = await axios.get<ApiPostDetailRes>(`/posts/${page_id}`); // 이글의 상세정보. 왜 들고 오려하냐? 글쓴이 아이디 알라고
const bookmark_post_data = post_get.data.item;

console.log(bookmark_post_data.user._id, '작성자 다시나오는지 확인띠');
// 이걸로는 이글의 작성자가 누군지 알라고
// ------------------------------------------

const bookmark_post_get =
  await axios.get<BookmarkListResponse>(`/bookmarks/post`); // 유저가 북마크 한 데이터를 들고옴
const my_bookmark_post_data_id = await bookmark_post_get.data.item._id;

console.log(my_bookmark_post_data_id, '로그인한 유저의 게시글북마크');

// ---------------------

const bookmark_user_get =
  await axios.get<BookmarkListResponse>(`/bookmarks/user`); // 유저가 북마크 한 데이터를 들고옴
const my_bookmark_user_data_id = await bookmark_user_get.data.item._id;

console.log(my_bookmark_user_data_id, '로그인한 유저의 구독자 북마크');
// ---------------------

// /* ---------------------------------------------------------
//   1. 좋아요, 구독 상태 체크
// --------------------------------------------------------- */
async function loadBookmarkcheck() {
  try {
    const bookmark_post_get =
      await axios.get<BookmarkListResponse2>(`/bookmarks/post`); // 유저가 북마크 한 데이터를 들고옴
    const my_bookmark_post_data = await bookmark_post_get.data.item;

    console.log(my_bookmark_post_data, '로그인한 유저의 게시글북마크');

    const bookmark_user_get =
      await axios.get<BookmarkListResponse2>(`/bookmarks/user`); // 유저가 북마크 한 데이터를 들고옴
    const my_bookmark_user_data = await bookmark_user_get.data.item;

    console.log(my_bookmark_user_data, '로그인한 유저의 구독자 북마크');

    const isMyPostBookmarked = my_bookmark_post_data.some(
      v => String(v.target_id) === String(page_id),
    );
    const isMyuserBookmarked = my_bookmark_post_data.some(
      v => String(v.target_id) === String(page_id),
    );

    if (isMyPostBookmarked) {
      console.log('이 게시글 북마크함');
      likeOff.style.display = 'none';
      likeOn.style.display = 'block';
    } else {
      console.log('이 게시글 북마크 안함');
      likeOff.style.display = 'block';
      likeOn.style.display = 'none';
    }

    if (isMyuserBookmarked) {
      console.log('이 작성자 북마크함');
      noSubBtn.style.display = 'none';
      yesSubBtn.style.display = 'block';
    } else {
      console.log('이 작성자 북마크 안함');
      noSubBtn.style.display = 'block';
      yesSubBtn.style.display = 'none';
    }
  } catch (err) {
    console.log(err);
  }
}

// /* ---------------------------------------------------------
//   2. 게시글 좋아요 하기
// --------------------------------------------------------- */
async function likePost() {
  try {
    await axios.post(`/bookmarks/post`, {
      target_id: `${page_id}`,
    });

    console.log('구독 완료!');
  } catch (err) {
    console.log(err);
  }
}

// /* ---------------------------------------------------------
//   2. 작성자 구독 하기
// --------------------------------------------------------- */
async function subscribe() {
  try {
    await axios.post(`/bookmarks/post`, {
      target_id: `${page_id}`,
    });

    console.log('구독 완료!');
  } catch (err) {
    console.log(err);
  }
}

// /* ---------------------------------------------------------
//   3. 구독 취소하기
// --------------------------------------------------------- */
async function DeleteSub() {
  try {
    await axios.delete(`/bookmarks/user`, {
      data: { target_id: `${my_bookmark_user_data_id}` },
    });
    console.log('삭제 완료!');
  } catch (err) {
    console.log(err);
  }
}

// /* ---------------------------------------------------------
//   4. 게시글 취소하기
// --------------------------------------------------------- */
async function DeleteLike() {
  try {
    await axios.delete(`/bookmarks/post`, {
      data: { target_id: `${my_bookmark_post_data_id}` },
    });
    console.log('삭제 완료!');
  } catch (err) {
    console.log(err);
  }
}

// /* ---------------------------------------------------------
//   5. 초기 실행 + 이벤트 바인딩
// --------------------------------------------------------- */
async function init() {
  await loadBookmarkcheck();

  if (noSubBtn) {
    noSubBtn.addEventListener('click', () => {
      void subscribe();
    });
  }

  if (yesSubBtn) {
    yesSubBtn.addEventListener('click', () => {
      void DeleteSub();
    });
  }

  if (likeOff) {
    likeOff.addEventListener('click', () => {
      void likePost();
    });
  }

  if (likeOn) {
    likeOn.addEventListener('click', () => {
      void DeleteLike();
    });
  }
}

void init();
