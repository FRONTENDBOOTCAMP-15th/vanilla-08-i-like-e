// 사진 첨부 기능

// DOM 요소
// HTML에서 사진 첨부 버튼과 내용 입력 영역을 찾아서 변수에 저장
// querySelector는 CSS 선택자로 요소를 찾는 메서드
// null이 반환될 수 있기때문에 타입을 HTMLButtonElement | null로 지정
const imageBtn: HTMLButtonElement | null =
  document.querySelector('.tool_image');
const contentTextarea: HTMLDivElement | null =
  document.querySelector('.content_textarea');

// 숨겨진 파일 input 요소 생성
// 사용자가 파일을 선택할 수 있게 <input type="file"> 요소를 동적으로 생성
// 이 요소는 화면에 숨김, 나중에 버튼 클릭시 JavaScript 코드로 자동으로 파일 선택 창을 열어줌
// (프로그래밍 방식 = 사용자가 직접 클릭하지 않고 코드가 자동으로 실행하는 것)
const fileInput: HTMLInputElement = document.createElement('input');
fileInput.type = 'file'; // 파일 선택 타입으로 설정
fileInput.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 제한
fileInput.style.display = 'none'; // 화면에 보이지 않게 숨김 처리
// body 요소에 추가하여 DOM에 등록
// createElement()로 만든 요소는 아직 메모리에만 존재함 실제 웹페이지에는 보이지 않음
// appendChild()를 사용하면 이 요소를 실제 HTML 문서 구조 DOM에 추가할 수 있음
// document.body는 <body> 태그를 말함, 여기에 추가하면 페이지의 일부가 됨
// 이렇게 만들어야 나중에 fileInput.click() 같은 메서드를 사용가능
document.body.appendChild(fileInput);

// 사진첨부 버튼 클릭 이벤트
// 사용자가 사진 첨부 버튼을 클릭하면 숨겨진 fileInput을 클릭한 것처럼 동작시킴(파일 선택창 열림)
if (imageBtn) {
  // imageBtn이 null이 아닐 때만 이벤트 리스너를 추가함(안전한 코드 작성)
  imageBtn.addEventListener('click', () => {
    // 프로그래밍 방식으로 fileInput을 클릭하여 파일 선택 창을 연다
    fileInput.click();
  });
}

// 파일 선택 이벤트(파일 하나만 선택 가능.......)
// 사용자가 파일을 선택하면 change 이벤트가 발생
// 이 이벤트를 감지하여 선택된 파일을 처리한다
fileInput.addEventListener('change', (e: Event) => {
  // 이벤트 객체에서 파일 입력 요소를 가져욤
  // e.target은 이벤트가 발생한 요소를 가리키며, HTMLInputElement로 타입 변환함
  const target = e.target as HTMLInputElement;
  // files 속성은 선택된 파일들의 배열. 첫 번째 파일 [0]을 가져옴
  const file: File | undefined = target.files?.[0];

  // 파일이 선택되지 않았으면 함수를 종료시킴
  if (!file) {
    return;
  }

  // 이미지 파일인지 확인
  // file.type은 파일의 MIME 타입을 반환함
  // MIME 타입 : 파일의 종류를 나타내는 표준 형식(브라우저가 파일의 실제 형식을 정확히 알 수 있게 해줌)
  // 형식: "주타입/부타입" (예: 'image/jpeg', 'image/png', 'text/html', 'application/pdf')
  // startsWith('image/')로 파일 타입이 'image/'로 시작하는지 확인
  // 이렇게 하면 이미지 파일만 허용하고 다른 파일 형식(텍스트, PDF 등)은 거부함
  if (!file.type.startsWith('image/')) {
    return;
  }

  // FileReader로 이미지 읽기(사용자가 선택한 파일을 브라우저에서 읽을 수 있게 해주는 API 내장 객체)
  const reader: FileReader = new FileReader();

  // 파일 읽기가 완료되면 실행되는 콜백 함수
  // onload 이벤트는 파일 읽기가 성공적으로 완료되었을 때 발생함
  reader.onload = (event: ProgressEvent<FileReader>) => {
    // contentTextarea가 존재하고, 파일 읽기 결과가 있을 때만 실행함
    if (contentTextarea && event.target?.result) {
      // 이미지 요소 생성
      // <img> 태그를 동적으로 생성하고 선택한 이미지를 화면에 표시함
      const img: HTMLImageElement = document.createElement('img');
      // event.target.result는 파일을 읽은 결과
      img.src = event.target.result as string;
      img.style.width = '50%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '10px 0';

      // 내용 영역 커서 뒤에 이미지 삽입
      // 이미지 앞뒤로 줄바꿈 <br> 태그를 추가하여 이미지가 텍스트와 겹치지 않도록 함
      const brBefore: HTMLBRElement = document.createElement('br'); // 이미지 앞 줄바꿈
      const brAfter: HTMLBRElement = document.createElement('br'); // 이미지 뒤 줄바꿈
      // appendChild는 요소를 부모 요소의 마지막 자식으로 추가함
      contentTextarea.appendChild(brBefore); // 줄바꿈 추가
      contentTextarea.appendChild(img); // 이미지 추가
      contentTextarea.appendChild(brAfter); // 줄바꿈 추가

      // 이미지 삽입 후 커서 위치를 이미지 뒤로 이동시킴
      // Range와 Selection API를 사용하여 커서 위치를 제어함
      const range: Range = document.createRange(); // 새로운 범위(Range) 객체 생성
      const selection: Selection | null = window.getSelection(); // 현재 선택 영역 가져오기
      if (selection) {
        // range.setStartAfter()는 지정한 요소 뒤를 범위의 시작점으로 설정함
        range.setStartAfter(brAfter); // brAfter 요소 뒤를 시작점으로 설정
        // collapse(true)는 범위를 시작점으로 축소함 (끝점을 시작점과 같게 만듦)
        // 이렇게 하면 커서가 한 지점에 위치하게 됨
        range.collapse(true);
        // 기존 선택 영역을 모두 제거함
        selection.removeAllRanges();
        // 새로 만든 범위를 선택 영역에 추가함
        selection.addRange(range);
        // contentTextarea에 포커스를 주어 커서가 보이도록 함
        contentTextarea.focus();
      }
    }
  };
  // 파일을 Data URL(문자열)로 변환
  // readAsDataURL()은 파일을 Base64로 인코딩된 데이터 URL 형식으로 읽음
  // 이 형식은 <img src="">에 직접 사용할 수 있어서 이미지를 표시할 수 있음
  reader.readAsDataURL(file);
});

// Base64 인코딩이란?
// 이미지 파일을 텍스트 문자열로 변환하는 방법
// 원래 이미지는 0과 1로 이루어진 바이너리 데이터인데, 이를 텍스트로 변환해야 HTML에서 사용 가능
// Base64는 64개의 문자(A-Z, a-z, 0-9, +, /)를 사용하여 데이터를 표현함
// 예: 이미지 파일 → "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
//
// 왜 Base64로 변환하나?
// <img src="">에는 이미지 파일 경로나 URL이 필요한데, 사용자가 선택한 파일은 아직 서버에 업로드되지 않음
// Base64로 변환하면 파일을 서버 없이도 브라우저에서 직접 표시할 수 있음
// Data URL 형식 : "data:이미지타입;base64,인코딩된데이터"
// 이 문자열을 img.src에 넣으면 이미지가 표시됨
