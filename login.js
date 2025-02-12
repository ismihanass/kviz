function getUserInfo() {
    const inputEmail = document.getElementById('email').value;
    const inputName = document.getElementById('name').value;
    const inputPass = document.getElementById('password').value;
    const inputLastName = document.getElementById('lastName').value;

    createUser(inputEmail, inputPass, inputName, inputLastName);
}

function createUser(email, password, firstName, lastName) {
    fetch('https://c986-77-239-14-36.ngrok-free.app/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
        }),
    })
    .then((response) => {
        response.json().then((data) => {
          console.log(data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
}

document.getElementById('sendUser').addEventListener('click', getUserInfo);
