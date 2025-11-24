// getAxios: axios 인스턴스를 생성하는 함수 (공통 설정이 적용된 axios 객체를 반환)
import { getAxios } from '../../utils/axios';
// import type : 타입만 가져오기 (실제 코드에는 포함되지 않고, 타입 체크에만 사용)
import type {
  ApiUser, // 작가/사용자 정보 타입 (기본 타입)
  ApiPost, // 게시글 정보 타입 (기본 타입)
  ApiusersResponse, // 사용자 목록 응답 타입
} from '../../types/types';

// writer.ts에서만 사용하는 확장된 타입 정의
// 인터섹션 타입(&)을 사용하여 기존 ApiUser 타입에 추가 필드를 확장
// 이렇게 하면 types/types.ts를 수정하지 않고도 필요한 타입을 추가할 수 있음
type WriterApiUser = ApiUser & {
  type: string; // "user", "seller", "admin"
  loginType: string; // "email", "kakao"
  createdAt?: string; // "2025.11.13 13:10:58" 형식
  updatedAt?: string; // "2025.11.13 13:10:58" 형식
  likedBy?: { users: number }; // 좋아요 수
  totalSales?: number; // 총 판매액
  extra?: {
    job?: string;
    biography?: string;
    keyword?: Array<string>;
  };
};

// writer.ts에서만 사용하는 확장된 게시글 타입
// 인터섹션 타입(&)을 사용하여 기존 ApiPost 타입에 날짜 필드 추가
type WriterApiPost = ApiPost & {
  createdAt?: string; // "2025.11.13 13:10:58" 형식
  updatedAt?: string; // "2025.11.13 13:10:58" 형식
  extra?: {
    subTitle?: string;
    writer?: string;
  };
};

// axios 인스턴스 생성 (표준 패턴)
// getAxios()를 호출하면 baseURL, 헤더 등이 설정된 axios 객체가 반환됨
// 이 객체를 사용하면 /users 같은 상대 경로만으로 API 호출 가능
// (실제로는 https://fesp-api.koyeb.app/market/users 로 요청이 감)
const axios = getAxios();

// URL 파라미터에서 이메일 가져오기
// 예 : writer.html?email=w1@market.com 에서 'w1@market.com'을 추출
function getEmailFromUrl(): string | null {
  // URLSearchParams : URL의 쿼리 파라미터(?뒤의 부분)를 다루는 객체
  // window.location.search: 현재 페이지 URL의 쿼리 파라미터 부분 (예: ?email=w1@market.com)
  const urlParams = new URLSearchParams(window.location.search);
  // get('email'): 'email'이라는 이름의 파라미터 값을 가져옴
  // 값이 있으면 문자열 반환, 없으면 null 반환
  return urlParams.get('email');
}

// 날짜 포맷팅
// API 응답의 날짜 문자열("2025.11.13 13:10:58")을 "Jan 02. 2024" 형식으로 변환하는 함수
function formatDate(dateString: string): string {
  // API 응답 형식: "2025.11.13 13:10:58"
  // Date 객체로 변환하기 위해 점(.)을 하이픈(-)으로 바꾸고 공백을 'T'로 변경
  // "2025.11.13 13:10:58" → "2025-11-13T13:10:58" → Date 객체
  // replace(/\./g, '-'): 모든 점(.)을 하이픈(-)으로 변경
  // replace(' ', 'T'): 첫 번째 공백을 'T'로 변경 (ISO 8601 형식)
  const formattedDateString = dateString.replace(/\./g, '-').replace(' ', 'T');
  const date = new Date(formattedDateString);

  // 날짜가 유효하지 않으면 현재 날짜 사용
  // isNaN(date.getTime()): Date 객체가 유효하지 않은 날짜인지 확인
  if (isNaN(date.getTime())) {
    return formatDateFromDate(new Date());
  }

  return formatDateFromDate(date);
}

