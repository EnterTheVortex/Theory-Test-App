let currentRevisionQuestions = [];
let revisionIndex = 0;
let mockQuestions = []; // The 50-question test
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
  // Reset
  mockIndex = 0;
  mockScore = 0;

  // Randomly shuffle and pick 50 questions from the full bank
  mockQuestions = shuffleArray([...questionsBank]).slice(0, 50);

  showMockQuestion();
}

// Show the current mock test question
function showMockQuestion() {
  if (mockIndex >= mockQuestions.length) {
    // Test complete
    let resultText = `<p>You scored ${mockScore} out of ${mockQuestions.length}.</p>`;
    if (mockScore >= 43) {
      resultText += "<p style='color:green; font-weight:bold;'>🎉 Pass!</p>";
    } else {
      resultText += "<p style='color:red; font-weight:bold;'>❌ Fail</p>";
    }
    document.getElementById('mockQuestion').innerHTML = resultText;
    return;
  }

  const q = mockQuestions[mockIndex];
  let html = `<div class="question-card"><p><strong>Q${mockIndex + 1}:</strong> ${q.question}</p>`;
  q.options.forEach((opt, i) => {
    html += `<button class="option" onclick="checkMockAnswer(${i})">${opt}</button>`;
  });
  html += `</div>`;

  document.getElementById('mockQuestion').innerHTML = html;
}

// Handle mock test answer click
function checkMockAnswer(selectedIndex) {
  const q = mockQuestions[mockIndex];
  if (selectedIndex === q.answer) {
    mockScore++;
  }
  mockIndex++;
  showMockQuestion();
}

// Utility: shuffle an array
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
