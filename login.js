document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("https://algosikhibackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    const msg = document.getElementById("loginMessage");

    if (res.ok) {
        localStorage.setItem("token", data.token); // Save JWT
        localStorage.setItem("username", data.user.username); // Optional
        window.location.href = "dashboard.html"; // Redirect
    }
    
    else {
        msg.style.color = "red";
        msg.textContent = data.message || "❌ Login failed.";
        alert(data.message);
    }
});
