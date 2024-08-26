const palavras = {
    animais: [
        'leão', 'elefante', 'baleia azul', 'canguru', 'panda', 'urso polar',
        'águia', 'pinguim', 'flamingo', 'pica-pau', 'papagaio',
        'cobra', 'lagarto', 'tartaruga', 'jacaré', 'dragão barbudo',
        'sapo', 'rã', 'salamandra', 'axolote',
        'tubarão', 'salmão', 'cavalo-marinho', 'peixe-palhaço',
        'abelha', 'borboleta', 'joaninha', 'formiga',
        'aranha', 'escorpião', 'carrapato',
        'polvo', 'lula', 'caracol',
        'camarão', 'caranguejo', 'lagosta'
    ],
    frutas: [
        'maçã', 'banana', 'laranja', 'pera', 'uva', 'manga', 'abacaxi',
        'morango', 'kiwi', 'melancia', 'pêssego', 'cereja', 'mamão',
        'limo', 'limão', 'ameixa',
        'jabuticaba', 'graviola', 'cabeludinha', 'cupuaçu', 'camucamu',
        'tamarindo', 'physalis', 'salak', 'rambutan', 'durian', 'longan'
    ],
    paises: {
        africa: [
            'nigéria', 'egito', 'áfrica do sul', 'quênia', 'gana', 'marrocos',
            'argélia', 'tanzânia', 'uganda', 'senegal'
        ],
        americas: [
            'estados unidos', 'canadá', 'méxico', 'brasil', 'argentina',
            'colômbia', 'chile', 'peru', 'venezuela', 'cuba'
        ],
        asia: [
            'china', 'índia', 'japão', 'coreia do sul', 'indonésia', 'tailândia',
            'malásia', 'filipinas', 'arábia saudita', 'vietnam'
        ],
        europa: [
            'alemanha', 'frança', 'reino unido', 'itália', 'espanha',
            'países baixos', 'suíça', 'suécia', 'grécia', 'portugal'
        ],
        oceania: [
            'austrália', 'nova zelândia', 'fiji', 'papua-nova guiné',
            'samoa', 'tonga'
        ],
        medioOriente: [
            'turquia', 'irã', 'israel', 'emirados árabes unidos', 'líbano',
            'iraque', 'síria', 'arábia saudita', 'omã', 'qatar'
        ]
    }
};

let selectedWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
let correctGuesses = 0;
let selectedCategory = '';

const wordContainer = document.getElementById('wordContainer');
const hangmanImage = document.getElementById('hangmanImage');
const keyboard = document.getElementById('keyboard');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const categorySelect = document.getElementById('categorySelect');
const customWord = document.getElementById('customWord');
const startGameDiv = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const selectedCategoryElem = document.getElementById('selectedCategory');

// Sons de vitória e derrota
const winSound = new Audio('audio/ganhouu.mp3');
const loseSound = new Audio('audio/errrouu.mp3');

// Inicializa o jogo com a palavra escolhida
startBtn.addEventListener('click', () => {
    selectedCategory = categorySelect.value;
    const customWordValue = customWord.value.toLowerCase().trim();

    if (customWordValue) {
        selectedWord = customWordValue;
    } else if (selectedCategory && palavras[selectedCategory]) {
        const wordList = palavras[selectedCategory];
        selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    } else {
        alert('Por favor, selecione uma categoria ou insira uma palavra personalizada.');
        return;
    }

    // Exibe a categoria escolhida
    selectedCategoryElem.textContent = `Categoria Selecionada: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`;

    // Log da categoria e palavra selecionada no console
    console.log(`Categoria Selecionada: ${selectedCategory}`);
    console.log(`Palavra Selecionada: ${selectedWord}`);

    startGameDiv.classList.add('d-none');
    gameArea.classList.remove('d-none');
    restartBtn.classList.remove('d-none');
    initializeGame();
});

const initializeGame = () => {
    guessedLetters = [];
    wrongGuesses = 0;
    correctGuesses = 0;
    hangmanImage.innerHTML = `<img src="img/forca1.png" alt="Forca" class="img-fluid">`;
    displayWord();
    createKeyboard();
};

const displayWord = () => {
    wordContainer.innerHTML = selectedWord.split('').map(letter =>
        guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
};

const createKeyboard = () => {
    keyboard.innerHTML = '';

    // Letras com acento
    const specialChars = 'ã á é í ó ô ú ç'.split(' ');

    // Letras do alfabeto
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i).toLowerCase();
        const button = document.createElement('button');
        button.className = 'btn btn-outline-secondary m-1';
        button.textContent = letter;
        button.addEventListener('click', () => handleGuess(letter, button));
        keyboard.appendChild(button);
    }

    // Adiciona botões para caracteres especiais
    specialChars.forEach(char => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-secondary m-1';
        button.textContent = char;
        button.addEventListener('click', () => handleGuess(char, button));
        keyboard.appendChild(button);
    });
};

const handleGuess = (letter, button) => {
    if (guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    button.disabled = true; // Desativa o botão após o clique
    button.classList.add('btn-secondary'); // Altera a classe para indicar que foi clicado

    if (selectedWord.includes(letter)) {
        correctGuesses++;
    } else {
        wrongGuesses++;
        hangmanImage.innerHTML = `<img src="img/forca${wrongGuesses}.png" alt="Forca" class="img-fluid">`;
    }
    displayWord();
    updateCounters();
    checkGameStatus();
};

const updateCounters = () => {
    document.getElementById('correctCount').textContent = correctGuesses;
    document.getElementById('wrongCount').textContent = wrongGuesses;
};

const checkGameStatus = () => {
    if (wrongGuesses >= 6) {
        loseSound.play();
        document.getElementById('losingWord').textContent = selectedWord;
        document.getElementById('modalCorrectCountLose').textContent = correctGuesses;
        document.getElementById('modalWrongCountLose').textContent = wrongGuesses;
        const loseModal = new bootstrap.Modal(document.getElementById('loseModal'));
        loseModal.show();
        restartBtn.classList.remove('d-none');
    } else if (!wordContainer.textContent.includes('_')) {
        winSound.play();
        document.getElementById('winningWord').textContent = selectedWord;
        document.getElementById('modalCorrectCount').textContent = correctGuesses;
        document.getElementById('modalWrongCount').textContent = wrongGuesses;
        const winModal = new bootstrap.Modal(document.getElementById('winModal'));
        winModal.show();
        restartBtn.classList.remove('d-none');
    }
};

restartBtn.addEventListener('click', () => {
    startGameDiv.classList.remove('d-none');
    gameArea.classList.add('d-none');
    restartBtn.classList.add('d-none');
});

document.getElementById('restartBtnModal').addEventListener('click', () => {
    const winModal = bootstrap.Modal.getInstance(document.getElementById('winModal'));
    winModal.hide();
    restartBtn.click();
});

document.getElementById('restartBtnModalLose').addEventListener('click', () => {
    const loseModal = bootstrap.Modal.getInstance(document.getElementById('loseModal'));
    loseModal.hide();
    restartBtn.click();
});

// Alterna entre modo claro e escuro
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
};

// Adiciona evento ao botão de alternar modo escuro
document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);

// Inicializa o estado do modo escuro com base na preferência do usuário armazenada no localStorage
const darkModeIcon = document.getElementById('darkModeIcon');
const darkModeText = document.getElementById('darkModeText');

if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeIcon.className = 'bi bi-moon';
    darkModeText.textContent = 'Modo Claro';
}
