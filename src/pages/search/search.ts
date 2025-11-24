// axios 라이브러리를 가져옴 (HTTP 요청을 보내기 위한 도구)
import axios from 'axios';
import type { ApiUser, ApiPost } from '../../types/types'; // 작가 정보 타입, 게시글 정보 타입

interface SearchApiResponse {
  user: ApiUser[];
  post: ApiPost[];
}

// 검색 데이터를 가져오는 API 함수
// async : 비동기 함수 (데이터를 가져오는 동안 다른 작업을 계속할 수 있음)
// Promise<SearchApiResponse | null> : 성공하면 SearchApiResponse를, 실패하면 null을 반환
async function getSearchDataApi(): Promise<SearchApiResponse | null> {
  try {
    // axios.get()으로 서버에서 데이터 가져오기
    // <SearchApiResponse> : 가져올 데이터의 타입 지정
    // await : 데이터를 가져올 때까지 기다림
    // 빌드 후에도 작동하도록 localhost URL 제거하고 상대 경로 사용
    // 개발 환경과 빌드 환경 모두에서 작동하도록 절대 경로 사용
    const response = await axios.get<SearchApiResponse>(
      `/api/dbinit/readonly-brunch/data.json`,
    );
    // response.data에 실제 데이터가 들어있음
    return response.data;
  } catch (error) {
    // 에러가 발생하면 에러 메시지 출력
    console.error('검색 데이터 조회 오류:', error);
    // null을 반환하여 에러를 알림
    return null;
  }
}

// DOM 요소
// HTML에서 필요한 요소들을 찾아서 변수에 저장
// getElementById : HTML 요소의 id 속성으로 요소를 찾는 메서드
// as HTMLInputElement : TypeScript에서 요소의 타입을 명시적으로 지정
const searchInput = document.getElementById('search_input') as HTMLInputElement;
const searchInitial = document.getElementById('search_initial') as HTMLElement;
const searchResults = document.getElementById('search_results') as HTMLElement;
const searchTabs = document.getElementById('search_tabs') as HTMLElement;
const tabPosts = document.getElementById('tab_posts') as HTMLElement;
const tabWriters = document.getElementById('tab_writers') as HTMLElement;
const tabIndicator = document.querySelector('.tab_indicator') as HTMLElement;
const writersResults = document.getElementById(
  'writers_results',
) as HTMLElement;
const postsResults = document.getElementById('posts_results') as HTMLElement;
const resultsCount = document.getElementById('results_count') as HTMLElement;
const noResults = document.getElementById('no_results') as HTMLElement;

// 현재 선택된 탭
// posts 또는 writers 중 하나의 값만 저장
// 탭을 전환할 때 값이 변경되기 때문에 let으로 선언
let currentTab: 'posts' | 'writers' = 'posts';

// 검색어 저장 변수
// 사용자가 입력한 검색어를 저장하는 전역 변수
let searchKeyword = '';

// 검색 데이터 저장
// API에서 가져온 모든 데이터를 저장하는 변수
// null로 초기화: 아직 데이터를 가져오지 않았음을 의미
let allData: SearchApiResponse | null = null;

/**
 * 검색어가 텍스트에 포함되어 있는지 확인
 * @param text - 검색할 텍스트
 * @param keyword - 검색어
 * @returns 검색어가 포함되어 있으면 true, 없으면 false
 */
function containsKeyword(text: string, keyword: string): boolean {
  // text나 keyword가 없으면 false 반환
  // ! 없으면 true, 있으면 false
  if (!text || !keyword) {
    return false;
  }
  // toLowerCase(): 문자열을 모두 소문자로 변환
  // includes(): 문자열에 특정 문자열이 포함되어 있는지 확인
  // 대소문자 구분 없이 검색하기 위해 둘 다 소문자로 변환하여 비교
  return text.toLowerCase().includes(keyword.toLowerCase());
}

/**
 * 검색어 하이라이트표시 함수
 * 검색 결과에서 검색어를 강조 표시하기 위해 <span class="highlight"> 태그로 감싸는 함수
 * @param text - 원본 텍스트
 * @param keyword - 하이라이트할 검색어
 * @returns 검색어가 <span class="highlight"> 태그로 감싸진 HTML 문자열
 */
