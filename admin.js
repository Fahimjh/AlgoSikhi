document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in as admin.");
        window.location.href = "index.html";
        return;
    }
    fetchAllUsers(token);
});

async function fetchAllUsers(token) {
    try {
        const res = await fetch("https://algosikhibackend.onrender.com/api/admin/users", {
            headers: { Authorization: token }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const users = await res.json();
        renderUsers(users);
    } catch (err) {
        document.getElementById("adminUsers").innerHTML = "Failed to load users.";
    }
}

function renderUsers(users) {
    const container = document.getElementById("adminUsers");
    container.innerHTML = "";

    // Find the admin user
    const adminUser = users.find(u => u.isAdmin);
    const otherUsers = users.filter(u => !u.isAdmin);

    // Show admin info in the left of header
    if (adminUser) {
        const adminSection = document.querySelector(".admin-info-section");
        adminSection.innerHTML = `
            <h2>Admin Details</h2>
            <form onsubmit="event.preventDefault(); saveUser('${adminUser._id}', this)">
                <label>
                    Username:
                    <input type="text" name="username" value="${adminUser.username}" required>
                </label><br>
                <label>
                    Email:
                    <input type="email" name="email" value="${adminUser.email}" required>
                </label><br>
                <label>
                    New Password:
                    <input type="password" name="password" placeholder="Leave blank to keep unchanged">
                </label><br>
                <button type="submit" style="background:#1976d2;margin-top:8px;color:#fff;">Save</button>
            </form>
        `;
    }

    // Show other users in the grid
    otherUsers.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.className = "admin-user-card";
        userDiv.innerHTML = `
            <form onsubmit="event.preventDefault(); saveUser('${user._id}', this)">
                <label>
                    Username:
                    <input type="text" name="username" value="${user.username}" required>
                </label><br>
                <label>
                    Email:
                    <input type="email" name="email" value="${user.email}" required>
                </label><br>
                <label>
                    New Password:
                    <input type="password" name="password" placeholder="Leave blank to keep unchanged">
                </label><br>
                <button type="submit" style="background:#1976d2;margin-top:8px;">Save</button>
                <button type="button" onclick="deleteUser('${user._id}')" style="background:#e53935;margin-top:8px;">Delete User</button>
            </form>
            <div class="user-progress"></div>
        `;
        // Progress section for non-admin users
        const progressDiv = userDiv.querySelector('.user-progress');
        for (const topic in topics) {
            const topicDiv = document.createElement("div");
            topicDiv.innerHTML = `<strong>${topic}</strong>`;
            for (const sub in topics[topic]) {
                const subName = topics[topic][sub];
                const isDone = user.progress?.[topic]?.[sub] || false;
                const subDiv = document.createElement("div");
                subDiv.innerHTML = `
                    <label>
                        <input type="checkbox" ${isDone ? "checked" : ""} 
                            onchange="toggleCompletion('${user._id}', '${topic}', '${sub}', this.checked)">
                        ${subName}
                    </label>
                `;
                topicDiv.appendChild(subDiv);
            }
            progressDiv.appendChild(topicDiv);
        }
        container.appendChild(userDiv);
    });
}

// Add this function to handle saving user info
window.saveUser = async function(userId, form) {
    const token = localStorage.getItem("token");
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const body = { username, email };
    if (password) body.password = password;

    const res = await fetch(`https://algosikhibackend.onrender.com/api/admin/user/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify(body)
    });
    if (res.ok) {
        alert("User info updated!");
        fetchAllUsers(token);
    } else {
        alert("Failed to update user info.");
    }
};

window.deleteUser = async function(userId) {
    // Prevent admin deletion
    const user = Array.from(document.querySelectorAll('.admin-user-card'))
        .find(card => card.querySelector('form').action.includes(userId));
    if (user && user.querySelector('input[name="email"]').value === "admin@gmail.com") {
        alert("Admin account cannot be deleted.");
        return;
    }
    if (!confirm("Delete this user?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`https://algosikhibackend.onrender.com/api/admin/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: token }
    });
    if (res.ok) {
        alert("User deleted");
        fetchAllUsers(token);
    } else {
        alert("Failed to delete user");
    }
};

window.toggleCompletion = async function(userId, topic, sub, isDone) {
    const token = localStorage.getItem("token");
    const res = await fetch(`https://algosikhibackend.onrender.com/api/admin/user/${userId}/progress`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({ topic, sub, isDone })
    });
    if (!res.ok) alert("Failed to update progress");
};

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}