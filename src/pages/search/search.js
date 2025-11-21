// 글 검색, 작가 검색 기능

// DOM 요소 가져오기
// HTML에서 필요한 요소들을 찾아서 변수에 저장
// getElementById는 HTML 요소의 id 속성으로 요소를 찾는 메서드
const searchInput = document.getElementById('search_input'); // 검색어를 입력하는 input 요소
const searchInitial = document.getElementById('search_initial'); // 초기 화면 (검색 전 화면)
const searchResults = document.getElementById('search_results'); // 검색 결과를 표시하는 영역
const searchTabs = document.getElementById('search_tabs'); // 탭 네비게이션 (글/작가 탭)

// 검색어를 저장할 변수
// 사용자가 입력한 검색어를 저장하는 전역 변수
// 나중에 값이 변경될 수 있기 때문에 let으로 선언
let searchKeyword = '';

// 최근 검색어 관리 함수
// 검색어를 localStorage에 저장하여 브라우저를 닫아도 검색 기록이 유지되도록 함
// localStorage는 브라우저에 데이터를 저장하는 저장소 (브라우저를 닫아도 데이터가 남아있음)
function saveSearchHistory(keyword) {
  // keyword가 없거나 공백만 있으면 함수 종료
  // trim()은 문자열 앞뒤 공백을 제거하는 메서드
  if (!keyword || !keyword.trim()) {
    return;
  }

  // 검색어 앞뒤 공백 제거
  const trimmedKeyword = keyword.trim();

  // localStorage에서 기존 검색 기록 가져오기
  // localStorage.getItem('searchHistory')는 저장된 값을 가져옴 (없으면 null)
  // null이면 [] 빈 배열 문자열을 사용
  // JSON.parse()는 JSON 문자열을 JavaScript 객체/배열로 변환
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

  // 이미 존재하는 검색어는 제거
  // filter()는 배열에서 조건에 맞는 요소만 남기는 메서드
  // item !== trimmedKeyword : 현재 검색어와 다른 것만 남김 (중복 제거)
  searchHistory = searchHistory.filter(item => item !== trimmedKeyword);

  // 맨 앞에 추가
  // unshift()는 배열의 맨 앞에 요소를 추가하는 메서드
  // 최근 검색어가 위에 오도록 하기 위함
  searchHistory.unshift(trimmedKeyword);

  // 최대 10개만 저장
  // 검색 기록이 너무 많아지지 않도록 제한
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

// 검색 기록 가져오기 함수
// localStorage에서 저장된 검색 기록을 가져와서 배열로 반환
function getSearchHistory() {
  // localStorage에서 searchHistory 키로 저장된 값을 가져옴
  // 없으면 빈 배열 []을 반환
  // JSON.parse()로 문자열을 배열로 변환
  return JSON.parse(localStorage.getItem('searchHistory') || '[]');
}

// 검색 기록 삭제 함수
// 사용자가 검색 기록에서 특정 검색어를 삭제할 때 사용
function deleteSearchHistory(keyword) {
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

// 검색 기록 화면에 표시하는 함수
// localStorage에 저장된 검색 기록을 화면에 동적으로 생성하여 표시
function displaySearchHistory() {
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
  searchHistory.forEach(function (keyword) {
    // 검색 기록 하나를 감싸는 div 요소 생성
    const recentItem = document.createElement('div');
    recentItem.className = 'recent_item'; // CSS 클래스 추가

    // 검색어를 표시할 span 요소 생성
    const recentTerm = document.createElement('span');
    recentTerm.className = 'recent_term';
    // textContent는 HTML 요소 안에 텍스트를 넣는 속성(예 : <span>꿀</span>)
    recentTerm.textContent = keyword;

    // 삭제 버튼 생성
    const recentDeleteBtn = document.createElement('button');
    recentDeleteBtn.className = 'recent_delete_btn';
    // innerHTML은 HTML 태그를 포함한 내용을 설정할 수 있음
    // × 기호를 표시하기 위해 사용
    recentDeleteBtn.innerHTML = '<span class="delete_icon">×</span>';

    // 검색어 클릭 이벤트
    // 사용자가 검색 기록을 클릭하면 해당 검색어로 다시 검색
    recentTerm.addEventListener('click', function () {
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
    recentDeleteBtn.addEventListener('click', function (e) {
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

// 화면 전환 함수
// 초기 화면과 검색 결과 화면을 전환하는 함수
// showResults가 true면 검색 결과 화면을 보여주고, false면 초기 화면을 보여줌
function toggleScreen(showResults) {
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

// 검색어 입력 이벤트
// 사용자가 검색어를 입력할 때마다 발생하는 이벤트
// input 이벤트는 입력창의 값이 변경될 때마다 발생함 (한 글자 입력할 때마다)
searchInput.addEventListener('input', function (e) {
  // e.target은 이벤트가 발생한 요소 (검색 입력창)
  // value는 입력창의 현재 값을 가져옴
  // trim()으로 앞뒤 공백 제거
  searchKeyword = e.target.value.trim();

  // 검색어가 있는지 확인
  // length는 문자열의 길이를 반환
  const hasKeyword = searchKeyword.length > 0;

  // 검색어가 있으면 검색 결과 화면으로, 없으면 초기 화면으로 전환
  toggleScreen(hasKeyword);

  // 검색어가 있으면 검색 실행 (검색 기록 저장 없이)
  // 실시간으로 검색 결과를 보여주기 위함
  if (hasKeyword) {
    executeSearchWithoutSave(searchKeyword);
  }
});

// Enter 키로 검색 완료
// 사용자가 Enter 키를 누르면 검색을 완료하고 검색 기록에 저장
// keypress 이벤트는 키보드 키를 눌렀을 때 발생
searchInput.addEventListener('keypress', function (e) {
  // e.key는 눌린 키의 값을 반환 ('Enter', 'a', '1' 등)
  // Enter 키를 눌렀는지 확인
  if (e.key === 'Enter') {
    // 입력창의 값을 가져와서 공백 제거
    const keyword = e.target.value.trim();

    // 검색어가 있으면 검색 실행
    if (keyword) {
      // 검색어 변수 업데이트
      searchKeyword = keyword;
      // 검색 결과 화면으로 전환
      toggleScreen(true);
      // 검색 실행 (검색 기록 저장 포함)
      // executeSearch는 검색 기록을 저장하고 검색을 실행함
      executeSearch(keyword);
    }
  }
});

// 탭 기능
// 글 탭과 작가 탭을 전환하여 각각의 검색 결과를 보여주는 기능

// 탭 관련 DOM 요소
// HTML에서 탭 버튼과 탭 인디케이터를 찾아서 변수에 저장
const tabPosts = document.getElementById('tab_posts'); // 글 탭 버튼
const tabWriters = document.getElementById('tab_writers'); // 작가 탭 버튼
const tabIndicator = document.querySelector('.tab_indicator'); // 탭 아래 움직이는 인디케이터

// 현재 선택된 탭
// posts 또는 writers 값을 저장하여 현재 어떤 탭이 선택되었는지 추적
let currentTab = 'posts'; // 기본값은 글 탭

// 탭 전환 함수
// 사용자가 탭을 클릭했을 때 탭을 전환하고 해당 탭의 검색 결과를 표시
function switchTab(tabName) {
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
  if (searchKeyword) {
    executeSearch(searchKeyword);
  }
}

// 탭 클릭 이벤트
// 사용자가 탭을 클릭하면 해당 탭으로 전환
tabPosts.addEventListener('click', function () {
  switchTab('posts'); // 글 탭으로 전환
});

tabWriters.addEventListener('click', function () {
  switchTab('writers'); // 작가 탭으로 전환
});

// 검색 기능
// 사용자가 입력한 검색어로 글과 작가를 검색하고 결과를 표시하는 기능

// 결과 영역 DOM 요소
// 검색 결과를 표시할 영역들을 찾아서 변수에 저장
const writersResults = document.getElementById('writers_results'); // 작가 검색 결과 영역
const postsResults = document.getElementById('posts_results'); // 글 검색 결과 영역
const resultsCount = document.getElementById('results_count'); // 검색 결과 건수를 표시하는 요소
const filterButtons = document.getElementById('filter_buttons'); // 필터 버튼 영역
const noResults = document.getElementById('no_results'); // 검색 결과 없음 메시지 영역

// 모든 작가와 글 데이터를 저장할 배열
// 페이지에 있는 모든 작가와 글의 정보를 저장하여 검색에 사용
// 빈 배열로 초기화 (나중에 collectAllData() 함수에서 데이터를 채움)
let allWritersData = []; // 모든 작가 데이터 배열
let allPostsData = []; // 모든 글 데이터 배열

// 페이지 로드 시 모든 작가와 글 데이터 수집
// HTML에 이미 표시된 작가와 글의 정보를 수집하여 검색에 사용할 수 있도록 준비
// 이렇게 하면 서버에 요청하지 않고도 클라이언트에서 검색할 수 있음
function collectAllData() {
  // 작가 데이터 수집
  // querySelectorAll은 CSS 선택자로 여러 요소를 한 번에 찾는 메서드
  // #writers_results .writer_item은 'writers_results' 안의 모든 'writer_item' 요소를 찾음
  const writerItems = document.querySelectorAll(
    '#writers_results .writer_item',
  );

  // 배열 초기화 (이전 데이터 제거)
  allWritersData = [];

  // 각 작가 항목에 대해 반복
  // forEach는 배열의 각 요소에 대해 함수를 실행
  writerItems.forEach(function (item) {
    // 각 작가 항목에서 필요한 정보 추출
    // querySelector는 요소 내부에서 첫 번째로 일치하는 요소를 찾음
    const nameEl = item.querySelector('.writer_name'); // 작가 이름 요소
    const descEl = item.querySelector('.writer_desc'); // 작가 설명 요소
    const tagEls = item.querySelectorAll('.tag'); // 작가 태그들 (여러 개)
    const tags = []; // 태그를 저장할 배열

    // 각 태그의 텍스트를 배열에 추가
    tagEls.forEach(function (tag) {
      // push는 배열의 끝에 요소를 추가하는 메서드
      tags.push(tag.textContent.trim());
    });

    // 작가 정보를 객체로 만들어 배열에 추가
    // 객체는 여러 정보를 하나로 묶어서 저장하는 자료구조
    allWritersData.push({
      element: item, // 원본 HTML 요소 (나중에 표시/숨김 처리에 사용)
      name: nameEl ? nameEl.textContent.trim() : '', // 작가 이름 (요소가 없으면 빈 문자열)
      desc: descEl ? descEl.textContent.trim() : '', // 작가 설명
      tags: tags, // 작가 태그 배열
    });
  });

  // 글 데이터 수집
  // 작가 데이터와 동일한 방식으로 글 데이터도 수집
  const postItems = document.querySelectorAll('#posts_results .post_item');
  allPostsData = [];

  postItems.forEach(function (item) {
    // 각 글 항목에서 필요한 정보 추출
    const titleEl = item.querySelector('.post_title'); // 글 제목 요소
    const descEl = item.querySelector('.post_desc'); // 글 설명 요소
    const metaEl = item.querySelector('.post_meta'); // 글 메타 정보 요소 (본문에 대한 추가 정보 날짜, 댓글 수 등)

    // 글 정보를 객체로 만들어 배열에 추가
    allPostsData.push({
      element: item, // 원본 HTML 요소
      title: titleEl ? titleEl.textContent.trim() : '', // 글 제목
      desc: descEl ? descEl.textContent.trim() : '', // 글 설명
      meta: metaEl ? metaEl.textContent.trim() : '', // 글 메타 정보
    });
  });
}

// 검색어가 텍스트에 포함되어 있는지 확인
// 검색어가 제목, 설명 등에 포함되어 있는지 확인하는 함수
// 대소문자 구분 없이 검색하기 위해 toLowerCase()를 사용
function containsKeyword(text, keyword) {
  // text나 keyword가 없으면 false 반환
  // ! 없으면 true, 있으면 false
  if (!text || !keyword) {
    return false;
  }

  // toLowerCase()는 문자열을 모두 소문자로 변환
  // includes()는 문자열에 특정 문자열이 포함되어 있는지 확인하는 메서드
  // 대소문자 구분 없이 검색하기 위해 둘 다 소문자로 변환하여 비교
  return text.toLowerCase().includes(keyword.toLowerCase());
}

// 검색어를 하이라이트하는 함수
// 검색 결과에서 검색어를 강조 표시하기 위해 <span class="highlight"> 태그로 감싸는 함수
function highlightKeyword(text, keyword) {
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

// 작가 검색 함수
// 검색어로 작가를 검색하여 일치하는 작가들을 반환하는 함수
function searchWriters(keyword) {
  // 검색어가 없으면 모든 작가 반환
  if (!keyword || !keyword.trim()) {
    return allWritersData;
  }

  // 검색어를 소문자로 변환하여 저장
  // 대소문자 구분 없이 검색하기 위함
  const searchTerm = keyword.trim().toLowerCase();

  // 일치하는 작가들을 저장할 배열
  const matchedWriters = [];

  // 모든 작가 데이터를 순회하면서 검색어가 포함된 작가 찾기
  allWritersData.forEach(function (writer) {
    // 작가 이름에 검색어가 포함되어 있는지 확인
    const nameMatch = containsKeyword(writer.name, searchTerm);

    // 작가 설명에 검색어가 포함되어 있는지 확인
    const descMatch = containsKeyword(writer.desc, searchTerm);

    // 태그에 검색어가 포함되어 있는지 확인
    // 태그는 여러 개일 수 있으므로 반복문으로 확인
    let tagMatch = false; // 태그 매칭 여부를 저장할 변수
    // for 배열의 각 요소를 순회
    // i는 인덱스(0부터 시작), writer.tags.length는 태그 배열의 길이
    for (let i = 0; i < writer.tags.length; i++) {
      // 각 태그에 검색어가 포함되어 있는지 확인
      if (containsKeyword(writer.tags[i], searchTerm)) {
        tagMatch = true; // 하나라도 일치하면 true
        break; // 일치하는 태그를 찾았으면 반복문 종료 (더 이상 확인할 필요 없음)
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

// 글 검색 함수
// 검색어로 글을 검색하여 일치하는 글들을 반환하는 함수
function searchPosts(keyword) {
  // 검색어가 없으면 모든 글 반환
  if (!keyword || !keyword.trim()) {
    return allPostsData;
  }

  // 검색어를 소문자로 변환하여 저장
  // 대소문자 구분 없이 검색하기 위함
  const searchTerm = keyword.trim().toLowerCase();

  // 일치하는 글들을 저장할 배열
  const matchedPosts = [];

  // 모든 글 데이터를 순회하면서 검색어가 포함된 글 찾기
  allPostsData.forEach(function (post) {
    // 글 제목에 검색어가 포함되어 있는지 확인
    const titleMatch = containsKeyword(post.title, searchTerm);

    // 글 설명에 검색어가 포함되어 있는지 확인
    const descMatch = containsKeyword(post.desc, searchTerm);

    // 제목이나 설명 중 하나라도 일치하면 검색 결과에 추가
    // || 하나라도 true면 true
    if (titleMatch || descMatch) {
      matchedPosts.push(post); // 일치하는 글을 배열에 추가
    }
  });

  // 검색 결과 배열 반환
  return matchedPosts;
}

// 작가 결과 화면에 표시하는 함수
// 검색된 작가들을 화면에 표시하고 검색어를 하이라이트하는 함수
function displayWriters(writers, keyword) {
  // 모든 작가 숨기기
  // 먼저 모든 작가를 숨긴 후, 검색 결과에 해당하는 작가만 표시
  allWritersData.forEach(function (writer) {
    // display : none은 요소를 화면에서 완전히 숨김
    writer.element.style.display = 'none';
  });

  // 검색 결과가 없으면 false 반환
  // false를 반환하면 호출한 곳에서 "검색 결과 없음" 메시지를 표시할 수 있음
  if (writers.length === 0) {
    return false;
  }

  // 검색된 작가들만 보이게 하고 하이라이트 적용
  // 검색 결과에 포함된 작가들만 화면에 표시
  writers.forEach(function (writer) {
    // display : flex는 요소를 표시하고 flexbox 레이아웃 적용
    writer.element.style.display = 'flex';

    // 작가 이름 요소 찾기
    const nameEl = writer.element.querySelector('.writer_name');

    // 이름 요소가 있고 검색어가 있으면 하이라이트 적용
    if (nameEl && keyword) {
      // innerHTML은 HTML 태그를 포함한 내용을 설정할 수 있음
      // highlightKeyword()로 검색어를 <span class="highlight"> 태그로 감싸서 반환
      nameEl.innerHTML = highlightKeyword(writer.name, keyword);
    }
  });

  // 검색 결과가 있으면 true 반환
  return true;
}

// 글 결과 화면에 표시하는 함수
// 검색된 글들을 화면에 표시하고 검색어를 하이라이트하는 함수
function displayPosts(posts, keyword) {
  // 모든 글 숨기기
  // 먼저 모든 글을 숨긴 후, 검색 결과에 해당하는 글만 표시
  allPostsData.forEach(function (post) {
    // display: none은 요소를 화면에서 완전히 숨김
    post.element.style.display = 'none';
  });

  // 검색 결과가 없으면 false 반환
  // false를 반환하면 호출한 곳에서 "검색 결과 없음" 메시지를 표시할 수 있음
  if (posts.length === 0) {
    return false;
  }

  // 검색된 글들만 보이게 하고 하이라이트 적용
  // 검색 결과에 포함된 글들만 화면에 표시
  posts.forEach(function (post) {
    // display: flex는 요소를 표시하고 flexbox 레이아웃 적용
    post.element.style.display = 'flex';

    // 글 제목과 설명 요소 찾기
    const titleEl = post.element.querySelector('.post_title'); // 제목 요소
    const descEl = post.element.querySelector('.post_desc'); // 설명 요소

    // 제목에 검색어 하이라이트 적용
    // titleEl이 존재하고 keyword가 있으면 하이라이트
    if (titleEl && keyword) {
      // innerHTML은 HTML 태그를 포함한 내용을 설정할 수 있음
      // highlightKeyword()로 검색어를 <span class="highlight"> 태그로 감싸서 반환
      titleEl.innerHTML = highlightKeyword(post.title, keyword);
    }

    // 설명에 검색어 하이라이트 적용
    if (descEl && keyword) {
      descEl.innerHTML = highlightKeyword(post.desc, keyword);
    }
  });

  // 검색 결과가 있으면 true 반환
  return true;
}

// 검색 결과 없음 화면 표시
// 검색 결과가 없을 때 "검색 결과 없음" 메시지를 표시하는 함수
function showNoResults() {
  // 모든 결과 영역 숨기기
  writersResults.style.display = 'none'; // 작가 결과 영역 숨김
  postsResults.style.display = 'none'; // 글 결과 영역 숨김
  noResults.style.display = 'flex'; // 검색 결과 없음 메시지 표시
  filterButtons.style.display = 'none'; // 필터 버튼 숨김
  resultsCount.style.display = 'none'; // 결과 건수 숨김
}

// 검색 결과 없음 화면 숨기기
// 검색 결과가 있을 때 "검색 결과 없음" 메시지를 숨기는 함수
function hideNoResults() {
  noResults.style.display = 'none'; // 검색 결과 없음 메시지 숨김
  resultsCount.style.display = 'block'; // 결과 건수 표시
}

// 검색 결과 건수 업데이트
// 검색 결과가 몇 건인지 화면에 표시하는 함수
// type은 posts 또는 writers, count는 검색 결과 개수
function updateResultsCount(type, count) {
  // type에 따라 다른 텍스트 표시
  if (type === 'posts') {
    // 글 검색 결과인 경우
    // textContent는 요소의 텍스트 내용을 설정하는 속성
    resultsCount.textContent = '글 검색 결과 ' + count + '건';
  } else {
    // 작가 검색 결과인 경우
    resultsCount.textContent = '작가 검색 결과 ' + count + '건';
  }

  // 결과 건수 요소 표시
  resultsCount.style.display = 'block';
}

// 모든 결과 초기화 함수
// 검색어를 지웠을 때 모든 작가와 글을 다시 표시하고 하이라이트를 제거하는 함수
function resetAllResults() {
  // 모든 작가 다시 표시
  allWritersData.forEach(function (writer) {
    // 작가 요소 표시
    writer.element.style.display = 'flex';

    // 작가 이름 요소 찾기
    const nameEl = writer.element.querySelector('.writer_name');

    // 이름 요소가 있으면 원본 텍스트로 복원 (하이라이트 제거)
    if (nameEl) {
      // textContent는 HTML 태그 없이 순수 텍스트만 설정
      // 하이라이트 태그를 제거하고 원본 이름만 표시
      nameEl.textContent = writer.name;
    }
  });

  // 모든 글 다시 표시
  allPostsData.forEach(function (post) {
    // 글 요소 표시
    post.element.style.display = 'flex';

    // 글 제목과 설명 요소 찾기
    const titleEl = post.element.querySelector('.post_title');
    const descEl = post.element.querySelector('.post_desc');

    // 제목 원본 텍스트로 복원 (하이라이트 제거)
    if (titleEl) {
      titleEl.textContent = post.title;
    }

    // 설명 원본 텍스트로 복원 (하이라이트 제거)
    if (descEl) {
      descEl.textContent = post.desc;
    }
  });
}

// 검색 실행 함수 (저장 없이)
// 검색어로 검색을 실행하지만 검색 기록에는 저장하지 않는 함수
// 사용자가 검색어를 입력하는 중에 실시간으로 검색 결과를 보여줄 때 사용
function executeSearchWithoutSave(keyword) {
  // 검색어가 없으면 모든 결과를 다시 표시하고 함수 종료
  if (!keyword || !keyword.trim()) {
    resetAllResults(); // 모든 작가와 글을 다시 표시
    return; // 함수 종료
  }

  // 검색어 앞뒤 공백 제거
  const searchTerm = keyword.trim();

  // 현재 탭에 따라 검색 실행
  // currentTab 변수에 저장된 값 posts 또는 writers 에 따라 다른 검색 실행
  if (currentTab === 'posts') {
    // 글 탭이 선택된 경우
    // searchPosts() 함수로 검색어가 포함된 글들 찾기
    const matchedPosts = searchPosts(searchTerm);

    // 찾은 글들을 화면에 표시
    // displayPosts()는 검색 결과를 표시하고 true/false를 반환
    const hasResults = displayPosts(matchedPosts, searchTerm);

    if (hasResults) {
      // 검색 결과가 있는 경우
      hideNoResults(); // "검색 결과 없음" 메시지 숨김
      postsResults.style.display = 'block'; // 글 결과 영역 표시
      writersResults.style.display = 'none'; // 작가 결과 영역 숨김
      filterButtons.style.display = 'flex'; // 필터 버튼 표시
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
    const matchedWriters = searchWriters(searchTerm);

    // 찾은 작가들을 화면에 표시
    const hasResults = displayWriters(matchedWriters, searchTerm);

    if (hasResults) {
      // 검색 결과가 있는 경우
      hideNoResults(); // "검색 결과 없음" 메시지 숨김
      writersResults.style.display = 'block'; // 작가 결과 영역 표시
      postsResults.style.display = 'none'; // 글 결과 영역 숨김
      filterButtons.style.display = 'none'; // 필터 버튼 숨김 (작가 탭에는 필터 없음)
      // 검색 결과 건수 업데이트
      updateResultsCount('writers', matchedWriters.length);
    } else {
      // 검색 결과가 없는 경우
      showNoResults(); // "검색 결과 없음" 메시지 표시
    }
  }
}

// 실제 검색 실행 함수 (저장 포함)
// 검색어로 검색을 실행하고 검색 기록에도 저장하는 함수
// 사용자가 Enter 키를 눌러 검색을 완료했을 때 사용
function executeSearch(keyword) {
  // 검색어가 없으면 모든 결과를 다시 표시하고 함수 종료
  if (!keyword || !keyword.trim()) {
    resetAllResults(); // 모든 작가와 글을 다시 표시
    return; // 함수 종료
  }

  // 검색어 앞뒤 공백 제거
  const searchTerm = keyword.trim();

  // 검색 기록 저장
  // localStorage에 검색어를 저장하여 나중에 다시 사용할 수 있게 함
  saveSearchHistory(searchTerm);

  // 검색 실행
  // executeSearchWithoutSave()를 호출하여 실제 검색 수행
  // 검색 기록 저장은 이미 위에서 했으므로 여기서는 검색만 실행
  executeSearchWithoutSave(searchTerm);
}

// 페이지 로드 시 초기화
// DOMContentLoaded 이벤트는 HTML 문서가 완전히 로드되었을 때 발생
// 이 시점에 초기 설정을 수행함
document.addEventListener('DOMContentLoaded', function () {
  // 초기 화면 설정
  searchInitial.style.display = 'block'; // 초기 화면 표시
  searchResults.style.display = 'none'; // 검색 결과 화면 숨김
  searchTabs.style.display = 'none'; // 탭 네비게이션 숨김

  // 탭 초기 설정
  tabIndicator.style.left = '0'; // 탭 인디케이터를 왼쪽(글 탭) 위치로 설정
  tabPosts.classList.add('active'); // 글 탭에 active 클래스 추가 (선택된 스타일)
  tabWriters.classList.remove('active'); // 작가 탭에서 active 클래스 제거

  // 데이터 수집 및 검색 기록 표시
  collectAllData(); // 페이지에 있는 모든 작가와 글 데이터 수집
  displaySearchHistory(); // localStorage에 저장된 검색 기록을 화면에 표시
});
