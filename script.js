// ------------------- GLOBAL VARIABLES -------------------
let currentRevisionQuestions = [];
let revisionIndex = 0;
let revisionSelectedAnswers = [];

let mockQuestions = [];
let mockIndex = 0;
let mockAnswers = [];
let timerInterval;
let timeRemaining = 57 * 60; // 57 minutes

// ------------------- TABS -------------------
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');

  // Load road signs if that tab is active
  if(tabId === 'roadSigns') showRoadSigns();
}

// ------------------- REVISION -------------------
function startRevision() {
  const category = document.getElementById('categorySelect').value;
  if(!category) return;

  currentRevisionQuestions = questionsBank.filter(q => q.category === category);
  revisionIndex = 0;
  revisionSelectedAnswers = Array(currentRevisionQuestions.length).fill(null);

  showRevisionQuestion();
}

function showRevisionQuestion() {
  if(revisionIndex >= currentRevisionQuestions.length) {
    document.getElementById('revisionQuestion').innerHTML = "<p>You have completed all revision questions for this category.</p>";
    return;
  }

  const q = currentRevisionQuestions[revisionIndex];
  let html = `<div class="question-card"><p><strong>Q${revisionIndex + 1}:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i)=>{
    let selectedClass = revisionSelectedAnswers[revisionIndex] === i ? 'selected' : '';
    html += `<button class="option ${selectedClass}" onclick="checkRevisionAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;
  document.getElementById('revisionQuestion').innerHTML = html;
}

function checkRevisionAnswer(selected) {
  const q = currentRevisionQuestions[revisionIndex];
  revisionSelectedAnswers[revisionIndex] = selected;

  const buttons = document.querySelectorAll('#revisionQuestion .option');
  buttons.forEach((btn,i)=>{
    btn.disabled = true;
    if(i === q.answer) btn.classList.add('correct');
    if(i === selected && i !== q.answer) btn.classList.add('incorrect');
  });

  revisionIndex++;
  setTimeout(showRevisionQuestion, 1500);
}

// ------------------- MOCK TEST -------------------
function startMockTestPage() {
  showTab('mockTest');
  startMockTest();
}

function startMockTest() {
  mockIndex = 0;
  timeRemaining = 57 * 60;
  mockAnswers = Array(50).fill(null);

  mockQuestions = shuffleArray([...questionsBank]).slice(0,50);

  document.getElementById('mockQuestion').innerHTML = '';
  document.getElementById('timer').textContent = 'Time Remaining: 57:00';
  document.getElementById('timer').classList.remove('hidden');
  document.getElementById('progressContainer').classList.remove('hidden');
  updateProgressBar();

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  showMockQuestion();
}

function updateTimer() {
  if(timeRemaining <= 0) {
    clearInterval(timerInterval);
    endMockTest();
    return;
  }
  timeRemaining--;
  let minutes = Math.floor(timeRemaining/60);
  let seconds = timeRemaining % 60;
  document.getElementById('timer').textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2,'0')}`;
}

function showMockQuestion() {
  const q = mockQuestions[mockIndex];
  const total = mockQuestions.length;

  let html = `<div class="question-card"><p><strong>Q${mockIndex + 1}/${total}:</strong> ${q.question}</p>`;
  q.options.forEach((opt,i)=>{
    let selectedClass = mockAnswers[mockIndex] === i ? 'selected' : '';
    html += `<button class="option ${selectedClass}" onclick="selectMockAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;

  html += `<div class="navigation-buttons">
    ${mockIndex > 0 ? `<button class="back-btn" onclick="previousQuestion()">Back</button>` : `<div></div>`}
    ${mockIndex < total - 1 ? `<button class="next-btn" id="nextBtn" onclick="nextQuestion()" disabled>Next</button>` : `<button class="finish-btn" id="nextBtn" onclick="confirmFinish()" disabled>Finish Test</button>`}
  </div>`;

  document.getElementById('mockQuestion').innerHTML = html;
  updateProgressBar();

  if(mockAnswers[mockIndex] !== null) {
    const nextBtn = document.getElementById('nextBtn');
    if(nextBtn) nextBtn.disabled = false;
  }
}

function selectMockAnswer(i) {
  mockAnswers[mockIndex] = i;

  const buttons = document.querySelectorAll('#mockQuestion .option');
  buttons.forEach((btn, idx)=>{
    btn.classList.remove('selected');
    if(idx === i) btn.classList.add('selected');
  });

  const nextBtn = document.getElementById('nextBtn');
  if(nextBtn) nextBtn.disabled = false;
}

function nextQuestion() {
  if(mockIndex < mockQuestions.length -1) {
    mockIndex++;
    showMockQuestion();
  }
}

function previousQuestion() {
  if(mockIndex > 0) {
    mockIndex--;
    showMockQuestion();
  }
}

