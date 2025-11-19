// 사진 첨부 기능

// DOM 요소
const imageBtn: HTMLButtonElement | null = document.querySelector('.tool_image');
const contentTextarea: HTMLDivElement | null = document.querySelector('.content_textarea');

// 숨겨진 파일 input 요소 생성
const fileInput: HTMLInputElement = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// 사진첨부 버튼 클릭 이벤트
if (imageBtn) {
  imageBtn.addEventListener('click', () => {
    fileInput.click();
  });
}

// 파일 선택 이벤트
fileInput.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file: File | undefined = target.files?.[0];

  if (!file) {
    return;
  }

  // 이미지 파일인지 확인
  if (!file.type.startsWith('image/')) {
    return;
  }

  // FileReader로 이미지 읽기(사용자가 선택한 파일을 읽어주는 브라우저 내장 객체)
  const reader: FileReader = new FileReader();
  reader.onload = (event: ProgressEvent<FileReader>) => {
    if (contentTextarea && event.target?.result) {
      // 이미지 요소 생성
      const img: HTMLImageElement = document.createElement('img');
      img.src = event.target.result as string;
      img.style.width = '50%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px 0';
      img.style.borderRadius = '8px';

      // 내용 영역 커서 뒤에 이미지 삽입
      const brBefore: HTMLBRElement = document.createElement('br');
      const brAfter: HTMLBRElement = document.createElement('br');
      contentTextarea.appendChild(brBefore);
      contentTextarea.appendChild(img);
      contentTextarea.appendChild(brAfter);

      // 커서를 이미지 뒤로 이동
      const range: Range = document.createRange();
      const selection: Selection | null = window.getSelection();
      if (selection) {
        range.setStartAfter(brAfter);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        contentTextarea.focus();
      }
    }
  };
  // 파일을 Data URL(문자열)로 변환
  reader.readAsDataURL(file);
});

