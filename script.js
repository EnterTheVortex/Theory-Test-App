// ------------------- TAB NAVIGATION -------------------
function showTab(tabId, event) {
  // Hide all tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.add("hidden");
  });

  // Show selected tab
  document.getElementById(tabId).classList.remove("hidden");

  // Remove active from all nav buttons
  document.querySelectorAll(".header-nav button, nav button").forEach(btn => {
    btn.classList.remove("active");
  });

  // Add active to clicked button
  if (event) {
    event.target.classList.add("active");
  }
}

// ------------------- HAZARD PERCEPTION -------------------
const hazardClips = [
  { src: "videos/hazard1.mp4", hazardStart: 18, hazardEnd: 23 },
  { src: "videos/hazard2.mp4", hazardStart: 18, hazardEnd: 23 },
  { src: "videos/hazard3.mp4", hazardStart: 18, hazardEnd: 23 }
];

let currentHazardIndex = 0;
let hazardScore = 0;
let hazardClicks = [];
let clipScore = 0; // best score for current clip

// Anti-spam / pattern detection settings
const MAX_CLICKS_IN_WINDOW = 5;
const CLICK_WINDOW_MS = 2000;
const MAX_OUTSIDE_HAZARD = 3;

function setupHazardPerception() {
  currentHazardIndex = 0;
  hazardScore = 0;
  hazardClicks = [];
  clipScore = 0;
  loadHazardClip();
}

function loadHazardClip() {
  if (currentHazardIndex >= hazardClips.length) {
    showHazardSummary();
    return;
  }

  hazardClicks = [];
  clipScore = 0;
  const clip = hazardClips[currentHazardIndex];
  const container = document.getElementById("hazardContainer");

  container.innerHTML = `
    <video id="hazardVideo" width="640" height="360" controls>
      <source src="${clip.src}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <p>Click when you see a developing hazard!</p>
    <button id="hazardClickBtn" onclick="registerHazardClick()">Click Hazard</button>
    <div id="flagContainer" style="position: relative; width: 100%; height: 20px; margin-top: 10px; background: #eee; border-radius: 5px; overflow: hidden;"></div>
    <p id="clickWarning" style="color:red; font-weight:bold; display:none;"></p>
    <p id="clickCounter">Clicks: 0</p>
  `;
}

function registerHazardClick() {
  const video = document.getElementById("hazardVideo");
  const warning = document.getElementById("clickWarning");
  const counter = document.getElementById("clickCounter");
  const flagContainer = document.getElementById("flagContainer");
  if (!video) return;

  const time = video.currentTime;
  const now = Date.now();

  hazardClicks.push({ videoTime: time, timestamp: now });
  counter.textContent = `Clicks: ${hazardClicks.length}`;

  const clip = hazardClips[currentHazardIndex];

  // Rapid clicks detection
  const recentClicks = hazardClicks.filter(c => now - c.timestamp <= CLICK_WINDOW_MS);
  if (recentClicks.length > MAX_CLICKS_IN_WINDOW) {
    warning.textContent = "Too many rapid clicks! Restarting clip...";
    warning.style.display = "block";
    hazardClicks = [];
    clipScore = 0;
    video.currentTime = 0;
    video.play();
    setTimeout(() => warning.style.display = "none", 2000);
    return;
  }

  // Suspicious clicks outside hazard window
  const outsideHazardClicks = hazardClicks.filter(c => c.videoTime < clip.hazardStart || c.videoTime > clip.hazardEnd).length;
  if (outsideHazardClicks > MAX_OUTSIDE_HAZARD) {
    warning.textContent = "Suspicious click pattern detected! Restarting clip...";
    warning.style.display = "block";
    hazardClicks = [];
    clipScore = 0;
    video.currentTime = 0;
    video.play();
    setTimeout(() => warning.style.display = "none", 2000);
    return;
  }

  // Add red flag to timeline
  const flag = document.createElement("div");
  flag.style.position = "absolute";
  flag.style.left = `${(time / video.duration) * 100}%`;
  flag.style.top = "0";
  flag.style.width = "2px";
  flag.style.height = "100%";
  flag.style.background = "red";
  flagContainer.appendChild(flag);

  // Award points based on time zone
  let points = 0;
  if (time >= 18 && time < 19) points = 5;
  else if (time >= 19 && time < 20) points = 4;
  else if (time >= 20 && time < 21) points = 3;
  else if (time >= 21 && time < 22) points = 2;
  else if (time >= 22 && time < 23) points = 1;

  // Keep only the best score for this clip
  if (points > clipScore) {
    clipScore = points;
  }
}

// Called when video ends — lock in clip score
function endClipScoring() {
  hazardScore += clipScore;

  const container = document.getElementById("hazardContainer");
  container.innerHTML = `
    <div class="question-card">
      <p>Clip ${currentHazardIndex + 1} finished!</p>
      <p>Your score for this clip: <strong>${clipScore}/5</strong></p>
      <button onclick="nextHazardClip()">Next Clip</button>
    </div>
  `;
}

function nextHazardClip() {
  currentHazardIndex++;
  loadHazardClip();
}

function showHazardSummary() {
  const container = document.getElementById("hazardContainer");
  container.innerHTML = `
    <div class="question-card">
      <h3>Hazard Perception Summary</h3>
      <p>Total Score: ${hazardScore} out of ${hazardClips.length * 5}</p>
      <p>Clips completed: ${hazardClips.length}</p>
    </div>
  `;
}

// ----------------- MOBILE NAVIGATION -----------------
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".header-nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
});
