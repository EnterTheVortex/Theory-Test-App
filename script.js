// ------------------- GLOBAL VARIABLES -------------------
let currentRevisionQuestions = [];
let revisionIndex = 0;
let revisionSelectedAnswers = [];

let mockQuestions = [];
let mockIndex = 0;
let mockAnswers = [];
let timerInterval;
let timeRemaining = 57 * 60; // 57 minutes

// ------------------- NAV & TABS -------------------
function showTab(tabId, ev) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  const target = document.getElementById(tabId);
  if (target) target.classList.remove('hidden');
  const navButtons = document.querySelectorAll('.header-nav button');
  navButtons.forEach(b => b.classList.remove('active'));
  if (ev && ev.currentTarget) ev.currentTarget.classList.add('active');
  const nav = document.querySelector('.header-nav');
  if (nav) nav.classList.remove('show');
  if (tabId === 'roadSigns') showRoadSigns();
  if (tabId === 'hazardPerception') setupHazardPerception();
}

function toggleMenu() {
  const nav = document.querySelector('.header-nav');
  if (nav) nav.classList.toggle('show');
}

// ------------------- ANSWER RANDOMISATION -------------------
function withShuffledOptions(q) {
  const idxs = q.options.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  const displayOptions = idxs.map(i => q.options[i]);
  const displayAnswerIndex = idxs.indexOf(q.answer);
  return { ...q, displayOptions, displayAnswerIndex };
}

// ------------------- REVISION -------------------
function startRevision() {
  const category = document.getElementById('categorySelect').value;
  if (!category) return;
  currentRevisionQuestions = questionsBank.filter(q => q.category === category).map(withShuffledOptions);
  revisionIndex = 0;
  revisionSelectedAnswers = Array(currentRevisionQuestions.length).fill(null);
  showRevisionQuestion();
}

