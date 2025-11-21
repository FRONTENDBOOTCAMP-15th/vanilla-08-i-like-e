import type { ApiBookmark, ApiPost, ApiUser } from '../../types/types';
import { getAxios } from '../../utils/axios';

const axios = getAxios();

const libraryRoot = document.querySelector('.libraryWrap') as HTMLElement;
const recentList = document.querySelector('.recent-list') as HTMLElement;
const favoriteList = document.querySelector(
  '.favorite-posts-list',
) as HTMLElement;
const authorList = document.querySelector('.authors-list') as HTMLElement;

if (libraryRoot) {
  initRecentPosts();
  initFavoritePosts();
  initFavoriteAuthorList();
}

/**
 * 최근 본 글 불러오기 - localStorage
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
 * 최근 본 글 화면에 출력
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
 * 관심 글 불러오기 - API
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
      .filter(bookmark => bookmark.post) // null 제거
      .map(bookmark => bookmark.post as ApiPost); // TS에게 ApiPost 라고 확정

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

/**
 * 구독 작가 불러오기 - API
 */
async function initFavoriteAuthorList() {
  if (!authorList) return;
  console.log('❤️ 구독 작가 불러오기 시작');

  try {
    const res = await axios.get('/bookmarks/user');

    if (res.data.ok !== 1) {
      console.warn('💔 구독 작가 조회 실패:', res.data.message);
      return;
    }

    const bookmarks = res.data.item as ApiBookmark[];

    if (!bookmarks || bookmarks.length === 0) {
      authorList.innerHTML = '<p>관심 작가가 없습니다.</p>';
      return;
    }

    // 북마크 안 user 데이터를 그대로 사용
    const authors: ApiUser[] = bookmarks
      .filter(bookmark => bookmark.user) // null 제거
      .map(bookmark => bookmark.user as ApiUser); // 확정

    renderFavoriteAuthors(authors);
  } catch (error) {
    console.error('관심 작가 API 오류:', error);
  }
}

/**
 * 구독 작가 화면에 출력
 */
function renderFavoriteAuthors(authors: ApiUser[]) {
  if (!authorList) return;

  const html = authors
    .map(
      author => `
      <li class="authors-item">
        <a href="/src/pages/writer/writer.html?id=${author._id}" class="author-link">
          <img src="${author.image}" alt="${author.name}" class="author-image" />
          <span class="author-name">${author.name}</span>
        </a>
      </li>
    `,
    )
    .join('');

  authorList.innerHTML = html;
}
