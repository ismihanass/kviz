
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
let isMenuOpen = false;


hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});


document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});


navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});


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
  const loginBtn = document.getElementById('login');
  const registerBtn = document.getElementById('register');
  const logoutBtn = document.getElementById('logout');
  const loginMobileBtn = document.getElementById('mobile-login');
  const registerMobileBtn = document.getElementById('mobile-register');
  const logoutMobileBtn = document.getElementById('mobile-logout');

  if (token) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = '';
    if (loginMobileBtn) loginMobileBtn.style.display = 'none';
    if (registerMobileBtn) registerMobileBtn.style.display = 'none';
    if (logoutMobileBtn) logoutMobileBtn.style.display = '';
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (registerBtn) registerBtn.style.display = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (loginMobileBtn) loginMobileBtn.style.display = '';
    if (registerMobileBtn) registerMobileBtn.style.display = '';
    if (logoutMobileBtn) logoutMobileBtn.style.display = 'none';
  }
}

updateAuthButtons();

const logoutBtn = document.getElementById('logout');
const logoutMobileBtn = document.getElementById('mobile-logout');

function handleLogout(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  updateAuthButtons();
  window.location.reload();
}
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
if (logoutMobileBtn) logoutMobileBtn.addEventListener('click', handleLogout);
