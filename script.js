let currentRevisionQuestions = [];
let revisionIndex = 0;
let mockQuestions = []; // 50-question test
let mockIndex = 0;
let mockScore = 0;
let timerInterval;
let timeRemaining = 57 * 60; // 57 minutes in seconds

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// ---------------- REVISION ----------------
function startRevision() {
  const category = document.getElementById('categorySelect').value;
  if (!category) return;

  // Use the full question bank
  currentRevisionQuestions = questionsBank.filter(q => q.category === category);
  revisionIndex = 0;
  showRevisionQuestion();
}

function showRevisionQuestion() {
  if (revisionIndex >= currentRevisionQuestions.length) {
    document.getElementById('revisionQuestion').innerHTML =
      "<p>You have completed all revision questions for this category.</p>";
    return;
  }

  const q = currentRevisionQuestions[revisionIndex];
  let categoryClass = q.category.toLowerCase().replace(/\s+/g, '-');

  let html = `<div class="question-card ${categoryClass}"><p><strong>Q${revisionIndex + 1}:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    html += `<button class="option" onclick="checkRevisionAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;
  document.getElementById('revisionQuestion').innerHTML = html;
}

function checkRevisionAnswer(selected) {
  const q = currentRevisionQuestions[revisionIndex];
  const buttons = document.querySelectorAll('#revisionQuestion .option');
  buttons.forEach((btn, i) => {
    if (i === q.answer) btn.classList.add('correct');
    if (i === selected && i !== q.answer) btn.classList.add('incorrect');
    btn.disabled = true;
  });
  revisionIndex++;
  setTimeout(showRevisionQuestion, 1500);
}

// ---------------- MOCK TEST ----------------
function startMockTest() {
  mockIndex = 0;
  mockScore = 0;
  timeRemaining = 57 * 60;

  // Hide start button
  document.getElementById('startMockBtn').classList.add('hidden');

  // Show timer and progress
  document.getElementById('timer').classList.remove('hidden');
  document.getElementById('progressContainer').classList.remove('hidden');

  // Shuffle and pick 50 questions
  mockQuestions = shuffleArray([...questionsBank]).slice(0, 50);

  // Initialize progress bar
  updateProgressBar();

  // Start countdown timer
  timerInterval = setInterval(updateTimer, 1000);

  // Show first question
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
  if (mockIndex >= mockQuestions.length) {
    endMockTest();
    return;
  }

  const q = mockQuestions[mockIndex];

  // Update progress
  updateProgressBar();

  // Display question in styled card
  let html = `<div class="question-card"><p><strong>Q${mockIndex + 1}/50:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    html += `<button class="option" onclick="checkMockAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;
  document.getElementById('mockQuestion').innerHTML = html;
}

function checkMockAnswer(selectedIndex) {
  const q = mockQuestions[mockIndex];
  if (selectedIndex === q.answer) mockScore++;
  mockIndex++;
  showMockQuestion();
}

function endMockTest() {
  clearInterval(timerInterval);
  let resultText = `<div class="question-card"><p>You scored ${mockScore} out of ${mockQuestions.length}.</p>`;
  if (mockScore >= 43) {
    resultText += "<p style='color:green; font-weight:bold;'>🎉 Pass!</p>";
  } else {
    resultText += "<p style='color:red; font-weight:bold;'>❌ Fail</p>";
  }
  resultText += "</div>";
  document.getElementById('mockQuestion').innerHTML = resultText;

  document.getElementById('progressBarFill').style.width = '100%';
  document.getElementById('progressText').textContent = 'Test Completed';
}

// Update progress bar and indicator
function updateProgressBar() {
  const percent = (mockIndex / 50) * 100;
  document.getElementById('progressBarFill').style.width = percent + '%';
  document.getElementById('progressText').textContent = `Q${mockIndex + 1}/50`;
}

// Utility: shuffle an array
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
