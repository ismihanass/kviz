const form = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');

const token = localStorage.getItem('token');

const checkLoginStatus = async () => {
  if (!token) {
    console.log('Nema tokena. Korisnik nije prijavljen.');
    return;
  }

  try {
    const res = await fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Korisnik je već prijavljen:', data);
      window.location.href = './index.html';
    } else {
      console.log('Token nije važeći ili je istekao.');
      localStorage.removeItem('token');
    }
  } catch (err) {
    console.error('Greška prilikom provjere tokena:', err);
  }
};

checkLoginStatus();

form.onsubmit = async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) return alert('Unesite email i lozinku.');

  try {
    const res = await fetch('https://quiz-be-zeta.vercel.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || 'Greška pri prijavi.');

    localStorage.setItem('token', data.token);
    window.location.href = './index.html'; 
  } catch (err) {
    console.error('Greška:', err);
    alert('Došlo je do greške. Pokušajte ponovo.');
  }
};