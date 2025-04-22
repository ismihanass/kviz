document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.querySelector('.register-button');

  registerBtn.addEventListener('click', () => {
    const email = document.querySelector('#email').value.trim();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    const confirmPassword = document.querySelector('#confirm-password').value.trim();

    if (!email || !username || !password || !confirmPassword) {
      alert('Molimo popunite sva polja.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Lozinke se ne podudaraju.');
      return;
    }

    fetch('https://quiz-be-zeta.vercel.app/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'User registered successfully') {
        alert('Uspješna registracija! Možete se prijaviti.');
        window.location.href = './login.html';
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
