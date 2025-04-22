document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.login-button');
  
    loginBtn.addEventListener('click', () => {
      const email = document.querySelector('#email').value.trim();
      const password = document.querySelector('#password').value.trim();
  
      if (!email || !password) {
        alert('Molimo unesite e-mail i lozinku.');
        return;
      }
  
      fetch('https://quiz-be-zeta.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username); // ako backend šalje username
          window.location.href = '../htmls/profile.html'; // promijeni ako imaš drugu stranicu
        } else {
          alert(data.message || 'Prijava nije uspjela. Provjerite podatke.');
        }
      })
      .catch(err => {
        console.error('Greška pri prijavi:', err);
        alert('Došlo je do greške. Pokušajte ponovo.');
      });
    });
  });
  