// Date 객체를 "Jan 02. 2024" 형식의 문자열로 변환하는 함수
function formatDateFromDate(date: Date): string {
  // 월 이름 배열 (영문 약자)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  // date.getMonth() : 0~11 사이의 숫자 반환 (0=1월, 11=12월)
  // months 배열에서 해당 월 이름 가져오기
  const month = months[date.getMonth()];
  // date.getDate() : 일(day) 반환 (1~31)
  // toString() : 숫자를 문자열로 변환
  // padStart(2, '0') : 문자열이 2자리가 아니면 앞에 '0'을 추가 (예: "2" → "02")
  const day = date.getDate().toString().padStart(2, '0');
  // date.getFullYear() : 연도 반환
  const year = date.getFullYear();
  // 템플릿 리터럴: 백틱(`)을 사용하여 변수를 문자열에 삽입
  // ${변수} 형식으로 변수 값을 문자열에 포함시
  return `${month} ${day}. ${year}`;
}

// 관심작가 수 가져오기
// 현재 로그인한 사용자가 구독한 작가 수를 API에서 가져와서 표시
async function loadFollowingCount(element: HTMLElement): Promise<void> {
  try {
    // /bookmarks/user 엔드포인트를 시도 (현재 사용자가 구독한 작가 목록)
    // 이 엔드포인트가 존재하면 관심작가 목록을 가져올 수 있음
    const bookmarksRes = await axios.get<{ ok: number; item: any[] }>(
      '/bookmarks/user',
    );
    // 응답이 성공하고 데이터가 있으면 배열 길이를 표시
    if (bookmarksRes.data.ok === 1 && bookmarksRes.data.item) {
      const followingCount = bookmarksRes.data.item.length;
      element.textContent = followingCount.toString();
    } else {
      // 데이터가 없으면 0으로 유지
      element.textContent = '0';
    }
  } catch (error) {
    // /bookmarks/user 엔드포인트가 없거나 에러가 발생하면
    // 현재는 관심작가 수를 가져올 수 없으므로 0으로 유지
    // 추후 API에서 관심작가 수를 제공하는 엔드포인트가 추가되면 여기서 사용 가능
    // 예: 현재 사용자 정보에서 가져오기
    //     const userStr = localStorage.getItem('user');
    //     if (userStr) {
    //       const currentUser = JSON.parse(userStr);
    //       const userDetailRes = await axios.get(`/users/${currentUser._id}`);
    //       const followingCount = userDetailRes.data.item.followingCount;
    //       element.textContent = followingCount.toString();
    //     }
    console.log(
      '관심작가 수를 가져올 수 없습니다. /bookmarks/user 엔드포인트가 존재하지 않거나 접근 권한이 없습니다.',
    );
    element.textContent = '0';
  }
}

