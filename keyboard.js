const keyboardContainer = document.getElementById("keyboard");

const keyboardLayout = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm"
];

const keyboardKeys = {};

function createKeyboard() {
  keyboardContainer.innerHTML = ""; // Pulisce se riavvii
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    for (let letter of row) {
      const key = document.createElement("div");
      key.classList.add("key");
      key.textContent = letter;
      key.setAttribute("data-key", letter);
      keyboardKeys[letter] = key;
      rowDiv.appendChild(key);
    }
    keyboardContainer.appendChild(rowDiv);
  });
}

function markKeyAbsent(letter) {
  const key = keyboardKeys[letter];
  if (key && !key.classList.contains("key-absent")) {
    key.classList.add("key-absent");
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

createKeyboard(); // chiamala appena parte il gioco o in startNewGame()
