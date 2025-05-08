document.addEventListener('DOMContentLoaded', () => {
    const questionText = document.querySelector('.text-content');
    const optionsContainer = document.querySelector('.options');
    const scoreElement = document.querySelector('.bodovi');
    const timerElement = document.querySelector('.timer');
    let score = 0;
    let timer;
    let gameId;
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Morate biti prijavljeni!');
        window.location.href = '../htmls/login.html';
    }

    function startGame() {
        fetch('https://quiz-be-zeta.vercel.app/game/start', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            gameId = data.gameId;
            displayQuestion(data);
        })
        .catch(err => console.error('Greška pri pokretanju igre:', err));
    }

    function displayQuestion(data) {
        const question = data.question;
        questionText.textContent = question.title;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.text;
            btn.addEventListener('click', () => submitAnswer(option.text, question._id));
            optionsContainer.appendChild(btn);
        });

        startTimer();
    }

    function submitAnswer(answer, questionId) {
        clearInterval(timer);

        fetch('https://quiz-be-zeta.vercel.app/game/answer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ gameId, questionId, answer })
        })
        .then(res => res.json())
        .then(data => {
            if (data.correct) {
                score += 10;
                scoreElement.textContent = `Bodovi: ${score}`;
                getNextQuestion();
            } else {
                endGame();
            }
        })
        .catch(err => console.error('Greška pri slanju odgovora:', err));
    }

    function getNextQuestion() {
        fetch('https://quiz-be-zeta.vercel.app/game/start', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => displayQuestion(data))
        .catch(err => console.error('Greška pri dohvatanju pitanja:', err));
    }

    function startTimer() {
        let timeLeft = 30;
        timerElement.textContent = `${timeLeft}s`;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        window.location.href = '../htmls/quiz-end.html';
    }

    startGame();
});