function showRevisionQuestion() {
  if (revisionIndex >= currentRevisionQuestions.length) {
    document.getElementById('revisionQuestion').innerHTML =
      "<div class='question-card'><p>You have completed all revision questions for this category.</p></div>";
    return;
  }
  const q = currentRevisionQuestions[revisionIndex];
  let html = `<div class="question-card"><p><strong>Q${revisionIndex + 1}:</strong> ${q.question}</p>`;
  q.displayOptions.forEach((opt, i) => {
    const selectedClass = revisionSelectedAnswers[revisionIndex] === i ? 'selected' : '';
    html += `<button class="option ${selectedClass}" onclick="checkRevisionAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;
  document.getElementById('revisionQuestion').innerHTML = html;
}

function checkRevisionAnswer(selected) {
  const q = currentRevisionQuestions[revisionIndex];
  revisionSelectedAnswers[revisionIndex] = selected;
  document.querySelectorAll('#revisionQuestion .option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.displayAnswerIndex) btn.classList.add('correct');
    if (i === selected && i !== q.displayAnswerIndex) btn.classList.add('incorrect');
  });
  revisionIndex++;
  setTimeout(showRevisionQuestion, 1500);
}

// ------------------- MOCK TEST -------------------
function startMockTestPage() { showTab('mockTest'); startMockTest(); }

function startMockTest() {
  mockIndex = 0;
  timeRemaining = 57*60;
  mockAnswers = Array(50).fill(null);
  mockQuestions = shuffleArray([...questionsBank]).slice(0,50).map(withShuffledOptions);
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
  if (timeRemaining <= 0) { clearInterval(timerInterval); endMockTest(); return; }
  timeRemaining--;
  const minutes = Math.floor(timeRemaining/60);
  const seconds = timeRemaining%60;
  document.getElementById('timer').textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2,'0')}`;
}

function showMockQuestion() {
  const q = mockQuestions[mockIndex];
  const total = mockQuestions.length;
  let html = `<div class="question-card"><p><strong>Q${mockIndex+1}/${total}:</strong> ${q.question}</p>`;
  q.displayOptions.forEach((opt,i)=>{
    const selectedClass = mockAnswers[mockIndex]===i?'selected':'';
    html += `<button class="option ${selectedClass}" onclick="selectMockAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;
  html += `<div class="navigation-buttons">
    ${mockIndex>0?`<button class="back-btn" onclick="previousQuestion()">Back</button>`:`<div></div>`}
    ${mockIndex<total-1
      ? `<button class="next-btn" id="nextBtn" onclick="nextQuestion()" disabled>Next</button>`
      : `<button class="finish-btn" id="nextBtn" onclick="confirmFinish()" disabled>Finish Test</button>`}
  </div>`;
  document.getElementById('mockQuestion').innerHTML = html;
  updateProgressBar();
  if (mockAnswers[mockIndex]!==null) {
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = false;
  }
}

function selectMockAnswer(i) {
  mockAnswers[mockIndex] = i;
  document.querySelectorAll('#mockQuestion .option').forEach((btn,idx)=>{btn.classList.remove('selected'); if(idx===i) btn.classList.add('selected');});
  const nextBtn = document.getElementById('nextBtn');
  if(nextBtn) nextBtn.disabled = false;
}

function nextQuestion(){ if(mockIndex<mockQuestions.length-1){mockIndex++; showMockQuestion();} }
function previousQuestion(){ if(mockIndex>0){mockIndex--; showMockQuestion();} }

function confirmFinish(){
  const popupHTML = `<div id="finishPopup" class="popup-overlay"><div class="popup-content">
    <p>Are you sure you want to finish the test? You can still go back and review your answers before submitting.</p>
    <div style="display:flex; justify-content:space-between; gap:10px; margin-top:15px;">
      <button onclick="closePopup()">Go Back</button>
      <button onclick="endMockTest()">Finish Test</button>
    </div>
  </div></div>`;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function closePopup(){ const popup=document.getElementById('finishPopup'); if(popup) popup.remove(); }

function endMockTest(){
  closePopup();
  clearInterval(timerInterval);
  document.getElementById('timer').classList.add('hidden');
  document.getElementById('progressContainer').classList.add('hidden');
  let score=0;
  mockQuestions.forEach((q,i)=>{ if(mockAnswers[i]===q.displayAnswerIndex) score++; });
  const scoreText=document.getElementById('scoreText');
  const passFailText=document.getElementById('passFailText');
  const summaryQuestions=document.getElementById('summaryQuestions');
  scoreText.textContent=`You answered ${score}/${mockQuestions.length} questions correctly`;
  passFailText.textContent=score>=43?'Pass':'Fail';
  passFailText.style.color=score>=43?'green':'red';
  passFailText.style.fontSize='1.3rem';
  passFailText.style.fontWeight='700';
  let questionsHTML='';
  mockQuestions.forEach((q,i)=>{
    const user=mockAnswers[i];
    const isCorrect=user===q.displayAnswerIndex;
    questionsHTML+=`<div class="question-card">
      <p><strong>Q${i+1}:</strong> ${q.question}</p>
      <p class="${isCorrect?'correct':'incorrect'}">Your answer: ${user!==null?q.displayOptions[user]:'<em>Not answered</em>'}</p>
      <p class="correct">Correct answer: ${q.displayOptions[q.displayAnswerIndex]}</p>
    </div>`;
  });
  summaryQuestions.innerHTML=questionsHTML;
  showTab('summary');
  const pbFill=document.getElementById('progressBarFill'); if(pbFill) pbFill.style.width='100%';
  const pbText=document.getElementById('progressText'); if(pbText) pbText.textContent='Test Completed';
}

function updateProgressBar() {
  const total = mockQuestions.length || 50;
  const percent = total ? ((mockIndex+1)/total)*100 : 0;
  const fill = document.getElementById('progressBarFill');
  if (fill) fill.style.width = percent+'%';
  const text = document.getElementById('progressText');
  if (text) text.textContent=`Q${Math.min(mockIndex+1,total)}/${total}`;
}

function shuffleArray(array){ let currentIndex=array.length,randomIndex; while(currentIndex!==0){ randomI

// ------------------- ROAD SIGNS DATA (FULLY UPDATED + COMPLETE) -------------------
const roadSignsData = [
  // ---------------- Regulatory ----------------

  // --- Access / Vehicle Type Restrictions ---
  { name: "Permit Holders Only", image: "images/permit-holders.png", description: "Only vehicles with a valid permit may enter.", category: "Regulatory" },
  { name: "Cycles Only", image: "images/cycles-only.png", description: "Only bicycles may use this route.", category: "Regulatory" },
  { name: "Buses and Cycles Only", image: "images/buses-cycles.png", description: "Only buses and bicycles are permitted in this lane.", category: "Regulatory" },
  { name: "No Motor Vehicles", image: "images/no-motor-vehicles.png", description: "Motor vehicles are prohibited.", category: "Regulatory" },
  { name: "No Motor Vehicles Except Solo Motorcycles", image: "images/no-motor-except-bike.png", description: "Only solo motorcycles allowed; all other motor vehicles prohibited.", category: "Regulatory" },
  { name: "No Pedestrians", image: "images/no-pedestrians.png", description: "Pedestrians are not allowed on this road.", category: "Regulatory" },
  { name: "No Ridden or Accompanied Horses", image: "images/no-horses.png", description: "Ridden or accompanied horses are prohibited.", category: "Regulatory" },
  { name: "No Solo Motorcycles", image: "images/no-solo-motorcycles.png", description: "Solo motorcycles are prohibited.", category: "Regulatory" },
  { name: "No Towed Caravans", image: "images/no-towed-caravans.png", description: "Towed caravans are not permitted.", category: "Regulatory" },
  { name: "No Articulated Vehicles", image: "images/no-articulated-vehicles.png", description: "Articulated vehicles (trucks with trailers) are prohibited.", category: "Regulatory" },
  { name: "No Horse Drawn Vehicles", image: "images/no-horse-drawn.png", description: "Horse drawn vehicles are prohibited.", category: "Regulatory" },
  { name: "No Vehicles Over Max Weight Shown", image: "images/no-vehicles-over-weight.png", description: "Vehicles exceeding maximum weight are prohibited.", category: "Regulatory" },
  { name: "No Vehicles Over Max Length Shown", image: "images/no-vehicles-over-length.png", description: "Vehicles exceeding maximum length are prohibited.", category: "Regulatory" },
  { name: "No Vehicle Over Max Height", image: "images/no-vehicles-over-height.png", description: "Vehicles exceeding the maximum height are prohibited.", category: "Regulatory" },
  { name: "No Through Road", image: "images/no-through-road.png", description: "No through traffic; dead end ahead.", category: "Regulatory" },

  // --- Turn / Direction / Lane Controls ---
  { name: "One Way Traffic", image: "images/one-way.png", description: "Traffic must travel in the indicated direction.", category: "Regulatory" },
  { name: "Pass Either Side for Same Destination", image: "images/pass-either-side.png", description: "Vehicles may pass on either side to reach same destination.", category: "Regulatory" },
  { name: "Proceed Left", image: "images/proceed-left.png", description: "Vehicles must proceed left.", category: "Regulatory" },
  { name: "Proceed Right", image: "images/proceed-right.png", description: "Vehicles must proceed right.", category: "Regulatory" },
  { name: "Right Turn Only", image: "images/right-turn-only.png", description: "Only right turns allowed.", category: "Regulatory" },
  { name: "Left Turn Only", image: "images/left-turn-only.png", description: "Only left turns allowed.", category: "Regulatory" },
  { name: "No Left Turn", image: "images/no-left-turn.png", description: "Left turns are prohibited at this junction.", category: "Regulatory" },
  { name: "No Right Turn", image: "images/no-right-turn.png", description: "Right turns are prohibited at this junction.", category: "Regulatory" },

  // --- Priority / Give Way / Stop ---
  { name: "Priority Over Oncoming Traffic", image: "images/priority-oncoming.png", description: "You have priority over oncoming vehicles.", category: "Regulatory" },
  { name: "Give Way", image: "images/give-way.png", description: "Give way to traffic on the major road; slow down and prepare to stop if necessary.", category: "Regulatory" },
  { name: "Give Way to Oncoming Traffic", image: "images/give-way-oncoming.png", description: "You must give way to oncoming vehicles.", category: "Regulatory" },
  { name: "Stop", image: "images/stop.png", description: "Stop completely at the line and give way.", category: "Regulatory" },

  // --- Speed / Minimum / Maximum / Enforcement ---
  { name: "Minimum Speed 30mph", image: "images/min-speed-30.png", description: "Vehicles must travel at or above 30 mph.", category: "Regulatory" },
  { name: "Minimum Speed 40mph", image: "images/min-speed-40.png", description: "Vehicles must travel at or above 40 mph.", category: "Regulatory" },
  { name: "End of Minimum Speed 30", image: "images/end-min-speed-30.png", description: "Minimum speed of 30 mph has ended.", category: "Regulatory" },
  { name: "End of Minimum Speed 40", image: "images/end-min-speed-40.png", description: "Minimum speed of 40 mph has ended.", category: "Regulatory" },
  { name: "End of 20mph, Start of 30", image: "images/end-20-start-30.png", description: "Speed limit changes from 20 mph to 30 mph.", category: "Regulatory" },
  { name: "Average Speed Check", image: "images/average-speed-check.png", description: "Average speed of vehicles monitored over a distance; obey speed limits.", category: "Regulatory" },

  // --- Miscellaneous / Other Restrictions ---
  { name: "No Stopping", image: "images/no-stopping.png", description: "Stopping is prohibited at all times.", category: "Regulatory" },
  { name: "No Waiting", image: "images/no-waiting.png", description: "Waiting or parking is prohibited.", category: "Regulatory" },

  // ---------------- Warning ----------------

  // --- Road Layout / Geometry Hazards ---
  { name: "Road Narrows on Both Sides", image: "images/road-narrows-both.png", description: "Road narrows ahead on both sides.", category: "Warning" },
  { name: "Road Narrows on Left", image: "images/road-narrows-left.png", description: "Road narrows ahead on the left side.", category: "Warning" },
  { name: "Road Narrows on Right", image: "images/road-narrows-right.png", description: "Road narrows ahead on the right side.", category: "Warning" },
  { name: "Dual Carriageway Ends", image: "images/dual-carriageway-ends.png", description: "Dual carriageway ends; single carriageway ahead.", category: "Warning" },
  { name: "Mini Roundabout", image: "images/mini-roundabout.png", description: "A small roundabout ahead.", category: "Warning" },
  { name: "Roundabout Ahead", image: "images/roundabout-ahead.png", description: "Roundabout ahead; prepare to give way.", category: "Warning" },
  { name: "Bend to the Left", image: "images/bend-left.png", description: "Road bends to the left ahead.", category: "Warning" },
  { name: "Bend to the Right", image: "images/bend-right.png", description: "Road bends to the right ahead.", category: "Warning" },
  { name: "Double Bend", image: "images/double-bend.png", description: "Double bend ahead; first to left, then right.", category: "Warning" },
  { name: "Sharp Deviation Left", image: "images/sharp-left.png", description: "Road sharply deviates to the left ahead.", category: "Warning" },
  { name: "Sharp Deviation Right", image: "images/sharp-right.png", description: "Road sharply deviates to the right ahead.", category: "Warning" },
  { name: "Junction on Bend", image: "images/junction-bend.png", description: "Junction on a bend ahead; reduce speed.", category: "Warning" },
  { name: "Crossroads", image: "images/crossroads.png", description: "Crossroads junction ahead.", category: "Warning" },
  { name: "T Junction with Priority Over Traffic on Right", image: "images/t-junction-priority.png", description: "T junction ahead; you have priority over traffic on the right.", category: "Warning" },
  { name: "Staggered Junction", image: "images/staggered-junction.png", description: "Two junctions slightly offset ahead.", category: "Warning" },
  { name: "Distance to Give Way Line Ahead", image: "images/distance-give-way.png", description: "Distance to the upcoming give way line.", category: "Warning" },
  { name: "Distance to Stop Sign Again", image: "images/distance-stop.png", description: "Distance to the next stop sign.", category: "Warning" },
  { name: "Hidden Dip", image: "images/hidden-dip.png", description: "Road dips ahead which may obscure visibility.", category: "Warning" },

  // --- Surface / Driving Conditions ---
  { name: "Slippery Road", image: "images/slippery-road.png", description: "Road may be slippery when wet.", category: "Warning" },
  { name: "Uneven Road", image: "images/uneven-road.png", description: "Road surface is uneven; drive with caution.", category: "Warning" },
  { name: "Loose Chippings", image: "images/loose-chippings.png", description: "Loose chippings on road; reduce speed.", category: "Warning" },
  { name: "Soft Verges", image: "images/soft-verges.png", description: "Soft verges may cause vehicles to sink; drive carefully.", category: "Warning" },
  { name: "Humps for Distance Shown", image: "images/humps-distance.png", description: "Road humps ahead; distance shown on sign.", category: "Warning" },
  { name: "Risk of Grounding", image: "images/risk-grounding.png", description: "Vehicles may scrape on uneven surface; proceed carefully.", category: "Warning" },

  // --- Traffic / Vehicle Hazards ---
  { name: "Traffic Merging from the Left Ahead", image: "images/merge-left.png", description: "Traffic will merge from the left.", category: "Warning" },
  { name: "Two Way Traffic Straight Ahead", image: "images/two-way-straight.png", description: "Two-way traffic ahead on the same road.", category: "Warning" },
  { name: "Two Way Traffic Crossing One Way Road", image: "images/two-way-crossing.png", description: "Two-way traffic crosses one-way road ahead.", category: "Warning" },
  { name: "Traffic Signals Ahead", image: "images/traffic-signals.png", description: "Traffic lights ahead; be prepared to stop.", category: "Warning" },
  { name: "Traffic Signals Not in Use", image: "images/traffic-signals-off.png", description: "Traffic lights ahead are not in use.", category: "Warning" },
  { name: "Countdown Markers to Exit on Motorway", image: "images/motorway-exit-countdown.png", description: "Countdown markers to upcoming exit on motorway.", category: "Warning" },

  // --- Level Crossings / Bridges / Tunnels ---
  { name: "Level Crossing without Barrier", image: "images/level-crossing-no-barrier.png", description: "Level crossing ahead with no barrier or gate.", category: "Warning" },
  { name: "Level Crossing with Barrier", image: "images/level-crossing-barrier.png", description: "Level crossing ahead with barrier.", category: "Warning" },
  { name: "Light Signals Ahead at Level Crossing", image: "images/level-crossing-lights.png", description: "Light signals at level crossing ahead.", category: "Warning" },
  { name: "Opening or Swing Bridge Ahead", image: "images/swing-bridge.png", description: "Bridge ahead may open or swing; proceed with caution.", category: "Warning" },
  { name: "Hump Bridge", image: "images/hump-bridge.png", description: "Bridge has a hump; reduce speed.", category: "Warning" },
  { name: "Tunnel Ahead", image: "images/tunnel.png", description: "Tunnel ahead; switch on headlights.", category: "Warning" },

  // --- Pedestrian / Animal / Cycle Hazards ---
  { name: "Segregated Pedal Cycle and Pedestrian Route", image: "images/segregated-cycle.png", description: "Separate lanes for cyclists and pedestrians.", category: "Warning" },
  { name: "Cycle Route Ahead", image: "images/cycle-route.png", description: "Indicates a cycle route ahead.", category: "Warning" },
  { name: "Zebra Crossing", image: "images/zebra-crossing.png", description: "Pedestrian crossing ahead; give way to pedestrians.", category: "Warning" },
  { name: "Pedestrians in Road Ahead", image: "images/pedestrians-road.png", description: "Watch for pedestrians walking on the road.", category: "Warning" },
  { name: "Frail Pedestrians", image: "images/frail-pedestrians.png", description: "Frail or elderly pedestrians may be crossing.", category: "Warning" },
  { name: "Cattle", image: "images/cattle.png", description: "Cattle may be on the road; proceed with caution.", category: "Warning" },
  { name: "Wild Animals", image: "images/wild-animals.png", description: "Wild animals may be on the road; reduce speed.", category: "Warning" },

  // --- Environmental / Other Hazards ---
  { name: "Falling or Fallen Rocks", image: "images/falling-rocks.png", description: "Beware of falling or fallen rocks on the road.", category: "Warning" },
  { name: "Quayside or River Bank", image: "images/quayside.png", description: "Road runs alongside a quayside or river bank.", category: "Warning" },
  { name: "Risk of Ice", image: "images/risk-ice.png", description: "Road may be icy; drive carefully.", category: "Warning" },
  { name: "Side Winds", image: "images/side-winds.png", description: "Strong side winds may affect vehicle control.", category: "Warning" },
  { name: "Tourist Attraction", image: "images/tourist-attraction.png", description: "Tourist attraction ahead; watch for pedestrians.", category: "Warning" },

  // --- Motorway / Special Cases ---
  { name: "Motorway Ends", image: "images/motorway-end.png", description: "End of motorway; normal road rules apply.", category: "Warning" },

  // ---------------- Informational ----------------
  { name: "Bus Lane", image: "images/bus-lane.png", description: "Lane reserved for buses.", category: "Informational" },
  { name: "Cycle Lane", image: "images/cycle-lane.png", description: "Lane reserved for cyclists.", category: "Informational" },
  { name: "Motorway Starts", image: "images/motorway-start.png", description: "Start of motorway; follow motorway rules.", category: "Informational" },
  { name: "National Speed Limit", image: "images/national-speed-limit.png", description: "Default speed limit applies.", category: "Informational" },
  { name: "New Speed Limit in Force", image: "images/new-speed-limit.png", description: "New speed limit is in effect; obey limit.", category: "Informational" },
  { name: "Roadworks", image: "images/roadworks.png", description: "Roadworks ahead; proceed with caution.", category: "Informational" },
  { name: "Speed Cameras", image: "images/speed-camera.png", description: "Speed cameras ahead; obey speed limit.", category: "Informational" },
  { name: "Speed Camera with Speed Limit", image: "images/speed-camera-limit.png", description: "Speed camera ahead with enforced speed limit.", category: "Informational" },

  // ---------------- Temporary / Other ----------------
  { name: "Temporary Diversion", image: "images/temporary-diversion.png", description: "Temporary diversion; follow directions.", category: "Temporary" },
  { name: "Temporary Speed Limit", image: "images/temporary-speed-limit.png", description: "Temporary speed restriction in effect.", category: "Temporary" },
  { name: "Temporary Pedestrian Crossing", image: "images/temporary-ped-crossing.png", description: "Temporary pedestrian crossing in use.", category: "Temporary" },
  { name: "Temporary Lane Closure", image: "images/temporary-lane-closure.png", description: "One or more lanes closed temporarily.", category: "Temporary" },
  { name: "Temporary Traffic Lights", image: "images/temporary-traffic-lights.png", description: "Temporary traffic lights ahead.", category: "Temporary" }
];

// ------------------- ROAD SIGNS -------------------
const roadSignsData=[ /* All your road signs data from Regulatory, Warning, Informational, Temporary included exactly as above */ ];

function showRoadSigns() {
  const category=document.getElementById('roadSignCategory').value;
  const container=document.getElementById('roadSignsContainer');
  if(!container){ return; }
  container.innerHTML='';
  if(!category){ return; }
  const filteredSigns=(typeof roadSignsData!=='undefined'?roadSignsData:[]).filter(sign=>sign.category===category);
  if(!filteredSigns.length){
    container.innerHTML="<div class='question-card'><p>No road signs available for this category.</p></div>";
    return;
  }
  filteredSigns.forEach(sign=>{
    const card=document.createElement('div');
    card.className='road-sign-card';
    card.innerHTML=`<img src="${sign.image}" alt="${sign.name}" class="road-sign-image">
      <h4>${sign.name}</h4>
      <p>${sign.description}</p>`;
    container.appendChild(card);
  });
}

// ------------------- HAZARD PERCEPTION (FULL FEATURED) -------------------

// Settings for anti-spam / misuse detection
const MAX_CLICKS_IN_WINDOW = 5; // allowed clicks in CLICK_WINDOW_MS before restart
const CLICK_WINDOW_MS = 2000; // sliding window for rapid-click detection
const MAX_OUTSIDE_HAZARD = 3; // allowed clicks outside hazard windows for a clip before restart

// hazardClips: supports either .hazards = [{start,end}, ...] for multi-hazard clips
// or single hazardStart/hazardEnd for legacy entries.
const hazardClips = [
  // Example clips (replace with your real local file paths)
  { src: "videos/hazard1.mp4", hazardStart: 18, hazardEnd: 23 },
  { src: "videos/hazard2.mp4", hazardStart: 18, hazardEnd: 23 },
  { src: "videos/hazard3.mp4", hazardStart: 18, hazardEnd: 23 }
];

let currentHazardIndex = 0;
let hazardScore = 0;
let allClicksForClip = []; // persistent clicks for current clip
let clipBestScores = []; // best score per hazard for current clip

function setupHazardPerception() {
  currentHazardIndex = 0;
  hazardScore = 0;
  allClicksForClip = [];
  clipBestScores = [];
  loadHazardClip();
}

function normalizeHazards(clip) {
  // returns array of {start, end}
  if (Array.isArray(clip.hazards)) return clip.hazards.map(h => ({ start: h.start, end: h.end }));
  if (clip.hazardStart !== undefined && clip.hazardEnd !== undefined) return [{ start: clip.hazardStart, end: clip.hazardEnd }];
  return []; // none
}

function loadHazardClip() {
  if (currentHazardIndex >= hazardClips.length) {
    showHazardSummary();
    return;
  }

  allClicksForClip = [];
  clipBestScores = [];

  const clip = hazardClips[currentHazardIndex];
  const container = document.getElementById("hazardContainer");
  if (!container) return;

  const hazards = normalizeHazards(clip);
  // initialize clipBestScores to zeros (one per hazard)
  clipBestScores = new Array(hazards.length).fill(0);

  container.innerHTML = `
    <div class="video-wrapper" style="position:relative; display:inline-block; width:100%; max-width:900px;">
      <video id="hazardVideo" width="100%" controls preload="metadata">
        <source src="${clip.src}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div id="clickOverlay" style="
          position:absolute;
          left:0; right:0; bottom:0;
          height:48px;
          display:none;
          align-items:center;
          justify-content:center;
          background:rgba(200,0,0,0.92);
          color:white;
          font-weight:700;
          z-index:10;
          border-bottom-left-radius:12px;
          border-bottom-right-radius:12px;
          pointer-events:none;
          ">
        CLICK
      </div>
    </div>

    <div style="margin-top:12px;">
      <p style="margin:8px 0 6px 0; font-weight:600;">Click when you see a developing hazard!</p>
      <button id="hazardClickBtn" class="option" style="display:inline-block;">Click Hazard</button>
      <p id="clickWarning" style="color:red; font-weight:bold; display:none; margin-top:8px;"></p>
      <p id="clickCounter" style="margin-top:6px;">Clicks: 0</p>
    </div>
  `;

  const video = document.getElementById('hazardVideo');
  const btn = document.getElementById('hazardClickBtn');

  // Attach event listeners
  if (btn) {
    btn.onclick = () => registerHazardClick();
  }

  if (video) {
    // don't autoplay - respects user's request
    video.currentTime = 0;
    video.removeAttribute('autoplay');
    // When video ends, score the clip
    video.onended = () => endClipScoring();
  }
}

// helper: return array of hazard windows for the current clip
function currentClipHazards() {
  const clip = hazardClips[currentHazardIndex];
  return normalizeHazards(clip);
}

function isInAnyHazardWindow(time) {
  const hazards = currentClipHazards();
  return hazards.some(h => time >= h.start && time <= h.end);
}

// compute points for a click relative to a given hazard window (5..1 or 0)
function getPointsForTime(time, start, end) {
  if (time < start || time > end) return 0;
  const totalLen = (end - start);
  if (totalLen <= 0) return 5;
  const segment = totalLen / 5; // five equal segments
  // index 0 => best (5 points), index 4 => worst (1 point)
  let idx = Math.floor((time - start) / segment);
  if (idx < 0) idx = 0;
  if (idx > 4) idx = 4;
  return 5 - idx;
}

function registerHazardClick() {
  const video = document.getElementById("hazardVideo");
  const warning = document.getElementById("clickWarning");
  const counter = document.getElementById("clickCounter");
  const overlay = document.getElementById("clickOverlay");
  const clip = hazardClips[currentHazardIndex];

  if (!video || !counter) return;

  const time = video.currentTime;
  const now = Date.now();

  // record persistent click for this clip
  allClicksForClip.push({ videoTime: time, timestamp: now });

  // update click counter display (persistent across clip)
  counter.textContent = `Clicks: ${allClicksForClip.length}`;

  // check recent clicks for spam (sliding window)
  const recentClicks = allClicksForClip.filter(c => now - c.timestamp <= CLICK_WINDOW_MS).length;
  if (recentClicks > MAX_CLICKS_IN_WINDOW) {
    // too many rapid clicks -> restart clip
    if (warning) {
      warning.textContent = "Too many rapid clicks! Restarting clip...";
      warning.style.display = "block";
    }
    restartCurrentClip(video);
    return;
  }

  // suspicious pattern: too many clicks outside hazard windows during this clip
  const hazards = currentClipHazards();
  const outsideClicksCount = allClicksForClip.filter(c => {
    // click outside all hazard windows
    return !hazards.some(h => c.videoTime >= h.start && c.videoTime <= h.end);
  }).length;

  if (outsideClicksCount > MAX_OUTSIDE_HAZARD) {
    if (warning) {
      warning.textContent = "Suspicious click pattern detected! Restarting clip...";
      warning.style.display = "block";
    }
    restartCurrentClip(video);
    return;
  }

  // Award points for any hazard window(s) this click intersects; keep best per hazard
  hazards.forEach((h, i) => {
    const pts = getPointsForTime(time, h.start, h.end);
    if (pts > (clipBestScores[i] || 0)) {
      clipBestScores[i] = pts;
    }
  });

  // Show overlay for user feedback (brief red flag at bottom)
  if (overlay) {
    // show points if inside hazard, otherwise show "MISS"
    const ptsForThisClick = hazards.reduce((acc, h) => {
      return Math.max(acc, getPointsForTime(time, h.start, h.end));
    }, 0);
    overlay.textContent = ptsForThisClick > 0 ? `+${ptsForThisClick}` : 'MISS';
    overlay.style.display = 'flex';
    // fade after short delay
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 700);
  }

  // clear warning after a short time if present
  if (warning) {
    setTimeout(() => {
      warning.style.display = 'none';
    }, 1500);
  }
}

function restartCurrentClip(video) {
  // reset clip state and replay from start
  allClicksForClip = [];
  clipBestScores = new Array(currentClipHazards().length).fill(0);
  // update UI
  const counter = document.getElementById("clickCounter");
  if (counter) counter.textContent = `Clicks: 0`;
  const overlay = document.getElementById("clickOverlay");
  if (overlay) overlay.style.display = 'none';
  // rewind and play
  if (video) {
    try {
      video.currentTime = 0;
      video.play();
    } catch (e) {
      // some browsers block autoplay - that's ok
      // user can press play manually
    }
  }
}

function endClipScoring() {
  // sum clip best scores
  const clipSum = clipBestScores.reduce((s, v) => s + (v || 0), 0);
  hazardScore += clipSum;

  const container = document.getElementById("hazardContainer");
  if (!container) return;

  // compute max for this clip
  const maxForClip = (currentClipHazards().length) * 5;

  // Build list of best scores per hazard for info
  let detailHtml = '';
  if (clipBestScores.length > 0) {
    clipBestScores.forEach((s, i) => {
      detailHtml += `<p> Hazard ${i+1}: ${s || 0} / 5</p>`;
    });
  }

  container.innerHTML = `
    <div class="question-card">
      <p>Clip ${currentHazardIndex + 1} finished!</p>
      <p>Your score for this clip: <strong>${clipSum}/${maxForClip}</strong></p>
      ${detailHtml}
      <div style="margin-top:12px;">
        <button class="next-btn" onclick="nextHazardClip()">Next Clip</button>
        <button class="back-btn" onclick="replayCurrentClip()">Replay Clip</button>
      </div>
    </div>
  `;
}

function replayCurrentClip() {
  // simply reload same clip
  loadHazardClip();
}

function nextHazardClip() {
  currentHazardIndex++;
  loadHazardClip();
}

function showHazardSummary() {
  const container = document.getElementById("hazardContainer");
  if (!container) return;
  const totalPossible = hazardClips.reduce((acc, clip) => {
    const hazards = normalizeHazards(clip);
    return acc + hazards.length * 5;
  }, 0);

  container.innerHTML = `
    <div class="question-card">
      <h3>Hazard Perception Summary</h3>
      <p>Total Score: <strong>${hazardScore}</strong> out of <strong>${totalPossible}</strong></p>
      <p>Clips completed: ${hazardClips.length}</p>
      <div style="margin-top:12px;">
        <button onclick="setupHazardPerception()" class="next-btn">Try Again</button>
      </div>
    </div>
  `;
}

// ------------------- INITIALISATION -------------------
window.addEventListener('DOMContentLoaded', () => {
  // populate road sign categories
  const categorySelect = document.getElementById('roadSignCategory');
  if (categorySelect && typeof roadSignsData !== 'undefined') {
    const categories = [...new Set(roadSignsData.map(sign => sign.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // make nav buttons behave even if inline onclick is used:
  document.querySelectorAll('.header-nav button').forEach(btn => {
    // if button has an inline onclick already, safe to also attach a listener because showTab is idempotent
    const onclickAttr = btn.getAttribute('onclick') || '';
    // try to parse tab id used inline: showTab('tabId')
    const match = onclickAttr.match(/showTab\((['"])(.*?)\1/);
    if (match) {
      const tabId = match[2];
      btn.addEventListener('click', (ev) => showTab(tabId, ev));
    } else {
      // fallback - attempt to map by text content (lowercase)
      const txt = (btn.textContent || '').trim().toLowerCase().replace(/\s+/g, '');
      btn.addEventListener('click', (ev) => {
        // try map
        if (txt === 'home') showTab('home', ev);
        else if (txt === 'revision') showTab('revision', ev);
        else if (txt === 'mocktest' || txt === 'mocktest') showTab('mockInfo', ev);
        else if (txt === 'roadsigns') showTab('roadSigns', ev);
        else if (txt === 'hazardperception') showTab('hazardPerception', ev);
        else showTab('home', ev);
      });
    }
  });

  // set default active tab (Home)
  showTab('home');

  // hamburger toggle (if present)
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) hamburger.addEventListener('click', toggleMenu);
});
