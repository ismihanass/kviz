document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register-form');

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const email = document.querySelector('#email').value.trim();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (!email || !username || !password) {
      alert('Molimo popunite sva polja.');
      return;
    }

    fetch('https://quiz-be-zeta.vercel.app/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Uspješna registracija! Automatski ste prijavljeni.');
        window.location.href = './index.html';
      } else {
        alert(data.message || 'Registracija nije uspjela.');
      }
    })
    .catch(err => {
      console.error('Greška pri registraciji:', err);
      alert('Došlo je do greške. Pokušajte ponovo.');
    });
  });
});
