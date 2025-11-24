import type { ApiBookmark, ApiPost, ApiUser } from '../../types/types';
import { getAxios } from '../../utils/axios';

const axios = getAxios();

//로컬스토리지에 user로 저장된 문자열 꺼내기
const savedUser = localStorage.getItem('user');
//문자열을 객체로 바꾸기 JSON.parse
const userData = savedUser ? JSON.parse(savedUser) : null;
//객체 안에서 id만 뽑아오기. id가 없으면 null
const userId = userData ? userData._id : null;

// dom 요소 꺼내기
const libraryRoot = document.querySelector('.libraryWrap') as HTMLElement;
const recentList = document.querySelector('.recent-list') as HTMLElement;
const favoriteList = document.querySelector(
  '.favorite-posts-list',
) as HTMLElement;
const authorList = document.querySelector('.authors-list') as HTMLElement;
const myBrunchList = document.querySelector('.my-brunch-list') as HTMLElement;

//내 서랍 페이지일 경우에 로그인 여부 확인. 내 서랍이고 로그인되어있으면 init 실행
if (libraryRoot) {
  //로그인 안되어있으면 로그인페이지로 이동하기
  if (!savedUser) {
    alert('로그인이 필요한 페이지입니다.');
    window.location.href = '/src/pages/login/login.html';
  }
  initRecentPosts();
  initFavoritePosts();
  initFavoriteAuthorList();
  initMyBrunchList();
}

/**
 * 최근 본 글 불러오기 - localStorage
 */
function initRecentPosts() {
  if (!recentList) return;
  console.log('📌 최근 본 글 불러오기 시작');

  const stored = localStorage.getItem(`recentPosts_${userId}`);
  if (!stored) {
    recentList.innerHTML = '';
    return;
  }

  const items: ApiPost[] = JSON.parse(stored).slice(-7);
  renderRecentPosts(items);
}

/**
 * 최근 본 글 화면에 출력
 */

function renderRecentPosts(items: ApiPost[]) {
  if (!recentList) return;

  recentList.innerHTML = items
    .map(
      post => `
      <li class="recent-item">
        <a href="/src/pages/detail/detail.html?id=${post._id}" class="post-link">
          <div class="recent-book">
            <img src="${post.image}" alt="${post.title}" class="recent-book-cover" />
            <div class="overlay-box">
              <p class="overlay-title">${post.title}</p>
              <p class="overlay-author">${post.user.name}</p>
            </div>
          </div>
          <div class="recent-info">
            <strong class="recent-title">${post.title}</strong>
            <span class="recent-author">by ${post.user.name}</span>
          </div>
        </a>
      </li>
    `,
    )
    .join('');
}

/**
 * 관심 글 불러오기 - API
 */
async function initFavoritePosts() {
  if (!favoriteList) return;

  console.log('🕵🏻 관심 글 불러오기 시작');

  try {
    const res = await axios.get(`/bookmarks/post`);

    if (res.data.ok !== 1) return;

    const bookmarks: ApiBookmark[] = res.data.item;

    if (!bookmarks.length) {
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
  favoriteList.innerHTML = items
    .map(
      post => `
      <li class="favorite-item">
        <a href="/src/pages/detail/detail.html?id=${post._id}" class="post-link">
          <div class="favorite-book">
            <img src="${post.image}" alt="${post.title}" class="favorite-book-cover" />
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
}

/**
 * 구독 작가 불러오기 - API
 */
async function initFavoriteAuthorList() {
  if (!authorList) return;
  console.log('❤️ 구독 작가 불러오기 시작');

  try {
    const res = await axios.get(`/bookmarks/user`);

    if (res.data.ok !== 1) return;

    const bookmarks = res.data.item as ApiBookmark[];

    if (!bookmarks.length) {
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
  authorList.innerHTML = authors
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
}

/**
 * 내 브런치 - 로그인 되어있는 유저 꺼내기 -localStorage
 */
async function initMyBrunchList() {
  if (!myBrunchList) return;
  console.log('📙 내 브런치 불러오기 시작');

  try {
    const res = await axios.get(`/posts`, {
      params: { _id: userId },
    });

    if (res.data.ok !== 1) return;

    const allPosts = res.data.item as ApiPost[];

    const myPosts = allPosts.filter(post => post.user._id === userId);

    renderMyBrunchList(myPosts);
  } catch (error) {
    console.error('내 브런치 API 오류:', error);
  }
}

/**
 * 내 브런치 화면에 출력
 */
function renderMyBrunchList(posts: ApiPost[]) {
  myBrunchList.innerHTML = posts
    .map(
      post => `
      <li class="my-brunch-item">
        <a href="/src/pages/detail/detail.html?id=${post._id}" class="post-link">
          <strong class="my-brunch-post-title">${post.title}</strong>
          <p class="my-brunch-post-subtitle">${post.extra?.subTitle || ''}</p>
          <time datetime="${post.createdAt}" class="my-brunch-post-date">
            ${new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </time>
        </a>
      </li>
    `,
    )
    .join('');
}
