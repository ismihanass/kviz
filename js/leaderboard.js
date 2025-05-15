document.addEventListener('DOMContentLoaded', () => {
  const scoreCards = document.querySelectorAll('#score-card');
  const token = localStorage.getItem('token');
  console.log('Token:', token ? 'exists' : 'not found');


  fetch('https://quiz-be-zeta.vercel.app/leaderboard')
    .then(response => response.json())
    .then(leaderboardData => {
      console.log('Leaderboard data:', leaderboardData);
      

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


      if (token) {
        fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(userData => {
          console.log('User data:', userData);
          
          if (userData && userData.username) {
            const userCard = scoreCards[scoreCards.length - 1];
            if (userCard) {

              const userPosition = leaderboardData.findIndex(player => 
                player._id === userData._id
              ) + 1;
              
              const cardText = userCard.querySelector('.card-text');
              const name = userCard.querySelector('.leaderboard-name');
              const score = userCard.querySelector('.score');

              if (cardText) cardText.textContent = userPosition ? `#${userPosition}` : '-';
              if (name) name.textContent = userData.username;
              if (score) score.textContent = userData.bestScore || '0';
            }
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token'); 
        });
      } else {

        const userCard = scoreCards[scoreCards.length - 1];
        if (userCard) {
          const cardText = userCard.querySelector('.card-text');
          const name = userCard.querySelector('.leaderboard-name');
          const score = userCard.querySelector('.score');

          if (cardText) cardText.textContent = '-';
          if (name) name.textContent = 'login!';
          if (score) score.textContent = '-';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching leaderboard:', error);
    });


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
      button.addEventListener('click', (e) => {
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