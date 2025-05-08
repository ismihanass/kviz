document.addEventListener('DOMContentLoaded', () => {
    const questionText = document.querySelector('.text-content');
    const optionsContainer = document.querySelector('.options');
    const scoreElement = document.querySelector('.bodovi');
    const timerElement = document.querySelector('.timer');
    const questionNumber = document.getElementById('quesNum');
    const bestScore = document.getElementById('bestScore');
    let score = 0;
    let questionNum = 1;
    let timer;
    let gameId;
    const token = localStorage.getItem('token');

    function endGame() {

        window.location.href = '../htmls/quiz-end.html';
    }

    if (!token) {
        alert('Morate biti prijavljeni!');
        window.location.href = '../htmls/login.html';
    }

    function startGame() {
        fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('User Profile:', data);
            if (data && data.bestScore !== undefined) {
                bestScore.textContent = `${data.bestScore}`;
            }
        })
        .catch(err => console.error('Greška pri dohvatanju korisničkih podataka:', err));

        fetch('https://quiz-be-zeta.vercel.app/game/start', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('API odgovor pri pokretanju igre:', data);
            gameId = data.gameId;
            displayQuestion(data.question);
        })
        .catch(err => console.error('Greška pri pokretanju igre:', err));
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
            console.log('API odgovor nakon slanja odgovora:', data);
            if (data.correct) {
                score++;
                questionNum++;
                scoreElement.textContent = `Bodovi: ${score}`;
                questionNumber.textContent = `Pitanje broj ${questionNum}`;

                if (data.nextQuestion) {
                    displayQuestion(data.nextQuestion);
                } else {
                    endGame();
                }
            } else {
                endGame();
            }
        })
        .catch(err => console.error('Greška pri slanju odgovora:', err));
    }

    function displayQuestion(question) {
        console.log('Prikazivanje pitanja:', question);
        questionText.textContent = question.title;
        optionsContainer.innerHTML = '';

        question.options.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.text;
            btn.addEventListener('click', () => submitAnswer(option.text, question._id));
            optionsContainer.appendChild(btn);
        });

        startTimer(question.timeLimit);
    }

    function startTimer(timeLimit) {
        let timeLeft = timeLimit;
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

    startGame();
});
