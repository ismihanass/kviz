document.addEventListener('DOMContentLoaded', () => {
    const resultBox = document.querySelector('.result-box');
    const pointsElement = resultBox.querySelector('.points');
    const placeElement = resultBox.querySelector('.place');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Morate biti prijavljeni!');
        window.location.href = '../htmls/login.html';
    }

    // Show score from localStorage (set by questions.js)
    const quizScore = localStorage.getItem('quizScore') || 0;
    pointsElement.innerHTML = `Osvojili ste: <strong>${quizScore} bodova</strong> 🧠`;

    // Fetch leaderboard position as before, but do NOT overwrite the score
    fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        fetch('https://quiz-be-zeta.vercel.app/leaderboard')
            .then(response => response.json())
            .then(leaderboardData => {
                const userRank = leaderboardData.findIndex(player => player._id === data._id) + 1;
                if (userRank > 0) {
                    placeElement.innerHTML = `Leaderboard: <strong>#${userRank} mjesto</strong> 🥇`;
                } else {
                    placeElement.innerHTML = 'Leaderboard: <strong>nije u prvih 10</strong>';
                }
            })
            .catch(error => {
                console.error('Greška pri dohvatanju leaderboard podataka:', error);
            });
    })
    .catch(error => {
        console.error('Greška pri dohvatanju podataka korisnika:', error);
    });
});
