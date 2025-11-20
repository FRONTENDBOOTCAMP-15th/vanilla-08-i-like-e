import type { ApiPost } from '../../types/types';
import { getAxios } from '../../utils/axios';

const axios = getAxios();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadDetail() {
  try {
    if (!id) {
      document.querySelector('#json')!.textContent = 'id 없음!';
      return;
    }

    // 상세 API 호출
    const res = await axios.get(`/posts/${id}`);

    // 상세 글 실제 데이터(수진)
    const post = res.data.item;

    // 로컬스토리지에 최근 본 글 저장(수진)
    saveRecentView(post);

    // JSON 예쁘게 출력
    const prettyJson = JSON.stringify(res.data, null, 2);
    document.querySelector('#json')!.textContent = prettyJson;
  } catch (err) {
    document.querySelector('#json')!.textContent =
      '에러 발생: ' + (err as Error).message;
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
