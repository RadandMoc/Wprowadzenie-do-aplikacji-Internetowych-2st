// Uzyskaj dostęp do elementów canvas
const bgCanvas = document.getElementById("backgroundCanvas");
const bgContext = bgCanvas.getContext("2d");

const gameAreaCanvas = document.getElementById("gameCanvas");
const gameAreaContext = gameAreaCanvas.getContext("2d");

const interfaceCanvas = document.getElementById("uiCanvas");
const uiContext = interfaceCanvas.getContext("2d");

// Ustawienia rozmiarów canvasów
bgCanvas.width = gameAreaCanvas.width = interfaceCanvas.width = window.innerWidth;
bgCanvas.height = gameAreaCanvas.height = interfaceCanvas.height = window.innerHeight;

// Parametry gry
const fullLives = 3; // Maksymalna liczba żyć
let currentLives = fullLives;
let currentScore = 0;
let activeZombies = [];
let activeBullets = [];
const maxZombiesOnScreen = 10; // Maksymalna liczba zombie na ekranie
const maxZombiesPerFrame = 2; // Maksymalna liczba nowych zombie na każdą klatkę
const zombieSpriteCount = 10; // Liczba klatek w arkuszu animacji
let zombieSpriteWidth = 0; // Szerokość jednej klatki
let currentZombieSprite = 0;
let animationCounter = 0;

let gameLoopId; // ID pętli gry do anulowania
let gameIsOver = false; // Flaga zakończenia gry

// Ilość obrazków do załadowania
let imagesPending = 5;

function onAssetLoaded() {
  imagesPending--;
  if (imagesPending === 0) {
    // Wszystkie zasoby załadowane, można uruchomić grę
    updateUI();
    startGameLoop();
  }
}

// Ładowanie obrazów
const fullHeartIcon = new Image();
fullHeartIcon.src = "images/full_heart.png";
fullHeartIcon.onload = onAssetLoaded;

const emptyHeartIcon = new Image();
emptyHeartIcon.src = "images/empty_heart.png";
emptyHeartIcon.onload = onAssetLoaded;

const zombieSprite = new Image();
zombieSprite.src = "images/walkingdead.png"; // Arkusz animacji zombie
zombieSprite.onload = () => {
  zombieSpriteWidth = zombieSprite.width / zombieSpriteCount;
  onAssetLoaded();
};

const crosshairIcon = new Image();
crosshairIcon.src = "images/aim.png";
crosshairIcon.onload = onAssetLoaded;

const backgroundImage = new Image();
backgroundImage.src = "images/board-bg.jpg";
backgroundImage.onload = () => {
  bgContext.drawImage(backgroundImage, 0, 0, bgCanvas.width, bgCanvas.height);
  onAssetLoaded();
};

// Muzyka
// Music by <a href="https://pixabay.com/pl/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=143149">Universfield</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=143149">Pixabay</a>
//const gameOverMusic = new Audio("music/sad_music.mp3");
const gameOverMusic = new Audio("music/sad-music.mp3"); // muzyka z zajec

// Celownik
const crosshair = { x: gameAreaCanvas.width / 2, y: gameAreaCanvas.height / 2 };

// Zdarzenie: Ruch myszki i strzelanie
gameAreaCanvas.addEventListener("mousemove", (event) => {
  if (gameIsOver) return;

  gameAreaContext.clearRect(crosshair.x - 100, crosshair.y - 100, 200, 200);

  crosshair.x = event.clientX;
  crosshair.y = event.clientY;

  drawCrosshair();
});

gameAreaCanvas.addEventListener("click", () => {
  if (gameIsOver) return;

  const bullet = { x: crosshair.x, y: crosshair.y, timeFired: Date.now() };

  let hitTarget = false;
  activeZombies.forEach((zombie, zombieIdx) => {
    if (bullet.x > zombie.x && bullet.x < zombie.x + zombie.width &&
        bullet.y > zombie.y && bullet.y < zombie.y + zombie.height) {
      currentScore += 20;
      activeZombies.splice(zombieIdx, 1);
      updateUI();
      hitTarget = true;
    }
  });

  if (!hitTarget) {
    currentScore -= 5;
    if (currentScore < 0) currentScore = 0;
    updateUI();
    activeBullets.push(bullet); // Dodaj pocisk, jeśli nietrafiony
  }
});

