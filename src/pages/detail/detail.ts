import { getAxios } from '../../utils/axios';

const axios = getAxios();

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function loadDetail() {
  try {
    if (!id) {
      document.querySelector('#json')!.textContent = 'id 없음!';
      return;
    }

    // 상세 API 호출
    const res = await axios.get(`/posts/${id}`);

    // JSON 예쁘게 출력
    const prettyJson = JSON.stringify(res.data, null, 2);
    document.querySelector('#json')!.textContent = prettyJson;
  } catch (err) {
    document.querySelector('#json')!.textContent =
      '에러 발생: ' + (err as Error).message;
  }
}

loadDetail();
