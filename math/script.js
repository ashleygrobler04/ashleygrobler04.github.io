const questionElement = document.getElementById("question");
const inputElement = document.getElementById("input");
const submitButton = document.getElementById("submit");
const timerElement = document.getElementById("timer");
const statusElement = document.getElementById("status");
const feedbackDialog = document.getElementById("feedbackDialog");
const feedbackMessage = document.getElementById("feedbackMessage");
const nextQuestionButton = document.getElementById("nextQuestion");
const timerSelect = document.getElementById("timerSelect");
const modeSelect = document.getElementById("modeSelect");
const initializeElement = document.getElementById("initialize");

let left;
let right;
let mode = "multiply";
let answer = 0;
let currentEquation = "";
let currentSpoken = "";
let timerId = null;
let timeRemaining = 20;
let roundActive = false;

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

function updateInitializePrompt() {
    if (initialized) {
        initializeElement.textContent = "Practice is active.";
        initializeElement.setAttribute("aria-label", "Practice is active.");
        return;
    }

    const operation = modeSelect.value === "divide" ? "division" : "multiplication";
    initializeElement.textContent = `Tap here to start ${operation} practice.`;
    initializeElement.setAttribute("aria-label", `Tap to start ${operation} practice.`);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    roundActive = false;
}

function showFeedback(result) {
    // Every completed round pauses before its feedback is displayed.
    pauseTimer();

    const feedback = {
        correct: {
            visual: "Correct!",
            spoken: "Correct."
        },
        incorrect: {
            visual: "Incorrect. Review the answer:",
            spoken: "Incorrect. Review the answer."
        },
        timeout: {
            visual: "Time is up. Review the answer:",
            spoken: "Time is up. Review the answer."
        }
    }[result];
    const visualMessage = `${feedback.visual} ${currentEquation}`;
    const spokenMessage = `${feedback.spoken} ${currentSpoken}`;

    feedbackMessage.textContent = visualMessage;
    feedbackDialog.hidden = false;
    inputElement.disabled = true;
    submitButton.disabled = true;
    speak(spokenMessage);
    nextQuestionButton.focus();
}

function continuePractice() {
    // This is the only action that starts another timed round.
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

    if (mode === "divide") {
        const product = left * right;
        const divideLeft = Math.random() < 0.5;
        const divisor = divideLeft ? left : right;

        answer = divideLeft ? right : left;
        currentEquation = `${product} ÷ ${divisor} = ${answer}`;
        currentSpoken = `${product} divided by ${divisor} equals ${answer}.`;
        questionElement.textContent = `${product} ÷ ${divisor} = ?`;
    } else {
        answer = left * right;
        currentEquation = `${left} × ${right} = ${answer}`;
        currentSpoken = `${left} times ${right} equals ${answer}.`;
        questionElement.textContent = `${left} × ${right} = ?`;
    }

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

    pauseTimer();

    timeRemaining = Number(timerSelect.value);
    updateTimerDisplay();
    roundActive = true;

    timerId = setInterval(() => {
        if (!roundActive) {
            pauseTimer();
            return;
        }

        timeRemaining = Math.max(0, timeRemaining - 1);

        updateTimerDisplay();

        if (timeRemaining === 0) {
            showFeedback("timeout");
        }
    }, 1000);
}

function initialize() {
    // Prevent initialization from happening more than once.
    if (initialized) {
        return;
    }

    initialized = true;

    updateInitializePrompt();

    // A user-initiated utterance primes speech synthesis before answer feedback.
    speak("Started");
    showStatus("Practice started.");

    generateQuestion();
    startTimer();

    inputElement.focus();
}

function checkAnswer() {
    // Ignore answers until initialization has happened.
    if (!initialized || !roundActive) {
        return;
    }

    const userAnswer = Number(inputElement.value.trim());
    const correctAnswer = answer;

    showFeedback(userAnswer === correctAnswer ? "correct" : "incorrect");
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

modeSelect.addEventListener("change", () => {
    mode = modeSelect.value;
    updateInitializePrompt();

    if (initialized) {
        generateQuestion();
        startTimer();
    }
});

// Set up the initial question and timer display,
// but DON'T start the timer.
mode = modeSelect.value;
updateInitializePrompt();
generateQuestion();

timeRemaining = Number(timerSelect.value);
updateTimerDisplay();