// 작가 정보 렌더링
// WriterApiUser 타입을 사용하여 작가 정보를 화면에 표시
// render : 데이터를 받아서 화면에 보여주는 것
function renderWriterInfo(writer: WriterApiUser): void {
  // 작가 이름
  // document.querySelector() : CSS 선택자로 HTML 요소를 찾는 메서드
  // .writer_name : 클래스 이름이 'writer_name'인 요소를 찾음
  const writerNameEl = document.querySelector('.writer_name');
  // if (writerNameEl) : 요소가 존재하는지 확인 (null이 아닐 때만 실행)
  // 안전한 코드 작성 : 요소가 없으면 에러가 발생하지 않도록 체크
  if (writerNameEl) {
    // textContent : HTML 요소 안에 텍스트를 넣는 속성
    // writer.name || '등록된 이름이 없습니다.':
    // writer.name이 있으면 그 값을 사용하고, 없으면 '등록된 이름이 없습니다.' 사용
    // || 왼쪽 값이 있으면 왼쪽 사용, 없으면(빈 문자열, null, undefined 등) 오른쪽 사용
    writerNameEl.textContent = writer.name || '등록된 이름이 없습니다.';
  }

  // 작가 직업
  const writerJobEl = document.querySelector('.writer_job');
  // && 왼쪽과 오른쪽이 모두 true일 때만 true
  // writer.extra?.job - extra가 없거나 job이 없으면 undefined 반환
  // ?.를 사용하면 extra가 null이나 undefined여도 에러가 발생하지 않음
  // extra가 있으면 job 값을 가져오고, 없으면 undefined 반환
  if (writerJobEl && writer.extra?.job) {
    writerJobEl.textContent = writer.extra.job;
  }

  // 작가 프로필 이미지
  // as HTMLImageElement : 타입 단언 (TypeScript에서 사용)
  // querySelector는 HTMLElement | null을 반환하는데,
  // 이것이 img 태그라는 것을 알고 있으니까 HTMLImageElement로 타입을 지정
  // 이렇게 하면 .src 같은 img 태그만의 속성을 사용할 수 있음
  const profileImgEl = document.querySelector(
    '.profile_img',
  ) as HTMLImageElement;
  if (profileImgEl && writer.image) {
    // API에서 받은 이미지 경로 사용
    // .src : img 태그의 이미지 경로를 설정하는 속성
    profileImgEl.src = writer.image;
    // .alt : 이미지가 로드되지 않을 때 표시되는 대체 텍스트 (접근성 향상)
    profileImgEl.alt = `${writer.name} 프로필 사진`;
  }

  // 통계 표시 (API 응답에서 직접 가져옴)
  // 구독자 수 (bookmarkedBy.users는 API 응답에 포함된 구독자 수)
  // '.writer_stats > div:first-child .stat_value':
  // writer_stats 클래스 안의 첫 번째 div 안의 stat_value 클래스를 찾음
  //  > 는 자식 선택자 (직접 자식만 선택)
  const subscriberStatEl = document.querySelector(
    '.writer_stats > div:first-child .stat_value',
  );
  if (subscriberStatEl) {
    // writer.bookmarkedBy?.users || 0 : bookmarkedBy가 있으면 users 값을 가져오고, 없으면 0 사용
    // || 0 : users가 0이거나 없으면 0을 사용 (0은 falsy 값이므로 || 연산자로 처리)
    const subscribersCount = writer.bookmarkedBy?.users || 0;
    // toString() : 숫자를 문자열로 변환 (textContent는 문자열만 받을 수 있음)
    subscriberStatEl.textContent = subscribersCount.toString();
  }

  // 관심작가 수 (현재 사용자가 구독한 작가 수)
  // API에서 관심작가 목록을 가져와서 개수를 표시
  const followingStatEl = document.querySelector(
    '.writer_stats > div:last-child .stat_value',
  ) as HTMLElement;
  if (followingStatEl) {
    // 초기값으로 0 표시 (API 호출 완료 후 업데이트됨)
    followingStatEl.textContent = '0';
    // 관심작가 수를 가져오는 함수 호출 (비동기)
    loadFollowingCount(followingStatEl);
  }

  // 구독 버튼 토글 기능 설정
  setupSubscribeButton(writer._id, writer.bookmarkedBy?.users || 0);
}

