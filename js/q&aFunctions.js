function toggleAskBox(button) {
  const askBox = button.closest('.ask-box');
  askBox.classList.toggle('expanded');
  askBox.classList.toggle('collapsed');
}

function toggleAnswerBox(button) {
  const answerBox = button.closest('.answer-section').querySelector('.answer-box');
  answerBox.classList.toggle('expanded');
  answerBox.classList.toggle('collapsed');
}

function toggleReply(button) {
  const replyBox = button.closest('.answer').querySelector('.reply-box');
  if (replyBox) {
    replyBox.classList.toggle('open');
  }
}

// ✅ Submit Question
async function submitQuestion(title, content, imageUrl) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/api/v1/qna/questions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content, imageUrl })
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.message); // "QUESTION_SUCCESSFULLY_CREATED"
    await loadRecentQuestions(); // refresh list
  } else {
    alert("Failed to create question");
  }
}

// ✅ Hook Ask Question button (desktop/mobile)
document.querySelectorAll('.ask-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const title = document.querySelector('.question-title').value;
    const content = document.querySelector('.question-content').value;
    const imageUrl = null; // or upload logic
    await submitQuestion(title, content, imageUrl);
  });
});

// ✅ Hook Submit Answer button
document.querySelector('.submit-answer').addEventListener('click', async () => {
  const questionId = document.getElementById('answer-title').getAttribute('data-id');
  const content = document.querySelector('.answer-textarea').value;
  const imageUrl = null; // or upload logic
  await submitAnswer(questionId, content, imageUrl);
});

