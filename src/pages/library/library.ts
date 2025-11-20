import type { ApiPost } from '../../types/types';
// import { getAxios } from '../../utils/axios';
// const axiosInstance = getAxios();

const libraryRoot = document.querySelector('.libraryWrap');
const recentList = document.querySelector('.recent-list') as HTMLElement;

if (!libraryRoot) {
  console.log('library 페이지가 아님. library.ts 실행 ❎');
} else {
  initLibraryPage();
}

// 내 서랍 페이지 초기화하기
function initLibraryPage() {
  console.log('library 페이지 감지. 최근 본 글 불러오기 시작');
  loadRecentPostsFromLocal();
}

// dom 요소 수집하기

/**
 * localStorage 에서 최근 본 글 불러오기
 */
function loadRecentPostsFromLocal() {
  const KEY = 'recentPosts';
  const stored = localStorage.getItem(KEY);

  if (!stored) {
    console.log('최근 본 글 없음');
    return;
  }

  const items: ApiPost[] = JSON.parse(stored);

  renderRecentPosts(items);
}

/**
 * 최근 본 글 리스트를 화면에 출력
 *
 * @param items - 최근 본 글 데이터 배열
 */

function renderRecentPosts(items: ApiPost[]) {
  if (!recentList) return;

  const result = items.map(post => {
    return `
      <li class="recent-item">
        <a href="/src/pages/detail/detail.html?id=${post._id}" class="post-link">
          
          <!-- 책 표지 + 흰 박스 -->
          <div class="recent-book">
            <img
              src="${post.image}"
              alt="${post.title}"
              class="recent-book-cover"
            />

            <div class="overlay-box">
              <p class="overlay-title">${post.title}</p>
              <p class="overlay-author">${post.user.name}</p>
            </div>
          </div>

          <!-- 책 아래 텍스트 영역 -->
          <div class="recent-info">
            <strong class="recent-title">${post.title}</strong>
            <span class="recent-author">by ${post.user.name}</span>
          </div>

        </a>
      </li>
    `;
  });

  recentList.innerHTML = result.join('');
}
