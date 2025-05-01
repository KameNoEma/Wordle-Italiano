// Riferimento alla schermata dei punteggi e ai suoi elementi
const scoreScreen = document.getElementById("score-screen");
const scoreTitle = document.getElementById("score-title"); // Riferimento al titolo
const scoreMessage = document.getElementById("score-message"); // Riferimento al messaggio
const restartButton = document.getElementById("restart-button");

// Variabile per tenere traccia del grafico
let attemptsChart = null;

// Funzione per mostrare la schermata dei punteggi
function showScoreScreen(title, message, isWin, attempts) {
  scoreTitle.textContent = title;
  message = isWin ? `Congratulazioni, hai vinto con ${attempts} tentativi!` : `La parola era: ${secretWord}. Prova ancora!`;
  scoreMessage.textContent = message;

  if (isWin) {
    scoreTitle.classList.add('win');
    scoreTitle.classList.remove('loss');
  } else {
    scoreTitle.classList.add('loss');
    scoreTitle.classList.remove('win');
  }

  const gameStats = document.createElement('p');
  scoreMessage.appendChild(gameStats);

  // Mostra la schermata e il pulsante
  scoreScreen.classList.remove("hidden");
  restartButton.style.display = "inline-block";
}

// Nasconde la schermata dei punteggi
function hideScoreScreen() {
  scoreScreen.classList.add("hidden");
}

// Funzione per terminare il gioco
function endGame() {
  let title = "";
  let message = "";
  let isWin = false;

  if (currentGuess === secretWord) {
    title = "Hai indovinato! 🎉";
    message = "Congratulazioni, hai vinto!";
    isWin = true;
  } else {
    title = "Peccato! 😔";
    message = `La parola era: ${secretWord}. Prova ancora!`;
  }

  // Aggiungi il punteggio alla cronologia
  addGameHistory(currentAttempt + 1, isWin, wordLength); // Passa anche la lunghezza della parola

  // Mostra la schermata dei punteggi con il titolo, messaggio e risultato
  showScoreScreen(title, message, isWin, currentAttempt + 1);
  // Aggiorna il grafico con i nuovi dati
  updateStats();
}

let gameHistory = []; // Array per tenere traccia dei punteggi

// Funzione per aggiungere il punteggio alla cronologia
function addGameHistory(attempts, isWin, wordLength) {
  if (attempts != null && typeof attempts === "number" && typeof isWin === "boolean") {
    gameHistory.push({ attempts, isWin, wordLength });
    console.log(gameHistory); // Debug per vedere la cronologia dei punteggi
    saveGameHistory();
  }
}

// Oggetto per tracciare le vittorie per numero di tentativi e lunghezza della parola
let attemptStats = {};

// Funzione per aggiornare le statistiche
function updateStats() {
  const statsByLength = {};

  gameHistory.forEach(game => {
    const maxAttempts = game.wordLength + 2; // +1 per tentativi validi, +1 per fallimento

    if (!statsByLength[game.wordLength]) {
      statsByLength[game.wordLength] = {
        wins: Array(maxAttempts).fill(0),
        losses: Array(maxAttempts).fill(0)
      };
    }

    if (game.isWin) {
      // I tentativi validi vanno da 1 a (wordLength + 1) → index = attempts - 1
      statsByLength[game.wordLength].wins[game.attempts - 1]++;
    } else {
      // Fallimento → sempre registrato nell'ultima posizione
      const failIndex = maxAttempts - 1;
      statsByLength[game.wordLength].losses[failIndex]++;
    }
  });

  for (let length in statsByLength) {
    updateAttemptsChart(
      statsByLength[length].wins,
      statsByLength[length].losses,
      length
    );
  }
}


