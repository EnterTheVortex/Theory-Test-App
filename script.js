// ----------------- GLOBAL VARIABLES -----------------
let currentTab = 'home';
let revisionCategory = '';
let revisionQuestions = [];
let revisionIndex = 0;

let mockQuestions = [];
let mockIndex = 0;
let mockScore = 0;
let mockTimer;
let mockTimeRemaining = 57 * 60; // 57 minutes

let hazardVideos = [];
let hazardClicks = [];
let hazardResults = [];

// ----------------- NAVIGATION & TABS -----------------
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.classList.add('hidden');
  });
  document.getElementById(tabName).classList.remove('hidden');

  // Update active nav button state
  const navButtons = document.querySelectorAll('header .header-nav button');
  navButtons.forEach(btn => {
    if (btn.textContent === tabName.replace(/([A-Z])/g, ' $1').trim()) {
      btn.classList.add('active-tab');
    } else {
      btn.classList.remove('active-tab');
    }
  });

  currentTab = tabName;
}

// ----------------- HAMBURGER MENU -----------------
function toggleMenu() {
  const nav = document.querySelector('.header-nav');
  nav.classList.toggle('show');
}

// ----------------- REVISION -----------------
function startRevision() {
  const select = document.getElementById('categorySelect');
  revisionCategory = select.value;
  if (!revisionCategory) return;

  revisionQuestions = questionsData.filter(q => q.category === revisionCategory);
  revisionIndex = 0;
  renderRevisionQuestion();
}

function renderRevisionQuestion() {
  const container = document.getElementById('revisionQuestion');
  container.innerHTML = '';

  if (revisionIndex >= revisionQuestions.length) {
    container.innerHTML = `<p>You've completed all questions in this category!</p>`;
    return;
  }

  const q = revisionQuestions[revisionIndex];
  const card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML = `<p><strong>Q${revisionIndex + 1}:</strong> ${q.question}</p>`;

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option';
    btn.onclick = () => checkRevisionAnswer(opt);
    card.appendChild(btn);
  });

  container.appendChild(card);
}

function checkRevisionAnswer(selected) {
  const q = revisionQuestions[revisionIndex];
  const container = document.getElementById('revisionQuestion');
  const buttons = container.querySelectorAll('button.option');

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === q.answer) btn.classList.add('correct');
    if (btn.textContent === selected && selected !== q.answer) btn.classList.add('incorrect');
  });

  revisionIndex++;
  setTimeout(renderRevisionQuestion, 1000);
}

// ----------------- MOCK TEST -----------------
function startMockTestPage() {
  mockQuestions = [...questionsData].sort(() => 0.5 - Math.random()).slice(0, 50);
  mockIndex = 0;
  mockScore = 0;
  mockTimeRemaining = 57 * 60;
  showTab('mockTest');
  renderMockQuestion();
  startMockTimer();
}

function renderMockQuestion() {
  const container = document.getElementById('mockQuestion');
  container.innerHTML = '';

  if (mockIndex >= mockQuestions.length) {
    endMockTest();
    return;
  }

  const q = mockQuestions[mockIndex];
  const card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML = `<p><strong>Q${mockIndex + 1}:</strong> ${q.question}</p>`;

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option';
    btn.onclick = () => selectMockAnswer(opt);
    card.appendChild(btn);
  });

  container.appendChild(card);

  // Update progress
  document.getElementById('progressText').textContent = `Q${mockIndex + 1}/50`;
  document.getElementById('progressBarFill').style.width = `${((mockIndex)/50)*100}%`;
}

function selectMockAnswer(selected) {
  const q = mockQuestions[mockIndex];
  if (selected === q.answer) mockScore++;
  mockIndex++;
  renderMockQuestion();
}

