const categories = {
    "Tecnologia": ["javascript", "html", "css", "programacao", "computador"],
    "Animais": ["elefante", "girafa", "cachorro", "gato", "leao"],
    "Frutas": ["banana", "maçã", "laranja", "uva", "abacaxi"]
};

let chosenCategory;
let chosenWord;
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startButton = document.getElementById('startButton');
const categoryContainer = document.getElementById('categoryContainer');
const wordContainer = document.getElementById('wordContainer');
const lettersContainer = document.getElementById('lettersContainer');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const backButton = document.getElementById('backButton');
const figureParts = document.querySelectorAll('.figure-part');

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    startGame();
});

resetButton.addEventListener('click', () => {
    startGame();
});

backButton.addEventListener('click', () => {
    gameScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});

function startGame() {
    guessedLetters = [];
    mistakes = 0;
    message.textContent = '';
    getRandomWord();
    displayCategory();
    displayWord();
    createLetters();
    updateFigure();
}

function getRandomWord() {
    const categoriesArray = Object.keys(categories);
    chosenCategory = categoriesArray[Math.floor(Math.random() * categoriesArray.length)];
    const wordsArray = categories[chosenCategory];
    chosenWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
}

function displayWord() {
    wordContainer.innerHTML = '';
    let display = chosenWord.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    wordContainer.textContent = display;

    if (!display.includes('_')) {
        message.textContent = 'Parabéns! Você venceu!';
        lettersContainer.innerHTML = '';
    }
}

function displayCategory() {
    categoryContainer.textContent = `Categoria: ${chosenCategory}`;
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
        updateFigure();
        let letterDiv = Array.from(lettersContainer.children).find(div => div.textContent.toLowerCase() === letter);
        letterDiv.classList.add('disabled', 'wrong');
        if (mistakes === maxMistakes) {
            message.textContent = `Você perdeu! A palavra era ${chosenWord}`;
            lettersContainer.innerHTML = '';
        }
    }

    let letterDiv = Array.from(lettersContainer.children).find(div => div.textContent.toLowerCase() === letter);
    letterDiv.classList.add('disabled');
}

function updateFigure() {
    figureParts.forEach((part, index) => {
        const errors = mistakes;
        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });
}
