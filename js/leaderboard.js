document.addEventListener('DOMContentLoaded', () => {
    const scoreCards = document.querySelectorAll('#score-card');

    fetch('https://quiz-be-zeta.vercel.app/leaderboard')
        .then(response => response.json())
        .then(data => {
            scoreCards.forEach((card, index) => {
                const player = data[index];
                if (!player) return; // ako nema više igrača

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

