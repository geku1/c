const textScene = document.getElementById("textScene");
const flashScene = document.getElementById("flashScene");
const eyeScene = document.getElementById("eyeScene");
const particles = document.getElementById("particles");

function showScene(scene) {
  [textScene, flashScene, eyeScene].forEach(s => s.classList.remove("active"));
  scene.classList.add("active");
}

function createSpark() {
  const spark = document.createElement("span");
  spark.className = "spark";

  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight * 0.55 + Math.random() * window.innerHeight * 0.25;
  const size = Math.random() * 4 + 2;
  const duration = Math.random() * 1.8 + 1.4;

  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.width = `${size}px`;
  spark.style.height = `${size}px`;
  spark.style.animationDuration = `${duration}s`;

  const hueType = Math.floor(Math.random() * 4);
  let glow = "rgba(255,255,255,0.95)";
  let shadow = "rgba(77,226,255,0.5)";

  if (hueType === 1) {
    glow = "rgba(77,226,255,0.95)";
    shadow = "rgba(77,226,255,0.65)";
  } else if (hueType === 2) {
    glow = "rgba(157,92,255,0.95)";
    shadow = "rgba(157,92,255,0.65)";
  } else if (hueType === 3) {
    glow = "rgba(255,79,216,0.95)";
    shadow = "rgba(255,79,216,0.65)";
  }

  spark.style.background = glow;
  spark.style.boxShadow = `0 0 10px ${glow}, 0 0 20px ${shadow}`;

  particles.appendChild(spark);

  setTimeout(() => {
    spark.remove();
  }, duration * 1000);
}

let sparkInterval;

function startParticles() {
  stopParticles();
  sparkInterval = setInterval(() => {
    for (let i = 0; i < 4; i++) {
      createSpark();
    }
  }, 140);
}

function stopParticles() {
  if (sparkInterval) clearInterval(sparkInterval);
}

function runSequence() {
  // 1) Frase
  showScene(textScene);

  setTimeout(() => {
    // 2) Flash / transición
    showScene(flashScene);
  }, 2800);

  setTimeout(() => {
    // 3) Ojo
    showScene(eyeScene);
    startParticles();
  }, 3800);

  setTimeout(() => {
    stopParticles();
    runSequence();
  }, 9000);
}

runSequence();
