import type {
  ApiPostDetailRes,
  ApiUserDetailRes,
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

// const res = await axios.get<ApiPostDetailRes>(`/posts/${id}`);
// /* ---------------------------------------------------------
//   1. 좋아요 상태 체크
// --------------------------------------------------------- */
async function loadBookmarkPost() {
  try {
    const bookmark_post_get = (await axios.get)<BookmarkListResponse>(
      `/bookmarks/post`,
    );
    const bookmark_post_data = (await bookmark_post_get).data.item;

    console.log(bookmark_post_data, '북마크 데이터가 잘 들어왔을까');
  } catch (err) {
    console.log(err);
  }
}

loadBookmarkPost();

// async function checkLike() {
//   try {
//     const res = await axios.get<BookmarkListResponse>(`/bookmarks/post`);

//     const data = res.data.item;
//     console.log(data, 'data 확인');

//     if (loginUserId === data?.user_id) {
//       const likeOff = document.getElementById('like_off');
//       if (likeOff) likeOff.style.display = 'none';
//     } else {
//       const likeOn = document.getElementById('like_on');
//       if (likeOn) likeOn.style.display = 'none';
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// checkLike();
// /* ---------------------------------------------------------
// 2. 구독 상태 체크 (구독 여부에 따라 버튼 노출 조절)
// --------------------------------------------------------- */

// // async function checkSub() {
// //   try {
// //     const bookmark_res =
// //       await axios.get<BookmarkListResponse2>(`/bookmarks/user/`);
// //     const list = bookmark_res.data.item; // 배열
// //     const bookmark = list.some(v => v.user_id === loginUserId); // 북마크
// //     const user_res = await axios.get<ApiUserDetailRes>(`/users/${loginUserId}`); // 글쓴사람
// //     console.log(bookmark, '나와 임마');
// //     console.log(user_res.data.item, '나와임마');
// //     if (bookmark) {
// //       const likebtn = document.querySelector('.no_sub') as HTMLElement;
// //       likebtn.style.display = 'none';
// //     } else {
// //       const likebtn = document.querySelector('.yes_sub') as HTMLElement;
// //       likebtn.style.display = 'none';
// //     }
// //   } catch (err) {
// //     console.log(err);
// //   }
// // }
// // checkSub();
// /* ---------------------------------------------------------
//   3. 구독 취소 (DELETE)
// --------------------------------------------------------- */
// // async function handleUnsubscribe() {
// //   try {
// //     await axios.delete(`/bookmarks/post/${target_Id}`, {
// //       data: { target_id: `${target_Id}` },
// //     });

// //     alert('구독취소 완료!');

// //     const yesSubBtn = document.querySelector<HTMLElement>('.yes_sub');
// //     const noSubBtn = document.querySelector<HTMLElement>('.no_sub');

// //     if (yesSubBtn && noSubBtn) {
// //       yesSubBtn.style.display = 'none';
// //       noSubBtn.style.display = 'block';
// //     }
// //   } catch (err) {
// //     console.log(err);
// //   }
// // }

// /* ---------------------------------------------------------
//   4. 구독하기 (POST)
// --------------------------------------------------------- */
// // async function subscribe() {
// //   try {
// //     await axios.post(`/bookmarks/post`, {
// //       target_id: `${target_Id}`,
// //     });

// //     console.log('구독 완료!');

// //     const yesSubBtn = document.querySelector<HTMLElement>('.yes_sub');
// //     const noSubBtn = document.querySelector<HTMLElement>('.no_sub');

// //     if (yesSubBtn && noSubBtn) {
// //       noSubBtn.style.display = 'none';
// //       yesSubBtn.style.display = 'block';
// //     }
// //   } catch (err) {
// //     console.log(err);
// //   }
// // }

// /* ---------------------------------------------------------
//   5. 초기 실행 + 이벤트 바인딩 (top-level await 안 쓰고 정리)
// --------------------------------------------------------- */
// // async function init() {
// //   await checkLike();
// //   await checkSub();

// //   const noBtn = document.querySelector<HTMLButtonElement>('.no_sub');
// //   const yesBtn = document.querySelector<HTMLButtonElement>('.yes_sub');

// //   if (noBtn) {
// //     noBtn.addEventListener('click', () => {
// //       void subscribe(); // TS에게 "await 안 해도 되는 비동기"라고 알려줄 때 void 사용
// //     });
// //   }

// //   if (yesBtn) {
// //     yesBtn.addEventListener('click', () => {
// //       void handleUnsubscribe();
// //     });
// //   }
// // }

// // void init();
