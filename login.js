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
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        window.location.href = "dashboard.html";
    } else {
        msg.style.color = "red";
        msg.textContent = data.message || "❌ Login failed.";
        alert(data.message);
    }
});

// --- Admin Login Logic ---
document.getElementById("showAdminLogin").onclick = function(e) {
    e.preventDefault();
    document.getElementById("userLoginSection").style.display = "none";
    document.getElementById("adminLoginSection").style.display = "block";
};

document.getElementById("backToUserLogin").onclick = function(e) {
    e.preventDefault();
    document.getElementById("adminLoginSection").style.display = "none";
    document.getElementById("userLoginSection").style.display = "block";
};

document.getElementById("adminLoginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    const res = await fetch("https://algosikhibackend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    const msg = document.getElementById("adminLoginMessage");

    if (res.ok && data.user && data.user.isAdmin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        window.location.href = "admin.html";
    } else if (res.ok) {
        msg.style.color = "red";
        msg.textContent = "❌ Not an admin account.";
        localStorage.removeItem("token");
    } else {
        msg.style.color = "red";
        msg.textContent = data.message || "❌ Admin login failed.";
    }
});
