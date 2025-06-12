// main.js — адаптований для мобільних пристроїв з поясненнями

// 🎨 Створюємо canvas та додаємо до тіла сторінки
const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// 📐 Базовий розмір гри
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// 📱 Адаптивне масштабування canvas під розмір вікна
function resizeCanvas() {
  const scale = Math.min(
    window.innerWidth / GAME_WIDTH,
    window.innerHeight / GAME_HEIGHT
  );
  canvas.width = GAME_WIDTH * scale;
  canvas.height = GAME_HEIGHT * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 🐑 Масив зображень об'єктів (вівці, погані персонажі тощо)
const sheepImages = [
  { src: "assets/sheep-small.png", type: "sheep-small" },
  { src: "assets/sheep-big.png", type: "sheep-big" },
  { src: "assets/horse.png", type: "horse" },
  { src: "assets/chog.png", type: "bad" },
  { src: "assets/molandak.png", type: "bad" },
  { src: "assets/moyaki.png", type: "bad" }
];
const goodTypes = ["sheep-small", "sheep-big", "horse"];

// 🖼️ Завантаження фону та логотипів
const logo = new Image();
logo.src = "assets/monad-logo.png";

const gate = new Image();
gate.src = "assets/gate.png";

const background1 = new Image();
background1.src = "assets/grass.png";

const background2 = new Image();
background2.src = "assets/background3.png"; // Додай цей файл в assets

const background3 = new Image();
background3.src = "assets/background2.png"; // Додай цей файл в assets



// 🔊 Аудіо
const sounds = {
  correct: new Audio("assets/correct.mp3"),
  wrong: new Audio("assets/wrong.mp3"),
  click: new Audio("assets/click.mp3"),
  levelup: new Audio("assets/level-up.mp3")
};

// 🎮 Глобальні змінні стану гри
let score = 0;
let level = 1;
let lives = 3;
let sheepList = [];
let gateY = GAME_HEIGHT - 150;
let gameStarted = false;
let animationId;
let horseCollected = 0;
let slowMotion = false;
let slowMotionTimeout;
let paused = false; // 🆕 Пауза
let explosionEffects = [];
let goodExplosionEffects = [];

// 🐑 Функція створення нової вівці
function spawnSheep() {
  const imgData = sheepImages[Math.floor(Math.random() * sheepImages.length)];
  const img = new Image();
  img.src = imgData.src;
  let speed = 2 + Math.random() * 1 + level * 0.8;
  if (imgData.type === "sheep-big") {
    speed = 1 + level * 0.5;
  }
  if (slowMotion) speed *= 0.5;
  sheepList.push({
    img: img,
    x: Math.random() * (GAME_WIDTH - 80),
    y: -80,
    speed: speed,
    type: imgData.type
  });
}

setInterval(() => {
  if (lives > 0 && gameStarted && !paused) spawnSheep(); // 🛠 Зміна: додано !paused
}, Math.max(300, 2000 - level * 200));

// 🖱️ Обробка кліків
canvas.addEventListener("click", (e) => {
  if (!gameStarted || lives <= 0 || paused) return; // 🛠 Зміна: додано paused

  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / GAME_WIDTH;
  const x = (e.clientX - rect.left) / scale;
  const y = (e.clientY - rect.top) / scale;

  let clicked = false;
  for (let i = 0; i < sheepList.length; i++) {
    const s = sheepList[i];
    if (x >= s.x && x <= s.x + 80 && y >= s.y && y <= s.y + 80) {
      clicked = true;
      if (goodTypes.includes(s.type)) {
        if (s.type === "horse") {
          score += 3;
          horseCollected++;
          if (horseCollected % 5 === 0) lives++;
        } else if (s.type === "sheep-small") {
          score += 1;
        } else if (s.type === "sheep-big") {
          score += 1;
          slowMotion = true;
          clearTimeout(slowMotionTimeout);
          slowMotionTimeout = setTimeout(() => (slowMotion = false), 5000);
        }
        sounds.correct.play();
        if (score % 5 === 0) {
          level++;
          sounds.levelup.play();
        }
        goodExplosionEffects.push({
          x: s.x + 40,
          y: s.y + 40,
          radius: 10,
          alpha: 1,
          growthRate: 2
        });
      } else {
        lives--;
        sounds.wrong.play();
        explosionEffects.push({
          x: s.x + 40,
          y: s.y + 40,
          radius: 10,
          alpha: 1,
          growthRate: 2
        });
      }
      sheepList.splice(i, 1);
      break;
    }
  }
  if (!clicked) sounds.click.play();
});

function drawExplosion() {
  for (let i = explosionEffects.length - 1; i >= 0; i--) {
    const effect = explosionEffects[i];
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 0, 0, ${effect.alpha})`;
    ctx.fill();
    effect.radius += effect.growthRate;
    effect.alpha -= 0.05;
    if (effect.alpha <= 0) explosionEffects.splice(i, 1);
  }
}

function drawGoodExplosion() {
  for (let i = goodExplosionEffects.length - 1; i >= 0; i--) {
    const effect = goodExplosionEffects[i];
    ctx.beginPath();
    ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 255, 0, ${effect.alpha})`;
    ctx.fill();
    effect.radius += effect.growthRate;
    effect.alpha -= 0.05;
    if (effect.alpha <= 0) goodExplosionEffects.splice(i, 1);
  }
}

function updateLeaderboard(newScore) {
  const nameInput = document.getElementById("playerName");
  const playerName = nameInput.value.trim() || "Anonymous";
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  board.push({ name: playerName, score: newScore, date: new Date().toLocaleString() });
  const filtered = board
    .filter(entry => entry && typeof entry.score === 'number')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(filtered));
}

