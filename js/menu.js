const hamburgerMobile = document.getElementById('hamburger-menu');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerMobile.addEventListener('click', () => {
  hamburgerMobile.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburgerMobile.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

function updateAuthButtons() {
  const token = localStorage.getItem('token');
  
  const coins = document.getElementById('coins');

  const loginBtn = document.getElementById('login');
  const registerBtn = document.getElementById('register');
  const logoutBtn = document.getElementById('menu-logout');

  const menuLoginBtn = document.getElementById('menu-login');
  const menuRegisterBtn = document.getElementById('menu-register');

  const mobileLoginBtn = document.getElementById('mobile-login');
  const mobileRegisterBtn = document.getElementById('mobile-register');
  const mobileLogoutBtn = document.getElementById('mobile-logout');

  const isLoggedIn = !!token;

  if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
  if (registerBtn) registerBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
  if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';

  if (menuLoginBtn) menuLoginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
  if (menuRegisterBtn) menuRegisterBtn.style.display = isLoggedIn ? 'none' : 'inline-block';

  if (mobileLoginBtn) mobileLoginBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
  if (mobileRegisterBtn) mobileRegisterBtn.style.display = isLoggedIn ? 'none' : 'inline-block';
  if (mobileLogoutBtn) mobileLogoutBtn.style.display = isLoggedIn ? 'inline-block' : 'none';
}

updateAuthButtons();

const logoutButtons = document.querySelectorAll('#menu-logout, #mobile-logout');
logoutButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    updateAuthButtons();
  });
});