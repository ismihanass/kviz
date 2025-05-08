document.addEventListener('DOMContentLoaded', () => {
    const scoreCards = document.querySelectorAll('#score-card');

    fetch('https://quiz-be-zeta.vercel.app/leaderboard')
        .then(response => response.json())
        .then(data => {
            scoreCards.forEach((card, index) => {
                const player = data[index];
                if (!player) return; 

                const cardText = card.querySelector('.card-text');
                const name = card.querySelector('.leaderboard-name');
                const score = card.querySelector('.score');

                if (cardText) cardText.textContent = `#${index + 1}`;
                if (name) name.textContent = player.username;
                if (score) score.textContent = `${player.bestScore} bodova`;
            });
        })
        .catch(error => {
            console.error('Greška pri dohvatanju leaderboard podataka:', error);
        });
});

//za login i register dugme

document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login');
    const registerBtn = document.getElementById('register');
  
    const token = localStorage.getItem('token');
    
    if (token) {
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
    } else {
      loginBtn.style.display = 'block';
      registerBtn.style.display = 'block';
    }
  });
  