
const SIZE = 4;
const TOTAL = SIZE * SIZE;

const imagePath = "images/sister1.jpg";

const puzzle = document.getElementById("puzzle");
const welcome = document.getElementById("welcome");
const game = document.getElementById("game");
const celebration = document.getElementById("celebration");
const music = document.getElementById("music");

let pieces = [];
let selected = null;
let moves = 0;
let seconds = 0;
let timer = null;
let started = false;
let completed = false;
let imageReady = false;
let dragged = null;

const photo = new Image();
photo.src = imagePath;

photo.onload = () => {
  imageReady = true;
  document.getElementById("previewImage").src = imagePath;
  document.getElementById("finalImage").src = imagePath;
};

photo.onerror = () => {
  document.getElementById("feedback").textContent =
    "Please add images/sister1.jpg first! 💗";
};

// START GAME
document.getElementById("startBtn").onclick = () => {
  if (!imageReady) {
    alert("Please add sister1.jpg inside your images folder!");
    return;
  }

  welcome.classList.add("hidden");
  game.classList.remove("hidden");

  music.pause();
  music.currentTime = 0;

  newGame();
};

// TIMER
function startTimer() {
  if (started || completed) return;

  started = true;

  timer = setInterval(() => {
    seconds++;

    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");

    document.getElementById("timer").textContent =
      `${min}:${sec}`;
  }, 1000);
}

// SHUFFLE
function newGame() {
  clearInterval(timer);
  timer = null;

  started = false;
  completed = false;
  selected = null;
  dragged = null;
  seconds = 0;
  moves = 0;

  music.pause();
  music.currentTime = 0;

  document.getElementById("timer").textContent = "00:00";
  document.getElementById("moves").textContent = "0";

  document.getElementById("feedback").textContent =
    "Let's put our memories together! 💕";

  celebration.classList.add("hidden");
  game.classList.remove("hidden");

  pieces = Array.from({ length: TOTAL }, (_, i) => i);

  // Shuffle pieces randomly
  for (let i = 0; i < 100; i++) {
    const a = Math.floor(Math.random() * TOTAL);
    const b = Math.floor(Math.random() * TOTAL);

    [pieces[a], pieces[b]] = [pieces[b], pieces[a]];
  }

  if (pieces.every((p, i) => p === i)) {
    [pieces[0], pieces[1]] = [pieces[1], pieces[0]];
  }

  renderPuzzle();
}

// DISPLAY PUZZLE
function renderPuzzle() {
  puzzle.innerHTML = "";

  pieces.forEach((piece, position) => {
    const tile = document.createElement("div");

    tile.className = "piece";

    const x = piece % SIZE;
    const y = Math.floor(piece / SIZE);

    tile.style.backgroundImage = `url("${imagePath}")`;
    tile.style.backgroundSize = "400% 400%";

    tile.style.backgroundPosition =
      `${x * 100 / 3}% ${y * 100 / 3}%`;

    if (piece === position) {
      tile.classList.add("correct");
    }

    tile.draggable = true;

    // TAP TO SELECT
    tile.addEventListener("click", () => {
      selectPiece(position, tile);
    });

    // DRAG ON DESKTOP
    tile.addEventListener("dragstart", () => {
      if (completed) return;

      dragged = position;
      startTimer();
    });

    tile.addEventListener("dragover", e => {
      e.preventDefault();
    });

    tile.addEventListener("drop", e => {
      e.preventDefault();

      if (dragged !== null) {
        swapPieces(dragged, position);
        dragged = null;
      }
    });

    puzzle.appendChild(tile);
  });
}

// TAP TWO PIECES TO SWAP
function selectPiece(position, tile) {
  if (completed) return;

  startTimer();

  if (selected === null) {
    selected = position;
    tile.classList.add("selected");
    return;
  }

  if (selected === position) {
    selected = null;
    renderPuzzle();
    return;
  }

  swapPieces(selected, position);
}

// SWAP PIECES
function swapPieces(a, b) {
  if (completed || a === null || a === b) {
    selected = null;
    return;
  }

  [pieces[a], pieces[b]] = [pieces[b], pieces[a]];

  selected = null;
  moves++;

  document.getElementById("moves").textContent = moves;

  renderPuzzle();
  checkWin();
}

// CHECK IF PUZZLE IS COMPLETE
function checkWin() {
  const won = pieces.every((piece, index) => piece === index);

  if (!won) {
    document.getElementById("feedback").textContent =
      "You're doing amazing, Sisso! 💗";
    return;
  }

  completed = true;

  clearInterval(timer);

  // SHOW BIRTHDAY SURPRISE
  game.classList.add("hidden");
  celebration.classList.remove("hidden");

  document.getElementById("finalImage").src = imagePath;

  // CONFETTI
  confetti();

  // PLAY MUSIC AUTOMATICALLY AFTER SOLVING
  music.currentTime = 0;
  music.loop = true;

  music.play()
    .then(() => {
      document.getElementById("musicBtn").textContent =
        "⏸ Pause Birthday Song";
    })
    .catch(() => {
      document.getElementById("musicBtn").textContent =
        "▶ Tap to Play Birthday Song";
    });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// BACKUP MUSIC BUTTON
document.getElementById("musicBtn").onclick = async () => {
  if (music.paused) {
    try {
      await music.play();

      document.getElementById("musicBtn").textContent =
        "⏸ Pause Birthday Song";
    } catch (error) {
      alert("Please check that birthday.mp3 is in your music folder.");
    }
  } else {
    music.pause();

    document.getElementById("musicBtn").textContent =
      "▶ Play Birthday Song";
  }
};

// RESTART
document.getElementById("shuffleBtn").onclick = newGame;
document.getElementById("againBtn").onclick = newGame;

// CONFETTI AND HEARTS
function confetti() {
  const symbols = ["💗", "💕", "✨", "🌸", "🎀", "🦋", "🎉"];

  for (let i = 0; i < 65; i++) {
    const item = document.createElement("div");

    item.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    item.style.position = "fixed";
    item.style.left = Math.random() * 100 + "vw";
    item.style.top = "-30px";
    item.style.fontSize = "24px";
    item.style.zIndex = "20";
    item.style.pointerEvents = "none";
    item.style.transition =
      `transform ${2 + Math.random() * 3}s linear, opacity 3s`;

    document.body.appendChild(item);

    requestAnimationFrame(() => {
      item.style.transform =
        `translateY(${window.innerHeight + 100}px) rotate(720deg)`;
      item.style.opacity = "0";
    });

    setTimeout(() => item.remove(), 5500);
  }
}

// FLOATING HEART BACKGROUND
const heartSymbols = ["♡", "💗", "💕", "✨", "🌸"];

setInterval(() => {
  const heart = document.createElement("div");

  heart.className = "heart";

  heart.textContent =
    heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration =
    (5 + Math.random() * 5) + "s";

  heart.style.fontSize =
    (15 + Math.random() * 20) + "px";

  document.getElementById("hearts").appendChild(heart);

  setTimeout(() => heart.remove(), 10000);
}, 800);
