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
      });

  const token = localStorage.getItem('token');
  const buttonsContainer = document.querySelector('.buttons');
  
  if (token) {
      buttonsContainer.innerHTML = `
          <button id="logout">
              <a href="#">Odjavi se</a>
          </button>
      `;
      
      document.getElementById('logout').addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          window.location.reload();
      });
  } else {
      buttonsContainer.innerHTML = `
          <button id="login">
              <a href="../htmls/login.html">Prijavi se</a>
          </button>
          <button id="register">
              <a href="../htmls/register.html" class="register-link">Registruj se</a>
          </button>
      `;
  }
});