function startMockTimer() {
  clearInterval(mockTimer);
  mockTimer = setInterval(() => {
    mockTimeRemaining--;
    const minutes = Math.floor(mockTimeRemaining / 60);
    const seconds = mockTimeRemaining % 60;
    document.getElementById('timer').textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2,'0')}`;

    if (mockTimeRemaining <= 0) {
      clearInterval(mockTimer);
      endMockTest();
    }
  }, 1000);
}

function endMockTest() {
  clearInterval(mockTimer);
  showTab('summary');
  const scoreText = document.getElementById('scoreText');
  const passFailText = document.getElementById('passFailText');

  scoreText.textContent = `You answered ${mockScore}/50 questions correctly`;
  passFailText.textContent = mockScore >= 43 ? 'Pass' : 'Fail';
  passFailText.className = mockScore >= 43 ? 'pass' : 'fail';

  renderSummaryQuestions();
}

function renderSummaryQuestions() {
  const container = document.getElementById('summaryQuestions');
  container.innerHTML = '';
  mockQuestions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question-card';
    div.innerHTML = `<p><strong>Q${i+1}:</strong> ${q.question}</p>
                     <p><strong>Answer:</strong> ${q.answer}</p>`;
    container.appendChild(div);
  });
}

// ----------------- ROAD SIGNS -----------------
function showRoadSigns() {
  const container = document.getElementById('roadSignsContainer');
  const category = document.getElementById('roadSignCategory').value;
  container.innerHTML = '';

  let signs = roadSignsData;
  if (category) signs = signs.filter(sign => sign.category === category);

  signs.forEach(sign => {
    const card = document.createElement('div');
    card.className = 'road-sign-card';
    card.innerHTML = `<img src="${sign.image}" alt="${sign.name}">
                      <h4>${sign.name}</h4>
                      <p>${sign.description}</p>`;
    container.appendChild(card);
  });
}

// ----------------- HAZARD PERCEPTION -----------------
function loadHazardVideos() {
  const container = document.getElementById('hazardContainer');
  container.innerHTML = '';
  hazardVideos.forEach((vidSrc, idx) => {
    const videoDiv = document.createElement('div');
    videoDiv.className = 'hazard-video-wrapper';
    videoDiv.style.position = 'relative';

    const video = document.createElement('video');
    video.src = vidSrc;
    video.controls = true;
    video.autoplay = false;
    videoDiv.appendChild(video);

    const clickButton = document.createElement('button');
    clickButton.textContent = 'Click Hazard';
    clickButton.onclick = () => registerHazardClick(idx);
    videoDiv.appendChild(clickButton);

    const flag = document.createElement('div');
    flag.className = 'hazard-flag';
    flag.style.position = 'absolute';
    flag.style.bottom = '0';
    flag.style.left = '0';
    flag.style.width = '0%';
    flag.style.height = '6px';
    flag.style.background = 'red';
    videoDiv.appendChild(flag);

    container.appendChild(videoDiv);
  });
}

function registerHazardClick(index) {
  if (!hazardClicks[index]) hazardClicks[index] = [];
  const videoDiv = document.getElementsByClassName('hazard-video-wrapper')[index];
  const video = videoDiv.querySelector('video');
  const flag = videoDiv.querySelector('.hazard-flag');

  const clickTime = video.currentTime;
  hazardClicks[index].push(clickTime);

  // Animate the red flag across bottom proportionally
  const percent = (clickTime / video.duration) * 100;
  const newFlag = document.createElement('div');
  newFlag.style.position = 'absolute';
  newFlag.style.bottom = '0';
  newFlag.style.left = `${percent}%`;
  newFlag.style.width = '2px';
  newFlag.style.height = '100%';
  newFlag.style.background = 'red';
  videoDiv.appendChild(newFlag);
}

// ----------------- INITIAL SETUP -----------------
document.addEventListener('DOMContentLoaded', () => {
  // Load hazard videos if any
  hazardVideos = [
    'videos/hazard1.mp4',
    'videos/hazard2.mp4'
  ];
  loadHazardVideos();
});
