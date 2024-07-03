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
let wordsCount = 0;
let recordCount = 0;
let coinCount = 0;

// Load coin count and record count from localStorage
if (localStorage.getItem('coinCount')) {
    coinCount = parseInt(localStorage.getItem('coinCount'), 10);
}
if (localStorage.getItem('recordCount')) {
    recordCount = parseInt(localStorage.getItem('recordCount'), 10);
}

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const removeAdsScreen = document.getElementById('removeAdsScreen');
const storeScreen = document.getElementById('storeScreen');
const startButton = document.getElementById('startButton');
const storeButton = document.getElementById('storeButton');
const removeAdsButton = document.getElementById('removeAdsButton');
const backToStartButton = document.getElementById('backToStartButton');
const backToStartButtonStore = document.getElementById('backToStartButtonStore');
const categoryContainer = document.getElementById('categoryContainer');
const wordContainer = document.getElementById('wordContainer');
const lettersContainer = document.getElementById('lettersContainer');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const backButton = document.getElementById('backButton');
const infoButton = document.getElementById('infoButton');
const figureParts = document.querySelectorAll('.figure-part');
const hangmanSvg = document.getElementById('hangmanSvg');
const carouselSlide = document.querySelector('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const wordsCountElement = document.getElementById('wordsCount');
const recordCountElement = document.getElementById('recordCount');
const coinCountElement = document.getElementById('coinCount');

const infoModal = document.getElementById('infoModal');
const resetConfirmModal = document.getElementById('resetConfirmModal');
const winModal = document.getElementById('winModal');
const loseModal = document.getElementById('loseModal');
const wordsCountModal = document.getElementById('wordsCountModall');
const recordCountModal = document.getElementById('recordCountModal');

const closeInfoModal = document.querySelector('.close');
const closeResetModal = document.querySelector('.close-reset');
const closeWinModal = document.querySelector('.close-win');
const closeLoseModal = document.querySelector('.close-lose');
const closeWordsCountModal = document.querySelector('.close-words-count');
const closeRecordCountModal = document.querySelector('.close-record-count');

const confirmResetButton = document.getElementById('confirmResetButton');
const continueButton = document.getElementById('continueButton');
const tryAgainButton = document.getElementById('tryAgainButton');
let currentIndex = 0;

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    startGame();
});

storeButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    storeScreen.style.display = 'flex';
});

removeAdsButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    removeAdsScreen.style.display = 'flex';
});

backToStartButton.addEventListener('click', () => {
    removeAdsScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});

backToStartButtonStore.addEventListener('click', () => {
    storeScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});

resetButton.addEventListener('click', () => {
    if (wordsCount > 0) {
        resetConfirmModal.style.display = 'block';
    } else {
        startGame();
    }
});

backButton.addEventListener('click', () => {
    gameScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});

infoButton.addEventListener('click', () => {
    infoModal.style.display = 'block';
});

infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        infoModal.style.display = 'none';
    }
});

wordsCountModal.addEventListener('click', (e) => {
    if (e.target === wordsCountModal) {
        wordsCountModal.style.display = 'none';
    }
});

recordCountModal.addEventListener('click', (e) => {
    if (e.target === recordCountModal) {
        recordCountModal.style.display = 'none';
    }
});

closeInfoModal.addEventListener('click', () => {
    infoModal.style.display = 'none';
});

closeResetModal.addEventListener('click', () => {
    resetConfirmModal.style.display = 'none';
});

closeWinModal.addEventListener('click', continueGame);

closeLoseModal.addEventListener('click', () => {
    loseModal.style.display = 'none';
    wordsCount = 0;
    updateCounts();
    startGame();
});

closeWordsCountModal.addEventListener('click', () => {
    wordsCountModal.style.display = 'none';
});

closeRecordCountModal.addEventListener('click', () => {
    recordCountModal.style.display = 'none';
});

wordsCountElement.addEventListener('click', () => {
    document.getElementById('currentWordsCount').textContent = wordsCount;
    wordsCountModal.style.display = 'block';
});

recordCountElement.addEventListener('click', () => {
    document.getElementById('currentRecordCount').textContent = recordCount;
    recordCountModal.style.display = 'block';
});

