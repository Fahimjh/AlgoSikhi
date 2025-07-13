const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const queueContainer = document.getElementById("queue");
const typeSelect = document.querySelector(".types");
const opSelect = document.querySelector(".Operations");
const valueInput = document.getElementById("value");
const oprBtn = document.querySelector(".oprqueueBtn");
const homePageBtn = document.querySelector(".homePageBtn");
const setIntroBtn = document.querySelector(".setIntroBtn");

let queueData = [];
let priorityQueueData = [];
let currentStructure = [];

// === Parse Query Params ===
function parseQueueData() {
    const params = new URLSearchParams(window.location.search);
    
    function parseQueueParam(param) {
        try {
            if (!param) return [];
            const decoded = decodeURIComponent(param);
            const parsed = JSON.parse(decoded);
            return parsed.map(obj => obj.value).filter(v => v !== undefined);
        } catch (e) {
            console.error("Error parsing queue:", e);
            return [];
        }
    }

    queueData = parseQueueParam(params.get("queue"));
    priorityQueueData = parseQueueParam(params.get("priority_queue"));

    // Debug output to verify parsing
    console.log("Normal Queue Data:", queueData);
    console.log("Priority Queue Data:", priorityQueueData);
    
    // Only use defaults if BOTH queues are empty
    if (queueData.length === 0 && priorityQueueData.length === 0) {
        queueData = [10, 20, 30];
        priorityQueueData = [30, 20, 10]; // Different values
    }
}

// Initialize
parseQueueData();

function updateCurrentStructure() {
    currentStructure = typeSelect.value === "priority_queue" 
        ? [...priorityQueueData] 
        : [...queueData];
}

// === Setup Initial State ===
window.addEventListener("DOMContentLoaded", () => {
    // Set initial type based on available data
    typeSelect.value = priorityQueueData.length > 0 ? "priority_queue" : "queue";
    
    updateCurrentStructure();
    updateOperations();
    renderQueue(currentStructure);
});

// === Toggle Visualization Section ===
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Queue";
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Queue";
});

// === Render Queue ===
function renderQueue(arr, highlight = null) {
    queueContainer.innerHTML = "";
    arr.forEach((val, index) => {
        const cell = document.createElement("div");
        cell.className = `cell ${typeSelect.value === "priority_queue" ? "priority-cell" : ""}`;
        cell.textContent = val;
        if (val === highlight) cell.classList.add("active");
        queueContainer.appendChild(cell);
    });
}

// === Update Operations Dropdown ===
function updateOperations() {
    const selectedType = typeSelect.value;
    const allOps = {
        queue: ["enqueue()", "dequeue()", "front()", "rear()", "empty()", "size()"],
        priority_queue: ["push()", "pop()", "top()", "empty()", "size()"]
    };
    opSelect.innerHTML = "";
    allOps[selectedType].forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        opSelect.appendChild(option);
    });
    toggleInput();
}

typeSelect.addEventListener("change", () => {
    updateCurrentStructure();
    updateOperations();
    renderQueue(currentStructure);
});

// === Toggle Input Field Visibility ===
function toggleInput() {
    const op = opSelect.value;
    const hideOps = ["dequeue()", "pop()", "top()", "front()", "rear()", "empty()", "size()"];
    valueInput.style.display = hideOps.includes(op) ? "none" : "inline-block";
}

opSelect.addEventListener("change", toggleInput);
toggleInput();

// === Perform Operation ===
oprBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const op = opSelect.value;
    const raw = valueInput.value.trim();
    const values = raw.split(",").map(v => v.trim()).filter(Boolean);
    let highlight = null;

    switch (op) {
        case "enqueue()":
        case "push()":
            if (!raw) return alert("Please enter a value.");
            currentStructure.push(values[0]);
            highlight = values[0];
            break;
        case "dequeue()":
        case "pop()":
            if (currentStructure.length === 0) return alert("Structure is empty.");
            const removed = currentStructure.shift();
            alert(`Removed: ${removed}`);
            break;
        case "front()":
        case "top()":
            if (currentStructure.length === 0) return alert("Structure is empty.");
            alert(`Front: ${currentStructure[0]}`);
            highlight = currentStructure[0];
            break;
        case "rear()":
            if (currentStructure.length === 0) return alert("Structure is empty.");
            alert(`Rear: ${currentStructure[currentStructure.length - 1]}`);
            highlight = currentStructure[currentStructure.length - 1];
            break;
        case "empty()":
            alert(currentStructure.length === 0 ? "Structure is empty" : "Structure is not empty");
            break;
        case "size()":
            alert(`Size = ${currentStructure.length}`);
            break;
    }

    // Update the correct data array
    if (typeSelect.value === "priority_queue") {
        priorityQueueData = [...currentStructure];
        if (op === "push()") {
            priorityQueueData.sort((a, b) => b - a);
            currentStructure = [...priorityQueueData];
        }
    } else {
        queueData = [...currentStructure];
    }

    renderQueue(currentStructure, highlight);
    sendProgress(type, op);
    valueInput.value = "";
});

// === Backend Progress Update ===
function sendProgress(type, op) {
    const opMap = {
        "enqueue()": "enqueue",
        "dequeue()": "dequeue",
        "front()": "front",
        "rear()": "rear",
        "push()": "push",
        "pop()": "pop",
        "top()": "top",
        "empty()": "empty",
        "size()": "size"
    };

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            topic: `${type} Operations`,
            subtopic: opMap[op],
            value: true
        })
    })
        .then(res => res.json())
        .then(() => console.log(`✅ Progress updated: ${type} - ${opMap[op]}`))
        .catch(err => console.error("❌ Progress update error:", err));
}

// === Navigation ===
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});