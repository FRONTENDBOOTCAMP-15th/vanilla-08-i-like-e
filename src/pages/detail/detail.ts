import type {
  ApiPost,
  ApiPostDetailRes,
  ApiUserDetailRes,
} from '../../types/types';

import { getAxios } from '../../utils/axios';

const axios = getAxios();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

export async function loadDetail(): Promise<void> {
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
    document.querySelector('.like_number')!.textContent =
      String(user_data.bookmarkedBy.users) ?? 0;
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

    //===========================
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
    const KEY = 'recentPosts';

    // 1) 기존 localStorage 데이터 가져오기
    const stored = localStorage.getItem(KEY);

    // 2) 타입을 명확하게! ApiPost[] 배열로 파싱
    const list: ApiPost[] = stored ? JSON.parse(stored) : [];

    // 3) 같은 글(_id) 제거 → 중복 방지
    const filtered = list.filter(item => item._id !== post._id);

    // 4) 최신 글을 맨 앞에 추가
    filtered.unshift(post);

    // 5) 최대 10개만 유지해서 다시 저장
    localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, 10)));

    console.log('최근 본 글 저장 완료:', filtered.slice(0, 10));
  } catch (err) {
    console.error('최근 본 글 저장 오류:', err);
  }
}

import './detail_bookmark_subscribe';
