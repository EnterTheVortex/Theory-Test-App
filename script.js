// Page Navigation
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");

  if (pageId === "revision") loadRevision();
  if (pageId === "mock") startMockTest();
}

// -------- REVISION MODE --------
function loadRevision() {
  const container = document.getElementById("revision-container");
  container.innerHTML = "";
  
  questions.forEach((q, index) => {
    let div = document.createElement("div");
    div.innerHTML = `<p><strong>Q${index+1}:</strong> ${q.question}</p>`;
    
    q.options.forEach((opt, i) => {
      let btn = document.createElement("button");
      btn.textContent = opt;
      btn.className = "answer";
      btn.onclick = () => {
        if (i === q.answer) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
        }
      };
      div.appendChild(btn);
    });
    
    container.appendChild(div);
  });
}

// -------- MOCK TEST MODE --------
let mockQuestions = [];
let currentMock = 0;
let score = 0;
let timer;

function startMockTest() {
  mockQuestions = shuffle([...questions]).slice(0, 2); // pick 2 random Qs for demo
  currentMock = 0;
  score = 0;
  showMockQuestion();
  startTimer(60); // 60 sec for demo (real test: 57 mins)
}

function showMockQuestion() {
  const container = document.getElementById("mock-container");
  container.innerHTML = "";
  
  if (currentMock >= mockQuestions.length) {
    container.innerHTML = `<h3>Test finished!</h3>
      <p>You scored ${score} out of ${mockQuestions.length}</p>`;
    clearInterval(timer);
    return;
  }
  
  let q = mockQuestions[currentMock];
  let div = document.createElement("div");
  div.innerHTML = `<p><strong>Q${currentMock+1}:</strong> ${q.question}</p>`;
  
  q.options.forEach((opt, i) => {
    let btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "answer";
    btn.onclick = () => {
      if (i === q.answer) score++;
      currentMock++;
      showMockQuestion();
    };
    div.appendChild(btn);
  });
  
  container.appendChild(div);
}

function startTimer(seconds) {
  const timerEl = document.getElementById("timer");
  clearInterval(timer);
  
  timer = setInterval(() => {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    timerEl.textContent = `Time Left: ${mins}:${secs < 10 ? "0"+secs : secs}`;
    seconds--;
    
    if (seconds < 0) {
      clearInterval(timer);
      document.getElementById("mock-container").innerHTML =
        `<h3>Time's up!</h3><p>You scored ${score} out of ${mockQuestions.length}</p>`;
    }
  }, 1000);
}

// -------- HELPER --------
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
