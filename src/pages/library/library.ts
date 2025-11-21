import type { ApiBookmark, ApiPost } from '../../types/types';
import { getAxios } from '../../utils/axios';

const axios = getAxios();

const libraryRoot = document.querySelector('.libraryWrap');
const recentList = document.querySelector('.recent-list') as HTMLElement;
const favoriteList = document.querySelector('.favorite-posts-list');

if (libraryRoot) {
  initRecentPosts();
  initFavoritePosts();
}

/**
 * localStorage 에서 최근 본 글 불러오기
 */
function initRecentPosts() {
  if (!recentList) return;
  console.log('📌 최근 본 글 불러오기 시작');

  const stored = localStorage.getItem('recentPosts');
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

/**
 * API로 관심 글 불러오기
 */
async function initFavoritePosts() {
  if (!favoriteList) return;
  console.log('❤️ 관심 글 불러오기 시작');

  try {
    const res = await axios.get('/bookmarks/post');

    if (res.data.ok !== 1) {
      console.warn('⭐ 관심 글 조회 실패:', res.data.message);
      return;
    }

    const bookmarks: ApiBookmark[] = res.data.item;

    if (!bookmarks || bookmarks.length === 0) {
      favoriteList.innerHTML = '<p>관심 글이 없습니다.</p>';
      return;
    }

    // ⭐ 북마크 안의 post 데이터를 바로 사용
    const posts: ApiPost[] = bookmarks
      .map(bookmark => bookmark.post)
      .filter(post => post);

    renderFavoritePosts(posts);
  } catch (error) {
    console.error('관심 글 API 오류:', error);
  }
}

/**
 * 관심 글 화면에 출력
 */
function renderFavoritePosts(items: ApiPost[]) {
  if (!favoriteList) return;

  const html = items
    .map(
      post => `
      <li class="favorite-item">
        <a href="/src/pages/detail/detail.html?id=${post._id}" class="post-link">

          <div class="favorite-book">
            <img
              src="${post.image}"
              alt="${post.title}"
              class="favorite-book-cover"
            />

            <div class="overlay-box">
              <p class="overlay-title">${post.title}</p>
              <p class="overlay-author">${post.user.name}</p>
            </div>
          </div>

          <div class="favorite-info">
            <strong class="favorite-title">${post.title}</strong>
            <span class="favorite-author">by ${post.user.name}</span>
          </div>

        </a>
      </li>
    `,
    )
    .join('');

  favoriteList.innerHTML = html;
}