confirmResetButton.addEventListener('click', () => {
    resetConfirmModal.style.display = 'none';
    wordsCount = 0;
    updateCounts();
    startGame();
});

continueButton.addEventListener('click', continueGame);

tryAgainButton.addEventListener('click', () => {
    loseModal.style.display = 'none';
    wordsCount = 0;
    updateCounts();
    startGame();
});

window.addEventListener('resize', () => {
    adjustHangmanSize();
});

document.getElementById('nextSlide').addEventListener('click', () => {
    nextSlide();
});

document.getElementById('prevSlide').addEventListener('click', () => {
    prevSlide();
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

removeAdsScreen.addEventListener('touchstart', startTouch, false);
removeAdsScreen.addEventListener('touchmove', moveTouch, false);

let initialX = null;
let initialY = null;

function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
}

function moveTouch(e) {
    if (initialX === null || initialY === null) {
        return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            // swipe left
            nextSlide();
        } else {
            // swipe right
            prevSlide();
        }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
}

function nextSlide() {
    if (currentIndex < 2) {
        currentIndex++;
        updateCarousel();
    }
}

function prevSlide() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
}

function updateCarousel() {
    carouselSlide.style.transform = `translateX(${-currentIndex * 100 / 3}%)`;
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    const carouselControls = document.querySelector('.carousel-controls');
    if (currentIndex === 0) {
        carouselControls.classList.add('first-slide');
    } else {
        carouselControls.classList.remove('first-slide');
    }

    if (currentIndex === 0) {
        document.getElementById('prevSlide').style.display = 'none';
    } else {
        document.getElementById('prevSlide').style.display = 'block';
    }

    if (currentIndex === 2) {
        document.getElementById('nextSlide').style.display = 'none';
    } else {
        document.getElementById('nextSlide').style.display = 'block';
    }
}

function startGame() {
    guessedLetters = [];
    mistakes = 0;
    message.textContent = '';
    getRandomWord();
    displayCategory();
    displayWord();
    createLetters();
    updateFigure();
    adjustHangmanSize();
    updateCounts(); // Update counts on game start
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
    adjustFontSize();
    
    if (!display.includes('_')) {
        message.textContent = 'Parabéns! Você venceu!';
        lettersContainer.innerHTML = '';
        setTimeout(() => {
            winModal.style.display = 'block';
        }, 1000);
    }
}

function adjustFontSize() {
    let fontSize = 2; // Initial font size in em
    wordContainer.style.fontSize = `${fontSize}em`;
    while (wordContainer.scrollWidth > wordContainer.clientWidth && fontSize > 0.5) {
        fontSize -= 0.1;
        wordContainer.style.fontSize = `${fontSize}em`;
    }
}

function displayCategory() {
    categoryContainer.textContent = chosenCategory;
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
            document.getElementById('correctWord').textContent = chosenWord;
            setTimeout(() => {
                loseModal.style.display = 'block';
            }, 1000);
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

function adjustHangmanSize() {
    const containerHeight = document.querySelector('.container').offsetHeight;
    hangmanSvg.style.height = `${containerHeight * 0.4}px`;
    hangmanSvg.style.width = 'auto';
}

function updateCounts() {
    wordsCountElement.innerHTML = `${wordsCount} <i class="bi bi-check-lg laranja"></i>`;
    recordCountElement.innerHTML = `${recordCount} <i class="bi bi-trophy laranja"></i>`;
    coinCountElement.innerHTML = `${coinCount} <i class="bi bi-coin"></i>`;
    // Save coin count and record count to localStorage
    localStorage.setItem('coinCount', coinCount);
    localStorage.setItem('recordCount', recordCount);
}

function continueGame() {
    winModal.style.display = 'none';
    wordsCount++;
    let coinsEarned = maxMistakes - mistakes;
    coinCount += coinsEarned;
    if (wordsCount > recordCount) {
        recordCount = wordsCount;
    }
    updateCounts();
    startGame();
}

// Initial update to display the loaded coin count and record count
updateCounts();

// Initial call to hide prevSlide button
updateCarousel();