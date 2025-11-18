// 사진 첨부 기능

// DOM 요소
const imageBtn = document.querySelector('.tool_image');
const contentTextarea = document.querySelector('.content_textarea');

// 숨겨진 파일 input 요소 생성
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
fileInput.multiple = false; // 단일 이미지 선택

// body에 추가
document.body.appendChild(fileInput);

// 사진첨부 버튼클릭 이벤트
if (imageBtn) {
  imageBtn.addEventListener('click', () => {
    fileInput.click();
  });
}

// 파일선택 이벤트
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];

  if (!file) {
    return; // 파일이 선택되지 않았으면 종료
  }

  // 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 선택할 수 있습니다.');
    return;
  }
});