function highlightKeyword(text: string, keyword: string): string {
  // text나 keyword가 없으면 원본 텍스트 그대로 반환
  if (!text || !keyword) {
    return text;
  }
  // 정규식 특수문자 이스케이프 처리
  // replace()는 문자열에서 특정 패턴을 찾아 다른 문자열로 바꾸는 메서드
  // [.*+?^${}()|[\]\\]는 정규식에서 특수한 의미를 가진 문자들
  // '\\$&'는 찾은 문자 앞에 백슬래시를 추가하여 특수문자로 인식되지 않게 함
  // 예: '.' → '\.', '(' → '\('
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 정규식 객체 생성
  // RegExp는 정규식을 만드는 생성자 함수
  // '(' + escapedKeyword + ')'는 검색어를 그룹으로 묶음 (나중에 $1로 참조 가능)
  // 'gi' 플래그: g(전역 검색), i(대소문자 구분 안 함)
  const regex = new RegExp('(' + escapedKeyword + ')', 'gi');

  // 검색어를 찾아서 <span class="highlight"> 태그로 감싸기
  // replace()는 첫 번째 인자로 정규식을 받고, 두 번째 인자로 바꿀 문자열을 받음
  // '$1'은 정규식에서 첫 번째 그룹(검색어)을 의미
  // 예: "안녕하세요"에서 "안녕" 검색 → "<span class="highlight">안녕</span>하세요"
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * 작가 검색 함수
 * 검색어로 작가를 검색하여 일치하는 작가들을 반환하는 함수
 * @param keyword - 검색어
 * @param data - 검색할 데이터 (모든 작가와 글 정보)
 * @returns 검색어와 일치하는 작가 배열
 */
function searchWriters(keyword: string, data: SearchApiResponse): ApiUser[] {
  // 검색어가 없으면 모든 작가 반환
  if (!keyword || !keyword.trim()) {
    return data.user;
  }

  // 검색어를 소문자로 변환하여 저장
  // 대소문자 구분 없이 검색하기 위함
  const searchTerm = keyword.trim().toLowerCase();

  // 일치하는 작가들을 저장할 배열
  const matchedWriters: ApiUser[] = [];

  // 모든 작가 데이터를 순회하면서 검색어가 포함된 작가 찾기
  // forEach는 배열의 각 요소에 대해 함수를 실행하는 메서드
  data.user.forEach(writer => {
    // 작가 이름에 검색어가 포함되어 있는지 확인
    const nameMatch = containsKeyword(writer.name, searchTerm);

    // 작가 설명(biography)에 검색어가 포함되어 있는지 확인
    // writer.extra?.biography - extra가 없거나 biography가 없으면 undefined
    // || '' : undefined이면 빈 문자열 사용
    const descMatch = containsKeyword(
      writer.extra?.biography || '',
      searchTerm,
    );

    // 태그에 검색어가 포함되어 있는지 확인
    // 태그는 여러 개일 수 있으므로 반복문으로 확인
    let tagMatch = false; // 태그 매칭 여부를 저장할 변수
    if (writer.extra?.keyword) {
      // for 배열의 각 요소를 순회
      // i는 인덱스 0부터 시작, writer.extra.keyword.length는 태그 배열의 길이
      for (let i = 0; i < writer.extra.keyword.length; i++) {
        // 각 태그에 검색어가 포함되어 있는지 확인
        if (containsKeyword(writer.extra.keyword[i], searchTerm)) {
          tagMatch = true; // 하나라도 일치하면 true
          break; // 일치하는 태그를 찾았으면 반복문 종료
        }
      }
    }

    // 이름, 설명, 태그 중 하나라도 일치하면 검색 결과에 추가
    // || 하나라도 true면 true
    if (nameMatch || descMatch || tagMatch) {
      matchedWriters.push(writer); // 일치하는 작가를 배열에 추가
    }
  });

  // 검색 결과 배열 반환
  return matchedWriters;
}

/**
 * 글 검색 함수
 * 검색어로 글을 검색하여 일치하는 글들을 반환하는 함수
 * @param keyword - 검색어
 * @param data - 검색할 데이터 (모든 작가와 글 정보)
 * @returns 검색어와 일치하는 글 배열
 */
function searchPosts(keyword: string, data: SearchApiResponse): ApiPost[] {
  // 검색어가 없으면 모든 글 반환
  if (!keyword || !keyword.trim()) {
    return data.post;
  }

  // 검색어를 소문자로 변환하여 저장
  // 대소문자 구분 없이 검색하기 위함
  const searchTerm = keyword.trim().toLowerCase();

  // 일치하는 글들을 저장할 배열
  const matchedPosts: ApiPost[] = [];

  // 모든 글 데이터를 돌면서 검색어가 포함된 글 찾기
  data.post.forEach(post => {
    // 글 제목에 검색어가 포함되어 있는지 확인
    const titleMatch = containsKeyword(post.title, searchTerm);

    // 글 설명(subTitle)에 검색어가 포함되어 있는지 확인
    // post.extra?.subTitle - extra가 없거나 subTitle이 없으면 undefined
    // || '' : undefined이면 빈 문자열 사용
    const descMatch = containsKeyword(post.extra?.subTitle || '', searchTerm);

    // 제목이나 설명 중 하나라도 일치하면 검색 결과에 추가
    // 하나라도 true면 true
    if (titleMatch || descMatch) {
      matchedPosts.push(post); // 일치하는 글을 배열에 추가
    }
  });

  // 검색 결과 배열 반환
  return matchedPosts;
}

/**
 * 검색 기록 저장
 * 검색어를 localStorage에 저장하여 브라우저를 닫아도 검색 기록이 유지되도록 함
 * localStorage는 브라우저에 데이터를 저장하는 저장소 (브라우저를 닫아도 데이터가 남아있음)
 * @param keyword - 저장할 검색어
 */
function saveSearchHistory(keyword: string): void {
  // keyword가 없거나 공백만 있으면 함수 종료
  // trim()은 문자열 앞뒤 공백을 제거하는 메서드
  if (!keyword || !keyword.trim()) {
    return;
  }

  const trimmedKeyword = keyword.trim();

  // localStorage에서 기존 검색 기록 가져오기
  // localStorage.getItem('searchHistory')는 저장된 값을 가져옴 (없으면 null)
  // null이면 '[]' 빈 배열 문자열을 사용
  // JSON.parse()는 JSON 문자열을 JavaScript 객체/배열로 변환
  let searchHistory: string[] = JSON.parse(
    localStorage.getItem('searchHistory') || '[]',
  );

  // 이미 존재하는 검색어는 제거
  // filter()는 배열에서 조건에 맞는 요소만 남기는 메서드
  // item !== trimmedKeyword : 현재 검색어와 다른 것만 남김 (중복 제거)
  searchHistory = searchHistory.filter(item => item !== trimmedKeyword);

  // 맨 앞에 추가
  // unshift()는 배열의 맨 앞에 요소를 추가하는 메서드
  // 최근 검색어가 위에 오도록 하기 위함
  searchHistory.unshift(trimmedKeyword);

  // 검색 기록 최대 10개만 저장
  if (searchHistory.length > 10) {
    // slice(0, 10)은 배열의 처음부터 10번째까지만 가져옴
    searchHistory = searchHistory.slice(0, 10);
  }

  // localStorage에 검색 기록 저장
  // JSON.stringify()는 JavaScript 객체/배열을 JSON 문자열로 변환
  // localStorage는 문자열만 저장할 수 있기 때문에 변환이 필요함
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // 검색 기록 저장 후 화면에 바로 반영
  // 화면에 표시된 검색 기록 목록을 업데이트함
  displaySearchHistory();
}

/**
 * 검색 기록 가져오기
 * localStorage에서 저장된 검색 기록을 가져와서 배열로 반환
 * @returns 검색 기록 배열
 */
function getSearchHistory(): string[] {
  // localStorage에서 searchHistory 키로 저장된 값을 가져옴
  // 없으면 빈 배열 []을 반환
  // JSON.parse()로 문자열을 배열로 변환
  return JSON.parse(localStorage.getItem('searchHistory') || '[]');
}

/**
 * 검색 기록 삭제
 * 사용자가 검색 기록에서 특정 검색어를 삭제할 때 사용
 * @param keyword - 삭제할 검색어
 */
function deleteSearchHistory(keyword: string): void {
  // 기존 검색 기록 가져오기
  let searchHistory = getSearchHistory();

  // 삭제할 검색어를 제외한 나머지만 남김
  // filter()로 keyword와 다른 것만 필터링
  searchHistory = searchHistory.filter(item => item !== keyword);

  // 수정된 검색 기록을 localStorage에 다시 저장
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

  // 화면에 표시된 검색 기록 목록 업데이트
  displaySearchHistory();
}

/**
 * 검색 기록 화면에 표시
 * localStorage에 저장된 검색 기록을 화면에 동적으로 생성하여 표시
 */
function displaySearchHistory(): void {
  // 검색 기록을 표시할 영역 찾기
  // querySelector는 CSS 선택자로 요소를 찾는 메서드
  const recentList = document.querySelector('.recent_list');

  // 요소가 없으면 함수 종료 (안전한 코드 작성)
  if (!recentList) {
    return;
  }

  // localStorage에서 검색 기록 가져오기
  const searchHistory = getSearchHistory();

  // 기존 목록 제거
  // innerHTML을 빈 문자열로 설정하면 자식 요소들이 모두 삭제됨
  // 이렇게 해야 중복으로 표시되지 않음
  recentList.innerHTML = '';

  // 검색 기록이 없으면 함수 종료
  // length는 배열의 길이를 반환하는 속성
  if (searchHistory.length === 0) {
    return;
  }

  // 검색 기록 표시
  // forEach는 배열의 각 요소에 대해 함수를 실행하는 메서드
  // 각 검색어마다 화면에 표시할 요소를 생성
  searchHistory.forEach(keyword => {
    // 검색 기록 하나를 감싸는 div 요소 생성
    const recentItem = document.createElement('div');
    recentItem.className = 'recent_item'; // CSS 클래스 추가

    // 검색어를 표시할 span 요소 생성
    const recentTerm = document.createElement('span');
    recentTerm.className = 'recent_term';
    // textContent는 HTML 요소 안에 텍스트를 넣는 속성 (예시 : <span>꿀</span>)
    recentTerm.textContent = keyword;

    // 삭제 버튼 생성
    const recentDeleteBtn = document.createElement('button');
    recentDeleteBtn.className = 'recent_delete_btn';
    // innerHTML은 HTML 태그를 포함한 내용을 설정할 수 있음
    // × 기호를 표시하기 위해 사용
    recentDeleteBtn.innerHTML = '<span class="delete_icon">×</span>';

    // 검색어 클릭 이벤트
    // 사용자가 검색 기록을 클릭하면 해당 검색어로 다시 검색
    recentTerm.addEventListener('click', () => {
      // 검색 입력창에 검색어 설정
      searchInput.value = keyword;
      // 검색어 변수 업데이트
      searchKeyword = keyword;
      // 검색 결과 화면으로 전환
      toggleScreen(true);
      // 검색 실행 (검색 기록 저장 포함)
      executeSearch(keyword);
    });

    // 삭제 버튼 클릭 이벤트
    // 사용자가 × 버튼을 클릭하면 해당 검색어를 삭제
    recentDeleteBtn.addEventListener('click', (e: Event) => {
      // stopPropagation()은 이벤트가 부모 요소로 전파되는 것을 막음
      // 이렇게 하면 버튼 클릭 시 검색어 클릭 이벤트가 발생하지 않음
      e.stopPropagation();
      // 검색 기록에서 삭제
      deleteSearchHistory(keyword);
    });

    // 요소들을 부모 요소에 추가
    // appendChild는 요소를 부모 요소의 마지막 자식으로 추가하는 메서드
    recentItem.appendChild(recentTerm); // 검색어를 recentItem에 추가
    recentItem.appendChild(recentDeleteBtn); // 삭제 버튼을 recentItem에 추가
    recentList.appendChild(recentItem); // recentItem을 recentList에 추가
  });
}

/**
 * 화면 전환 함수
 * 초기 화면과 검색 결과 화면을 전환하는 함수
 * @param showResults - true면 검색 결과 화면을 보여주고, false면 초기 화면을 보여줌
 */
function toggleScreen(showResults: boolean): void {
  if (showResults) {
    // 검색 결과 화면 표시
    // display 속성을 변경하여 요소를 보이거나 숨김
    searchInitial.style.display = 'none'; // 초기 화면 숨김
    searchResults.style.display = 'block'; // 검색 결과 화면 표시
    searchTabs.style.display = 'flex'; // 탭 네비게이션 표시
  } else {
    // 초기 화면 표시
    searchInitial.style.display = 'block'; // 초기 화면 표시
    searchResults.style.display = 'none'; // 검색 결과 화면 숨김
    searchTabs.style.display = 'none'; // 탭 네비게이션 숨김
    // 검색 기록 목록을 화면에 표시
    displaySearchHistory();
  }
}

/**
 * 탭 전환 함수
 * 사용자가 탭을 클릭했을 때 탭을 전환하고 해당 탭의 검색 결과를 표시
 * @param tabName - 전환할 탭 이름 posts 또는 writers
 */
function switchTab(tabName: 'posts' | 'writers'): void {
  // 현재 탭 변수 업데이트
  currentTab = tabName;

  if (tabName === 'posts') {
    // 글 탭 선택 시
    tabPosts.classList.add('active'); // 글 탭에 active 클래스 추가 (선택된 스타일 적용)
    tabWriters.classList.remove('active'); // 작가 탭에서 active 클래스 제거
    // 인디케이터를 왼쪽으로 이동 (0% 위치)
    // left는 CSS 속성으로 요소의 왼쪽 위치를 지정
    tabIndicator.style.left = '0';
  } else {
    // 작가 탭 선택 시
    tabWriters.classList.add('active'); // 작가 탭에 active 클래스 추가
    tabPosts.classList.remove('active'); // 글 탭에서 active 클래스 제거
    // 인디케이터를 오른쪽으로 이동 (50% 위치)
    tabIndicator.style.left = '50%';
  }

  // 탭 전환 시 검색 실행
  // 검색어가 있으면 현재 탭에 맞는 검색 결과를 다시 표시
  if (searchKeyword && allData) {
    executeSearch(searchKeyword);
  }
}

/**
 * 검색 결과 없음 화면 표시
 * 검색 결과가 없을 때 "검색 결과 없음" 메시지를 표시하는 함수
 */
function showNoResults(): void {
  // 모든 결과 영역 숨기기
  writersResults.style.display = 'none'; // 작가 결과 영역 숨김
  postsResults.style.display = 'none'; // 글 결과 영역 숨김
  noResults.style.display = 'flex'; // 검색 결과 없음 메시지 표시
  resultsCount.style.display = 'none'; // 결과 건수 숨김
}

/**
 * 검색 결과 없음 화면 숨기기
 * 검색 결과가 있을 때 "검색 결과 없음" 메시지를 숨기는 함수
 */
function hideNoResults(): void {
  noResults.style.display = 'none'; // 검색 결과 없음 메시지 숨김
  resultsCount.style.display = 'block'; // 결과 건수 표시
}

/**
 * 검색 결과 건수 업데이트
 * 검색 결과가 몇 건인지 화면에 표시하는 함수
 * @param type - posts 또는 writers
 * @param count - 검색 결과 개수
 */
function updateResultsCount(type: 'posts' | 'writers', count: number): void {
  // type에 따라 다른 텍스트 표시
  if (type === 'posts') {
    // 글 검색 결과인 경우
    // textContent는 요소 안에 텍스트를 넣는 속성
    resultsCount.textContent = '글 검색 결과 ' + count + '건';
  } else {
    // 작가 검색 결과인 경우
    resultsCount.textContent = '작가 검색 결과 ' + count + '건';
  }

  // 결과 건수 표시
  resultsCount.style.display = 'block';
}

/**
 * 게시글 목록을 렌더링하는 함수
 * 검색된 글들을 화면에 표시하고 검색어를 하이라이트하는 함수
 * @param posts - 표시할 게시글 배열
 * @param keyword - 검색어 (하이라이트에 사용)
 */
function render(posts: ApiPost[], keyword: string): void {
  // postsResults 요소가 없으면 함수 종료
  if (!postsResults) {
    return;
  }

  // 기존 게시글 목록 제거
  // innerHTML을 빈 문자열로 설정하면 자식 요소들이 모두 삭제됨
  postsResults.innerHTML = '';

  // 게시글이 없으면 함수 종료
  if (posts.length === 0) {
    return;
  }

  // 각 게시글에 대해 반복
  // forEach는 배열의 각 요소에 대해 함수를 실행
  posts.forEach(post => {
    // 게시글 항목을 감싸는 article 요소 생성
    const postItem = document.createElement('article');
    postItem.className = 'post_item'; // CSS 클래스 추가

    // 게시글 내용을 감싸는 div 요소 생성
    const postContent = document.createElement('div');
    postContent.className = 'post_content';

    // 게시글 제목 요소 생성
    const postTitle = document.createElement('h3');
    postTitle.className = 'post_title';
    if (keyword) {
      // 검색어가 있으면 하이라이트 적용
      // innerHTML은 HTML 태그를 포함한 내용을 설정할 수 있음
      postTitle.innerHTML = highlightKeyword(post.title, keyword);
    } else {
      // 검색어가 없으면 일반 텍스트로 표시
      postTitle.textContent = post.title;
    }

    // 게시글 설명 요소 생성
    const postDesc = document.createElement('p');
    postDesc.className = 'post_desc';
    // 설명 텍스트 : subTitle이 있으면 사용, 없으면 제목 사용
    const descText = post.extra?.subTitle || post.title;
    if (keyword) {
      // 검색어가 있으면 하이라이트 적용
      postDesc.innerHTML = highlightKeyword(descText, keyword);
    } else {
      // 검색어가 없으면 일반 텍스트로 표시
      postDesc.textContent = descText;
    }

    // 게시글 메타 정보(본문에 대한 추가 정보 : 작가이름, 날짜, 조회수 등) 요소 생성
    const postMeta = document.createElement('p');
    postMeta.className = 'post_meta';
    // 템플릿 리터럴 사용: `by ${변수}` 형식으로 문자열 연결
    postMeta.textContent = `by ${post.user.name}`;

    // 요소들을 부모 요소에 추가
    postContent.appendChild(postTitle); // 제목을 postContent에 추가
    postContent.appendChild(postDesc); // 설명을 postContent에 추가
    postContent.appendChild(postMeta); // 메타 정보를 postContent에 추가
    postItem.appendChild(postContent); // postContent를 postItem에 추가
    postsResults.appendChild(postItem); // postItem을 postsResults에 추가
  });
}

/**
 * 작가 목록을 렌더링하는 함수
 * 검색된 작가들을 화면에 표시하고 검색어를 하이라이트하는 함수
 * @param writers - 표시할 작가 배열
 * @param keyword - 검색어 (하이라이트에 사용)
 */
function renderWriters(writers: ApiUser[], keyword: string): void {
  // writersResults 요소가 없으면 함수 종료
  if (!writersResults) {
    return;
  }

  // 기존 작가 목록 제거
  // innerHTML을 빈 문자열로 설정하면 자식 요소들이 모두 삭제됨
  writersResults.innerHTML = '';

  // 작가가 없으면 함수 종료
  if (writers.length === 0) {
    return;
  }

  // 각 작가에 대해 반복
  writers.forEach(writer => {
    // 작가 항목을 감싸는 div 요소 생성
    const writerItem = document.createElement('div');
    writerItem.className = 'writer_item'; // CSS 클래스 추가

    // 작가 프로필 이미지 요소 생성
    const writerProfileImg = document.createElement('img');
    writerProfileImg.className = 'writer_profile_img';
    // 이미지 경로 설정 (서버 경로로 변환)
    writerProfileImg.src = `/${writer.image}`;
    writerProfileImg.alt = writer.name; // 접근성을 위한 대체 텍스트

    // 작가 정보를 감싸는 div 요소 생성
    const writerInfo = document.createElement('div');
    writerInfo.className = 'writer_info';

    // 작가 이름 요소 생성
    const writerName = document.createElement('h3');
    writerName.className = 'writer_name';
    if (keyword) {
      // 검색어가 있으면 하이라이트 적용
      writerName.innerHTML = highlightKeyword(writer.name, keyword);
    } else {
      // 검색어가 없으면 일반 텍스트로 표시
      writerName.textContent = writer.name;
    }

    // 작가 설명 요소 생성
    const writerDesc = document.createElement('p');
    writerDesc.className = 'writer_desc';
    // 설명 텍스트 : biography가 있으면 사용, 없으면 빈 문자열
    const descText = writer.extra?.biography || '';
    writerDesc.textContent = descText;

    // 작가 태그를 감싸는 div 요소 생성
    const writerTags = document.createElement('div');
    writerTags.className = 'writer_tags';
    // 태그가 있으면 각 태그를 span 요소로 생성
    if (writer.extra?.keyword) {
      writer.extra.keyword.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        writerTags.appendChild(tagSpan); // 태그를 writerTags에 추가
      });
    }

    // 요소들을 부모 요소에 추가
    writerInfo.appendChild(writerName); // 이름을 writerInfo에 추가
    writerInfo.appendChild(writerDesc); // 설명을 writerInfo에 추가
    writerInfo.appendChild(writerTags); // 태그를 writerInfo에 추가

    writerItem.appendChild(writerProfileImg); // 프로필 이미지를 writerItem에 추가
    writerItem.appendChild(writerInfo); // 작가 정보를 writerItem에 추가
    writersResults.appendChild(writerItem); // writerItem을 writersResults에 추가
  });
}