function drawLeaderboard() {
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 5;
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
  ctx.fillRect(GAME_WIDTH / 2 - 160, canvas.height / 2 - 200, 320, 40 + board.length * 30);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "purple";
  ctx.font = "18px Arial";
  ctx.fillText("Leaderboard:", GAME_WIDTH / 2 - 70, canvas.height / 2 - 170);

  if (board.length === 0) {
    ctx.fillText("No scores yet", GAME_WIDTH / 2 - 50, canvas.height / 2 - 140);
  }

  board.forEach((entry, index) => {
    if (entry && typeof entry.score === 'number') {
      ctx.fillText(`${index + 1}. ${entry.name || "Anon"}: ${entry.score} (${entry.date})`, GAME_WIDTH / 2 - 130, canvas.height / 2 - 140 + index * 30);
    }
  });
}

// 🧱 Вибір фону залежно від рівня
function getCurrentBackground() {
  if (level >= 3) return background3;
  if (level === 2) return background2;
  return background1;
}

// 🔁 Малювання кадру
function draw() {
  if (!gameStarted || paused) return; // 🛠 Додано перевірку gameStarted

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  ctx.drawImage(getCurrentBackground(), 0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.drawImage(gate, GAME_WIDTH / 2 - 100, gateY, 200, 100);

  for (let i = sheepList.length - 1; i >= 0; i--) {
    const s = sheepList[i];
    s.y += s.speed;
    ctx.drawImage(s.img, s.x, s.y, 80, 80);
    if (s.y > gateY + 80) {
      if (goodTypes.includes(s.type)) {
        lives--;
        sounds.wrong.play();
      }
      sheepList.splice(i, 1);
    }
  }

  drawExplosion();
  drawGoodExplosion();

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Level: ${level}`, 100, 30);
  ctx.fillText(`Lives: ${lives}`, 100, 60);
  ctx.fillText(`Score: ${score}`, 100, 90);
  ctx.drawImage(logo, 10, 10, 60, 60);

  if (lives <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", GAME_WIDTH / 2 - 130, canvas.height / 2 - 200);

    updateLeaderboard(score);
    drawLeaderboard();

    const leaderboardHeight = 40 + 5 * 30;
    const leaderboardBottom = (canvas.height / 2 - 200) + leaderboardHeight;
    const restartTop = leaderboardBottom + 40 + (window.innerHeight * 0.03); // 🛠 Зменшено адаптивний зсув до 3%
    const playerNameTop = restartTop + 45; // 🛠 Нова відстань 45px замість 70px

    // Додаємо 120px зсув лише для ПК (ширина > 600px)
    const isDesktop = window.innerWidth > 600;
    const additionalOffset = isDesktop ? 120 : 0;

    const restartBtn = document.getElementById("restartBtn");
    restartBtn.style.position = "absolute";
    restartBtn.style.top = `${((restartTop + additionalOffset) / window.innerHeight) * 100}vh`;
    restartBtn.style.left = "50%";
    restartBtn.style.transform = "translate(-50%, -50%)";
    restartBtn.style.width = "120px";
    restartBtn.style.height = "40px";
    restartBtn.style.padding = "0";
    restartBtn.style.fontSize = "16px";
    restartBtn.style.display = "block";

    const playerName = document.getElementById("playerName");
    playerName.style.position = "absolute";
    playerName.style.top = `${((playerNameTop + additionalOffset) / window.innerHeight) * 100}vh`;
    playerName.style.left = "50%";
    playerName.style.transform = "translate(-50%, -50%)";
    playerName.style.width = "120px";
    playerName.style.height = "40px";
    playerName.style.padding = "2px";
    playerName.style.fontSize = "16px";
    playerName.style.display = "block";

    pauseBtn.style.display = "none"; // 🛠 Приховуємо паузу на екрані Game Over
    cancelAnimationFrame(animationId);
  } else {
    animationId = requestAnimationFrame(draw);
  }
}

// ▶️ Старт гри
const startBtn = document.createElement("button");
startBtn.innerText = "Start Game";
startBtn.style.cssText = `
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  padding: 12px 24px;
  z-index: 10;
  display: block; // 🛠 Явно встановлюємо відображення
`;
document.body.appendChild(startBtn);
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  pauseBtn.style.display = "block"; // 🛠 Показуємо паузу після старту
  gameStarted = true;
  paused = false; // 🛠 Скидаємо паузу
  
  // Сховати інструкцію з index.html
  const instructions = document.getElementById("instructions");
  if (instructions) {
    instructions.style.display = "none";
  }

  draw();
});

// 🆕 Кнопка паузи
const pauseBtn = document.createElement("button");
pauseBtn.innerText = "⏸️ Pause";
pauseBtn.style.cssText = `
  position: absolute;
  top: 10px;
  right: 10px;
  width: 80px;
  height: 30px;
  font-size: 16px;
  padding: 0;
  z-index: 10;
  display: none; // 🛠 Приховуємо за замовчуванням
`;
document.body.appendChild(pauseBtn);
pauseBtn.addEventListener("click", () => {
  if (gameStarted && lives > 0) {
    paused = !paused;
    pauseBtn.innerText = paused ? "▶️ Resume" : "⏸️ Pause";
    if (!paused) draw(); // 🛠 Відновлюємо анімацію
  }
});

// ♻️ Рестарт
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", () => {
  score = 0;
  level = 1;
  lives = 3;
  horseCollected = 0;
  sheepList = [];
  slowMotion = false;
  clearTimeout(slowMotionTimeout);
  paused = false; // 🛠 Знімаємо паузу
  pauseBtn.innerText = "⏸️ Pause";
  pauseBtn.style.display = "block"; // 🛠 Показуємо паузу
  restartBtn.style.display = "none";
  document.getElementById("playerName").style.display = "none";
  gameStarted = true;
  draw();
});