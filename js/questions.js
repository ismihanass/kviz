document.addEventListener('DOMContentLoaded', () => {
    const questionText = document.querySelector('.text-content');
    const optionsContainer = document.querySelector('.options');
    const scoreElement = document.getElementById('scoreNum');
    const timerElement = document.querySelector('.timer');
    const questionNumber = document.getElementById('quesNum');
    const bestScore = document.getElementById('bestScore');
    const endQuizBtn = document.querySelector('.endquiz');
    let score = 0;
    let questionNum = 1;
    let timer;
    let gameId;
    const token = localStorage.getItem('token');

    function endGame() {
        clearInterval(timer);
        localStorage.setItem('quizScore', score);
        window.location.href = '../htmls/quiz-end.html';
    }

    if (!token) {
        window.location.href = '../htmls/login.html';
        return;
    }

    endQuizBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Da li ste sigurni da želite završiti kviz?')) {
            endGame();
        }
    });

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
            if (data?.bestScore !== undefined) {
                bestScore.textContent = data.bestScore;
            }
        });

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
            displayQuestion(data.question);
            questionNumber.textContent = `Pitanje ${questionNum}`;
        })
        .catch(err => {
            alert('Došlo je do greške pri pokretanju kviza. Pokušajte ponovo.');
        });
    }

    function displayQuestion(question) {
        const questionText = document.querySelector('.text-content');
        const optionsContainer = document.querySelector('.options');


        const newQuestionText = question.title;
        const newOptions = question.options.map((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span>${['A', 'B', 'C', 'D'][index]}</span> ${option.text}`;
            btn.addEventListener('click', () => submitAnswer(btn, option.text, question._id));
            return btn;
        });


        questionText.classList.add('fade-out');
        optionsContainer.classList.add('fade-out');


        setTimeout(() => {
            questionText.textContent = newQuestionText;
            optionsContainer.innerHTML = '';
            newOptions.forEach(btn => optionsContainer.appendChild(btn));


            requestAnimationFrame(() => {
                questionText.classList.remove('fade-out');
                questionText.classList.add('fade-in');
                optionsContainer.classList.remove('fade-out');
                optionsContainer.classList.add('fade-in');
            });

            startTimer(question.timeLimit);
        }, 150); 
    }

    function submitAnswer(selectedBtn, answer, questionId) {
        clearInterval(timer);
        
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.cursor = 'not-allowed';
        });

        selectedBtn.classList.add('selected');

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
            highlightAnswers(data.correctAnswer, data.correct, answer);


            setTimeout(() => {
                if (data.correct) {
                    score++;
                    questionNum++;
                    scoreElement.textContent = score;
                    questionNumber.textContent = `Pitanje ${questionNum}`;

                    if (data.nextQuestion) {
                        displayQuestion(data.nextQuestion);
                    } else {
                        endGame();
                    }
                } else {
                    endGame();
                }
            }, 1000);
        });
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

    function highlightAnswers(correctAnswer, isCorrect, selectedAnswer) {
        const options = document.querySelectorAll('.option-btn');
        options.forEach(option => {
            const optionText = option.textContent.replace(/^[A-D]\s/, '');
            if (optionText === correctAnswer) {
                option.classList.add('correct');
            } else if (optionText === selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
    }

    startGame();
});