/**
 * 검색 실행 함수
 * 검색어로 검색을 실행하고 검색 기록에도 저장하는 함수
 * 사용자가 Enter 키를 눌러 검색을 완료했을 때 사용
 * @param keyword - 검색어
 */
function executeSearch(keyword: string): void {
  // 데이터가 없으면 함수 종료
  if (!allData) {
    return;
  }

  // 검색어 앞뒤 공백 제거
  const searchTerm = keyword.trim();

  // 현재 탭에 따라 검색 실행
  // currentTab 변수에 저장된 값 posts 또는 writers)에 따라 다른 검색 실행
  if (currentTab === 'posts') {
    // 글 탭이 선택된 경우
    // searchPosts() 함수로 검색어가 포함된 글들 찾기
    const matchedPosts = searchPosts(searchTerm, allData);
    // 찾은 글들을 화면에 표시
    render(matchedPosts, searchTerm);

    if (matchedPosts.length > 0) {
      // 검색 결과가 있는 경우
      hideNoResults(); // "검색 결과 없음" 메시지 숨김
      postsResults.style.display = 'block'; // 글 결과 영역 표시
      writersResults.style.display = 'none'; // 작가 결과 영역 숨김
      // 검색 결과 건수 업데이트
      // matchedPosts.length는 배열의 길이 (검색된 글의 개수)
      updateResultsCount('posts', matchedPosts.length);
    } else {
      // 검색 결과가 없는 경우
      showNoResults(); // "검색 결과 없음" 메시지 표시
    }
  } else {
    // 작가 탭이 선택된 경우
    // searchWriters() 함수로 검색어가 포함된 작가들 찾기
    const matchedWriters = searchWriters(searchTerm, allData);
    // 찾은 작가들을 화면에 표시
    renderWriters(matchedWriters, searchTerm);

    if (matchedWriters.length > 0) {
      // 검색 결과가 있는 경우
      hideNoResults(); // "검색 결과 없음" 메시지 숨김
      writersResults.style.display = 'block'; // 작가 결과 영역 표시
      postsResults.style.display = 'none'; // 글 결과 영역 숨김
      // 검색 결과 건수 업데이트
      updateResultsCount('writers', matchedWriters.length);
    } else {
      // 검색 결과가 없는 경우
      showNoResults(); // "검색 결과 없음" 메시지 표시
    }
  }
}

