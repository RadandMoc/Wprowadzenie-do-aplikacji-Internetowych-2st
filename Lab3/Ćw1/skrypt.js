// Elementy HTML
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

// Zmienne do obsługi stopera
let seconds = 0;
let timerInterval = null;

// Funkcja do formatowania czasu
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
        return `${minutes}min ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
}

// Funkcja aktualizująca wyświetlany czas
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(seconds);
}

// Funkcja rozpoczynająca stoper
function startTimer() {
    if (timerInterval === null) { // Sprawdzenie, czy timer już nie działa
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

// Funkcja zatrzymująca stoper
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// Funkcja resetująca stoper
function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

// Event Listenery dla przycisków
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// Początkowe ustawienie wyświetlania czasu
updateTimerDisplay();
