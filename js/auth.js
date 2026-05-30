document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken");
  const joinBtn = document.getElementById("joinBtn");
  const profileMenu = document.querySelector(".profile-dropdown");
  const API_BASE = "https://devc0nnect-back3nd-production-1f73.up.railway.app";

  if (token) {
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/signin/verify-token`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        if (joinBtn) joinBtn.style.display = "none";   // hide Join button
        if (profileMenu) profileMenu.style.display = "block"; // show profile
      } else {
        localStorage.removeItem("jwtToken");
        if (joinBtn) joinBtn.style.display = "inline-block";
        if (profileMenu) profileMenu.style.display = "none";
      }
    } catch (err) {
      console.error("Error verifying token:", err);
      localStorage.removeItem("jwtToken");
      if (joinBtn) joinBtn.style.display = "inline-block";
      if (profileMenu) profileMenu.style.display = "none";
    }
  } else {
    if (joinBtn) joinBtn.style.display = "inline-block";
    if (profileMenu) profileMenu.style.display = "none";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("jwtToken");
      if (joinBtn) joinBtn.style.display = "inline-block";  // bring back Join
      if (profileMenu) profileMenu.style.display = "none";  // hide profile
      window.location.href = "index.html";
    });
  }
});

// Protect Q&A page
const qnaLink = document.querySelector("a[href='q&a_page.html']");
if (qnaLink) {
  qnaLink.addEventListener("click", (e) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      e.preventDefault(); // stop navigation
      alert("You must sign in to access the Q&A page.");
      
      // Open the signin/signup modal
      if (typeof openModal === "function") {
        openModal();
        // Force the signin form to show
        setTimeout(() => {
          const signupWrapper = document.getElementById("signupFormWrapper");
          const signinWrapper = document.getElementById("signinFormWrapper");
          if (signupWrapper && signinWrapper) {
            signupWrapper.style.display = "none";
            signinWrapper.style.display = "block";
          }
        }, 300);
      }
    }
  });
}

