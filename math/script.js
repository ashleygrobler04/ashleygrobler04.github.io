const questionElement = document.getElementById("question");
const inputElement = document.getElementById("input");
const submitButton = document.getElementById("submit");
const timerElement = document.getElementById("timer");
const statusElement = document.getElementById("status");
const feedbackDialog = document.getElementById("feedbackDialog");
const feedbackMessage = document.getElementById("feedbackMessage");
const nextQuestionButton = document.getElementById("nextQuestion");
const timerSelect = document.getElementById("timerSelect");
const initializeElement = document.getElementById("initialize");

let left;
let right;
let timerId = null;
let timeRemaining = 20;

// The application must be initialized by the user first.
let initialized = false;

function speak(text) {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

function showStatus(message) {
    statusElement.textContent = message;
}

function showFeedback(isCorrect) {
    const answer = left * right;
    const visualMessage = `${isCorrect ? "Correct!" : "Incorrect."} ${left} × ${right} = ${answer}`;
    const spokenMessage = `${isCorrect ? "Correct" : "Incorrect"}. ${left} times ${right} equals ${answer}.`;

    feedbackMessage.textContent = visualMessage;
    feedbackDialog.hidden = false;
    inputElement.disabled = true;
    submitButton.disabled = true;
    speak(spokenMessage);
    nextQuestionButton.focus();
}

function continuePractice() {
    feedbackDialog.hidden = true;
    inputElement.disabled = false;
    submitButton.disabled = false;
    generateQuestion();
    startTimer();
    inputElement.focus();
}

function generateQuestion() {
    left = Math.floor(Math.random() * 12) + 1;
    right = Math.floor(Math.random() * 12) + 1;

    questionElement.textContent = `${left} × ${right} = ?`;

    inputElement.value = "";
}

function updateTimerDisplay() {
    timerElement.textContent = `Time remaining: ${timeRemaining} seconds`;
}

function startTimer() {
    // Do not start the timer until the application has been initialized.
    if (!initialized) {
        return;
    }

    clearInterval(timerId);

    timeRemaining = Number(timerSelect.value);
    updateTimerDisplay();

    timerId = setInterval(() => {
        timeRemaining--;

        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerId);

            const answer = left * right;
            const message = `Time is up. The answer was ${answer}.`;

            showStatus(message);
            speak(message);

            generateQuestion();
            startTimer();
        }
    }, 1000);
}

function initialize() {
    // Prevent initialization from happening more than once.
    if (initialized) {
        return;
    }

    initialized = true;

    initializeElement.textContent = "Practice is active.";
    initializeElement.setAttribute("aria-label", "Practice is active.");

    // A user-initiated utterance primes speech synthesis before answer feedback.
    speak("Started");
    showStatus("Practice started.");

    generateQuestion();
    startTimer();

    inputElement.focus();
}

function checkAnswer() {
    // Ignore answers until initialization has happened.
    if (!initialized) {
        return;
    }

    const userAnswer = Number(inputElement.value.trim());
    const correctAnswer = left * right;

    clearInterval(timerId);

    showFeedback(userAnswer === correctAnswer);
}

// User initializes the application by activating the div.
initializeElement.addEventListener("click", initialize);

initializeElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        initialize();
    }
});

submitButton.addEventListener("click", checkAnswer);

nextQuestionButton.addEventListener("click", continuePractice);

inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

timerSelect.addEventListener("change", () => {
    if (initialized) {
        startTimer();
    }
});

// Set up the initial question and timer display,
// but DON'T start the timer.
generateQuestion();

timeRemaining = Number(timerSelect.value);
updateTimerDisplay();