function updateAttemptsChart(winData, defeatData, wordLength) {
  const chartId = `attempts-chart-${wordLength}`;
  let chartCanvas = document.getElementById(chartId);

  // Crea il contenitore dei grafici se non esiste
  let chartsContainer = document.getElementById("charts-grid");
  if (!chartsContainer) {
    chartsContainer = document.createElement("div");
    chartsContainer.id = "charts-grid";
    chartsContainer.classList.add("charts-grid");
    document.getElementById("score-message").appendChild(chartsContainer);
  }

  // Se il canvas non esiste, crealo
  if (!chartCanvas) {
    chartCanvas = document.createElement("canvas");
    chartCanvas.id = chartId;
    chartsContainer.appendChild(chartCanvas);
  }
  const attemptsLabels = [];
  const maxAttempts = winData.length;
  for (let i = 1; i < maxAttempts; i++) {
    attemptsLabels.push(`${i} Tentativi`);
  }
  attemptsLabels.push("Fallito");

  const ctx = chartCanvas.getContext("2d");

  // Imposta la risoluzione del dispositivo
  Chart.defaults.devicePixelRatio = 1;

  // Distruggi un eventuale grafico precedente
  if (chartCanvas.chartInstance) {
    chartCanvas.chartInstance.destroy();
  }

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: attemptsLabels,
      datasets: [
        {
          label: Vittorie (${wordLength} lettere),
          data: winData,
          backgroundColor: "#538d4e",
          borderColor: "#3e8e41",
          borderWidth: 1,
        },
        {
          label: Sconfitte (${wordLength} lettere),
          data: defeatData,
          backgroundColor: "#f44336",
          borderColor: "#e53935",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          bodyFont: {
            size: 12,
          },
          titleFont: {
            size: 13,
          },
        },
        // Aggiungi un titolo direttamente nel grafico
        title: {
          display: true,
          text: `Parola di ${wordLength} lettere`, // Imposta il titolo dinamico
          font: {
            size: 14, // Imposta la dimensione del font del titolo
            weight: "bold", // Puoi cambiare lo stile se lo desideri
          },
          padding: {
            top: 2, // Distanza dal bordo superiore del grafico
            bottom: 2, // Distanza dal bordo inferiore del titolo
          }
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 2,
            callback: value => Number.isInteger(value) ? value : "",
            font: 11,
          },
          title: {
            display: true,
            text: "Numero di partite",
            font: 12,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: 11,
            callback: value => value < winData.length ? value + 1 : "Fallito",
          },
          title: {
            display: true,
            text: "Tentativi",
            font: 12,
          },
        },
      },
      layout: {
        padding: 2
      }
    }
  });

  // Salva l'istanza del grafico per distruggerla se serve
  chartCanvas.chartInstance = chart;

  // Forza il resize per adattare le scritte
  setTimeout(() => {
    chart.resize();

const chartsContainer = document.getElementById("charts-grid");
  }, 0);
}





function saveGameHistory() {
  // Prendi lo storico delle partite
  localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
}

function loadGameHistory() {
  // Recupera lo storico dal localStorage
  const savedHistory = localStorage.getItem("gameHistory");
  
  // Se esiste, ripristina lo storico
  if (savedHistory) {
    gameHistory = JSON.parse(savedHistory); // Trasformalo in oggetto
  }
}

loadGameHistory();

function resetGameHistory() {
  localStorage.removeItem("gameHistory"); // Elimina le statistiche dal localStorage
  
  // Svuota il contenuto del chart-container (grafici)
  const chartContainer = document.getElementById("chart-container");
  if (chartContainer) {
    chartContainer.innerHTML = ''; // Rimuove tutti i grafici e il contenuto
  }
  
  // Aggiorna l'interfaccia per visualizzare un messaggio
  const scoreMessage = document.getElementById("score-message");
  if (scoreMessage) {
    scoreMessage.innerHTML = "<p>Le statistiche sono state azzerate.</p>"; // Mostra un messaggio di conferma
  }

  // Se vuoi anche svuotare la lista storica
  const historyList = document.getElementById("history-list");
  if (historyList) {
    historyList.innerHTML = ''; // Rimuove gli elementi della lista storica
  }
}

document.getElementById("azzera-statistiche").addEventListener("click", () => {
  resetGameHistory();
});
