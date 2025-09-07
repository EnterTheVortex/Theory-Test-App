let currentRevisionQuestions = [];
let revisionIndex = 0;
let mockQuestions = [];
let mockIndex = 0;
let mockScore = 0;

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// ---------------- REVISION ----------------
function startRevision() {
  const category = document.getElementById('categorySelect').value;
  if (!category) return;
  // Filter questions by category
  currentRevisionQuestions = questions.filter(q => q.category === category);
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

  // Convert category name to CSS class-friendly string
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
  // Pick 50 random questions from all categories
  mockQuestions = shuffleArray([...questions]).slice(0, 50);
  mockIndex = 0;
  mockScore = 0;
  showMockQuestion();
}

function showMockQuestion() {
  if (mockIndex >= mockQuestions.length) {
    document.getElementById('mockQuestion').innerHTML = `<p>Test completed! Your score: ${mockScore} / ${mockQuestions.length}</p>`;
    return;
  }
  const q = mockQuestions[mockIndex];
  let html = `<p><strong>Q${mockIndex + 1}:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    html += `<button class="option" onclick="checkMockAnswer(${i})">${opt}</button>`;
  });
  document.getElementById('mockQuestion').innerHTML = html;
}

function checkMockAnswer(selected) {
  const q = mockQuestions[mockIndex];
  if (selected === q.answer) mockScore++;
  mockIndex++;
  showMockQuestion();
}

// ---------------- HELPER ----------------
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
