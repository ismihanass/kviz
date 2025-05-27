const form = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');


const API_BASE_URL = 'https://quiz-be-zeta.vercel.app';
const TOKEN_KEY = 'token';


const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const handleError = (error, customMessage = 'Došlo je do greške. Pokušajte ponovo.') => {
  console.error(error);
  alert(customMessage);
};

const redirectToHome = () => {
  window.location.href = '../index.html';
};


const checkLoginStatus = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.log('Nema tokena. Korisnik nije prijavljen.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Korisnik je već prijavljen:', data);
      redirectToHome();
    } else {
      console.log('Token nije važeći ili je istekao.');
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    handleError(err, 'Greška prilikom provjere tokena');
  }
};


const handleLogin = async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();


  if (!email || !password) {
    alert('Unesite email i lozinku.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Unesite validnu email adresu.');
    return;
  }

  if (!validatePassword(password)) {
    alert('Lozinka mora imati najmanje 6 karaktera.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Greška pri prijavi.');
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    redirectToHome();
  } catch (err) {
    handleError(err, err.message || 'Greška pri prijavi.');
  }
};


form.addEventListener('submit', handleLogin);


checkLoginStatus();