/* ------------------ DESKTOP ------------------ */
async function showQuestionDesktop(element) {
  const questionId = element.getAttribute("data-id");
  const token = localStorage.getItem("jwtToken");

  const res = await fetch(`${API_BASE}/api/v1/qna/questions/${questionId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  const question = data.data.question;
  const answers = data.data.answers;

  document.getElementById('answer-title').innerText = question.title;
  document.getElementById('answer-text').innerText = question.content;
  document.getElementById('answer-meta').innerText = `Asked by ${question.userName}`;
  document.getElementById('answer-title').setAttribute("data-id", question.id);

  const answerImages = document.getElementById('answer-images');
  answerImages.innerHTML = '';
  if (question.imageUrl) {
    const clone = document.createElement('img');
    clone.src = question.imageUrl;
    clone.alt = question.title;
    clone.className = 'uploaded-img';
    answerImages.appendChild(clone);
  }

  const answersContainer = document.getElementById('answers-container-desktop');
  answersContainer.innerHTML = '';
  answers.forEach(ans => {
    answersContainer.innerHTML += `
      <div class="answer">
        <img src="${ans.avatarUrl || 'images/default-avatar.png'}" alt="${ans.userName}" class="avatar">
        <div class="answer-content">
          <p>
            <strong>${ans.userName}</strong>
            <span class="meta">– <span class="helpful-count">${ans.votes}</span> helpful</span>
            <span class="timestamp">${ans.timestamp}</span>
          </p>
          <p>${ans.content}</p>
          <div class="actions">
            <button onclick="voteAnswer(${ans.id}, 'upvote')"><i class="fas fa-thumbs-up"></i> Like</button>
            <button onclick="voteAnswer(${ans.id}, 'downvote')"><i class="fas fa-thumbs-down"></i> Unlike</button>
            <button onclick="deleteAnswer(${ans.id})"><i class="fas fa-trash"></i> Delete</button>
            <button class="reply-btn" onclick="toggleReply(this)">Reply</button>
          </div>
          <div class="reply-box">
            <textarea placeholder="Write your reply..."></textarea>
            <button onclick="submitReply(${question.id}, ${ans.id}, this)">Submit Reply</button>
          </div>
        </div>
      </div>
    `;
  });
}

/* ------------------ MOBILE ------------------ */
async function showQuestionMobile(element) {
  const questionId = element.getAttribute("data-id");
  const token = localStorage.getItem("jwtToken");

  const res = await fetch(`${API_BASE}/api/v1/qna/questions/${questionId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  const question = data.data.question;
  const answers = data.data.answers;

  document.getElementById("answer-title-mobile").innerText = question.title;
  document.getElementById("answer-meta-mobile").innerText = `Asked by ${question.userName}`;
  document.getElementById("answer-text-mobile").innerText = question.content;

  const answerImages = document.getElementById("answer-images-mobile");
  answerImages.innerHTML = "";
  if (question.imageUrl) {
    const clone = document.createElement("img");
    clone.src = question.imageUrl;
    clone.alt = question.title;
    clone.className = "uploaded-img";
    answerImages.appendChild(clone);
  }

  const answersContainer = document.getElementById("answers-container-mobile");
  answersContainer.innerHTML = "";
  answers.forEach(ans => {
    answersContainer.innerHTML += `
      <div class="answer">
        <img src="${ans.avatarUrl || 'images/default-avatar.png'}" alt="${ans.userName}" class="avatar">
        <div class="answer-content">
          <p>
            <strong>${ans.userName}</strong>
            <span class="meta">– <span class="helpful-count">${ans.votes}</span> helpful</span>
            <span class="timestamp">${ans.timestamp}</span>
          </p>
          <p>${ans.content}</p>
          <div class="actions">
            <button onclick="voteAnswer(${ans.id}, 'upvote')">Like</button>
            <button onclick="voteAnswer(${ans.id}, 'downvote')">Unlike</button>
            <button onclick="deleteAnswer(${ans.id})">Delete</button>
            <button class="reply-btn" onclick="toggleReply(this)">Reply</button>
          </div>
          <div class="reply-box">
            <textarea placeholder="Write your reply..."></textarea>
            <button onclick="submitReply(${question.id}, ${ans.id}, this)">Submit Reply</button>
          </div>
        </div>
      </div>
    `;
  });

  showPage("answers-mobile");
}

// ✅ Answer actions
async function voteAnswer(answerId, type) {
  const token = localStorage.getItem("jwtToken");
  await fetch(`${API_BASE}/api/v1/qna/answers/${answerId}/vote?voteType=${type}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }
  });
}

async function deleteAnswer(answerId) {
  const token = localStorage.getItem("jwtToken");
  await fetch(`${API_BASE}/api/v1/qna/answers/${answerId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
}

async function submitReply(questionId, parentAnswerId, btn) {
  const token = localStorage.getItem("jwtToken");
  const replyBox = btn.closest('.reply-box');
  const content = replyBox.querySelector("textarea").value;

  await fetch(`${API_BASE}/api/v1/qna/answers/${parentAnswerId}/reply`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ questionId, content })
  });
  alert("Reply submitted!");
}

// ✅ Submit Answer
async function submitAnswer(questionId, content, imageUrl) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/api/v1/qna/answers`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ questionId, content, imageUrl })
  });
  const data = await res.json();
  alert(data.message); // "ANSWER_SUCCESSFULLY_ADDED"
}

async function loadRecentQuestions() {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/api/v1/qna/questions`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  const list = document.querySelector(".recent-questions ul");
  list.innerHTML = "";

  data.data.forEach(q => {
    list.innerHTML += `
      <li data-id="${q.id}" onclick="showQuestionDesktop(this)">
        <h4 class="question-title">${q.title}</h4>
        <p class="question-snippet">${q.content.substring(0, 100)}...</p>
        <span class="meta">Asked by ${q.userName} | ${q.createdAt}</span>
        ${q.imageUrl ? `<img src="${q.imageUrl}" alt="${q.title}" class="uploaded-img">` : ""}
      </li>
    `;
  });
}

// Run when page loads
window.addEventListener("DOMContentLoaded", loadRecentQuestions);

async function loadLeaderboard() {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/api/v1/qna/leaderboard`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  const tbody = document.querySelector(".leaderboard-table tbody");
  tbody.innerHTML = "";

  data.data.forEach((entry, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${entry.userName}</td>
        <td>${entry.helpfulVotes}</td>
        <td>${entry.points}</td>
      </tr>
    `;
  });
}

window.addEventListener("DOMContentLoaded", loadLeaderboard);


document.querySelectorAll('.submit-question').forEach(btn => {
  btn.addEventListener('click', async () => {
    const title = document.querySelector('.question-title').value;
    const content = document.querySelector('.question-content').value;
    const imageUrl = null;
    await submitQuestion(title, content, imageUrl);
  });
});
