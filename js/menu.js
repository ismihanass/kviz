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


nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});


nav.addEventListener('click', (e) => {
    e.stopPropagation();
});
