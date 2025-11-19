// 사진 첨부 기능

// DOM 요소
const imageBtn = document.querySelector('.tool_image');
const contentTextarea = document.querySelector('.content_textarea');

// 숨겨진 파일 input 요소 생성
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// 사진첨부 버튼 클릭 이벤트
imageBtn.addEventListener('click', () => {
  fileInput.click();
});

// 파일 선택 이벤트
fileInput.addEventListener('change', e => {
  const file = e.target.files[0];

  if (!file) {
    return;
  }

  // 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    return;
  }

  // FileReader로 이미지 읽기(사용자가 선택한 파일을 읽어주는 브라우저 내장 객체)
  const reader = new FileReader();
  reader.onload = event => {
    if (contentTextarea) {
      // 이미지 요소 생성
      const img = document.createElement('img');
      img.src = event.target.result;
      img.style.width = '50%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px 0';
      img.style.borderRadius = '8px';

      // 내용 영역 커서 뒤에 이미지 삽입
      const brBefore = document.createElement('br');
      const brAfter = document.createElement('br');
      contentTextarea.appendChild(brBefore);
      contentTextarea.appendChild(img);
      contentTextarea.appendChild(brAfter);

      // 커서를 이미지 뒤로 이동
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStartAfter(brAfter);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      contentTextarea.focus();
    }
  };
  // 파일을 Data URL(문자열)로 변환
  reader.readAsDataURL(file);
});