// 구독 버튼 토글 기능 설정
// _writerId : 매개변수 앞에 _를 붙이면 사용하지 않는 변수라는 의미 (TypeScript 경고 방지)
function setupSubscribeButton(
  _writerId: number | undefined,
  _initialSubscribersCount: number,
): void {
  // HTMLButtonElement : button 태그의 타입
  const subscribeBtn = document.querySelector(
    '.subscribe_btn',
  ) as HTMLButtonElement;
  const subscriberStatEl = document.querySelector(
    '.writer_stats > div:first-child .stat_value',
  ) as HTMLElement;

  // !subscribeBtn : subscribeBtn이 없으면 (null이면) return 함수를 즉시 종료 (아래 코드를 실행하지 않음)
  if (!subscribeBtn) {
    return;
  }

  // 초기 구독 상태는 false로 시작 (실제로는 사용자별 구독 상태를 확인해야 함)
  let isSubscribed = false;

  // 구독 버튼 클릭 이벤트
  // addEventListener : HTML 요소에 이벤트 리스너(이벤트가 발생했을 때 실행할 함수)를 추가
  // click 클릭 이벤트
  // () => {} 클릭했을 때 실행할 함수 (화살표 함수)
  subscribeBtn.addEventListener('click', () => {
    // !isSubscribed : 현재 상태의 반대값으로 변경 (false → true, true → false)
    isSubscribed = !isSubscribed;

    if (isSubscribed) {
      // 구독중 상태로 변경
      // classList.add() : CSS 클래스를 추가 (스타일 적용)
      subscribeBtn.classList.add('subscribed');
      // innerHTML : HTML 태그를 포함한 내용을 설정 (텍스트 + HTML 태그)
      // textContent와 달리 HTML 태그를 실제 태그로 인식함
      subscribeBtn.innerHTML = '<span class="checkmark">✓</span>구독중';

      // 구독자 수 증가
      if (subscriberStatEl) {
        // parseInt() : 문자열을 정수로 변환
        // textContent || '0': textContent가 없으면 '0' 사용
        // 10 : 10진수로 변환 (2진수, 16진수 등이 아닌 일반 숫자)
        const currentCount = parseInt(subscriberStatEl.textContent || '0', 10);
        // (currentCount + 1) 현재 값에 1을 더함
        // toString() 숫자를 문자열로 변환
        subscriberStatEl.textContent = (currentCount + 1).toString();
      }
    } else {
      // 구독 안 함 상태로 변경
      // classList.remove() : CSS 클래스를 제거
      subscribeBtn.classList.remove('subscribed');
      // textContent : 순수 텍스트만 설정 (HTML 태그는 텍스트로 표시됨)
      subscribeBtn.textContent = '구독';

      // 구독자 수 감소
      if (subscriberStatEl) {
        const currentCount = parseInt(subscriberStatEl.textContent || '0', 10);
        // Math.max(0, currentCount - 1):
        // currentCount - 1과 0 중 더 큰 값을 반환
        // 음수가 되지 않도록 0 이하로 내려가지 않게 함
        const newCount = Math.max(0, currentCount - 1);
        subscriberStatEl.textContent = newCount.toString();
      }
    }
  });
}

