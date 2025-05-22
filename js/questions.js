const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

let currentQuestion = null;
let score = 0;
let timeLeft = 30;
let timer = null;
let gameStarted = false;

async function checkLoginStatus() {
    try {
        const response = await fetch('https://quiz-be-zeta.vercel.app/auth/profile', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            window.location.href = '/htmls/login.html';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        window.location.href = '/htmls/login.html';
    }
}

async function startGame() {
    try {
        const response = await fetch('https://quiz-be-zeta.vercel.app/game/start', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to start game');
        }
        
        gameStarted = true;
        await loadNextQuestion();
    } catch (error) {
        console.error('Error starting game:', error);
        showError('Failed to start game. Please try again.');
    }
}

async function loadNextQuestion() {
    try {
        const response = await fetch('https://quiz-be-zeta.vercel.app/game/next', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load question');
        }
        
        const data = await response.json();
        
        if (data.gameOver) {
            endGame();
            return;
        }
        
        currentQuestion = data;
        updateQuestionDisplay();
        startTimer();
    } catch (error) {
        console.error('Error loading question:', error);
        showError('Failed to load question. Please try again.');
    }
}

function updateQuestionDisplay() {
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classContent = 'option';
        button.textContent = option;
        button.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    questionContainer.style.opacity = '0';
    setTimeout(() => {
        questionContainer.style.opacity = '1';
    }, 150);
}

function startTimer() {
    if (timer) {
        clearInterval(timer);
    }
    
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = timeLeft;
    const progress = (timeLeft / 30) * 100;
    progressBar.style.width = `${progress}%`;
}

async function handleAnswer(optionIndex) {
    if (!gameStarted || !currentQuestion) return;
    
    clearInterval(timer);
    const selectedOption = optionsContainer.children[optionIndex];
    
    try {
        const response = await fetch('https://quiz-be-zeta.vercel.app/game/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                questionId: currentQuestion.id,
                answer: optionIndex
            })
        });
        
        const data = await response.json();
        
        if (data.correct) {
            selectedOption.classList.add('correct');
            score += data.points;
            scoreDisplay.textContent = score;
        } else {
            selectedOption.classList.add('incorrect');
        }
        
        setTimeout(() => {
            loadNextQuestion();
        }, 1000);
    } catch (error) {
        console.error('Error submitting answer:', error);
        showError('Failed to submit answer. Please try again.');
    }
}

function handleTimeout() {
    if (!gameStarted || !currentQuestion) return;
    
    const correctIndex = currentQuestion.correctAnswer;
    const correctOption = optionsContainer.children[correctIndex];
    correctOption.classList.add('correct');
    
    setTimeout(() => {
        loadNextQuestion();
    }, 1000);
}

function endGame() {
    gameStarted = false;
    window.location.href = '/htmls/quiz-end.html';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

checkLoginStatus();
startGame();