/**
 * 검색어 입력 이벤트 (저장 없이)
 * 검색어로 검색을 실행하지만 검색 기록에는 저장하지 않는 함수
 * 사용자가 검색어를 입력하는 중에 실시간으로 검색 결과를 보여줄 때 사용
 * @param keyword - 검색어
 */
function executeSearchWithoutSave(keyword: string): void {
  // 데이터가 없으면 함수 종료
  if (!allData) {
    return;
  }

  // 검색어 앞뒤 공백 제거
  const searchTerm = keyword.trim();

  // 현재 탭에 따라 검색 실행
  if (currentTab === 'posts') {
    // 글 탭이 선택된 경우
    const matchedPosts = searchPosts(searchTerm, allData);
    render(matchedPosts, searchTerm);

    if (matchedPosts.length > 0) {
      // 검색 결과가 있는 경우
      hideNoResults();
      postsResults.style.display = 'block';
      writersResults.style.display = 'none';
      updateResultsCount('posts', matchedPosts.length);
    } else {
      // 검색 결과가 없는 경우
      showNoResults();
    }
  } else {
    // 작가 탭이 선택된 경우
    const matchedWriters = searchWriters(searchTerm, allData);
    renderWriters(matchedWriters, searchTerm);

    if (matchedWriters.length > 0) {
      // 검색 결과가 있는 경우
      hideNoResults();
      writersResults.style.display = 'block';
      postsResults.style.display = 'none';
      updateResultsCount('writers', matchedWriters.length);
    } else {
      // 검색 결과가 없는 경우
      showNoResults();
    }
  }
}

