let currentRevisionQuestions = [];
let revisionSelectedAnswers = []; // track selected answers for revision
let revisionIndex = 0;

let mockQuestions = []; // 50-question test
let mockIndex = 0;
let timerInterval;
let timeRemaining = 57 * 60; // 57 minutes in seconds
let mockAnswers = []; // store selected answers for each question

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// ---------------- REVISION ----------------
function startRevision() {
  const category = document.getElementById('categorySelect').value;
  if (!category) return;

  currentRevisionQuestions = questionsBank.filter(q => q.category === category);
  revisionIndex = 0;
  revisionSelectedAnswers = Array(currentRevisionQuestions.length).fill(null);
  showRevisionQuestion();
}

function showRevisionQuestion() {
  if (revisionIndex >= currentRevisionQuestions.length) {
    document.getElementById('revisionQuestion').innerHTML =
      `<div class="question-card"><p>You have completed all revision questions for this category.</p></div>`;
    return;
  }

  const q = currentRevisionQuestions[revisionIndex];
  let categoryClass = q.category.toLowerCase().replace(/\s+/g, '-');

  let html = `<div class="question-card ${categoryClass}">
                <p><strong>Q${revisionIndex + 1}:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    const selectedClass = revisionSelectedAnswers[revisionIndex] === i ? 'selected' : '';
    html += `<button class="option ${selectedClass}" onclick="selectRevisionAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;

  html += `<div class="navigation-buttons">
            ${revisionIndex > 0 ? '<button onclick="prevRevisionQuestion()">Back</button>' : '<div></div>'}
            <button onclick="nextRevisionQuestion()">${revisionIndex === currentRevisionQuestions.length - 1 ? 'Finish' : 'Next'}</button>
           </div>`;

  document.getElementById('revisionQuestion').innerHTML = html;
}

function selectRevisionAnswer(selectedIndex) {
  revisionSelectedAnswers[revisionIndex] = selectedIndex;
  const buttons = document.querySelectorAll('#revisionQuestion .option');
  buttons.forEach((btn, i) => {
    btn.classList.remove('selected');
    if (i === selectedIndex) btn.classList.add('selected');
  });
}

function nextRevisionQuestion() {
  if (revisionIndex === currentRevisionQuestions.length - 1) {
    alert('You have completed the revision for this category!');
    return;
  }
  revisionIndex++;
  showRevisionQuestion();
}

function prevRevisionQuestion() {
  if (revisionIndex > 0) {
    revisionIndex--;
    showRevisionQuestion();
  }
}

// ---------------- MOCK TEST ----------------
function startMockTest() {
  mockIndex = 0;
  timeRemaining = 57 * 60;
  mockAnswers = Array(50).fill(null);

  document.getElementById('startMockBtn').classList.add('hidden');
  document.getElementById('timer').classList.remove('hidden');
  document.getElementById('progressContainer').classList.remove('hidden');

  mockQuestions = shuffleArray([...questionsBank]).slice(0, 50);

  updateProgressBar();
  timerInterval = setInterval(updateTimer, 1000);
  showMockQuestion();
}

function updateTimer() {
  if (timeRemaining <= 0) {
    clearInterval(timerInterval);
    endMockTest();
    return;
  }
  timeRemaining--;
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  document.getElementById('timer').textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showMockQuestion() {
  const q = mockQuestions[mockIndex];

  let html = `<div class="question-card"><p><strong>Q${mockIndex + 1}/50:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    let selectedClass = mockAnswers[mockIndex] === i ? 'selected' : '';
    html += `<button class="option ${selectedClass}" onclick="selectMockAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;

  html += `<div class="navigation-buttons">`;
  if (mockIndex > 0) html += `<button onclick="previousQuestion()">Back</button>`;
  if (mockIndex < 49) html += `<button onclick="nextQuestion()">Next</button>`;
  else html += `<button onclick="confirmFinish()">Finish Test</button>`;
  html += `</div>`;

  document.getElementById('mockQuestion').innerHTML = html;
  updateProgressBar();
}

function selectMockAnswer(selectedIndex) {
  mockAnswers[mockIndex] = selectedIndex;

  const buttons = document.querySelectorAll('#mockQuestion .option');
  buttons.forEach((btn, i) => {
    btn.classList.remove('selected');
    if (i === selectedIndex) btn.classList.add('selected');
  });
}

function nextQuestion() {
  if (mockIndex < 49) {
    mockIndex++;
    showMockQuestion();
  }
}

function previousQuestion() {
  if (mockIndex > 0) {
    mockIndex--;
    showMockQuestion();
  }
}

function confirmFinish() {
  const popupHTML = `
    <div id="finishPopup" class="popup-overlay">
      <div class="popup-content">
        <p>Are you sure you want to finish the test now? You can review previous questions before submitting.</p>
        <button onclick="closePopup()">Go Back</button>
        <button onclick="endMockTest()">Finish Test</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function closePopup() {
  const popup = document.getElementById('finishPopup');
  if (popup) popup.remove();
}

function endMockTest() {
  clearInterval(timerInterval);
  let score = 0;
  mockAnswers.forEach((ans, i) => {
    if (ans === mockQuestions[i].answer) score++;
  });

  let resultText = `<div class="question-card"><p>You scored ${score} out of ${mockQuestions.length}.</p>`;
  resultText += score >= 43 ? "<p style='color:green; font-weight:bold;'>🎉 Pass!</p>" : "<p style='color:red; font-weight:bold;'>❌ Fail</p>";
  resultText += `</div>`;
  document.getElementById('mockQuestion').innerHTML = resultText;

  document.getElementById('progressBarFill').style.width = '100%';
  document.getElementById('progressText').textContent = 'Test Completed';
  closePopup();
}

// Smooth progress bar
function updateProgressBar() {
  const percent = ((mockIndex + 1) / 50) * 100;
  const fill = document.getElementById('progressBarFill');
  fill.style.transition = 'width 0.5s ease';
  fill.style.width = percent + '%';
  document.getElementById('progressText').textContent = `Q${mockIndex + 1}/50`;
}

// ------------------ Utility ------------------
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}
