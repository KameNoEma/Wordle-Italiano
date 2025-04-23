const keyboardContainer = document.getElementById("keyboard");

const keyboardLayout = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  ["backspace", "enter"]
];

const keyboardKeys = {};

function createKeyboard() {
  keyboardContainer.innerHTML = ""; // Pulisce se riavvii

  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    const keys = Array.isArray(row) ? row : row.split(""); // 👈 se è array, lo usa direttamente

    keys.forEach(letter => {
      const key = document.createElement("div");
      key.classList.add("key");

      // Simboli e testi personalizzati
      if (letter === "backspace") {
        key.textContent = "←";
        key.classList.add("key-wide");
      } else if (letter === "enter") {
        key.textContent = "Enter";
        key.classList.add("key-wide");
      } else {
        key.textContent = letter;
      }

      key.setAttribute("data-key", letter);
      keyboardKeys[letter] = key;

      key.addEventListener("click", () => {
        handleKeyPress(letter);
      });

      rowDiv.appendChild(key);
    });

    keyboardContainer.appendChild(rowDiv);
  });
}

function handleKeyPress(key) {
  if (key === "backspace") {
    // Gestisci il backspace (ad esempio, rimuovi l'ultimo carattere)
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
  } else if (key === "enter") {
    // Gestisci l'invio (ad esempio, verifica la parola)
    if (currentGuess.length === wordLength) {
      checkGuess();
    }
  } else {
    // Gestisci la lettera (aggiungi il carattere alla parola corrente)
    if (currentGuess.length < wordLength) {
      currentGuess += key;
      updateCurrentRow();
    }
  }
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