/**
 * 게시글 목록을 조회하고 렌더링하는 함수
 * URL 쿼리 파라미터에서 keyword를 가져와 해당 검색어로 검색함
 * 페이지가 로드될 때 자동으로 실행되어 데이터를 가져오고 검색을 수행함
 */
async function listView(): Promise<void> {
  // URL 쿼리 파라미터에서 keyword 가져오기
  // URLSearchParams는 URL의 쿼리 파라미터를 다루는 객체
  // window.location.search는 현재 URL의 쿼리 파라미터 부분 (예: "?keyword=꿀")
  // get('keyword')는 'keyword' 파라미터의 값을 가져옴 (없으면 null)
  // || '' : null이면 빈 문자열 사용
  const keyword =
    new URLSearchParams(window.location.search).get('keyword') || '';

  // API에서 데이터 가져오기
  // await : 데이터를 가져올 때까지 기다림
  const data = await getSearchDataApi();

  if (data) {
    // 가져온 데이터를 전역 변수에 저장
    allData = data;

    if (keyword) {
      // URL에 검색어가 있으면 검색 실행
      searchKeyword = keyword; // 검색어 변수 업데이트
      toggleScreen(true); // 검색 결과 화면으로 전환
      executeSearch(keyword); // 검색 실행
    } else {
      // URL에 검색어가 없으면 초기 화면 표시
      toggleScreen(false);
    }
  }
}

