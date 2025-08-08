document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
        alert("You must be logged in to view this page");
        window.location.href = "login.html";
        return;
    }
    else {
        // Display username with capitalized first letter
        const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
        document.getElementById("username").textContent = formattedUsername;

        // Add slight delay for smoother animation
        setTimeout(() => {
            fetchProgressData(token);
        }, 200);
    }

});

async function fetchProgressData(token) {
    try {
        // Show loading state
        document.getElementById("progressDetails").innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Loading your progress...
            </div>
        `;

        const response = await fetch("https://algosikhibackend.onrender.com/api/progress", {
            headers: { Authorization: token }
        });

        if (!response.ok) throw new Error("Failed to fetch progress");

        const progress = await response.json();
        renderProgressData(progress);

    } catch (error) {
        console.error("Error loading progress:", error);
        document.getElementById("progressDetails").innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i> Failed to load progress data. Please try again later.
            </div>
        `;
    }
}

function renderProgressData(progress) {
    const progressContainer = document.getElementById("progressDetails");
    let total = 0, completed = 0;

    // Clear previous content
    progressContainer.innerHTML = '';

    for (const topic in topics) {
        const topicDiv = document.createElement("div");
        topicDiv.className = "topic-card";

        // Inside renderProgressData(), after creating topicDiv but before adding content:
        topicDiv.addEventListener("click", () => {
            const pageMap = generateTopicPageMap();
            window.location.href = pageMap[topic] || "index.html";
        });

        // Add this new function anywhere in your dashboard.js
        function generateTopicPageMap() {
            return {
                "Array Introduction": "array.html",
                "Array Sorting": "arraySort.html",
                "Array Search": "arraySearch.html",
                "Array Update": "arrayUpdate.html",
                "Vector Introduction": "vector.html",
                "Vector Basic Operations": "vectorBasic.html",
                "Vector Sort": "vectorSort.html",
                "Vector Advanced Operations": "vectorAdvanced.html",
                "Deque Introduction": "dequeIntro.html",
                "Deque Operations": "dequeOperation.html",
                "list Introduction": "listBasic.html",
                "list Operations": "listOperation.html",
                "Map Introduction": "mapIntro.html",
                "map Operations": "mapOperation.html",
                "multimap Operations": "mapOperation.html",
                "unordered_map Operations": "mapOperation.html",
                "Set Introduction": "setIntro.html",
                "set Operations": "setOperation.html",
                "multiset Operations": "setOperation.html",
                "unordered_set Operations": "setOperation.html",
                "Stack Introduction": "stackIntro.html",
                "Stack Operations": "stackOperation.html",
                "Queue Introduction": "queueIntro.html",
                "queue Operations": "queueOps.html",
                "queupriority_queue Operations": "queueOps.html",
            };
        }

        const topicTitle = document.createElement("div");
        topicTitle.className = "topic-title";

        // Add icon based on completion status
        const topicCompletion = calculateTopicCompletion(progress, topic, topics[topic]);
        const icon = document.createElement("i");
        icon.className = topicCompletion === 100 ? "fas fa-check-circle" : "fas fa-book-open";
        icon.style.color = topicCompletion === 100 ? "var(--primary)" : "var(--gray)";
        topicTitle.appendChild(icon);

        const titleText = document.createElement("span");
        titleText.textContent = topic;
        topicTitle.appendChild(titleText);

        // Add completion percentage
        const percentSpan = document.createElement("span");
        percentSpan.className = "completion-percent";
        percentSpan.textContent = `${topicCompletion}%`;
        percentSpan.style.color = topicCompletion === 100 ? "var(--primary)" : "var(--gray)";
        percentSpan.style.marginLeft = "auto";
        topicTitle.appendChild(percentSpan);

        topicDiv.appendChild(topicTitle);

        const subtopics = topics[topic];
        const subtopicsList = document.createElement("div");
        subtopicsList.className = "subtopics-list";

        for (const sub in subtopics) {
            const isDone = progress?.[topic]?.[sub] || false;
            total++;
            if (isDone) completed++;

            const subDiv = document.createElement("div");
            subDiv.className = "subtopic";

            const statusIcon = document.createElement("div");
            statusIcon.className = isDone ? "status-icon status-done" : "status-icon status-pending";
            statusIcon.innerHTML = isDone ? '<i class="fas fa-check"></i>' : '<i class="far fa-circle"></i>';

            const subName = document.createElement("span");
            subName.className = "subtopic-name";
            subName.textContent = subtopics[sub];

            subDiv.appendChild(statusIcon);
            subDiv.appendChild(subName);
            subtopicsList.appendChild(subDiv);
        }

        topicDiv.appendChild(subtopicsList);
        progressContainer.appendChild(topicDiv);
    }

    // Update progress bar with animation
    const percent = total ? Math.round((completed / total) * 100) : 0;
    document.getElementById("progressPercent").textContent = percent + "%";

    // Animate progress bar
    setTimeout(() => {
        document.getElementById("progressFill").style.width = percent + "%";
    }, 100);
}

function calculateTopicCompletion(progress, topic, subtopics) {
    let completed = 0;
    for (const sub in subtopics) {
        if (progress?.[topic]?.[sub]) completed++;
    }
    return subtopics ? Math.round((completed / Object.keys(subtopics).length) * 100) : 0;
}

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.clear();
    window.location.href = "index.html";
}

async function deleteAccount() {
    const confirmDelete = confirm("Are you absolutely sure you want to delete your account?\n\nThis will permanently erase all your learning progress and cannot be undone.");
    if (!confirmDelete) return;

    try {
        const response = await fetch("https://algosikhibackend.onrender.com/api/auth/delete", {
            method: "DELETE",
            headers: { Authorization: localStorage.getItem("token") }
        });

        if (!response.ok) throw new Error("Failed to delete account");

        const data = await response.json();
        alert(data.message || "Account deleted successfully");
        localStorage.clear();
        window.location.href = "index.html";

    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete account. Please try again later.");
    }
}

function goToHomepage() {
    window.location.href = "index.html";
}