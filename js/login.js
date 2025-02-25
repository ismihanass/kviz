document.getElementById('loginUser').addEventListener('click', getLoginInfo);

function getLoginInfo() {
    const inputEmail = document.getElementById('email').value;
    const inputPass = document.getElementById('password').value;

    loginUser(inputEmail, inputPass);
}

function loginUser(email, password) {
    fetch('https://c986-77-239-14-36.ngrok-free.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
}