// Funkcja generująca nowe zombie
function spawnZombies() {
  if (activeZombies.length < maxZombiesOnScreen) {
    const zombiesToSpawn = Math.floor(Math.random() * maxZombiesPerFrame);
    for (let i = 0; i < zombiesToSpawn; i++) {
      const size = Math.random() * 50 + 60; // Losowy rozmiar zombie
      activeZombies.push({
        x: gameAreaCanvas.width,
        y: Math.random() * (gameAreaCanvas.height - 100),
        width: size,
        height: size,
        speed: (Math.random() * 2 + 1) * (2 / 3), // Losowa prędkość
      });
    }
  }
}

// Funkcja poruszania się zombie
function moveZombies() {
  activeZombies.forEach((zombie) => {
    zombie.x -= zombie.speed;
    if (zombie.x + zombie.width < 0) {
      currentLives--;
      if (currentLives < 0) currentLives = 0;
      updateUI();
      activeZombies = activeZombies.filter((z) => z !== zombie);
    }
  });
}

// Funkcja animacji zombie
function renderZombie(zombie) {
  animationCounter++;
  if (animationCounter % 30 === 0) {
    currentZombieSprite = (currentZombieSprite + 1) % zombieSpriteCount;
  }

  gameAreaContext.drawImage(
    zombieSprite,
    currentZombieSprite * zombieSpriteWidth,
    0,
    zombieSpriteWidth,
    zombieSprite.height,
    zombie.x,
    zombie.y,
    zombie.width,
    zombie.height
  );
}

// Funkcja rysująca celownik
function drawCrosshair() {
  gameAreaContext.drawImage(crosshairIcon, crosshair.x - 100, crosshair.y - 100, 200, 200);
}

// Funkcja do aktualizacji interfejsu
function updateUI() {
  uiContext.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);

  // Wyświetl wynik
  uiContext.font = "30px Arial";
  uiContext.fillStyle = "white";
  uiContext.textAlign = "right";
  uiContext.fillText(`Score: ${currentScore}`, interfaceCanvas.width - 20, 40);

  // Rysuj serca
  for (let i = 0; i < fullLives; i++) {
    const heartImage = i < currentLives ? fullHeartIcon : emptyHeartIcon;
    uiContext.drawImage(heartImage, 20 + i * 40, 30, 30, 30);
  }
}

// Funkcja rysująca wszystkie elementy gry
function renderGame() {
  gameAreaContext.clearRect(0, 0, gameAreaCanvas.width, gameAreaCanvas.height);

  activeZombies.forEach(renderZombie);

  const currentTime = Date.now();
  for (let i = activeBullets.length - 1; i >= 0; i--) {
    const bullet = activeBullets[i];
    if (currentTime - bullet.timeFired > 5000) {
      activeBullets.splice(i, 1);
      continue;
    }
    gameAreaContext.beginPath();
    gameAreaContext.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    gameAreaContext.fillStyle = "red";
    gameAreaContext.fill();
  }

  drawCrosshair();
}

function startGameLoop() {
  if (currentLives <= 0) {
    endGame();
    return;
  }

  moveZombies();
  spawnZombies();
  renderGame();

  gameLoopId = requestAnimationFrame(startGameLoop);
}

function endGame() {
  gameIsOver = true;
  cancelAnimationFrame(gameLoopId);

  uiContext.fillStyle = "rgba(0, 0, 0, 0.7)";
  uiContext.fillRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);

  uiContext.font = "50px Arial";
  uiContext.fillStyle = "white";
  uiContext.textAlign = "center";
  uiContext.fillText("Game Over", interfaceCanvas.width / 2, interfaceCanvas.height / 2);

  uiContext.font = "30px Arial";
  uiContext.fillText(
    `Your Score: ${currentScore}`, // Wyświetl wynik punktowy gracza
    interfaceCanvas.width / 2,
    interfaceCanvas.height / 2 + 50
  );

  // Informacja o ponownym uruchomieniu gry
  uiContext.fillText(
    "Click to Restart",
    interfaceCanvas.width / 2,
    interfaceCanvas.height / 2 + 100
  );

  interfaceCanvas.style.pointerEvents = "auto";
  interfaceCanvas.addEventListener("click", restartGame, { once: true });

  gameOverMusic.play();
}

function restartGame() {
  interfaceCanvas.removeEventListener("click", restartGame);

  currentLives = fullLives;
  currentScore = 0;
  activeZombies = [];
  activeBullets = [];
  currentZombieSprite = 0;
  animationCounter = 0;
  gameIsOver = false;

  uiContext.clearRect(0, 0, interfaceCanvas.width, interfaceCanvas.height);
  gameAreaContext.clearRect(0, 0, gameAreaCanvas.width, gameAreaCanvas.height);
  interfaceCanvas.style.pointerEvents = "none";

  gameOverMusic.pause();
  gameOverMusic.currentTime = 0;

  updateUI();
  startGameLoop();
}
