// Sample texts to type for the test
const textSamples = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice typing every day to improve your speed and accuracy.",
  "Learning to code requires patience and perseverance.",
  "HTML, CSS, and JavaScript are essential web development skills."
];

// DOM elements for interacting with the page
const textToTypeElement = document.getElementById('text-to-type');
const inputBox = document.getElementById('input-box');
const timerCircle = document.getElementById('timer-circle');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const charsTypedElement = document.getElementById('chars-typed');
const progressBarInner = document.getElementById('progress-bar-inner');
const keyboardElement = document.getElementById('keyboard');
const restartBtn = document.getElementById('restart-btn');

// Timer and character tracking variables
let timer = null;
let timeLeft = 25;  // Time in seconds for the typing test
let correctCharacters = 0;

// Function to generate the on-screen keyboard
function createKeyboard() {
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['Space']); // All the keys to display
  keyboardElement.innerHTML = '';  // Clear existing keyboard
  keys.forEach((key) => {
    const keyElement = document.createElement('div');
    keyElement.classList.add('key');
    keyElement.id = `key-${key}`;
    keyElement.textContent = key === 'Space' ? '␣' : key; // Special case for Space key
    keyboardElement.appendChild(keyElement);
  });
}

// Function to highlight the key on the virtual keyboard when typed
function highlightKey(key, isCorrect = true) {
  const keyElement = document.getElementById(`key-${key}`);
  if (keyElement) {
    keyElement.classList.add(isCorrect ? 'active' : 'incorrect');  // Mark key as active or incorrect
    setTimeout(() => keyElement.classList.remove('active', 'incorrect'), 200);  // Reset after short delay
  }
}

// Load a random text for the user to type
function loadRandomText() {
  const randomIndex = Math.floor(Math.random() * textSamples.length);  // Select a random sample
  textToTypeElement.innerText = textSamples[randomIndex];
}

// Start the countdown timer for the typing test
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;  // Decrease the time left by 1 second
    const percentage = (timeLeft / 15) * 100;  // Calculate percentage for timer circle
    timerCircle.style.background = `conic-gradient(#4caf50 0% ${percentage}%, #333 ${percentage}% 100%)`;
    timerCircle.innerText = timeLeft;

    if (timeLeft <= 0) {  // When the time is up, stop the timer
      clearInterval(timer);
      endTest();  // End the test and calculate stats
    }
  }, 1000);
}

// Calculate the words per minute (WPM) and accuracy
function calculateStats() {
  const elapsedMinutes = (15 - timeLeft) / 60;  // Convert seconds to minutes
  const wordsTyped = inputBox.value.trim().split(/\s+/).length;  // Count words typed
  const wpm = Math.floor(wordsTyped / elapsedMinutes);  // Calculate WPM
  const accuracy = Math.floor((correctCharacters / inputBox.value.length) * 100);  // Calculate accuracy

  // Update the stats on the page
  wpmElement.innerText = isNaN(wpm) ? 0 : wpm;
  accuracyElement.innerText = isNaN(accuracy) ? 100 : accuracy;
  charsTypedElement.innerText = inputBox.value.length;
}

// End the typing test and display stats
function endTest() {
  inputBox.disabled = true;  // Disable input field
  calculateStats();  // Calculate final stats
  alert('Time is up! Check your stats.');  // Alert the user
}

// Restart the typing test with a reset
function restartTest() {
  clearInterval(timer);  // Clear any existing timer
  timeLeft = 15;  // Reset time
  correctCharacters = 0;  // Reset correct character count

  inputBox.value = '';  // Clear input box
  inputBox.disabled = false;  // Enable input field
  timerCircle.style.background = 'conic-gradient(#4caf50 0% 100%, #333 100%)';  // Reset timer circle
  timerCircle.innerText = '15';  // Reset timer display
  progressBarInner.style.width = '0%';  // Reset progress bar

  wpmElement.innerText = '0';  // Reset WPM
  accuracyElement.innerText = '100';  // Reset accuracy
  charsTypedElement.innerText = '0';  // Reset character count

  loadRandomText();  // Load a new random text
  inputBox.focus();  // Focus on input box to start typing
  startTimer();  // Start the timer again
}

// Event listener for input in the text box
inputBox.addEventListener('input', () => {
  if (!timer) startTimer();  // Start the timer if it's not already running

  const inputText = inputBox.value;
  const referenceText = textToTypeElement.innerText;
  correctCharacters = 0;  // Reset correct character count

  // Check each character typed and highlight it if correct
  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] === referenceText[i]) {
      correctCharacters++;
      highlightKey(referenceText[i].toUpperCase());  // Highlight correct key
    }
  }

  // Update progress bar based on correct characters typed
  const progressPercentage = (correctCharacters / referenceText.length) * 100;
  progressBarInner.style.width = `${progressPercentage}%`;
  calculateStats();  // Update stats
});

// Event listener for keydown to highlight virtual keys on the screen
document.addEventListener('keydown', (event) => {
  highlightKey(event.key === ' ' ? 'Space' : event.key.toUpperCase());  // Highlight key pressed
});

// Event listener for the restart button
restartBtn.addEventListener('click', restartTest);

// Initialize the typing test by loading text and creating the keyboard
loadRandomText();
createKeyboard();
