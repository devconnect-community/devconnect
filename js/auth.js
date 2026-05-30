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


// 🔒 Protect Q&A page itself
  if (window.location.pathname.endsWith("q&a_page.html")) {
    if (!token) {
      alert("You must sign in to access the Q&A page.");
      window.location.replace("index.html#signin"); 
      // This sends them back to the homepage and opens the signin modal
    }
  }
});