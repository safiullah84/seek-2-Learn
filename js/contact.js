(function () {
  "use strict";
  const form = document.getElementById("contact-form");
  if (!form) return;
  const msg = document.getElementById("contact-msg");
  const API = window.location.origin;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    msg.className = "contact-message";
    msg.textContent = "";
    const btn = form.querySelector('button[type="submit"]');
    btn.classList.add("loading");
    btn.disabled = true;
    const data = {
      name: form.contactName.value.trim(),
      email: form.contactEmail.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };
    try {
      const res = await fetch(API + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error(
          "Server is not reachable. Please make sure the server is running.",
        );
      }
      if (!res.ok) throw new Error(result.error || "Failed to send message");
      msg.textContent = result.message;
      msg.className = "contact-message success";
      form.reset();
    } catch (err) {
      msg.textContent = err.message || "Could not connect to server.";
      msg.className = "contact-message error";
    } finally {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  });
})();
