// Search Page JavaScript

// DOM 요소
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const closeBtn = document.getElementById('closeBtn');
const searchInitial = document.getElementById('searchInitial');
const searchResults = document.getElementById('searchResults');
const resultHeader = document.getElementById('resultHeader');
const searchTabs = document.getElementById('searchTabs');
const searchQuery = document.getElementById('searchQuery');
const tabPosts = document.getElementById('tabPosts');
const tabWriters = document.getElementById('tabWriters');
const writersResults = document.getElementById('writersResults');
const postsResults = document.getElementById('postsResults');
const resultsHeader = document.getElementById('resultsHeader');
const resultsCount = document.getElementById('resultsCount');
const filterButtons = document.getElementById('filterButtons');
const noResults = document.getElementById('noResults');

// 현재 상태
let currentTab = 'writers'; // 'posts' or 'writers'
let currentQuery = '';

// 검색 입력 이벤트
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  currentQuery = query;

  if (query.length > 0) {
    // 검색어가 있으면 결과 화면 표시
    showSearchResults(query);
    clearBtn.style.display = 'flex';
  } else {
    // 검색어가 없으면 초기 화면 표시
    showInitialScreen();
    clearBtn.style.display = 'none';
  }
});

// 검색어 클리어 버튼
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentQuery = '';
  showInitialScreen();
  clearBtn.style.display = 'none';
  searchInput.focus();
});

// 닫기 버튼
closeBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentQuery = '';
  showInitialScreen();
  clearBtn.style.display = 'none';
  resultHeader.style.display = 'none';
  searchTabs.style.display = 'none';
});

// 탭 전환
tabPosts.addEventListener('click', () => {
  switchTab('posts');
});

tabWriters.addEventListener('click', () => {
  switchTab('writers');
});

function switchTab(tab) {
  currentTab = tab;

  // 탭 버튼 활성화
  if (tab === 'posts') {
    tabPosts.classList.add('active');
    tabWriters.classList.remove('active');
    writersResults.style.display = 'none';
    postsResults.style.display = 'block';
    filterButtons.style.display = 'flex';
    updateResultsCount('posts');
  } else {
    tabWriters.classList.add('active');
    tabPosts.classList.remove('active');
    postsResults.style.display = 'none';
    writersResults.style.display = 'block';
    filterButtons.style.display = 'none';
    updateResultsCount('writers');
  }

  // 탭 인디케이터 위치 조정
  updateTabIndicator();
}

// 탭 인디케이터 업데이트
function updateTabIndicator() {
  const indicator = document.querySelector('.tab_indicator');
  if (!indicator) return;
  
  if (currentTab === 'posts') {
    indicator.style.left = '0';
  } else {
    indicator.style.left = '50%';
  }
}

// 검색 결과 건수 업데이트
function updateResultsCount(type) {
  if (!resultsCount) return;
  
  if (type === 'posts') {
    resultsCount.textContent = '글 검색 결과 800건';
    resultsCount.style.display = 'block';
  } else {
    resultsCount.textContent = '작가 검색 결과 32건';
    resultsCount.style.display = 'block';
  }
}

// 초기 화면 표시
function showInitialScreen() {
  searchInitial.style.display = 'block';
  searchResults.style.display = 'none';
  resultHeader.style.display = 'none';
  searchTabs.style.display = 'none';
}

// 검색 결과 화면 표시
function showSearchResults(query) {
  searchInitial.style.display = 'none';
  searchResults.style.display = 'block';
  resultHeader.style.display = 'block';
  searchTabs.style.display = 'flex';

  // 검색어 표시
  searchQuery.textContent = query;

  // 검색 결과 확인 (예시: 특정 검색어는 결과 없음)
  if (query === '꿀,—' || query === '꿀,') {
    showNoResults();
  } else {
    hideNoResults();
    // 현재 탭에 맞는 결과 표시
    if (currentTab === 'posts') {
      postsResults.style.display = 'block';
      writersResults.style.display = 'none';
      filterButtons.style.display = 'flex';
      updateResultsCount('posts');
    } else {
      writersResults.style.display = 'block';
      postsResults.style.display = 'none';
      filterButtons.style.display = 'none';
      updateResultsCount('writers');
    }
  }
}

// 검색 결과 없음 표시
function showNoResults() {
  if (writersResults) writersResults.style.display = 'none';
  if (postsResults) postsResults.style.display = 'none';
  if (noResults) noResults.style.display = 'flex';
  if (filterButtons) filterButtons.style.display = 'none';
  if (resultsCount) resultsCount.style.display = 'none';
}

// 검색 결과 없음 숨김
function hideNoResults() {
  if (noResults) noResults.style.display = 'none';
  if (resultsCount) resultsCount.style.display = 'block';
}

// 필터 버튼 이벤트
const filterBtns = document.querySelectorAll('.filter_btn');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// 키워드 버튼 클릭 이벤트
const keywordBtns = document.querySelectorAll('.keyword_btn');
keywordBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const keyword = btn.textContent.trim();
    searchInput.value = keyword;
    currentQuery = keyword;
    showSearchResults(keyword);
    clearBtn.style.display = 'flex';
  });
});

// 최근 검색어 클릭 이벤트
const recentTerms = document.querySelectorAll('.recent_term');
recentTerms.forEach((term) => {
  term.addEventListener('click', () => {
    const query = term.textContent.trim();
    searchInput.value = query;
    currentQuery = query;
    showSearchResults(query);
    clearBtn.style.display = 'flex';
  });
});

// 최근 검색어 삭제 버튼
const recentDeleteBtns = document.querySelectorAll('.recent_delete_btn');
recentDeleteBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const recentItem = btn.closest('.recent_item');
    if (recentItem) {
      recentItem.remove();
    }
  });
});

// Enter 키로 검색
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = e.target.value.trim();
    if (query.length > 0) {
      currentQuery = query;
      showSearchResults(query);
      clearBtn.style.display = 'flex';
    }
  }
});

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  showInitialScreen();
  updateTabIndicator();
});

