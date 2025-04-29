const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.querySelector('.login-button');

loginButton.onclick = async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert('Unesite e-mail i lozinku.');
    return;
  }

  try {
    const res = await fetch('https://quiz-be-zeta.vercel.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Greška pri prijavi.');
      return;
    }

    localStorage.setItem('token', data.token);
    window.location.href = './kviz.html';
  } catch (err) {
    console.error('Greška:', err);
    alert('Došlo je do greške. Pokušajte ponovo.');
  }
};
const loginBtn = document.getElementById('login');
const loginOverlay = document.getElementById('loginOverlay');

loginBtn.addEventListener('click', () => {
  loginOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
});

loginOverlay.addEventListener('click', (e) => {
  if (e.target === loginOverlay) {
    loginOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
});
