document.addEventListener('DOMContentLoaded', () => {
    let gameId = null
    let currentQuestion = null
    let askedQuestionIds = new Set() // Za praćenje već postavljenih pitanja
  
    const questionText = document.querySelector('.text-content')
    const optionsContainer = document.querySelector('.options')
    const scoreElement = document.querySelector('.bodovi')
    const questionCounter = document.querySelector('.question-box span')
    const timerElement = document.querySelector('.timer')
    const streakElement = document.querySelector('.streak')
  
    let score = 0
    let questionNumber = 1
    let streak = 0
    let timeLimit = 30
    let timer = null
  
    const token = localStorage.getItem('token')
  
    if (!token) {
      alert('Morate biti prijavljeni!')
      window.location.href = '../htmls/login.html'
    }
  
    function updateScoreUI() {
      scoreElement.innerHTML = `<img src="../slike/trophy.svg" alt="Bodovi"> Bodovi: ${score}`
    }
  
    function updateStreakUI() {
      streakElement.innerHTML = `<img src="../slike/material-symbols_star-outline-rounded.svg" alt="Streak"> Streak: ${streak}`
    }
  
    function updateQuestionCounterUI() {
      questionCounter.textContent = `Pitanje ${questionNumber} od 20`
    }
  
    function showEndGame() {
      window.location.href = '../htmls/quiz-end.html'
    }
  
    function updateTimer() {
      timerElement.textContent = `${timeLimit} s`
      timeLimit--
      if (timeLimit < 0) {
        clearInterval(timer)
        submitAnswer('') // Ako vreme istekne, automatski šaljemo prazan odgovor
      }
    }
  
    function startTimer() {
      timeLimit = 30
      timer = setInterval(updateTimer, 1000)
    }
  
    function displayQuestion(data) {
      currentQuestion = data.question
  
      // Provjeravamo da li je pitanje već postavljeno
      if (askedQuestionIds.has(currentQuestion._id)) {
        getNextQuestion()
        return
      }
  
      askedQuestionIds.add(currentQuestion._id)
      questionText.textContent = currentQuestion.title
      optionsContainer.innerHTML = ''
  
      currentQuestion.options.forEach((option, i) => {
        const btn = document.createElement('button')
        btn.classList.add('option-btn')
        btn.innerHTML = `<span>${String.fromCharCode(65 + i)}</span> ${option.text}`
        btn.addEventListener('click', () => submitAnswer(option.text))
        optionsContainer.appendChild(btn)
      })
  
      updateQuestionCounterUI()
      updateScoreUI()
      updateStreakUI()
  
      startTimer()
    }
  
    function getNextQuestion() {
      if (questionNumber > 20) {
        showEndGame()
        return
      }
  
      fetch('https://quiz-be-zeta.vercel.app/game/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (!gameId) gameId = data.gameId
          displayQuestion(data)
        })
        .catch(err => console.error('Greška pri dohvatanju pitanja:', err))
    }
  
    function submitAnswer(answer) {
      if (!currentQuestion) return
  
      fetch('https://quiz-be-zeta.vercel.app/game/answer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gameId,
          questionId: currentQuestion._id,
          answer
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.correct) {
            score += 10
            streak++
            questionNumber++
  
            // Ako je broj pitanja manji od 20, pozivamo novo pitanje
            if (questionNumber <= 20) {
              getNextQuestion()
            } else {
              showEndGame() // Ako je to zadnje pitanje
            }
          } else {
            streak = 0
            showEndGame() // Ako je odgovor pogrešan, završavamo igru
          }
  
          updateScoreUI()
          updateStreakUI()
        })
        .catch(err => console.error('Greška pri slanju odgovora:', err))
    }
  
    // Početak igre
    getNextQuestion()
  })
  