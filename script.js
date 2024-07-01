const words = ["javascript", "html", "css", "programacao", "mobile"];
let chosenWord = words[Math.floor(Math.random() * words.length)];
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;

const wordContainer = document.getElementById('wordContainer');
const lettersContainer = document.getElementById('lettersContainer');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

function displayWord() {
    wordContainer.innerHTML = '';
    let display = chosenWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    wordContainer.textContent = display;

    if (!display.includes('_')) {
        message.textContent = 'Parabéns! Você venceu!';
        lettersContainer.innerHTML = '';
    }
}

function createLetters() {
    lettersContainer.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i);
        let letterDiv = document.createElement('div');
        letterDiv.textContent = letter;
        letterDiv.classList.add('letter');
        letterDiv.addEventListener('click', () => guessLetter(letter.toLowerCase()));
        lettersContainer.appendChild(letterDiv);
    }
}

function guessLetter(letter) {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);

    if (chosenWord.includes(letter)) {
        displayWord();
    } else {
        mistakes++;
        if (mistakes === maxMistakes) {
            message.textContent = 'Você perdeu! A palavra era ' + chosenWord;
            lettersContainer.innerHTML = '';
        }
    }

    let letterDiv = Array.from(lettersContainer.children).find(div => div.textContent.toLowerCase() === letter);
    letterDiv.classList.add('disabled');
}

resetButton.addEventListener('click', () => {
    chosenWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    mistakes = 0;
    message.textContent = '';
    displayWord();
    createLetters();
});

displayWord();
createLetters();
