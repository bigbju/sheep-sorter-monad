import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractABI.js";

async function submitScoreToBlockchain(score) {
  if (typeof window.ethereum === "undefined") {
    console.warn("🦊 MetaMask не встановлений");
    return;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.submitScore(score);
    console.log("⏳ Транзакція створена:", tx.hash);
    await tx.wait();
    console.log("✅ Транзакція завершена:", tx.hash);
  } catch (error) {
    console.error("❌ Помилка при відправці score в блокчейн:", error);
  }
}

async function fetchLeaderboardFromBlockchain(ctx) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const leaderboard = await contract.getTopPlayers();

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(200, 150, 400, 200);
    ctx.fillStyle = "purple";
    ctx.font = "18px Arial";
    ctx.fillText("🏆 Leaderboard:", 300, 180);

    leaderboard.forEach((entry, i) => {
      const shortAddress = `${entry.player.slice(0, 6)}...${entry.player.slice(-4)}`;
      ctx.fillText(`${i + 1}. ${shortAddress}: ${entry.score.toString()}`, 220, 210 + i * 30);
    });
  } catch (error) {
    console.error("❌ Не вдалося отримати лідерборд з блокчейну:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const connectWalletBtn = document.getElementById("connectWalletBtn");
  connectWalletBtn.addEventListener("click", async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask не встановлено. Встанови його з https://metamask.io/");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];
      connectWalletBtn.innerText = `✅ ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
      connectWalletBtn.disabled = true;
    } catch (err) {
      console.error("❌ Підключення MetaMask скасовано або помилка:", err);
    }
  });

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;
  function resizeCanvas() {
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    canvas.width = GAME_WIDTH * scale;
    canvas.height = GAME_HEIGHT * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const logo = new Image(); logo.src = "/assets/monad-logo.png";
  const gate = new Image(); gate.src = "/assets/gate.png";
  const background1 = new Image(); background1.src = "/assets/grass.png";
  const background2 = new Image(); background2.src = "/assets/background2.png";
  const background3 = new Image(); background3.src = "/assets/background3.png";

  const sheepImages = [
    { src: "/assets/sheep-small.png", type: "sheep-small" },
    { src: "/assets/sheep-big.png", type: "sheep-big" },
    { src: "/assets/horse.png", type: "horse" },
    { src: "/assets/chog.png", type: "bad" },
    { src: "/assets/molandak.png", type: "bad" },
    { src: "/assets/moyaki.png", type: "bad" }
  ];
  const goodTypes = ["sheep-small", "sheep-big", "horse"];

  const sounds = {
    correct: new Audio("/assets/correct.mp3"),
    wrong: new Audio("/assets/wrong.mp3"),
    click: new Audio("/assets/click.mp3"),
    levelup: new Audio("/assets/level-up.mp3"),
  };

  let score = 0, level = 1, lives = 3, horseCollected = 0;
  let sheepList = [], explosionEffects = [], goodExplosionEffects = [];
  let slowMotion = false, slowMotionTimeout;
  let gameStarted = false, paused = false;
  const gateY = GAME_HEIGHT - 150;
  let animationId;

  function spawnSheep() {
    const imgData = sheepImages[Math.floor(Math.random() * sheepImages.length)];
    const img = new Image(); img.src = imgData.src;
    let speed = 2 + Math.random() + level * 0.8;
    if (imgData.type === "sheep-big") speed = 1 + level * 0.5;
    if (slowMotion) speed *= 0.5;
    sheepList.push({ img, x: Math.random() * (GAME_WIDTH - 80), y: -80, speed, type: imgData.type });
  }

  setInterval(() => {
    if (gameStarted && lives > 0 && !paused) spawnSheep();
  }, Math.max(300, 2000 - level * 200));

  canvas.addEventListener("click", e => {
    if (!gameStarted || lives <= 0 || paused) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / GAME_WIDTH;
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleX;
    let hit = false;
    sheepList.forEach((s, i) => {
      if (!hit && x >= s.x && x <= s.x + 80 && y >= s.y && y <= s.y + 80) {
        hit = true;
        processClick(s, i);
      }
    });
    if (!hit) sounds.click.play();
  });

  function processClick(s, idx) {
    if (goodTypes.includes(s.type)) {
      if (s.type === "horse") {
        score += 3; horseCollected++;
        if (horseCollected % 5 === 0) lives++;
      } else if (s.type === "sheep-small") score++;
      else if (s.type === "sheep-big") {
        score++;
        slowMotion = true;
        clearTimeout(slowMotionTimeout);
        slowMotionTimeout = setTimeout(() => slowMotion = false, 5000);
      }
      sounds.correct.play();
      if (score % 5 === 0) sounds.levelup.play();
      goodExplosionEffects.push({ x: s.x + 40, y: s.y + 40, radius: 10, alpha: 1, growthRate: 2 });
    } else {
      lives--;
      sounds.wrong.play();
      explosionEffects.push({ x: s.x + 40, y: s.y + 40, radius: 10, alpha: 1, growthRate: 2 });
    }
    sheepList.splice(idx, 1);
  }

  function drawEffects(arr, color) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const ef = arr[i];
      ctx.beginPath();
      ctx.arc(ef.x, ef.y, ef.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${color},${ef.alpha})`;
      ctx.fill();
      ef.radius += ef.growthRate;
      ef.alpha -= 0.05;
      if (ef.alpha <= 0) arr.splice(i, 1);
    }
  }

  function getBackground() {
    if (level >= 3) return background3;
    if (level === 2) return background2;
    return background1;
  }

  function draw() {
    if (!gameStarted || paused) return;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(getBackground(), 0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(gate, GAME_WIDTH / 2 - 100, gateY, 200, 100);
    sheepList.forEach((s, i) => {
      s.y += s.speed;
      ctx.drawImage(s.img, s.x, s.y, 80, 80);
      if (s.y > gateY + 80) {
        if (goodTypes.includes(s.type)) {
          lives--; sounds.wrong.play();
        }
        sheepList.splice(i, 1);
      }
    });
    drawEffects(explosionEffects, "255,0,0");
    drawEffects(goodExplosionEffects, "0,255,0");
    ctx.fillStyle = "black"; ctx.font = "20px Arial";
    ctx.fillText(`Level: ${level}`, 100, 30);
    ctx.fillText(`Lives: ${lives}`, 100, 60);
    ctx.fillText(`Score: ${score}`, 100, 90);
    ctx.drawImage(logo, 10, 10, 60, 60);

    if (lives <= 0) {
      ctx.fillStyle = "red"; ctx.font = "40px Arial";
      ctx.fillText("GAME OVER", 250, 200);
      submitScoreToBlockchain(score);
      fetchLeaderboardFromBlockchain(ctx); // ✅ передаємо ctx
      document.getElementById("restartBtn").style.display = "block";
      cancelAnimationFrame(animationId);
      return;
    }

    animationId = requestAnimationFrame(draw);
  }

  const startBtn = document.getElementById("restartBtn");
  const startGameBtn = document.getElementById("startGameBtn");

  startGameBtn.addEventListener("click", () => {
    startGameBtn.style.display = "none";
    document.getElementById("instructions").style.display = "none";
    gameStarted = true;
    draw();
  });

  startBtn.addEventListener("click", () => {
    score = 0; level = 1; lives = 3; horseCollected = 0;
    sheepList = []; explosionEffects = []; goodExplosionEffects = [];
    paused = false;
    startBtn.style.display = "none";
    gameStarted = true;
    document.getElementById("instructions").style.display = "none";
    draw();
  });

  document.getElementById("instructions").addEventListener("click", () => {
    document.getElementById("instructions").style.display = "none";
    gameStarted = true;
    draw();
  });

  const pauseBtn = document.createElement("button");
  pauseBtn.innerText = "⏸️ Pause";
  pauseBtn.style.cssText = "position:absolute; top:10px; right:10px; z-index:10;";
  document.body.appendChild(pauseBtn);
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.innerText = paused ? "▶️ Resume" : "⏸️ Pause";
    if (!paused) draw();
  });
});
