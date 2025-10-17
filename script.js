// DATOS DEL QUIZ
const questions = [
  { question: "We ____ the bug in the login module last night.", options: ["found", "find", "finded"], answer: "found" },
  { question: "Our instructor ____ us how to use Git last week.", options: ["teached", "teach", "taught"], answer: "taught" },
  { question: "They ____ a backup before updating the database.", options: ["make", "maked", "made"], answer: "made" },
  { question: "Our team ____ a meeting to plan the next sprint.", options: ["had", "haved", "has"], answer: "had" },
  { question: "She ____ the documentation for the new API.", options: ["wrote", "write", "writed"], answer: "wrote" },
  { question: "The programmer ____ a complex problem during testing.", options: ["faced", "facced", "face"], answer: "faced" },
  { question: "The developer ____ the interface design yesterday.", options: ["review", "reviews", "reviewed"], answer: "reviewed" },
  { question: "We ____ the system performance last weekend.", options: ["test", "tested", "tests"], answer: "tested" },
  { question: "I ____ the project files and sent them to my manager.", options: ["organized", "organizes", "organizzed"], answer: "organized" },
  { question: "They ____ new code to the repository in the morning.", options: ["upladded", "uploads", "uploaded"], answer: "uploaded" },
  { question: "I ____ the client about the new version last night.", options: ["inform", "informed", "informs"], answer: "informed" },
  { question: "The designer ____ a mockup for the mobile app.", options: ["created", "creatted", "creates"], answer: "created" }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
const TIME_LIMIT = 30;

const CORRECT_ANSWER_DELAY = 5100; 
const INCORRECT_ANSWER_DELAY = 2500; 

const quizContainer = document.getElementById("quizContainer");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const progressBar = document.getElementById("progressBar");
const timerEl = document.getElementById("timer");

const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  let timeLeft = TIME_LIMIT;
  timerEl.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  incorrectSound.play();
  const q = questions[currentQuestion];
  userAnswers.push({ question: q, selected: "No answer", isCorrect: false });
  
  resultEl.textContent = `Time's up! The answer was "${q.answer}".`;
  resultEl.style.color = "red";
  quizContainer.classList.add('incorrect-animation');
  
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(b => {
      b.disabled = true;
      if (b.textContent === q.answer) {
        b.style.background = "#28a745";
        b.classList.add('correct-answer-highlight');
      }
  });

  setTimeout(() => transitionToNextQuestion(false), INCORRECT_ANSWER_DELAY);
}

function showQuestion() {
  quizContainer.className = 'quiz-container'; 
  void quizContainer.offsetWidth;

  resultEl.textContent = "";
  
  const progress = ((currentQuestion) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;

  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(btn, option);
    optionsEl.appendChild(btn);
  });
  
  startTimer();
}

function checkAnswer(button, selected) {
  clearInterval(timerInterval);
  const q = questions[currentQuestion];
  const isCorrect = selected === q.answer;

  userAnswers.push({ question: q, selected, isCorrect });

  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(b => (b.disabled = true));

  if (isCorrect) {
    button.style.background = "#28a745";
    button.classList.add('tada-animation');
    resultEl.textContent = "Correct!";
    resultEl.style.color = "#28a745";
    quizContainer.classList.add('correct-animation');
    correctSound.play();
    score++;
  } else {
    button.style.background = "#dc3545";
    button.classList.add('button-shake-animation');
    resultEl.textContent = `Wrong! The correct answer was "${q.answer}".`;
    resultEl.style.color = "#dc3545";
    quizContainer.classList.add('incorrect-animation');
    incorrectSound.play();

    buttons.forEach(btn => {
      if (btn.textContent === q.answer) {
        btn.style.background = "#28a745";
        btn.classList.add('correct-answer-highlight');
      }
    });
  }
  
  const delay = isCorrect ? CORRECT_ANSWER_DELAY : INCORRECT_ANSWER_DELAY;
  setTimeout(() => transitionToNextQuestion(isCorrect), delay);
}

function transitionToNextQuestion(wasCorrect) {
  const exitAnimation = wasCorrect ? 'exit-up' : 'exit-left';
  quizContainer.classList.add(exitAnimation);

  currentQuestion++;

  setTimeout(() => {
    quizContainer.classList.remove(exitAnimation);

    if (currentQuestion < questions.length) {
      showQuestion();
      const enterAnimation = wasCorrect ? 'enter-from-down' : 'enter-from-right';
      quizContainer.classList.add(enterAnimation);
    } else {
      showFinalScore();
    }
  }, 500);
}

function showFinalScore() {
  quizContainer.className = 'quiz-container';
  progressBar.style.width = '100%';
  timerEl.style.display = 'none';
  
  const finalGrade = ((score / questions.length) * 5.0).toFixed(1);
  const passed = finalGrade >= 3.5;

  let title = passed ? "Congratulations, you passed!" : "Keep studying!";
  let color = passed ? "#28a745" : "#dc3545";

  questionEl.innerHTML = `<h2 style="color: ${color};">${title}</h2><p>Your final grade is: <strong>${finalGrade} / 5.0</strong></p><p>(${score} correct out of ${questions.length})</p>`;
  
  optionsEl.innerHTML = "";
  resultEl.textContent = "";

  // --- AJUSTE CLAVE ---
  // Ahora añadimos una clase en lugar de estilos directos
  const summaryContainer = document.createElement('div');
  summaryContainer.className = 'summary-container'; 
  
  summaryContainer.innerHTML = '<h3>Your Answers:</h3>';
  
  userAnswers.forEach(ans => {
    const p = document.createElement('p');
    p.className = 'summary-answer'; // Clase para los párrafos

    if (ans.isCorrect) {
      p.innerHTML = `<strong>Q:</strong> ${ans.question.question}<br><span style="color: #28a745;">✔ Your answer: ${ans.selected}</span>`;
    } else {
      p.innerHTML = `<strong>Q:</strong> ${ans.question.question}<br><span style="color: #dc3545;">✖ Your answer: ${ans.selected}</span><br><span style="color: #2f5c3e;"><strong>Correct:</strong> ${ans.question.answer}</span>`;
    }
    summaryContainer.appendChild(p);
  });
  
  optionsEl.appendChild(summaryContainer);
}

// Iniciar juego
shuffle(questions);
showQuestion();