const keyboardContainer = document.getElementById("keyboard");

const keyboardLayout = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "backspace enter"
];

const keyboardKeys = {};

function createKeyboard() {
  keyboardContainer.innerHTML = ""; // Pulisce se riavvii

  // Per ogni riga nella tastiera, inclusi i tasti speciali
  keyboardLayout.forEach((row, rowIndex) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    row.split("").forEach(letter => {
      const key = document.createElement("div");
      key.classList.add("key");
      key.textContent = letter;
      key.setAttribute("data-key", letter);
      keyboardKeys[letter] = key;

      // Aggiungi l'event listener per il click su ogni tasto
      key.addEventListener("click", () => {
        handleKeyPress(letter); // Chiama la funzione per gestire il click
      });

      rowDiv.appendChild(key);
    });

    // Aggiungi i tasti speciali (backspace e enter) alla fine delle righe
    if (rowIndex === 2) { // Se siamo nell'ultima riga
      // Tasto backspace
      const backspaceKey = document.createElement("div");
      backspaceKey.classList.add("key");
      backspaceKey.textContent = "←"; // Icona del backspace
      backspaceKey.setAttribute("data-key", "backspace");
      backspaceKey.addEventListener("click", () => {
        handleKeyPress("backspace"); // Chiama la funzione per il backspace
      });
      rowDiv.appendChild(backspaceKey);

      // Tasto enter
      const enterKey = document.createElement("div");
      enterKey.classList.add("key");
      enterKey.textContent = "Enter"; // Testo per il tasto invio
      enterKey.setAttribute("data-key", "enter");
      enterKey.addEventListener("click", () => {
        handleKeyPress("enter"); // Chiama la funzione per l'invio
      });
      rowDiv.appendChild(enterKey);
    }

    keyboardContainer.appendChild(rowDiv);
  });
}

function handleKeyPress(letter) {
  if (currentGuess.length < wordLength) {
    currentGuess += letter; // Aggiungi la lettera alla parola corrente
    updateCurrentRow(); // Aggiorna la riga nella griglia
  }
}
// Funzione per segnare le lettere "present" sulla tastiera
function markKeyPresent(letter) {
  const key = keyboardKeys[letter];
  if (key && !key.classList.contains("key-present")) {
    key.classList.add("key-present");
  }
}

// Funzione per segnare le lettere "correct" sulla tastiera
function markKeyCorrect(letter) {
  const key = keyboardKeys[letter];
  if (key && !key.classList.contains("key-correct")) {
    key.classList.add("key-correct");
  }
}

// Gestisci il click sui tasti della tastiera virtuale
document.querySelectorAll(".key").forEach(keyButton => {
  keyButton.addEventListener("click", (e) => {
    const key = e.target.getAttribute("data-key").toLowerCase();
 console.log(key);
    if (key === "backspace") {
      // Gestione del backspace
      currentGuess = currentGuess.slice(0, -1);
      updateCurrentRow();
    } else if (key === "enter") {
      // Gestione del tasto Enter
      if (currentGuess.length === wordLength) {
        checkGuess();
      }
    } else if (/^[a-zàèéìòù]$/i.test(key)) {
      // Gestione delle lettere
      if (currentGuess.length < wordLength) {
        currentGuess += key;
        updateCurrentRow();
      }
    }
  });
});