// 이벤트 리스너
// 검색어 입력 이벤트
// 사용자가 검색어를 입력할 때마다 발생하는 이벤트
// input 이벤트는 입력창의 값이 변경될 때마다 발생함 (한 글자 입력할 때마다)
searchInput.addEventListener('input', (e: Event) => {
  // e.target은 이벤트가 발생한 요소 (검색 입력창)
  // as HTMLInputElement: TypeScript에서 타입을 명시적으로 지정
  const target = e.target as HTMLInputElement;
  // value는 입력창의 현재 값을 가져옴
  // trim()으로 앞뒤 공백 제거
  searchKeyword = target.value.trim();

  // 검색어가 있는지 확인
  // length는 문자열의 길이를 반환
  const hasKeyword = searchKeyword.length > 0;

  // 검색어가 있으면 검색 결과 화면으로, 없으면 초기 화면으로 전환
  toggleScreen(hasKeyword);

  // 검색어가 있고 데이터가 있으면 검색 실행 (검색 기록 저장 없이)
  // 실시간으로 검색 결과를 보여주기 위함
  if (hasKeyword && allData) {
    executeSearchWithoutSave(searchKeyword);
  }
});

// Enter 키로 검색 완료
// 사용자가 Enter 키를 누르면 검색을 완료하고 검색 기록에 저장
// keypress 이벤트는 키보드 키를 눌렀을 때 발생
searchInput.addEventListener('keypress', (e: KeyboardEvent) => {
  // e.key는 눌린 키의 값을 반환
  // Enter 키를 눌렀는지 확인
  if (e.key === 'Enter') {
    // 입력창의 값을 가져와서 공백 제거
    const keyword = (e.target as HTMLInputElement).value.trim();

    // 검색어가 있으면 검색 실행
    if (keyword) {
      // 검색어 변수 업데이트
      searchKeyword = keyword;
      // 검색 결과 화면으로 전환
      toggleScreen(true);
      // 검색 기록 저장
      saveSearchHistory(keyword);
      // 데이터가 있으면 검색 실행
      if (allData) {
        // executeSearch는 검색 기록을 저장하고 검색을 실행함
        executeSearch(keyword);
      }
    }
  }
});

