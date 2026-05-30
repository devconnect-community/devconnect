const joinBtnHeader = document.getElementById("joinBtn");
const joinBtnHero = document.querySelector(".btn-light");
const joinBtnAbout = document.querySelector(".btn-about");
const joinBtnPrimary = document.querySelector(".btn-primary");
const modal = document.getElementById("joinCommunityModal");

const API_BASE = "https://devc0nnect-back3nd-production-1f73.up.railway.app";

function openModal() {
  fetch("join-community.html")
    .then((res) => res.text())
    .then((html) => {
      modal.innerHTML = html;
      modal.style.display = "block";
      attachFormHandler();
    })
    .catch((err) => console.error("Error loading form:", err));
}

[joinBtnHeader, joinBtnHero].forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  }
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

function attachFormHandler() {
  const signupWrapper = document.getElementById("signupFormWrapper");
  const signinWrapper = document.getElementById("signinFormWrapper");
  const resetBtn = document.getElementById("reset-password-btn");

  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  const showSignin = document.getElementById("showSignin");
  const showSignup = document.getElementById("showSignup");

  if (showSignin) {
    showSignin.addEventListener("click", (e) => {
      e.preventDefault();
      signupWrapper.style.display = "none";
      signinWrapper.style.display = "block";
    });
  }

  if (showSignup) {
    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      signinWrapper.style.display = "none";
      signupWrapper.style.display = "block";
    });
  }

  const backBtn = document.getElementById("backToSignup");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      signinWrapper.style.display = "none";
      signupWrapper.style.display = "block";
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      window.location.href = "password-recovery.html";
    });
  }

  // Signup handler
  const joinForm = document.getElementById("joinForm");
  if (joinForm) {
    joinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.querySelector("#joinForm .btn-primary");
      btn.textContent = "Loading...";
      btn.disabled = true;

      const payload = {
        fullName: document.getElementById("fullname").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        reasonText: document.getElementById("reason").value.trim(),
        reasonOption: document.getElementById("reasonOption").value
      };

      try {
        const res = await fetch(`${API_BASE}/api/v1/signup/create-account`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Signup response:", data);

        if (res.ok && data.code === 200) {
          alert("Signup successful!\n\nCheck your email for a verification link.");
          localStorage.setItem("jwtToken", data.data.jwtToken);
        } else {
          if (data.data && data.data.errors) {
            alert("Validation errors:\n" + data.data.errors.join("\n"));
          } else {
            alert("Error: " + data.msg);
          }
        }
      } catch (err) {
        alert("Request failed: " + err);
      } finally {
        btn.textContent = "Join Community";
        btn.disabled = false;
      }
    });
  }

  // Signin handler
  const signinForm = document.getElementById("signinForm");
  if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.querySelector("#signinForm .btn-primary");
      btn.textContent = "Loading...";
      btn.disabled = true;

      const payload = {
        email: document.getElementById("signinEmail").value.trim(),
        password: document.getElementById("signinPassword").value.trim()
      };

      try {
        const res = await fetch(`${API_BASE}/api/v1/auth/signin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Signin response:", data);

        if (res.ok && data.code === 200) {
          alert("Welcome back! Signed in successfully.");
          if (data.data?.jwtToken) {
            localStorage.setItem("jwtToken", data.data.jwtToken);
          }
          modal.style.display = "none";
          window.location.replace("index.html");
        } else {
          alert("Signin failed: " + (data.msg || "Invalid credentials"));
        }
      } catch (err) {
        alert("Request failed: " + err);
      } finally {
        btn.textContent = "Sign In";
        btn.disabled = false;
      }
    });
  }
}

function togglePassword(inputId, eyeIcon) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    eyeIcon.textContent = "🙈";
  } else {
    input.type = "password";
    eyeIcon.textContent = "👁️";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.hash === "#signin") {
    openModal();
    setTimeout(() => {
      const signupWrapper = document.getElementById("signupFormWrapper");
      const signinWrapper = document.getElementById("signinFormWrapper");
      if (signupWrapper && signinWrapper) {
        signupWrapper.style.display = "none";
        signinWrapper.style.display = "block";
      }
    }, 500);
  }
});
