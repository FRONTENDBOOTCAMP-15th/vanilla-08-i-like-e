// ==네비게이터 이동 기능 구현==
const goHome = document.querySelector('#home') as HTMLElement;
const goSearch = document.querySelector('#navSearch') as HTMLElement;
const goWrite = document.querySelector('#write') as HTMLElement;
const goMybox = document.querySelector('#myBox') as HTMLElement;

goHome?.addEventListener('click', () => {
  window.location.href = '/index.html';
});

goSearch?.addEventListener('click', () => {
  window.location.href = '/src/pages/search/search.html';
});

goWrite?.addEventListener('click', () => {
  window.location.href = '/src/pages/post/post.html';
});

goMybox?.addEventListener('click', () => {
  window.location.href = '/src/pages/library/library.html';
});

//==로고 클릭시 이동==
const clickLogo = document.querySelector('.logo') as HTMLElement;
const clickfooterLogo = document.querySelector('.footerLogo') as HTMLElement;

clickLogo?.addEventListener('click', () => {
  window.location.href = '/index.html';
});
clickfooterLogo?.addEventListener('click', () => {
  window.location.href = '/index.html';
});

const clickSearch = document.querySelector('.searchIcon');

clickSearch?.addEventListener('click', () => {
  window.location.href = '/src/pages/search/search.html';
});

const clickLogin = document.querySelector('.login');

clickLogin?.addEventListener('click', () => {
  window.location.href = '/src/pages/login/login.html';
});

const clickMybox = document.querySelector('.myProfile') as HTMLElement;
clickMybox?.addEventListener('click', () => {
  window.location.href = '/src/pages/library/library.html';
});

//==푸터 sns 이동==
const clickKakao = document.querySelector('.kakao_talk');
const clickfacebook = document.querySelector('.facebook');
const clickX = document.querySelector('.twitter');

clickKakao?.addEventListener('click', () => {
  window.location.href = 'https://pf.kakao.com/_YYcYV';
});
clickfacebook?.addEventListener('click', () => {
  window.location.href = 'https://www.facebook.com/brunch.co.kr';
});
clickX?.addEventListener('click', () => {
  window.location.href = 'https://www.instagram.com/brunch.co.kr';
});

// ==로그인 상태에 따라 헤더 토글...==
// 로그인 토글 됐다고 가정... 나중에 로그인 기능 업데이트후 수정 할 예정 ...
const guestHeader = document.querySelector('.disconnect') as HTMLElement;
const userHeader = document.querySelector('.connect') as HTMLElement;

const token = localStorage.getItem('token'); // 로그인 상태 저장 값...

if (token) {
  guestHeader.style.display = 'none';
  userHeader.style.display = 'block';
} else {
  guestHeader.style.display = 'block';
  userHeader.style.display = 'none';
}
