if (!document.querySelector('.login-form')) {
  console.log('Login page not detected. login.ts not running.');
}

const form = document.querySelector('.login-form') as HTMLFormElement;
const emailInput = document.querySelector('#email') as HTMLInputElement;
const pwInput = document.querySelector('#password') as HTMLInputElement;

emailInput.value = 'w2@market.com';
pwInput.value = '11111111';

form.addEventListener('submit', async e => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = pwInput.value.trim();

  if (!email || !password) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }

  try {
    const response = await fetch(
      'https://fesp-api.koyeb.app/market/users/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': 'febc15-vanilla08-ecad',
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const result = await response.json();
    console.log('로그인 API 응답:', result);

    if (result.ok === 1) {
      alert('로그인 성공!');
      localStorage.setItem('accessToken', result.item.token.accessToken);
      localStorage.setItem('refreshToken', result.item.token.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.item));
      window.location.href = '/';
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error(err);
    alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
});
