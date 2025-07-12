// === queueIntro.js ===

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const createBtn = document.querySelector(".crtqueueBtn");
const queueOpsBtn = document.querySelector(".queueOpsBtn");
const homePageBtn = document.querySelector(".homePageBtn");

// Queue containers
let queueValues = [];
let priorityQueueValues = [];

// === TOGGLE VISUALIZATION SECTION ===
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Queue Creation";
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Queue Creation";
});

// === RENDER QUEUE ===
function renderQueue(arr) {
    const queueContainer = document.getElementById("queue");
    queueContainer.innerHTML = "";
    arr.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        queueContainer.appendChild(cell);
    });
}

// === CREATE QUEUE ===
createBtn.addEventListener("click", () => {
    const raw = valueInput.value.trim();

    if (!raw) {
        alert("Please enter some values.");
        return;
    }

    const values = raw.split(",").map(v => v.trim()).filter(Boolean);

    // Save queue (FIFO) and priority_queue (descending sort)
    queueValues = [...values];
    priorityQueueValues = [...values].sort((a, b) => b - a);

    renderQueue(queueValues); // Render queue by default

    // Set data-url for next page
    const buildParam = (type, values) =>
        `${type}=${encodeURIComponent(JSON.stringify(values.map(v => ({ value: v }))))}`;

    const params = [
        buildParam("queue", queueValues),
        buildParam("priority_queue", priorityQueueValues)
    ].join("&");

    queueOpsBtn.setAttribute("data-url", params);

    // ✅ Send backend progress
    updateProgress("queue");
    updateProgress("priority_queue");

    valueInput.value = "";
});

// === BACKEND PROGRESS ===
function updateProgress(type) {
    const subtopic = {
        queue: "queueIntro",
        priority_queue: "priorityQueueIntro"
    };

    const token = localStorage.getItem("token");
    if (!token || !subtopic[type]) return;

    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            topic: "Queue Introduction",
            subtopic: subtopic[type],
            value: true
        })
    })
        .then(res => res.json())
        .then(data => console.log(`✅ Progress updated for ${type}`))
        .catch(err => console.error("❌ Backend error:", err));
}

// === NAVIGATION ===
queueOpsBtn.addEventListener("click", () => {
    const url = "queueOps.html?" + queueOpsBtn.getAttribute("data-url");
    window.location.href = url;
});
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
