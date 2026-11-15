// Cybersecurity quiz for IT 3203 Milestone 2.
// Answers are stored here so the same grading logic works for every question.
const questions = [
    {
        "type": "radio",
        "answer": "Computers, networks, and information",
        "question": "What does cybersecurity mainly protect?"
    },
    {
        "type": "radio",
        "answer": "A fake email asking for your password",
        "question": "Which is an example of phishing?"
    },
    {
        "type": "text",
        "answer": "malware",
        "question": "What is harmful software called?"
    },
    {
        "type": "radio",
        "answer": "T7!qP2#vL9",
        "question": "Which password is usually strongest?"
    },
    {
        "type": "checkbox",
        "answer": [
            "Use multifactor authentication",
            "Use strong, unique passwords"
        ],
        "question": "Which actions help protect online accounts? Select all that apply."
    },
    {
        "type": "text",
        "answer": "encryption",
        "question": "What is the process of turning readable data into coded data called?"
    },
    {
        "type": "radio",
        "answer": "Filter network traffic",
        "question": "What is one purpose of a firewall?"
    },
    {
        "type": "radio",
        "answer": "They can fix security weaknesses",
        "question": "Why are software updates important?"
    },
    {
        "type": "radio",
        "answer": "To recover files if data is lost",
        "question": "What is the main reason to back up important files?"
    },
    {
        "type": "text",
        "answer": "authentication",
        "question": "What is checking a user\u2019s identity called?"
    }
];
const form = document.getElementById('quiz-form');
const results = document.getElementById('results');
const timer = document.getElementById('timer');
const submitButton = document.getElementById('submit-button');
const totalSeconds = 600;
let startedAt = Date.now();
let timerId;
let submitted = false;

// Ignore capitalization and extra spaces for typed answers.
function normalize(value) {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
function formatTime(seconds) {
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
}
function elapsedSeconds() {
    return Math.min(totalSeconds, Math.floor((Date.now() - startedAt) / 1000));
}
function updateTimer() {
    if (submitted) return;
    const remaining = Math.max(0, totalSeconds - elapsedSeconds());
    timer.textContent = formatTime(remaining);
    timer.classList.toggle('warning', remaining <= 60);
    if (remaining === 0) gradeQuiz();
}
function getAnswer(number, type) {
    if (type === 'text') return form.elements['q' + number].value;
    return Array.from(form.querySelectorAll('input[name="q' + number + '"]:checked')).map(input => input.value);
}
function isCorrect(given, expected, type) {
    if (type === 'text') return normalize(given) === normalize(expected);
    if (type === 'radio') return given.length === 1 && given[0] === expected;
    return given.length === expected.length && expected.every(answer => given.includes(answer));
}
// Use textContent for user answers so typed HTML cannot be inserted into the page.
function addLine(parent, text, className) {
    const line = document.createElement('p');
    line.textContent = text;
    if (className) line.className = className;
    parent.appendChild(line);
}
function gradeQuiz() {
    if (submitted) return;
    submitted = true;
    clearInterval(timerId);
    const spent = elapsedSeconds();
    let correctCount = 0;
    const details = [];
    questions.forEach((question, index) => {
        const answer = getAnswer(index + 1, question.type);
        const correct = isCorrect(answer, question.answer, question.type);
        if (correct) correctCount++;
        details.push({ question, answer, correct });
    });
    const score = correctCount * 10;
    results.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = score >= 70 ? 'Result: PASS' : 'Result: FAIL';
    heading.className = score >= 70 ? 'correct' : 'incorrect';
    results.appendChild(heading);
    addLine(results, 'Total score: ' + score + '/100 (' + correctCount + '/10 correct)');
    addLine(results, 'Time spent: ' + formatTime(spent));
    details.forEach((item, index) => {
        const section = document.createElement('div');
        section.className = 'result-item';
        addLine(section, (index + 1) + '. ' + item.question.question);
        addLine(section, (item.correct ? 'Correct' : 'Incorrect') + ' — ' + (item.correct ? 10 : 0) + '/10 points', item.correct ? 'correct' : 'incorrect');
        const response = Array.isArray(item.answer) ? item.answer.join(', ') : item.answer;
        addLine(section, 'Your answer: ' + (response || 'No answer'));
        const expected = Array.isArray(item.question.answer) ? item.question.answer.join(', ') : item.question.answer;
        addLine(section, 'Correct answer: ' + expected);
        results.appendChild(section);
    });
    results.hidden = false;
    form.querySelectorAll('input').forEach(input => input.disabled = true);
    submitButton.disabled = true;
    timer.textContent = '0:00' === formatTime(totalSeconds - spent) ? '0:00' : formatTime(totalSeconds - spent);
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
form.addEventListener('submit', function(event) {
    event.preventDefault();
    gradeQuiz();
});
// Reset all inputs, results, and the timer for another attempt.
document.getElementById('reset-button').addEventListener('click', function() {
    clearInterval(timerId);
    form.querySelectorAll('input').forEach(input => input.disabled = false);
    form.reset();
    results.replaceChildren();
    results.hidden = true;
    submitted = false;
    submitButton.disabled = false;
    startedAt = Date.now();
    timer.classList.remove('warning');
    updateTimer();
    timerId = setInterval(updateTimer, 250);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
updateTimer();
timerId = setInterval(updateTimer, 250);
