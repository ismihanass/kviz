// Get DOM elements
const hamburger = document.querySelector('.hamburger-menu');
const nav = document.querySelector('.navigation');
let isMenuOpen = false;

// Toggle menu when hamburger is clicked
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        isMenuOpen = false;
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    }
});

// Close menu when clicking a link
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Prevent menu from closing when clicking inside
nav.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Hamburger menu logic
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
