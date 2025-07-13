// === queueIntro.js ===
const typeSelect = document.querySelector(".types");
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const createBtn = document.querySelector(".crtqueueBtn");
const queueOpsBtn = document.querySelector(".queueOpsBtn");
const homePageBtn = document.querySelector(".homePageBtn");

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
    const selectedType = typeSelect.value;

    if (!raw) {
        alert("Please enter some values.");
        return;
    }

    const values = raw.split(",").map(v => Number(v.trim())).filter(v => !isNaN(v));

    if (!values.length) {
        alert("Please enter valid numeric values.");
        return;
    }

    // Store values differently based on type
    if (selectedType === "queue") {
        queueValues = [...values]; // Regular queue (FIFO order)
    } else {
        priorityQueueValues = [...values].sort((a, b) => b - a); // Priority queue (sorted)
    }

    renderQueue(selectedType === "queue" ? queueValues : priorityQueueValues);
    valueInput.value = "";
    updateProgress(selectedType);
});

typeSelect.addEventListener("change", () => {
    document.getElementById("queue").innerHTML = "";
});


// === BACKEND PROGRESS ===
function updateProgress(type) {
    const subtopic = {
        queue: "queue",
        priority_queue: "priority_queue"
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
// === NAVIGATION ===
queueOpsBtn.addEventListener("click", () => {
    if (!queueValues.length && !priorityQueueValues.length) {
        alert("Please create at least one queue.");
        return;
    }

    // Prepare parameters with proper data structure
    const queueParam = queueValues.length
        ? `queue=${encodeURIComponent(JSON.stringify(queueValues.map(v => ({ value: v }))))}`
        : "";

    const priorityParam = priorityQueueValues.length
        ? `priority_queue=${encodeURIComponent(JSON.stringify(priorityQueueValues.map(v => ({ value: v }))))}`
        : "";

    const combinedParams = [queueParam, priorityParam].filter(Boolean).join("&");
    window.location.href = `queueOps.html?${combinedParams}`;
});

homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
