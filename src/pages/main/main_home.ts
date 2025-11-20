import type {
  ApiPost,
  ApiPostDetailRes,
  ApiPostsResponse,
  ApiUser,
  ApiUserDetailRes,
  ApiusersResponse,
} from '../../types/types';
//ㄴ> 타입구분을 위해 import
import { getAxios } from '../../utils/axios';
//ㄴ> axios를 사용하기위해 함수를 미리 만듦 그걸 import

const axios = getAxios();
// 위에서 만든 함수 호출을 위한 변수 담음

//===================================================================

function remderTodayPick(posts: ApiPost[]): void {
  //ㄴ>API에서 받아온 게시물 목록을 돌면서 html에 li 형태로 뿌려주는 함수생성
  //post는 매개 변수 이것의 타입은 APipost (types에서 타입설정해줌) 배열이라서 []붙음?

  const ul = document.querySelector('.todayPick ul') as HTMLElement;
  //ㄴ> .todayPick ul을 가져옴 왜냐? 여기에 li를 붙일거니까!

  ul.innerHTML = '';
  //ㄴ> ul을 싹 비워줌 새로 생성할거니까 ㅇㅇ

  posts.forEach(post => {
    //ㄴ> 글 하나씩 순회하면서 UI를 생성할거임
    //forEach() 함수를 사용하면 반복문을 통해 배열의 요소를 접근하지 않고도
    // 콜백 함수로 간편하게 배열 요소들을 처리할수 있다

    const li = document.createElement('li');
    li.classList.add('liContent');
    //ㄴ> li 하나 만들고 클래스 추가

    li.innerHTML =
      //ㄴ>li 구조 채우기 시~작'
      `
      <div class="leftContent">
        <a href="./src/pages/detail/detail.html?id=${post._id}">
          <h4 class="bookname">${post.title}</h4>
        </a>
        <span class="by">by</span>
        <a href=./src/pages/writer/writer.html?id=${post.user?._id ?? '익명'}><span class="writer">${post.user?.name ?? '익명'}</span></a>
        <p>${stripHtml(post.content)}</p>
      </div>

      <a href="./src/pages/detail/detail.html?id=${post._id}">
      <div class="bookCoverWrap">
          <div class="bookCover" style=" z-index:2">
            <p class="bookname">${post.title}</p>
            <div class="writerWrap">
              <p class="writer">${post.user?.name ?? '익명'}</p>
            </div>
          </div>

          <img src="${post.image}" class="bookCoverWrap" alt="" style="object-fit:cover; z-index:1 " onerror="this.style.display='none'";/>
          </div>
          </a>
    `;
    // post._id 가 왜 id인걸 알 수 있냐면 ApiPost[]에서 지정해줬으니까.

    ul.appendChild(li);
    //ㄴ> 화면에 li 추가

    const hr = document.createElement('hr');
    ul.appendChild(hr);
    //ㄴ> 구분선 추가~
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
//ㄴ> html태그 전부 없애는 함수. .replace(정규식,'') > html태그(정규식)를 빈문자열로 바꿈

async function loadToodayPicks(): Promise<void> {
  //ㄴ> async를 함수 앞에 붙이면 await를 쓸거라는 선언. 프로미스(비동기 처리)가 처리될때까지 기다림.
  //근데 뒤에 <void>가 붙었으니까 비동기이긴 한데 아무것도 반환하지 않는다!!
  //즉,promise는 비동기작업의 결과를 약속해놓는거임 ex) 택배 시킴> 배송중...<<딱 promise상태
  try {
    const res = await axios.get<ApiPostsResponse>('/posts?type=brunch');
    //ㄴ> get> http get요청, <ApiPostsResponse> ->타입
    //ㄴ> await 응답을 다 받을때까지 멈춰있어 다받으면 다음줄 ㄱㄱ
    const posts = res.data.item;
    //ㄴ> res.data.item >> Apipost[](우리가 정한 글들의 배열)

    // console.log(posts, 'posts');

    const top10 = posts
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .slice(0, 10);
    //ㄴ> 인기순으로 내림차순 (.sort(..)>> retrun값이 양수면 a가 b보다 뒤로감, 음수면 반대, 0이면 그대로)
    //ㄴ> .slice(..) >> 인덱스 0부터 9까지 가져옴

    remderTodayPick(top10);
    //ㄴ> 위에서 만든 함수 사용
  } catch (err) {
    console.log(err);
  }
}

loadToodayPicks();
// 요즘뜨는 브런치 끝!
/*===============================================================*/

function renderTop(users: ApiUser[]): void {
  const ul = document.querySelector('.topWriter ul') as HTMLElement;

  ul.innerHTML = ' ';

  users.forEach(user => {
    const li = document.createElement('li');

    li.innerHTML = `
            <div>
              <a href=./src/pages/writer/writer.html?id=${user._id} ?? '익명'}>
                <img
                  src="${user.image}"
                  class="profilePhoto"
                />
                <div class="writer">${user.name}</div>
                <div class="catchphrase">${user.extra?.job ?? ''}</div>
                <div class="profile">
                  ${user.extra?.biography ?? ''}
                </div>
              </a>
            </div>
    `;

    ul.append(li);
  });
}

async function loadTop(): Promise<void> {
  try {
    const res = await axios.get<ApiusersResponse>('/users');
    const users = res.data.item;

    async function getUserDetail(_id: number): Promise<ApiUser> {
      const res2 = await axios.get<ApiUserDetailRes>(`/users/${_id}`);
      // console.log(res2, 'res2');
      return res2.data.item;
    }

    const userDetails = await Promise.all(users.map(u => getUserDetail(u._id)));

    // 게시글 숫자 많은 순으로 정렬
    userDetails.sort((a, b) => {
      const aCount: number = a.bookmarkedBy.users;
      const bCount = b.bookmarkedBy.users;
      return bCount - aCount;
    });

    const user4 = userDetails.slice(0, 4);

    renderTop(user4);
  } catch (err) {
    console.log(err);
  }
}

loadTop();
//top 작가 끝!!
//=======================================================

function renderTodayAuthor(user: ApiUser, posts: ApiPost[]) {
  const div = document.querySelector('section.todayWriter') as HTMLElement;

  div.innerHTML = ''; // 초기화

  // 1) 작가 프로필 박스
  const profile = document.createElement('div');
  profile.classList.add('profileContent');
  profile.innerHTML = `
  <div class="profileTxt">
    <a href=./src/pages/writer/writer.html?id=${user._id} ?? '익명'}>
        <h4>오늘의 작가</h4>
        <div class="writer">${user.name}</div>
        <div class="catchphrase">${user.extra?.job ?? ''}</div>
    </a>
  </div>
  <a href=./src/pages/writer/writer.html?id=${user._id} ?? '익명'}>
      <img src="${user.image}" alt="" />
  </a>
  `;
  div.append(profile);

  // 2) 작가 소개글 (bio)
  const bio = document.createElement('p');
  bio.classList.add('profile');
  bio.textContent = user.extra?.biography ?? '소개글이 없습니다.';
  div.append(bio);

  // 3) 책 리스트 박스
  const todayBook = document.createElement('div');
  todayBook.classList.add('todayBook');

  const ul = document.createElement('ul');
  todayBook.append(ul);

  posts.forEach(post => {
    const li = document.createElement('li');
    li.classList.add('bookProfile');

    li.innerHTML = `
      <div class="bookCoverWrap">
        <a href="./src/pages/detail/detail.html?id=${post._id}">
          <div class="bookCover" style=" z-index:2">
            <p class="bookname">${post.title}</p>
            <div class="writerWrap">
              <p class="writer">${user.name}</p>
            </div>
          </div>
          <img
            src="${post.image}"
            class="bookCoverWrap"
            alt=""
            style="object-fit:cover; z-index:1 " onerror="this.style.display='none'"
          />
        </a>
      </div>
      <a href="./src/pages/detail/detail.html?id=${post._id}">
        <div class="bookTxt">
          <p class="bookname">${post.title ?? ''}</p>
          <p class="bookDescription">
            ${post.content.slice(0, 60)}...
          </p>
        </div>
      </a>
    `;

    ul.append(li);
  });

  div.append(todayBook);
}

async function loadTodayAuthor() {
  // 1. 전체 글 가져오기
  const postsRes = await axios.get<ApiPostsResponse>('/posts?type=brunch');
  const posts = postsRes.data.item;

  // 2. 조회수 기준 정렬
  const sortedPosts = posts.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

  // 3. 조회수 1등 글의 작가
  const todayPost = sortedPosts[0];
  const authorId = todayPost.user._id;

  // 4. 작가 정보 가져오기
  const authorRes = await axios.get(`/users/${authorId}`);
  const author = authorRes.data.item;

  // 5. 전체 글 중에서 "유저 아이디가 같은 글만" 필터링
  const authorPosts = posts
    .filter(post => post.user._id === authorId)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0)) // 뷰 높은 순
    .slice(0, 2); // 상위 2개만;
  console.log(authorPosts, '같은 작가 글들');

  // 6. 렌더

  renderTodayAuthor(author, authorPosts);
  swiperRender(authorPosts[0], author);
}

loadTodayAuthor();
//오늘의 작가 끝@@
//====================================

function swiperRender(posts: ApiPost, users: ApiUser) {
  const swiper = document.querySelector('.swiper') as HTMLElement;

  swiper.innerHTML = '';
  //siperTxtCon
  const txt = document.createElement('div');
  txt.classList.add('swiperTxtCon');
  txt.innerHTML = `
    <a href="./src/pages/detail/detail.html?id=${posts._id}">
      <h3 class="bookname">${posts.title}</h3>
      <div class="spanCon">
        <span class="by">by</span>
        <span class="writer">${users.name}</span>
      </div>
    </a>
  `;
  swiper.append(txt);

  //bookCoverWrap
  const bookCover = document.createElement('div');
  bookCover.classList.add('bookCoverWrap');
  bookCover.innerHTML = `
    <a href="./src/pages/detail/detail.html?id=${posts._id}">
      <div class="bookCover" style=" z-index:2">
        <p class="bookname">${posts.title}</p>
      </div>
       <img src="${posts.image}" class="bookCoverWrap" alt="" style="object-fit:cover; z-index:1 " onerror="this.style.display='none'";/>
    </a>
  `;
  swiper.append(bookCover);

  //cheerCont
  const cheer = document.createElement('div');
  cheer.classList.add('cheerCount');
  cheer.innerHTML = `
    <span>${users.bookmarkedBy.users}</span><span>명이 응원</span>

    <div class="slide"></div>
  `;
  swiper.append(cheer);
}
