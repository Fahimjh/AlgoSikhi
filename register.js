document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const msg = document.getElementById("registerMessage");

  if (password !== confirmPassword) {
    msg.style.color = "red";
    msg.textContent = "❌ Passwords do not match.";
    return;
  }

  const res = await fetch("https://algosikhibackend.onrender.com/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    msg.style.color = "green";
    alert("🎉 Registered successfully! You can now login.");
    window.location.href = "login.html";
  } else {
    msg.style.color = "red";
    msg.textContent = data.message || "❌ Registration failed.";
    alert(data.message);
  }
});
