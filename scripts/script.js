// TODO: load words from a file.
const WORDS = [
    "termo",
    "quero",
    "muito",
    "valor",
    "custo",
    "antas",
    "vasto",
    "susto",
    "treco",
    "coisa",
    "musgo",
    "sexta",
    "zerar",
    "sagaz",
    "faixa",
    "quota",
    "jeito",
    "horas",
    "horta",
    "mente",
    "gente",
    "trena",
    "texto",
    "falho",
    "limbo",
    "eixos",
    "malho",
    "atuar",
    "dente",
    "testa",
    "moita",
    "muita"
];

const N_WORDS = 6;
const N_LETTERS = 5;

let targetWord = '';  // Word to be guessed by the player.
let currWordIndex = 0; // Index of word being edited, 0 to 5 (6 attempts).
let currLetterIndex = 0;  // Index of letter being edited, 0 to 4 (5 letters).
let userWord = ['', '', '', '', '']; // Current word entered by user.

// Selects a new random target word, different from the current one.
const chooseRandomWord = () => {
    let newWord = targetWord;
    while (newWord === targetWord) {
        newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    }
    targetWord = newWord;
}

// Changes the class of the HTML element of a letter.
const updateLetterClass = (wordIndex, letterIndex, className) => {
    const word = document.getElementsByClassName("word")[wordIndex];
    let letter = word.getElementsByTagName("div")[letterIndex];
    letter.className = className;
    if (className.includes("active")) {
        letter.onclick = () => { selectLetter(letterIndex) };
    } else {
        letter.onclick = null;
    }
}

// Selects a letter from the current word to be edited.
const selectLetter = (letterIndex) => {
    updateLetterClass(
        currWordIndex, currLetterIndex, "letter letter-active");
    updateLetterClass(
        currWordIndex, letterIndex, "letter letter-active letter-selected");
    currLetterIndex = letterIndex;
}

// Selects the next letter from the current word to be edited..
const nextLetter = () => {
    if (currLetterIndex < N_LETTERS - 1) {
        selectLetter(currLetterIndex + 1);
    }
}

// Selects the previous letter from the current word to be edited..
const previousLetter = () => {
    if (currLetterIndex > 0) {
        selectLetter(currLetterIndex - 1);
    }
}

// Edits the current letter.
const enterLetter = (letter) => {
    letter = letter.toUpperCase();
    if (/^[A-Z]$/i.test(letter)) {
        userWord[currLetterIndex] = letter;
        updateUserWord(currLetterIndex);
        nextLetter();
    }
}

// Erases the current letter content.
const eraseLetter = () => {
    userWord[currLetterIndex] = '';
    updateUserWord(currLetterIndex);
}

// Updates the background colors of each letter in the current word.
const updateLettersColors = () => {
    // TODO: add CSS animation for letters class change.
    // TODO: compare the letters ignoring accentuation.

    for (let i = 0; i < N_LETTERS; i++) {
        let userLetter = userWord[i].toLowerCase();
        let className = "letter ";
        if (userLetter === targetWord[i]) {
            className += "letter-correct";
        } else if (targetWord.includes(userLetter)) {
            className += "letter-wrong-position";
        } else {
            className += "letter-not-present";
        }
        updateLetterClass(currWordIndex, i, className);
    }
}

// Advances to the next word.
const nextWord = () => {
    updateLettersColors();

    // Changes the next word to the current.
    currWordIndex += 1;
    currLetterIndex = 0;
    for (let i = 0; i < N_LETTERS; i++) {
        let className = "letter letter-active";
        if (i === 0) className += " letter-selected";
        updateLetterClass(currWordIndex, i, className);
    }
}

// TODO: use a custom HTML pop-up dialog instead of JS 'alert'.

// TODO: store score stats in localStorage after defeat or victory.

const defeat = () => {
    updateLettersColors();

    setTimeout(() => {
        alert(
            "Que pena... Você não acertou a palavra: "
            + targetWord.toUpperCase()
            + "\n\nPressione OK para tentar outra!");
        startNewWord();
    }, 1);
}

const victory = () => {
    updateLettersColors();

    setTimeout(() => {
        alert(
            "Parabéns! Você acertou a palavra: "
            + targetWord.toUpperCase()
            + "\n\nPressione OK para continuar jogando!");
        startNewWord();
    }, 1);
}

const submitWord = () => {
    // TODO: check word ignoring accentuation.
    const word = userWord.join('').toLowerCase();
    if (word.length === N_LETTERS && WORDS.includes(word)) {
        if (word === targetWord) {
            victory();
        }
        else if (currWordIndex < N_WORDS - 1) {
            nextWord();
        }
        else {
            defeat();
        }
    } else {
        alert("Palavra inválida!\nDeve ter 5 letras e estar presente no dicionário do jogo!");
    }
}

// Updates the DOM elements of the current word entered by the user.
const updateUserWord = (letterIndex = null) => {
    const word = document.getElementsByClassName("word")[currWordIndex];

    if (letterIndex !== null) {
        let letter = word.getElementsByTagName('p')[letterIndex];
        letter.innerHTML = userWord[letterIndex];
    } else {
        for (let i = 0; i < N_LETTERS; i++) {
            let letter = word.getElementsByTagName('p')[i];
            letter.innerHTML = userWord[i];
        }
    }
}

const eraseWord = (wordIndex) => {
    const word = document.getElementsByClassName("word")[wordIndex];
    let letters = word.getElementsByTagName('p');
    for (let i = 0; i < N_LETTERS; i++) {
        letters[i].innerHTML = '';
    }
}

const startNewWord = () => {
    // Erases curent words.
    for (let i = 0; i <= currWordIndex; i++)  eraseWord(i);

    chooseRandomWord();
    currLetterIndex = 0;
    currWordIndex = 0;
    userWord = ['', '', '', '', ''];
    updateUserWord();

    // Changes all letters to disabled, first word letters to active and first
    // letter to selected.
    for (let i = 0; i < N_WORDS; i++) {
        for (let j = 0; j < N_LETTERS; j++) {
            let className = "letter";
            if (i === 0) className += " letter-active";
            if (i === 0 && j === 0) className += " letter-selected";
            updateLetterClass(i, j, className);
        }
    }
}

// TODO: add CSS animation for key press feedback.

// Adds the callbacks for the virtual keyboard (in the page).
const __initializeKeyboard = () => {
    let keys = document.getElementsByClassName("key");
    Array.prototype.forEach.call(keys, (key) => {
        const keyName = key.id.split("-")[1];
        if (keyName === "enter") {
            key.onclick = submitWord
        } else if (keyName === "delete") {
            key.onclick = eraseLetter;
        } else {
            key.onclick = () => { enterLetter(keyName) }
        }
    });
}

// Adds the callbacks for the physical keyboard.
const __initializeKeyPress = () => {
    document.addEventListener("keypress", function onEvent(event) {
        /*
            FIXME: left/right arrow and backspace key press are not even
            generating an event. Ttested with an US international keyboard,
            Linux OS and Firefox browser.
        */
        if (event.key === "Enter") submitWord();
        else if (event.key === "Backspace") eraseLetter();
        else if (event.key === "ArrowLeft") previousLetter();
        else if (event.key === "ArrowRight") nextLetter();
        else enterLetter(event.key);
    });
}

window.addEventListener("load", function (event) {
    __initializeKeyboard();
    __initializeKeyPress();
    startNewWord();

    // Hides the address bar in mobile browsers.
    setTimeout(() => { window.scrollTo(0, 1) }, 0);

    alert("Em construção...\n\nPoucas palavras disponíveis no momento!");
});
