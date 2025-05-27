
const API_BASE_URL = 'https://quiz-be-zeta.vercel.app';
const TOKEN_KEY = 'token';


const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateUsername = (username) => username.length >= 3 && username.length <= 20;
const validatePassword = (password) => password.length >= 6;

const handleError = (error, customMessage = 'Došlo je do greške. Pokušajte ponovo.') => {
  console.error(error);
  alert(customMessage);
};

const redirectToHome = () => {
  window.location.href = '../index.html';
};


const handleRegistration = async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const username = document.querySelector('#username').value.trim();
  const password = document.querySelector('#password').value.trim();
  const confirmPasswordField = document.querySelector('#confirmPassword');
  const confirmPassword = confirmPasswordField ? confirmPasswordField.value.trim() : null;

  if (!email || !username || !password) {
    alert('Molimo popunite sva polja.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Unesite validnu email adresu.');
    return;
  }

  if (!validateUsername(username)) {
    alert('Korisničko ime mora imati između 3 i 20 karaktera.');
    return;
  }

  if (!validatePassword(password)) {
    alert('Lozinka mora imati najmanje 6 karaktera.');
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    alert('Lozinke se ne podudaraju.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Registracija nije uspjela.');
    }

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      alert('Uspješna registracija! Automatski ste prijavljeni.');
      redirectToHome();
    } else {
      throw new Error('Token nije primljen od servera.');
    }
  } catch (err) {
    handleError(err, err.message || 'Greška pri registraciji.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
  }
});