// 게시글 목록 렌더링
// WriterApiPost 타입을 사용하여 게시글 목록을 화면에 표시
// posts : WriterApiPost[] - 게시글 배열 ([]는 배열을 의미)
function renderPostList(posts: WriterApiPost[]): void {
  const articleListEl = document.querySelector('.article_list');
  if (!articleListEl) {
    return;
  }

  // 기존 게시글 목록 제거
  // innerHTML = '' : 요소 안의 모든 내용을 삭제 (빈 문자열로 설정)
  // 이렇게 해야 이전에 표시된 게시글이 중복으로 표시되지 않음
  articleListEl.innerHTML = '';

  // posts.length : 배열의 길이 (게시글 개수)
  // === 0 : 배열이 비어있는지 확인
  if (posts.length === 0) {
    // createElement : 새로운 HTML 요소를 생성 (아직 화면에는 보이지 않음)
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = '작성된 글이 없습니다.';
    // 인라인 스타일을 직접 설정
    emptyMessage.style.textAlign = 'center';
    emptyMessage.style.padding = '40px 20px';
    emptyMessage.style.color = '#999999';
    // appendChild : 부모 요소의 마지막 자식으로 요소를 추가 (화면에 표시됨)
    articleListEl.appendChild(emptyMessage);
    return; // 함수 종료 (아래 코드 실행 안 함)
  }

  // forEach : 배열의 각 요소에 대해 함수를 실행
  // post : 배열의 각 요소 (각 게시글)
  // => : 화살표 함수 (각 게시글마다 실행할 코드)
  posts.forEach(post => {
    // article : HTML5 시맨틱 태그 (게시글, 뉴스 등 독립적인 콘텐츠를 나타냄)
    const articleItem = document.createElement('article');
    // className : 요소의 class 속성을 설정 (CSS 스타일 적용을 위해)
    articleItem.className = 'article_item';

    // 카테고리 (임시로 고정값 사용, 추후 API에서 카테고리 정보 제공 시 수정 필요)
    const categoryLink = document.createElement('p');
    categoryLink.className = 'category_link';
    categoryLink.textContent = '취준은 처음이라';
    // appendChild : articleItem의 자식 요소로 categoryLink를 추가
    articleItem.appendChild(categoryLink);

    // 제목 (게시글 상세 페이지로 링크)
    // a: 링크 태그
    const titleLink = document.createElement('a');
    // API 응답의 _id를 직접 사용 (표준 패턴)
    // href 링크가 이동할 주소
    // 빌드 후 경로 구조에 맞게 절대 경로 사용
    // vite.config.js에서 'bord/detail'로 설정되어 있으므로 /bord/detail.html 사용
    // 개발 환경과 빌드 환경 모두에서 작동하도록 절대 경로 사용
    // 예: "/bord/detail.html?id=123"
    titleLink.href = `/bord/detail.html?id=${post._id}`;
    titleLink.className = 'title';
    titleLink.textContent = post.title;
    articleItem.appendChild(titleLink);

    // 글 설명
    const desc = document.createElement('p');
    desc.className = 'desc';
    // if-else : 조건문 (조건에 따라 다른 코드 실행)
    if (post.extra?.subTitle) {
      // 템플릿 리터럴 : `${변수}` 형식으로 변수를 문자열에 삽입
      desc.textContent = `${post.extra.subTitle} | ${post.title}`;
    } else {
      // subTitle이 없으면 제목만 사용
      desc.textContent = post.title;
    }
    // 설명이 너무 길면 자르기
    // .length : 문자열의 길이 (문자 개수)
    if (desc.textContent.length > 80) {
      // substring(0, 80): 문자열의 0번째부터 80번째까지 자르기
      // + '...': 잘린 부분을 나타내기 위해 '...' 추가
      desc.textContent = desc.textContent.substring(0, 80) + '...';
    }
    articleItem.appendChild(desc);

    // 날짜 및 조회수
    // API 응답의 createdAt 필드를 사용하여 게시글 작성 날짜 표시
    const date = document.createElement('p');
    date.className = 'date';
    // post.views || 0 : views가 있으면 그 값을 사용하고, 없으면 0 사용
    const viewsCount = post.views || 0;
    // post.createdAt : API 응답에서 게시글 작성 날짜 가져오기 형식: "2025.11.13 13:10:58"
    // createdAt이 있으면 그 날짜를 사용하고, 없으면 현재 날짜 사용
    const postDate = post.createdAt
      ? formatDate(post.createdAt)
      : formatDateFromDate(new Date());
    date.textContent = `조회수 ${viewsCount} · ${postDate}`;
    articleItem.appendChild(date);

    // articleItem을 articleListEl에 추가 (화면에 표시됨)
    articleListEl.appendChild(articleItem);
  });
  // forEach 반복문 종료 (모든 게시글에 대해 위의 코드가 실행됨)
}

