import type {
  ApiPost,
  ApiPostDetailRes,
  ApiUserDetailRes,
} from '../../types/types';

import { getAxios } from '../../utils/axios';

const axios = getAxios();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadDetail(): Promise<void> {
  try {
    if (!id) return alert('id 없음');

    const res = await axios.get<ApiPostDetailRes>(`/posts/${id}`);
    const data = res.data.item;

    // 게시글의 작성자 id 얻기
    const userId = data.user._id;

    // 유저 상세 API 호출해야 함
    const user_res = await axios.get<ApiUserDetailRes>(`/users/${userId}`);
    const user_data = user_res.data.item;

    console.log(data, '데이터를 봅시다');
    console.log(user_data, '22데이터를 봅시다');

    // 제목 / 부제목
    document.querySelector('.title')!.textContent = data.title ?? '';
    document.querySelector('.subtitle')!.textContent =
      data.extra?.subTitle ?? '';

    // 제목 / 부제목 위쪽에 넣기

    const subjectWrap = document.querySelector('.subject_wrap') as HTMLElement;

    // 게시글 대표 이미지 적용
    if (data.image) {
      subjectWrap.style.backgroundImage = `url(${data.image})`;
      subjectWrap.style.backgroundSize = 'cover';
      subjectWrap.style.backgroundPosition = 'center';
    }

    // writer info
    document.querySelector('.writer')!.textContent = data.user?.name;
    const created = String(data.createdAt);
    const dateStr = created.slice(0, 10).replace(/\./g, '-');

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

    //===================================================
    // 상세 글 실제 데이터(수진)
    const post = res.data.item;

    // 로컬스토리지에 최근 본 글 저장(수진)
    saveRecentView(post);

    // // JSON 예쁘게 출력
    // const prettyJson = JSON.stringify(res.data, null, 2);
    // document.querySelector('#json')!.textContent = prettyJson;
  } catch (err) {
    console.error(err);
  }
}

loadDetail();

/**
 * ⭐ 최근 본 글 localStorage 저장 (수진)
 */
function saveRecentView(post: ApiPost) {
  try {
    // 로그인한 유저 ID
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return; // 로그인 안 한 경우 저장 X

    const userData = JSON.parse(savedUser);
    const currentUserId = userData._id;

    // 유저별 recentPosts key
    const KEY = `recentPosts_${currentUserId}`;

    // 기존 데이터 가져오기
    const stored = localStorage.getItem(KEY);
    const list: ApiPost[] = stored ? JSON.parse(stored) : [];

    // 중복 제거
    const filtered = list.filter(item => item._id !== post._id);

    // 최신 글 맨 앞에 추가
    filtered.unshift(post);

    // 최대 10개까지만 유지
    localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 10)));

    console.log(`최근 본 글 저장 완료(${currentUserId}):`, filtered);
  } catch (err) {
    console.error('최근 본 글 저장 오류:', err);
  }
}
