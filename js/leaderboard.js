document.addEventListener('DOMContentLoaded', () => {
  const scoreCards = document.querySelectorAll('#score-card');
  const token = localStorage.getItem('token');

  fetch('https://quiz-be-zeta.vercel.app/leaderboard')
    .then(response => response.json())
    .then(leaderboardData => {
      scoreCards.forEach((card, index) => {
        if (index < scoreCards.length - 1) {
          const player = leaderboardData[index];
          if (!player) return;

          const cardText = card.querySelector('.card-text');
          const name = card.querySelector('.leaderboard-name');
          const score = card.querySelector('.score');

          if (cardText) cardText.textContent = `#${index + 1}`;
          if (name) name.textContent = player.username || 'N/A';
          if (score) score.textContent = player.bestScore || '0';
        }
      });

      const userCard = scoreCards[scoreCards.length - 1];
      if (userCard) {
        if (token) {
          fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(response => response.json())
            .then(userData => {
              if (userData && userData.username) {
                const userPosition = leaderboardData.findIndex(player =>
                  player._id === userData._id
                ) + 1;

                const cardText = userCard.querySelector('.card-text');
                const name = userCard.querySelector('.leaderboard-name');
                const score = userCard.querySelector('.score');

                if (cardText) cardText.textContent = userPosition ? `#${userPosition}` : '-';
                if (name) name.textContent = userData.username;
                if (score) score.textContent = userData.bestScore || '0';
              } else {
                updateUserCardForNonLoggedIn(userCard);
              }
            })
            .catch(() => {
              localStorage.removeItem('token');
              updateUserCardForNonLoggedIn(userCard);
            });
        } else {
          updateUserCardForNonLoggedIn(userCard);
        }
      }
    })
    .catch(() => {});

  const buttonsContainer = document.querySelector('.buttons');
  const menuButtonsContainer = document.querySelector('.menu-buttons');

  if (token) {
    const logoutButton = `
      <button id="logout">
        <a href="#">Odjavi se</a>
      </button>
    `;
    buttonsContainer.innerHTML = logoutButton;
    if (menuButtonsContainer) {
      menuButtonsContainer.innerHTML = `
        <button id="menu-logout">
          <a href="#">Odjavi se</a>
        </button>
      `;
    }

    document.querySelectorAll('#logout, #menu-logout').forEach(button => {
      button.addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.reload();
      });
    });
  } else {
    const loginButtons = `
      <button id="login">
        <a href="../htmls/login.html">Prijavi se</a>
      </button>
      <button id="register">
        <a href="../htmls/register.html" class="register-link">Registruj se</a>
      </button>
    `;
    buttonsContainer.innerHTML = loginButtons;
    if (menuButtonsContainer) {
      menuButtonsContainer.innerHTML = `
        <button id="menu-login">
          <a href="../htmls/login.html">Prijavi se</a>
        </button>
        <button id="menu-register">
          <a href="../htmls/register.html">Registruj se</a>
        </button>
      `;
    }
  }
});

function updateUserCardForNonLoggedIn(userCard) {
  userCard.innerHTML = `
    <div style="width: 100%; text-align: center; padding: 15px 0; color: #2559D2; font-weight: 500; cursor: pointer;">
      Prijavi se da i tvoje ime bude tu!
    </div>
  `;

  userCard.style.cursor = 'pointer';
  userCard.addEventListener('click', () => {
    window.location.href = '../htmls/login.html';
  });
}
