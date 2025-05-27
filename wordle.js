// Carica parole utente dal localStorage e uniscile a italianWords
const userWords = JSON.parse(localStorage.getItem("userWords")) || [];
const italianWords = [...parole, ...userWords];


let wordLength = 5;
let maxAttempts = 6;
let secretWord = "";
let currentAttempt = 0;
let currentGuess = "";
let board = document.getElementById("board");

// Funzione per avviare una nuova partita
document.getElementById("start-button").addEventListener("click", () => {
  wordLength = parseInt(document.getElementById("word-length").value);
  maxAttempts = wordLength + 1;
  console.log("Pulsante 'Inizia' cliccato.");
  startNewGame();
});

// Funzione per riavviare la partita
document.getElementById("restart-button").addEventListener("click", () => {
  startNewGame();
  hideScoreScreen();
  console.log("Pulsante 'Nuova Partita' cliccato.");
});

// Funzione centrale per iniziare/riavviare una nuova partita
function startNewGame() {
  currentAttempt = 0;
  currentGuess = "";
  secretWord = getRandomWord(wordLength);

  document.getElementById("message").textContent = "";
  document.getElementById("restart-button").style.display = "none";

  clearBoard();
  generateBoard();
  createKeyboard();
  console.log("Parola segreta:", secretWord); // DEBUG
  createKeyboard();
}

// Imposta la riga attiva
function setActiveRow(index) {
  document.querySelectorAll(".row").forEach(row => {
    row.classList.remove("active");
  });
  const activeRow = document.querySelector(`.row[data-row="${index}"]`);
  if (activeRow) {
    activeRow.classList.add("active");
  }
}

// Funzione per ottenere una parola casuale dalla lista
function getRandomWord(length) {
  // Filtra l'array per ottenere solo le parole della lunghezza desiderata
  const filteredWords = italianWords.filter(word => word.length === length);
  
  // Scegli una parola casuale dall'array filtrato
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function clearBoard() {
  // Pulisce completamente la board, eliminando ogni traccia della partita precedente
  board.innerHTML = "";
}

function generateBoard() {
  // Genera la nuova board con la nuova configurazione
  board.style.gridTemplateRows = `repeat(${maxAttempts}, 1fr)`;
  for (let i = 0; i < maxAttempts; i++) {
    const row = document.createElement("div");
    row.className = "row";
    row.setAttribute("data-row", i);
    row.setAttribute("tabindex", "-1"); // per poter mettere il focus
    for (let j = 0; j < wordLength; j++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.setAttribute("data-row", i);
      tile.setAttribute("data-col", j);
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
 setActiveRow(0);
const firstRow = document.querySelector('.row[data-row="0"]');
if (firstRow) {
  firstRow.focus(); // 👈 Forza il focus sulla prima riga
}
}

// 🔡 Gestione input da tastiera
document.addEventListener("keydown", (e) => {
  if (currentAttempt >= maxAttempts) return;

  const key = e.key.toLowerCase();

  if (key === "backspace") {
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
  } else if (key === "enter") {
    if (currentGuess.length === wordLength) {
      checkGuess();
    }
  } else if (/^[a-zàèéìòù]$/i.test(key)) {
    if (currentGuess.length < wordLength) {
      currentGuess += key;
      updateCurrentRow();
    }
  }
});

function updateCurrentRow() {
  const tiles = document.querySelectorAll(`.tile[data-row="${currentAttempt}"]`);
  tiles.forEach((tile, i) => {
    tile.textContent = currentGuess[i] ? currentGuess[i].toUpperCase() : "";
  });
}

// Funzione per verificare se il tentativo è corretto
function checkGuess(force = false) {
  const guess = currentGuess.toLowerCase();

  // Verifica validità solo se non è forzato
  if (!force && !italianWords.includes(guess)) {
    showInvalidWordPopup(); // Mostra popup
    return;
  }

  const tiles = document.querySelectorAll(`.tile[data-row="${currentAttempt}"]`);

  let tempSecret = secretWord.split("");
  let result = Array(wordLength).fill("absent");

  // 🎯 Prima passata: lettere corrette
  for (let i = 0; i < wordLength; i++) {
    if (guess[i] === tempSecret[i]) {
      result[i] = "correct";
      tempSecret[i] = null;
    }
  }

  // 🔁 Seconda passata: lettere presenti
  for (let i = 0; i < wordLength; i++) {
    if (result[i] !== "correct" && tempSecret.includes(guess[i])) {
      result[i] = "present";
      tempSecret[tempSecret.indexOf(guess[i])] = null;
    }
  }

  // 🎨 Colorazione delle tiles
  for (let i = 0; i < wordLength; i++) {
    tiles[i].classList.add(result[i]);
  }

for (let i = 0; i < currentGuess.length; i++) {
  const letter = currentGuess[i];
  const status = result[i];

  if (status === "correct") {
    markKeyCorrect(letter);
  } else if (status === "present") {
    markKeyPresent(letter);
  } else if (status === "absent") {
    markKeyAbsent(letter);
  }
}

if (guess === secretWord) {
  endGame(); // Mostra la schermata dei punteggi (vuota) quando si vince
} else {
  currentAttempt++;
  currentGuess = "";
  if (currentAttempt === maxAttempts) {
    endGame(); // Mostra la schermata dei punteggi (vuota) quando si perde
  }
}
}

function showInvalidWordPopup() {
  const popup = document.getElementById("invalid-word-popup");
  popup.classList.remove("hidden");
}

document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("invalid-word-popup").classList.add("hidden");
  
  // ❌ Pulisce la parola attuale
  currentGuess = "";

  // 🧹 Rimuove il contenuto dalle tile della riga corrente
  const tiles = document.querySelectorAll(`.tile[data-row="${currentAttempt}"]`);
  tiles.forEach(tile => {
    tile.textContent = "";
    tile.className = "tile"; // Rimuove eventuali classi tipo 'correct', 'present', ecc.
  });
});

document.getElementById("force-submit-add").addEventListener("click", () => {
  // Aggiunge la parola e verifica
  const guess = currentGuess.toLowerCase();
  if (!italianWords.includes(guess)) {
    italianWords.push(guess);
    const savedUserWords = JSON.parse(localStorage.getItem("userWords")) || [];
    if (!savedUserWords.includes(guess)) {
      savedUserWords.push(guess);
      localStorage.setItem("userWords", JSON.stringify(savedUserWords));
    }
  }
  document.getElementById("invalid-word-popup").classList.add("hidden");
  checkGuess();
});

document.getElementById("force-submit").addEventListener("click", () => {
  document.getElementById("invalid-word-popup").classList.add("hidden");
  checkGuess(true); // Richiama checkGuess forzando il controllo
});


// Funzione per segnare le lettere "absent" sulla tastiera
function markKeyAbsent(letter) {
  const key = keyboardKeys[letter];
  if (key && !key.classList.contains("key-absent")) {
    key.classList.add("key-absent");
  }
}

function showMessage(msg) {
  const msgBox = document.getElementById("message");
  msgBox.textContent = msg;
  msgBox.style.marginTop = "1rem";
  document.getElementById("restart-button").style.display = "inline-block";
}

function setActiveRow(rowIndex) {
  document.querySelectorAll(".row").forEach((row, i) => {
    if (i === rowIndex) {
      row.classList.add("active");
    } else {
      row.classList.remove("active");
    }
  });
}