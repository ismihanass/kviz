const API_BASE_URL = 'https://quiz-be-zeta.vercel.app';

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const loginButton = document.getElementById('loginButton');
const googleLoginButton = document.getElementById('googleLogin');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!validatePassword(password)) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/index.html';
        } else {
            showError(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again.');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});

googleLoginButton.addEventListener('click', () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
});

checkLoginStatus();