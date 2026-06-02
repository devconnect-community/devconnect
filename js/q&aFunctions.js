  const API_BASE = "https://devc0nnect-back3nd-production-1f73.up.railway.app";

  function toggleAskBox(button) {
    const askBox = button.closest('.ask-section')?.querySelector('.ask-box')
              || button.closest('.page')?.querySelector('.ask-box'); 
    if (askBox) {
      askBox.classList.toggle('expanded');
      askBox.classList.toggle('collapsed');
    }
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
  document.querySelector('.hamburger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
  document.querySelectorAll('.submit-question').forEach(btn => {
    btn.addEventListener('click', async () => {
      const title = document.querySelector('.question-title').value;
      const content = document.querySelector('.question-content').value;
      await submitQuestion(title, content, null);
    });
  });

  async function submitQuestion(title, content, imageUrl) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/questions/create-question`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, content, imageUrl })
  });

  const data = await res.json();

  if (res.ok) {
    alert(data.msg);
    await loadRecentQuestions();
  } else {
    alert("Failed to create question");
  }
}


  document.querySelector('.submit-answer').addEventListener('click', async () => {
    const questionId = document.getElementById('answer-title').getAttribute('data-id');
    const content = document.querySelector('.answer-textarea').value;
    const imageUrl = null; 
    await submitAnswer(questionId, content, imageUrl);
  });
/* ------------------ DESKTOP ------------------ */
async function showQuestionDesktop(element) {
  const questionId = element.getAttribute("data-id");
  const token = localStorage.getItem("jwtToken");

  const res = await fetch(`${API_BASE}/questions/${questionId}`, {
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
      <div class="answer" data-id="${ans.id}">
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
        <div class="replies" id="replies-${ans.id}"></div>
      </div>
    `;

    // ✅ Render replies if they exist
    if (ans.replies && ans.replies.length > 0) {
      const repliesContainer = document.getElementById(`replies-${ans.id}`);
      ans.replies.forEach(rep => {
        repliesContainer.innerHTML += `
          <div class="reply">
            <p><strong>${rep.userName}</strong> replied:</p>
            <p>${rep.content}</p>
            <span class="timestamp">${rep.timestamp}</span>
          </div>
        `;
      });
    }
  });
}


/* ------------------ MOBILE ------------------ */
async function showQuestionMobile(element) {
  const questionId = element.getAttribute("data-id");
  const token = localStorage.getItem("jwtToken");

  const res = await fetch(`${API_BASE}/questions/${questionId}`, {
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

  // ✅ Only one loop here
  answers.forEach(ans => {
    answersContainer.innerHTML += `
      <div class="answer" data-id="${ans.id}">
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
        <div class="replies" id="replies-${ans.id}"></div>
      </div>
    `;

    // ✅ Render replies if they exist
    if (ans.replies && ans.replies.length > 0) {
      const repliesContainer = document.getElementById(`replies-${ans.id}`);
      ans.replies.forEach(rep => {
        repliesContainer.innerHTML += `
          <div class="reply">
            <p><strong>${rep.userName}</strong> replied:</p>
            <p>${rep.content}</p>
            <span class="timestamp">${rep.timestamp}</span>
          </div>
        `;
      });
    }
  });

  showPage("answers-mobile");
}


async function voteAnswer(answerId, type) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/answers/votes/${answerId}?voteType=${type}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  if (res.ok) {
    const answerDiv = document.querySelector(`.answer[data-id="${answerId}"]`);
    const helpfulCount = answerDiv.querySelector(".helpful-count");

    // Update count
    if (data.data && data.data.votes !== undefined) {
      helpfulCount.innerText = data.data.votes;
    }

    // Highlight button
    const likeBtn = answerDiv.querySelector("button[onclick*='upvote']");
    const unlikeBtn = answerDiv.querySelector("button[onclick*='downvote']");
    likeBtn.classList.remove("liked");
    unlikeBtn.classList.remove("unliked");

    if (type === "upvote") {
      likeBtn.classList.add("liked");
    } else {
      unlikeBtn.classList.add("unliked");
    }

    // Refresh leaderboard automatically
    await loadLeaderboard();
  } else {
    alert("Vote failed: " + data.msg);
  }
}


async function deleteAnswer(answerId) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/answers/${answerId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  if (res.ok) {
    alert("Answer deleted successfully");
    document.querySelector(`.answer[data-id="${answerId}"]`).remove();
    await loadLeaderboard();
  } else {
    alert("Failed to delete: " + data.msg);
  }
}


async function submitReply(questionId, parentAnswerId, btn) {
  const token = localStorage.getItem("jwtToken");
  const replyBox = btn.closest('.reply-box');
  const content = replyBox.querySelector("textarea").value;

  const res = await fetch(`${API_BASE}/answers/reply/${questionId}/${parentAnswerId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ content })
  });

  const data = await res.json();

  // Find the correct answer block
  const answerDiv = btn.closest('.answer');
  const repliesContainer = answerDiv.querySelector('.replies');

  // Append reply into the nested replies container
  repliesContainer.innerHTML += `
    <div class="reply">
      <p><strong>${data.data.userName}</strong> replied:</p>
      <p>${data.data.content}</p>
    </div>
  `;

  // Clear the textarea
  replyBox.querySelector("textarea").value = "";
}

async function submitAnswer(questionId, content, imageUrl) {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/answers/addAnswer`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ questionId, content, imageUrl })
  });
  const data = await res.json();
  alert(data.msg);
}

async function loadRecentQuestions() {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/questions/get-question`, {
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
window.addEventListener("DOMContentLoaded", loadRecentQuestions);

async function loadLeaderboard() {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/leaderboard/get-leaderboard`, {
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