function confirmFinish() {
  const popupHTML = `
    <div id="finishPopup" class="popup-overlay">
      <div class="popup-content">
        <p>Are you sure you want to finish the test? You can still go back and review your answers before submitting.</p>
        <div style="display:flex; justify-content:space-between; gap:10px; margin-top:15px;">
          <button onclick="closePopup()">Go Back</button>
          <button onclick="endMockTest()">Finish Test</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function closePopup() {
  const popup = document.getElementById('finishPopup');
  if(popup) popup.remove();
}

function endMockTest() {
  clearInterval(timerInterval);
  document.getElementById('timer').classList.add('hidden');
  document.getElementById('progressContainer').classList.add('hidden');

  let score = 0;
  let allQuestionsHTML = '';

  mockQuestions.forEach((q,i)=>{
    const user = mockAnswers[i];
    const isCorrect = user === q.answer;
    if(isCorrect) score++;

    allQuestionsHTML += `<div class="question-card ${isCorrect?'correct':'incorrect'}">
      <p><strong>Q${i+1}:</strong> ${q.question}</p>
      <p>Your answer: ${user!==null?q.options[user]:'<em>Not answered</em>'}</p>
      ${!isCorrect?`<p>Correct answer: ${q.options[q.answer]}</p>`:''}
    </div>`;
  });

  let passFail = score >= 43 
    ? "<p style='color:green; font-weight:bold;'>🎉 Pass!</p>" 
    : "<p style='color:red; font-weight:bold;'>❌ Fail</p>";

  let summaryHTML = `<div class="question-card"><p>You scored ${score} out of ${mockQuestions.length}.</p>${passFail}</div>` + allQuestionsHTML;

  document.getElementById('mockQuestion').innerHTML = summaryHTML;
  document.getElementById('progressBarFill').style.width = '100%';
  document.getElementById('progressText').textContent = 'Test Completed';
}

// ------------------- PROGRESS BAR -------------------
function updateProgressBar() {
  const total = mockQuestions.length;
  const percent = ((mockIndex+1)/total)*100;
  const fill = document.getElementById('progressBarFill');
  fill.style.width = percent+'%';
  document.getElementById('progressText').textContent = `Q${mockIndex+1}/${total}`;
}

// ------------------- UTILITY -------------------
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while(currentIndex !==0){
    randomIndex = Math.floor(Math.random()*currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ------------------- ROAD SIGNS DATA -------------------
const roadSignsData = [
  // Regulatory
  { category:"Regulatory", name:"Stop Sign", image:"images/stop-sign.png", description:"You must come to a complete stop and proceed only when safe." },
  { category:"Regulatory", name:"Yield Sign", image:"images/yield-sign.png", description:"Slow down and give way to traffic on the main road." },
  { category:"Regulatory", name:"No Entry", image:"images/no-entry.png", description:"Do not enter this road from your direction." },
  { category:"Regulatory", name:"Speed Limit 30", image:"images/speed-limit-30.png", description:"Maximum speed allowed is 30 mph." },
  { category:"Regulatory", name:"Speed Limit 50", image:"images/speed-limit-50.png", description:"Maximum speed allowed is 50 mph." },
  
  // Warning
  { category:"Warning", name:"Roundabout", image:"images/roundabout.png", description:"You must give way to traffic on your right." },
  { category:"Warning", name:"Pedestrian Crossing", image:"images/pedestrian-crossing.png", description:"Be prepared to stop for pedestrians crossing the road." },
  { category:"Warning", name:"Slippery Road", image:"images/slippery-road.png", description:"The road may be slippery when wet." },
  { category:"Warning", name:"Road Narrows", image:"images/road-narrows.png", description:"The road ahead narrows." },
  { category:"Warning", name:"Two-way Traffic", image:"images/two-way-traffic.png", description:"You are entering a road with two-way traffic." },

  // Informational
  { category:"Informational", name:"Hospital", image:"images/hospital.png", description:"Indicates a hospital nearby." },
  { category:"Informational", name:"Parking", image:"images/parking.png", description:"Parking available." },
  { category:"Informational", name:"Bus Stop", image:"images/bus-stop.png", description:"Indicates a bus stop." },
  { category:"Informational", name:"Motorway", image:"images/motorway.png", description:"Indicates motorway ahead." },
  { category:"Informational", name:"Bicycle Lane", image:"images/bicycle-lane.png", description:"Dedicated lane for bicycles." },

  // Temporary / Other
  { category:"Temporary", name:"Roadworks", image:"images/roadworks.png", description:"Temporary roadworks ahead." },
  { category:"Temporary", name:"Detour", image:"images/detour.png", description:"Follow the detour signs." },
  { category:"Temporary", name:"Temporary Speed Limit", image:"images/temp-speed-limit.png", description:"Temporary speed limit in force." },
  { category:"Temporary", name:"Falling Rocks", image:"images/falling-rocks.png", description:"Caution: falling rocks may be present." },
  { category:"Temporary", name:"School Zone", image:"images/school-zone.png", description:"Slow down; children may be present." }
];

// ------------------- DISPLAY ROAD SIGNS -------------------
function showRoadSigns() {
  const category = document.getElementById('roadSignCategory').value;
  const container = document.getElementById('roadSignsContainer');
  container.innerHTML = '';

  if (!category) return;

  const filteredSigns = roadSignsData.filter(sign => sign.category === category);

  filteredSigns.forEach(sign => {
    const card = document.createElement('div');
    card.className = 'road-sign-card';
    card.innerHTML = `
      <img src="${sign.image}" alt="${sign.name}" class="road-sign-img">
      <h4>${sign.name}</h4>
      <p>${sign.description}</p>
    `;
    container.appendChild(card);
  });
}
