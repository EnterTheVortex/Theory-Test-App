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
          <button onclick="endMockTest(true)">Finish Test</button>
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

function endMockTest(fromPopup = false) {
  clearInterval(timerInterval);

  // Remove popup if coming from Finish Test button
  if(fromPopup) closePopup();

  document.getElementById('timer').classList.add('hidden');
  document.getElementById('progressContainer').classList.add('hidden');

  let score = 0;
  let allQuestionsHTML = '';

  mockQuestions.forEach((q,i)=>{
    const user = mockAnswers[i];
    const isCorrect = user === q.answer;
    if(isCorrect) score++;

    allQuestionsHTML += `<div class="question-card ${isCorrect?'correct':'incorrect'}" style="color:black;">
      <p><strong>Q${i+1}:</strong> ${q.question}</p>
      <p>Your answer: ${user!==null?q.options[user]:'<em>Not answered</em>'}</p>
      ${!isCorrect?`<p>Correct answer: ${q.options[q.answer]}</p>`:''}
    </div>`;
  });

  let passFail = score >= 43 
    ? "<p style='color:green; font-weight:bold;'>🎉 Pass!</p>" 
    : "<p style='color:red; font-weight:bold;'>❌ Fail</p>";

  let summaryHTML = `<div class="question-card" style="color:black;"><p>You scored ${score} out of ${mockQuestions.length}.</p>${passFail}</div>` + allQuestionsHTML;

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

// ------------------- ROAD SIGNS DATA (FULLY UPDATED) -------------------
const roadSignsData = [
  // ---------------- Regulatory ----------------
  { name: "No U-Turn", image: "images/no-u-turn.png", description: "U-turns are prohibited.", category: "Regulatory" },
  { name: "No Overtaking", image: "images/no-overtaking.png", description: "Overtaking is prohibited.", category: "Regulatory" },
  { name: "No Motor Vehicles", image: "images/no-motor-vehicles.png", description: "Motor vehicles are not allowed.", category: "Regulatory" },
  { name: "No Parking", image: "images/no-parking.png", description: "Parking is prohibited.", category: "Regulatory" },
  { name: "No Waiting", image: "images/no-waiting.png", description: "Waiting is prohibited.", category: "Regulatory" },
  { name: "One Way Traffic", image: "images/one-way.png", description: "Traffic must travel in the indicated direction.", category: "Regulatory" },
  { name: "No Heavy Goods Vehicles", image: "images/no-hgv.png", description: "Heavy goods vehicles are prohibited.", category: "Regulatory" },
  { name: "National Speed Limit", image: "images/national-speed-limit.png", description: "Default speed limit applies: 60 mph on single carriageways, 70 mph on dual carriageways and motorways.", category: "Regulatory" },
  { name: "End of Speed Limit", image: "images/end-of-speed-limit.png", description: "Previous speed limit restriction has ended; follow the national speed limit.", category: "Regulatory" },
  { name: "Minimum Speed Limit", image: "images/minimum-speed-limit.png", description: "Vehicles must travel at or above the stated minimum speed.", category: "Regulatory" },
  { name: "Speed Limit 10 mph", image: "images/speed-limit-10.png", description: "Maximum speed allowed is 10 mph.", category: "Regulatory" },
  { name: "Speed Limit 20 mph", image: "images/speed-limit-20.png", description: "Maximum speed allowed is 20 mph.", category: "Regulatory" },
  { name: "Speed Limit 30 mph", image: "images/speed-limit-30.png", description: "Maximum speed allowed is 30 mph.", category: "Regulatory" },
  { name: "Speed Limit 40 mph", image: "images/speed-limit-40.png", description: "Maximum speed allowed is 40 mph.", category: "Regulatory" },
  { name: "Speed Limit 50 mph", image: "images/speed-limit-50.png", description: "Maximum speed allowed is 50 mph.", category: "Regulatory" },
  { name: "Speed Limit 60 mph", image: "images/speed-limit-60.png", description: "Maximum speed allowed is 60 mph.", category: "Regulatory" },
  { name: "Speed Limit 70 mph", image: "images/speed-limit-70.png", description: "Maximum speed allowed is 70 mph.", category: "Regulatory" },
  { name: "Height Limit", image: "images/height-limit.png", description: "Vehicles over the indicated height are prohibited.", category: "Regulatory" },
  { name: "Width Limit", image: "images/width-limit.png", description: "Vehicles over the indicated width are prohibited.", category: "Regulatory" },
  { name: "Length Limit", image: "images/length-limit.png", description: "Vehicles over the indicated length are prohibited.", category: "Regulatory" },
  { name: "Weight Limit", image: "images/weight-limit.png", description: "Vehicles over the indicated weight are prohibited.", category: "Regulatory" },
  { name: "No Horn", image: "images/no-horn.png", description: "Use of horns is prohibited in this area.", category: "Regulatory" },
  { name: "No Stopping", image: "images/no-stopping.png", description: "Stopping is prohibited at all times.", category: "Regulatory" },
  { name: "No Bicycles", image: "images/no-bicycles.png", description: "Bicycles are prohibited on this road.", category: "Regulatory" },

  // ---------------- Warning ----------------
  { name: "Slippery Road", image: "images/slippery-road.png", description: "Road may be slippery when wet.", category: "Warning" },
  { name: "Road Narrows", image: "images/road-narrows.png", description: "The road ahead narrows.", category: "Warning" },
  { name: "Steep Hill", image: "images/steep-hill.png", description: "Steep descent or ascent ahead.", category: "Warning" },
  { name: "Pedestrian Crossing Ahead", image: "images/pedestrian-crossing.png", description: "Watch for pedestrians crossing.", category: "Warning" },
  { name: "Children Crossing", image: "images/children-crossing.png", description: "Children may be crossing the road.", category: "Warning" },
  { name: "Traffic Signals Ahead", image: "images/traffic-signals-ahead.png", description: "Traffic lights are ahead.", category: "Warning" },
  { name: "Roadworks", image: "images/roadworks.png", description: "Roadworks ahead; slow down.", category: "Warning" },
  { name: "Falling Rocks", image: "images/falling-rocks.png", description: "Beware of falling rocks.", category: "Warning" },
  { name: "Slopes / Inclines", image: "images/slopes.png", description: "Steep slopes may affect vehicle control.", category: "Warning" },

  // ---------------- Informational ----------------
  { name: "Hospital Ahead", image: "images/hospital.png", description: "Hospital nearby; keep noise low.", category: "Informational" },
  { name: "Parking Area", image: "images/parking-area.png", description: "Parking facilities available.", category: "Informational" },
  { name: "Motorway Start", image: "images/motorway-start.png", description: "Start of motorway; follow motorway rules.", category: "Informational" },
  { name: "Motorway End", image: "images/motorway-end.png", description: "End of motorway; normal rules apply.", category: "Informational" },
  { name: "Bus Lane", image: "images/bus-lane.png", description: "Lane reserved for buses and taxis.", category: "Informational" },
  { name: "Cycle Lane", image: "images/cycle-lane.png", description: "Lane reserved for cyclists.", category: "Informational" },
  { name: "One Way Street Info", image: "images/one-way-info.png", description: "Indicates one-way street information.", category: "Informational" },

  // ---------------- Temporary / Other ----------------
  { name: "Temporary Diversion", image: "images/temporary-diversion.png", description: "Temporary diversion; follow directions.", category: "Temporary" },
  { name: "Temporary Roadworks", image: "images/temporary-roadworks.png", description: "Temporary roadworks ahead.", category: "Temporary" },
  { name: "Temporary Speed Limit", image: "images/temporary-speed-limit.png", description: "Temporary speed restriction in effect.", category: "Temporary" },
  { name: "Temporary Pedestrian Crossing", image: "images/temporary-ped-crossing.png", description: "Temporary pedestrian crossing in use.", category: "Temporary" },
  { name: "Temporary Lane Closure", image: "images/temporary-lane-closure.png", description: "One or more lanes closed temporarily.", category: "Temporary" },
  { name: "Temporary Narrow Road", image: "images/temporary-narrow-road.png", description: "Road narrows temporarily; drive carefully.", category: "Temporary" },
  { name: "Temporary Traffic Lights", image: "images/temporary-traffic-lights.png", description: "Temporary traffic lights ahead.", category: "Temporary" }
];

// ------------------- DISPLAY ROAD SIGNS -------------------
function showRoadSigns() {
  const category = document.getElementById('roadSignCategory').value;
  const container = document.getElementById('roadSignsContainer');
  container.innerHTML = '';

  if (!category) return;

  const filteredSigns = roadSignsData.filter(sign => sign.category === category);

  if (filteredSigns.length === 0) {
    container.innerHTML = "<p>No road signs available for this category.</p>";
    return;
  }

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
