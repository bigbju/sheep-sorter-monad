// === main.js ===

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sheepImages = [
  { src: "/assets/sheep1.png", type: "sheep-small" },
  { src: "/assets/sheep2.png", type: "sheep-big" },
  { src: "/assets/horse.png", type: "horse" },
  { src: "/assets/moyaki.png", type: "moyaki" },
  { src: "/assets/chog.png", type: "chog" },
  { src: "/assets/star.png", type: "star" }, // ⭐️ НОВЕ
  { src: "/assets/bomb.png", type: "bomb" }, // 💣 НОВЕ
];

let sheepArray = [];
let score = 0;
let level = 1;
let lives = 3;
let horseClickCount = 0;
let slowMotion = false;
let slowMotionTimer = 0;

const sounds = {
  hit: new Audio("/assets/hit.mp3"),
  miss: new Audio("/assets/miss.mp3"),
  explosion: new Audio("/assets/explosion.mp3"),
  star: new Audio("/assets/star.mp3")
};

class Sheep {
  constructor(image, type) {
    this.image = new Image();
    this.image.src = image;
    this.type = type;
    this.x = Math.random() * canvas.width;
    this.y = -100;
    this.size = 80 + Math.random() * 40;
    this.speed = slowMotion ? 1 + Math.random() * 1 : 2 + Math.random() * 2;
    this.clicked = false;
  }

  update() {
    this.y += this.speed;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}

function spawnSheep() {
  let random = Math.random();
  let img;
  if (random < 0.02) {
    img = sheepImages.find(s => s.type === "star");
  } else if (random < 0.07) {
    img = sheepImages.find(s => s.type === "bomb");
  } else {
    img = sheepImages[Math.floor(Math.random() * (sheepImages.length - 2))];
  }
  sheepArray.push(new Sheep(img.src, img.type));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sheepArray.forEach((sheep, index) => {
    sheep.update();
    sheep.draw();
    if (sheep.y > canvas.height && !sheep.clicked) {
      if (["sheep-small", "sheep-big", "horse", "star"].includes(sheep.type)) {
        lives--;
      }
      sheepArray.splice(index, 1);
    }
  });
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score} | Lives: ${lives} | Level: ${level}`, 20, 40);
}

function gameLoop() {
  draw();
  if (slowMotion) {
    slowMotionTimer--;
    if (slowMotionTimer <= 0) slowMotion = false;
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
setInterval(spawnSheep, 1000);

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for (let i = 0; i < sheepArray.length; i++) {
    const s = sheepArray[i];
    if (
      x >= s.x &&
      x <= s.x + s.size &&
      y >= s.y &&
      y <= s.y + s.size
    ) {
      processClick(s, i);
      return;
    }
  }
  sounds.miss.play();
});

function processClick(s, index) {
  if (s.clicked) return;
  s.clicked = true;
  switch (s.type) {
    case "sheep-small":
      score++;
      break;
    case "sheep-big":
      score += 2;
      slowMotion = true;
      slowMotionTimer = 300; // ~5 секунд при 60 FPS
      break;
    case "horse":
      score += 3;
      horseClickCount++;
      if (horseClickCount >= 5) {
        lives++;
        horseClickCount = 0;
      }
      break;
    case "star":
      score += 10;
      sounds.star.play();
      break;
    case "bomb":
      lives--;
      handleBombEffect(index);
      sounds.explosion.play();
      break;
    case "moyaki":
      score = Math.max(0, score - 1);
      break;
    case "chog":
      lives--;
      break;
  }
  level = Math.floor(score / 10) + 1;
  sheepArray.splice(index, 1);
  sounds.hit.play();
}

function handleBombEffect(centerIndex) {
  const targets = getObjectsNear(centerIndex);
  targets.forEach(i => {
    if (!sheepArray[i].clicked) {
      sheepArray[i].clicked = true;
      sheepArray.splice(i, 1);
    }
  });
}

function getObjectsNear(index) {
  let indices = [];
  for (let i = Math.max(0, index - 1); i <= Math.min(sheepArray.length - 1, index + 1); i++) {
    if (i !== index) indices.push(i);
  }
  return indices;
}

// === КІНЕЦЬ ===
