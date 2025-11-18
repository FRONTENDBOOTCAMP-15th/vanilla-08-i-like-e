import type { ApiPost, ApiPostsResponse } from '../../types/types';
//ㄴ> 타입구분을 위해 import
import { getAxios } from '../../utils/axios';
//ㄴ> axios를 사용하기위해 함수를 미리 만듦 그걸 import

const axios = getAxios();
// 위에서 만든 함수 호출을 위한 변수 담음

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
        <a href=./src/pages/writer/writer.html?id=${post.user?.name ?? '익명'}><span class="writer">${post.user?.name ?? '익명'}</span></a>
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

    console.log(posts);

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
