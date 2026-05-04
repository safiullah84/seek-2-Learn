(function () {
  "use strict";
  const API = window.location.origin;
  function showMsg(el, text, type) {
    el.textContent = text;
    el.className = "auth-message " + type;
  }
  function clearMsg(el) {
    el.className = "auth-message";
    el.textContent = "";
  }
  function updateNavAuth() {
    const user = JSON.parse(localStorage.getItem("Seek2Learn_user") || "null");
    const navCta = document.querySelector(".nav-cta");
    if (!navCta) return;
    if (user) {
      navCta.innerHTML = `
        <span style="color:var(--text);font-weight:600;margin-right:12px;">Hi, ${user.fullName.split(" ")[0]}</span>
        <a href="#" class="btn btn-coral" id="logout-btn">Logout</a>`;
      document
        .getElementById("logout-btn")
        .addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem("Seek2Learn_user");
          window.location.href = navCta.closest("[data-root]")
            ? "../index.html"
            : "index.html";
        });
    }
  }
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const msg = document.getElementById("signup-msg");
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearMsg(msg);
      const btn = signupForm.querySelector('button[type="submit"]');
      btn.classList.add("loading");
      btn.disabled = true;
      const fullName = signupForm.fullName.value.trim();
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value;
      const confirm = signupForm.confirmPassword.value;
      if (password !== confirm) {
        showMsg(msg, "Passwords do not match", "error");
        btn.classList.remove("loading");
        btn.disabled = false;
        return;
      }
      try {
        const res = await fetch(API + "/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, password }),
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(
            "Server is not reachable. Please make sure the server is running (node server.js).",
          );
        }
        if (!res.ok) throw new Error(data.error || "Signup failed");
        showMsg(msg, data.message + " Redirecting...", "success");
        localStorage.setItem("Seek2Learn_user", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      } catch (err) {
        showMsg(
          msg,
          err.message || "Could not connect to server. Please try again.",
          "error",
        );
      } finally {
        btn.classList.remove("loading");
        btn.disabled = false;
      }
    });
  }
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const msg = document.getElementById("login-msg");
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearMsg(msg);
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.classList.add("loading");
      btn.disabled = true;
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      try {
        const res = await fetch(API + "/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(
            "Server is not reachable. Please make sure the server is running (node server.js).",
          );
        }
        if (!res.ok) throw new Error(data.error || "Login failed");
        showMsg(msg, data.message + " Redirecting...", "success");
        localStorage.setItem("Seek2Learn_user", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1200);
      } catch (err) {
        showMsg(
          msg,
          err.message || "Could not connect to server. Please try again.",
          "error",
        );
      } finally {
        btn.classList.remove("loading");
        btn.disabled = false;
      }
    });
  }
  document.querySelectorAll(".password-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const input = btn.parentElement.querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
      } else {
        input.type = "password";
        btn.textContent = "👁️";
      }
    });
  });
  updateNavAuth();
})();
