let quiz = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timer;
let userName = '';

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.addEventListener('submit', addQuestion);
        document.getElementById('finishQuiz').addEventListener('click', finishQuiz);
    }

    const nextQuestionButton = document.getElementById('nextQuestion');
    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', showNextQuestion);
        startQuiz();
    }

    const userNameDisplay = document.getElementById('userName');
    if (userNameDisplay) {
        userName = localStorage.getItem('userName');
        userNameDisplay.textContent = userName;
        loadDashboard();
    }

    const summaryContent = document.getElementById('summaryContent');
    if (summaryContent) {
        displaySummary();
    }
});

function handleRegistration(event) {
    event.preventDefault();
    userName = document.getElementById('name').value;
    const role = document.getElementById('role').value;

    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', role);

    if (role === 'teacher') {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

function loadDashboard() {
    const role = localStorage.getItem('userRole');
    const dashboardContent = document.getElementById('dashboardContent');

    if (role === 'teacher') {
        dashboardContent.innerHTML = `
            <h2>Create and Manage Quizzes</h2>
            <button class="button-animated" onclick="window.location.href='create-quiz.html'">Create Quiz</button>
        `;
    } else if (role === 'student') {
        dashboardContent.innerHTML = `
            <h2>Take a Quiz</h2>
            <button class="button-animated" onclick="window.location.href='quiz.html'">Start Quiz</button>
        `;
    }
}

function addQuestion(event) {
    event.preventDefault();
    const question = document.getElementById('question').value;
    const options = document.getElementById('options').value.split(',');
    const correctOption = document.getElementById('correctOption').value;

    quiz.push({ question, options, correctOption });
    document.getElementById('quizPreview').innerHTML += `
        <div class="quiz-preview">
            <p><strong>Question:</strong> ${question}</p>
            <p><strong>Options:</strong> ${options.join(', ')}</p>
            <p><strong>Correct Answer:</strong> ${correctOption}</p>
        </div>
    `;

    document.getElementById('question').value = '';
    document.getElementById('options').value = '';
    document.getElementById('correctOption').value = '';
}

function finishQuiz() {
    localStorage.setItem('quiz', JSON.stringify(quiz));
    alert('Quiz saved! Students can now take the quiz.');
    window.location.href = 'dashboard.html';
}

function startQuiz() {
    quiz = JSON.parse(localStorage.getItem('quiz')) || [];
    if (quiz.length > 0) {
        showQuestion(quiz[currentQuestionIndex]);
        startTimer();
    } else {
        document.getElementById('questionContainer').innerText = 'No quiz available.';
    }
}

function showQuestion(questionObj) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<p><strong>${questionObj.question}</strong></p>`;
    questionObj.options.forEach((option) => {
        questionContainer.innerHTML += `
            <label>
                <input type="radio" name="option" value="${option}">
                ${option}
            </label><br>
        `;
    });
    document.getElementById('nextQuestion').disabled = false;
}

function showNextQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        if (selectedOption.value === quiz[currentQuestionIndex].correctOption) {
            score++;
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quiz.length) {
            showQuestion(quiz[currentQuestionIndex]);
            resetTimer();
        } else {
            clearInterval(timer);
            localStorage.setItem('score', score);
            window.location.href = 'summary.html';
        }
    } else {
        alert('Please select an option!');
    }
}

function startTimer() {
    timeLeft = 15;
    document.getElementById('timeLeft').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').innerText = timeLeft;
        if (timeLeft === 0) {
            showNextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

function displaySummary() {
    const score = localStorage.getItem('score');
    const totalQuestions = JSON.parse(localStorage.getItem('quiz')).length;
    const summaryContent = document.getElementById('summaryContent');

    summaryContent.innerHTML = `
        <p>Congratulations, <strong>${userName}</strong>!</p>
        <p>Your score is <strong>${score}</strong> out of <strong>${totalQuestions}</strong>.</p>
    `;
}
