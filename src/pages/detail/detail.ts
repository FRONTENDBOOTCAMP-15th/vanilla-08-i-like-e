import type {
  ApiPost,
  ApiPostDetailRes,
  ApiPostsResponse,
  ApiUserDetailRes,
  ApiusersResponse,
} from '../../types/types';
import { getAxios } from '../../utils/axios';

const axios = getAxios();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadDetail() {
  try {
    if (!id) return alert('id 없음');

    const res = await axios.get<ApiPostDetailRes>(`/posts/${id}`);
    const data = res.data.item;

    // ❗ 게시글의 작성자 id 얻기
    const userId = data.user._id;

    // ❗ 이걸로 유저 상세 API 호출해야 함
    const user_res = await axios.get<ApiUserDetailRes>(`/users/${userId}`);
    const user_data = user_res.data.item;

    console.log(data, '데이터를 봅시다');
    console.log(user_data, '22데이터를 봅시다');

    // 제목 / 부제목
    document.querySelector('.title')!.textContent = data.title ?? '';
    document.querySelector('.subtitle')!.textContent =
      data.extra?.subTitle ?? '';

    // writer info
    document.querySelector('.writer')!.textContent = data.user?.name;
    const dateStr = new Date(data.createdAt).toISOString().slice(0, 10);
    document.querySelector('.date')!.textContent = dateStr;

    // 본문
    document.querySelector('.post-text')!.innerHTML = data.content;

    // 작가 추가 정보
    document.querySelector('.witer_name')!.textContent = user_data.name;
    document.querySelector('.witer_job')!.textContent =
      user_data.extra?.job ?? '';
    document.querySelector('.witer_biography')!.textContent =
      user_data.extra?.biography ?? '';
    document.querySelector('.subscribe_number')!.textContent = String(
      user_data.bookmarkedBy.users,
    );

    (document.querySelector('.witer_profile') as HTMLImageElement).src =
      data.user?.image ?? '';

    // 좋아요 / 댓글수
    document.querySelector('.like_number')!.textContent = data.like ?? 0;
    document.querySelector('.replies_number')!.textContent =
      data.replies.length.toString();
  } catch (err) {
    console.error(err);
  }
}

loadDetail();