// 작가 데이터 가져오기 및 페이지 렌더링
// 이메일로 작가를 찾아서 정보와 게시글 목록을 가져옴
// async : 비동기 함수 (데이터를 가져오는 동안 다른 작업을 계속할 수 있음)
// Promise<void> : 이 함수는 아무것도 반환하지 않지만 비동기 작업을 수행함
async function getWriterData(writerEmail: string): Promise<void> {
  // try-catch : 에러 처리를 위한 구문
  // try : 정상적으로 실행될 코드
  // catch : 에러가 발생했을 때 실행될 코드
  try {
    // 1. 모든 사용자 목록 가져오기
    // await : 비동기 작업이 완료될 때까지 기다림 (데이터를 가져올 때까지 대기)
    // axios.get<ApiusersResponse>:
    // GET 요청을 보내고, 응답 데이터의 타입을 ApiusersResponse로 지정
    // <타입> : 제네릭 (TypeScript에서 타입을 매개변수로 전달하는 방법)
    const usersRes = await axios.get<ApiusersResponse>('/users');
    // usersRes.data.item : API 응답에서 실제 데이터 배열을 가져옴
    // API 응답 구조: { data: { item: [...] } }
    const users = usersRes.data.item;

    // 2. 이메일로 작가 찾기
    // find() : 배열에서 조건에 맞는 첫 번째 요소를 찾는 메서드
    // user => user.email === writerEmail : 각 사용자의 이메일이 찾고자 하는 이메일과 같은지 확인
    // === 값과 타입이 모두 같아야 true
    const writer = users.find(user => user.email === writerEmail);

    // !writer: writer가 없으면 (null이거나 undefined이면)
    if (!writer) {
      console.error('작가를 찾을 수 없습니다.');
      return;
    }

    // 3. 작가 상세 정보 가져오기 (구독자 수 등 추가 정보 포함)
    // `/users/${writer._id}` : 템플릿 리터럴로 URL 생성
    // 예: writer._id가 123이면 "/users/123"
    const writerDetailRes = await axios.get<{
      ok: number;
      item: WriterApiUser;
    }>(`/users/${writer._id}`);
    // writerDetail은 WriterApiUser 타입으로 사용 (확장된 타입)
    const writerDetail = writerDetailRes.data.item as WriterApiUser;

    // 4. 작가 정보 렌더링
    // 위에서 만든 함수를 호출하여 화면에 작가 정보 표시
    renderWriterInfo(writerDetail);

    // 5. 해당 작가의 게시글 목록 가져오기 (표준 API 엔드포인트 사용)
    // `/posts/users/${writer._id}`: 특정 작가의 게시글 목록을 가져오는 API
    // 예: "/posts/users/123" → ID가 123인 작가의 게시글 목록
    const postsRes = await axios.get<{ item: WriterApiPost[] }>(
      `/posts/users/${writer._id}`,
    );
    // writerPosts는 WriterApiPost[] 타입으로 사용 (확장된 타입)
    const writerPosts = postsRes.data.item as WriterApiPost[];

    // 6. 게시글 목록 렌더링
    // 위에서 만든 함수를 호출하여 화면에 게시글 목록 표시
    renderPostList(writerPosts);
  } catch (error) {
    // catch : try 블록에서 에러가 발생했을 때 실행되는 부분
    // error : 발생한 에러 정보
    console.error('작가 데이터 조회 오류:', error);
    // 사용자에게 에러 메시지 표시 (선택사항)
    const articleListEl = document.querySelector('.article_list');
    if (articleListEl) {
      // 에러 메시지를 HTML로 직접 삽입
      articleListEl.innerHTML =
        '<p style="text-align: center; padding: 40px 20px; color: #999999;">데이터를 불러오는 중 오류가 발생했습니다.</p>';
    }
  }
}

// 페이지 로드 시 실행
// DOMContentLoaded : HTML 문서가 완전히 로드되었을 때 발생하는 이벤트
// (이미지나 스타일시트는 아직 로드 중일 수 있지만, HTML 구조는 완성됨)
document.addEventListener('DOMContentLoaded', () => {
  // URL 파라미터에서 이메일 가져오기, 없으면 기본값 사용
  // getEmailFromUrl() || 'w1@market.com':
  // URL에 이메일이 있으면 그 값을 사용하고, 없으면 'w1@market.com' 사용
  const email = getEmailFromUrl() || 'w1@market.com';
  // async 함수이므로 await 없이 호출 (에러는 함수 내부에서 처리)
  // getWriterData는 async 함수이지만, 여기서는 await 없이 호출
  // 함수 내부에서 try-catch로 에러를 처리하므로 여기서는 기다릴 필요 없음
  getWriterData(email);
});