// 탭 클릭 이벤트
// 사용자가 탭을 클릭하면 해당 탭으로 전환
tabPosts.addEventListener('click', () => {
  switchTab('posts'); // 글 탭으로 전환
});

tabWriters.addEventListener('click', () => {
  switchTab('writers'); // 작가 탭으로 전환
});

// 페이지 로드 시 초기화
// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되었을 때 발생
// 이 시점에 초기 설정을 수행함
document.addEventListener('DOMContentLoaded', () => {
  // 초기 화면 설정
  searchInitial.style.display = 'block'; // 초기 화면 표시
  searchResults.style.display = 'none'; // 검색 결과 화면 숨김
  searchTabs.style.display = 'none'; // 탭 네비게이션 숨김

  // 탭 초기 설정
  tabIndicator.style.left = '0'; // 탭 인디케이터를 왼쪽(글 탭) 위치로 설정
  tabPosts.classList.add('active'); // 글 탭에 active 클래스 추가 (선택된 스타일)
  tabWriters.classList.remove('active'); // 작가 탭에서 active 클래스 제거

  // 데이터 수집 및 검색 기록 표시
  displaySearchHistory(); // localStorage에 저장된 검색 기록을 화면에 표시
  listView(); // 데이터 가져오기 및 검색 실행
});
