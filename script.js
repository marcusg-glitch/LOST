const terminalOutput = document.getElementById('output');
const terminalInput = document.getElementById('input');
const logEntries = document.getElementById('log-entries');
let timer;
const alertThreshold = 5 * 60; // 5 minutes in seconds

async function fetchTimeLeft() {
    try {
        const response = await fetch('/.netlify/functions/get-timer');
        const data = await response.json();
        return data.timeLeft; // Time left in seconds
    } catch (error) {
        console.error('Error fetching time left:', error);
        return 108 * 60; // Fallback to 108 minutes in seconds
    }
}

async function startTimer() {
    const timeLeft = await fetchTimeLeft();
    let countdown = timeLeft;

    displayMessage("> The timer is set for 108 minutes.");

    timer = setInterval(() => {
        countdown--;
        updateClock(countdown);

        if (countdown <= alertThreshold) {
            document.body.classList.add('red-alert');
        }

        if (countdown <= 0) {
            clearInterval(timer);
            displayMessage("> Time's up! Enter the numbers:");
            terminalInput.focus();
        }
    }, 1000); // Update every second
}

function updateClock(countdown) {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    const minutesTens = Math.floor(minutes / 10);
    const minutesUnits = minutes % 10;
    const secondsTens = Math.floor(seconds / 10);
    const secondsUnits = seconds % 10;

    document.getElementById('minutes-tens').textContent = minutesTens;
    document.getElementById('minutes-units').textContent = minutesUnits;
    document.getElementById('seconds-tens').textContent = secondsTens;
    document.getElementById('seconds-units').textContent = secondsUnits;
}

function displayMessage(message) {
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    terminalOutput.appendChild(newMessage);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function logEntry() {
    const now = new Date();
    const ipAddress = 'Unknown IP'; // Placeholder, cannot get IP directly in JS without backend

    const logMessage = `${now.toLocaleString()} - IP: ${ipAddress}`;
    const logItem = document.createElement('div');
    logItem.textContent = logMessage;
    logEntries.appendChild(logItem);
}

terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const inputText = terminalInput.value.trim();
        terminalInput.value = '';

        if (countdown <= alertThreshold && inputText === '4 8 15 16 23 42') {
            displayMessage("> Correct sequence entered. Resetting timer...");
            logEntry(); // Log the correct sequence entry
            startTimer();
        } else if (countdown > alertThreshold) {
            displayMessage("> Too early! Wait until the red alert.");
        } else {
            displayMessage("> Incorrect sequence. Try again.");
        }
    }
});

startTimer();