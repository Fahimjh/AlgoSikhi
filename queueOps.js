const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const queueContainer = document.getElementById("queue");
const typeSelect = document.querySelector(".types");
const opSelect = document.querySelector(".Operations");
const valueInput = document.getElementById("value");
const oprBtn = document.querySelector(".oprqueueBtn");
const homePageBtn = document.querySelector(".homePageBtn");
const homeBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

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
    if (queueData.length === 0 && priorityQueueData.length === 0) {
        queueData = [10, 20, 30];
        priorityQueueData = [30, 20, 10];
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
    typeSelect.value = priorityQueueData.length > 0 ? "priority_queue" : "queue";
    updateCurrentStructure();
    updateOperations();
    renderQueue(currentStructure);
});

const queueOpsPseudocode = {
    "enqueue()": [
        "FUNCTION enqueue(queue, value)",
        "  ADD value TO rear of queue",
        "END FUNCTION"
    ],
    "dequeue()": [
        "FUNCTION dequeue(queue)",
        "  IF queue is empty THEN",
        "    RETURN error",
        "  END IF",
        "  REMOVE value FROM front of queue",
        "END FUNCTION"
    ],
    "front()": [
        "FUNCTION front(queue)",
        "  IF queue is empty THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN value AT front of queue",
        "END FUNCTION"
    ],
    "back()": [
        "FUNCTION back(queue)",
        "  IF queue is empty THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN value AT rear of queue",
        "END FUNCTION"
    ],
    "empty()": [
        "FUNCTION empty(queue)",
        "  RETURN queue.length == 0",
        "END FUNCTION"
    ],
    "size()": [
        "FUNCTION size(queue)",
        "  RETURN queue.length",
        "END FUNCTION"
    ],
    "push()": [
        "FUNCTION push(priority_queue, value)",
        "  ADD value TO priority_queue",
        "  SORT priority_queue (descending)",
        "END FUNCTION"
    ],
    "pop()": [
        "FUNCTION pop(priority_queue)",
        "  IF priority_queue is empty THEN",
        "    RETURN error",
        "  END IF",
        "  REMOVE highest priority value",
        "END FUNCTION"
    ],
    "top()": [
        "FUNCTION top(priority_queue)",
        "  IF priority_queue is empty THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN highest priority value",
        "END FUNCTION"
    ]
};

function renderPseudocode(operation) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    const lines = queueOpsPseudocode[operation];
    if (!lines) return;
    lines.forEach((line, idx) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${idx}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

function highlightLines(...indices) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    indices.forEach(idx => {
        const target = document.getElementById(`line-${idx}`);
        if (target) target.classList.add("highlight");
    });
}

startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize queue operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(opSelect.value);
    }
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize queue operations";
});

function renderQueue(arr, highlights = []) {
    queueContainer.innerHTML = "";
    arr.forEach((v, idx) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = v;
        if (highlights.includes(idx)) {
            cell.classList.add("active");
        }
        queueContainer.appendChild(cell);
    });
}

function updateOperations() {
    const selectedType = typeSelect.value;
    const allOps = {
        queue: ["enqueue()", "dequeue()", "front()", "back()", "empty()", "size()"],
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

function toggleInput() {
    const op = opSelect.value;
    renderPseudocode(op);
    const hideOps = ["dequeue()", "pop()", "top()", "front()", "back()", "empty()", "size()"];
    valueInput.style.display = hideOps.includes(op) ? "none" : "inline-block";
}
opSelect.addEventListener("change", toggleInput);
toggleInput();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

oprBtn.addEventListener("click", async () => {
    const op = opSelect.value;
    const raw = valueInput.value.trim();
    let highlights = [];

    // Use currentStructure for all operations
    if (typeSelect.value === "queue") {
        if (op === "enqueue()") {
            if (!raw) {
                alert("Please enter a value.");
                return;
            }
            highlightLines(0);
            await delay(300);
            currentStructure.push(raw);
            highlightLines(1);
            await delay(300);
            highlights = [currentStructure.length - 1];
            renderQueue(currentStructure, highlights);

        } else if (op === "dequeue()") {
            highlightLines(0);
            await delay(200);
            if (currentStructure.length === 0) {
                highlightLines(1);
                await delay(300);
                highlightLines(2);
                await delay(300);
                alert("Queue is empty. Cannot dequeue.");
                return;
            }
            highlightLines(4);
            await delay(300);
            const removed = currentStructure.shift();
            alert(`Dequeued: ${removed}`);
            renderQueue(currentStructure);

        } else if (op === "front()") {
            highlightLines(0);
            await delay(300);
            if (currentStructure.length === 0) {
                highlightLines(1);
                await delay(300);
                highlightLines(2);
                await delay(300);
                alert("Queue is empty.");
                return;
            }
            highlightLines(4);
            await delay(300);
            alert(`Front: ${currentStructure[0]}`);
            highlights = [0];
            renderQueue(currentStructure, highlights);

        } else if (op === "back()") {
            highlightLines(0);
            await delay(300);
            if (currentStructure.length === 0) {
                highlightLines(1);
                await delay(300);
                highlightLines(2);
                await delay(300);
                alert("Queue is empty.");
                return;
            }
            highlightLines(4);
            await delay(300);
            alert(`Back: ${currentStructure[currentStructure.length - 1]}`);
            highlights = [currentStructure.length - 1];
            renderQueue(currentStructure, highlights);

        } else if (op === "empty()") {
            highlightLines(1);
            await delay(300);
            alert(currentStructure.length === 0 ? "Queue is empty" : "Queue is not empty");

        } else if (op === "size()") {
            highlightLines(1);
            await delay(300);
            alert(`Size = ${currentStructure.length}`);
        }
        queueData = [...currentStructure];
    } else {
        // priority_queue
        if (op === "push()") {
            if (!raw) {
                alert("Please enter a value.");
                return;
            }
            highlightLines(0);
            await delay(300);
            currentStructure.push(Number(raw));
            highlightLines(1);
            await delay(300);
            currentStructure.sort((a, b) => b - a);
            highlightLines(2);
            await delay(300);
            highlights = [0];
            renderQueue(currentStructure, highlights);

        } else if (op === "pop()") {
            highlightLines(0);
            await delay(200);
            if (currentStructure.length === 0) {
                highlightLines(1);
                await delay(300);
                highlightLines(2);
                await delay(300);
                alert("Priority queue is empty. Cannot pop.");
                return;
            }
            highlightLines(4);
            await delay(300);
            const removed = currentStructure.shift();
            alert(`Popped: ${removed}`);
            renderQueue(currentStructure);

        } else if (op === "top()") {
            highlightLines(0);
            await delay(300);
            if (currentStructure.length === 0) {
                highlightLines(1);
                await delay(300);
                highlightLines(2);
                await delay(300);
                alert("Priority queue is empty.");
                return;
            }
            highlightLines(4);
            await delay(300);
            alert(`Top: ${currentStructure[0]}`);
            highlights = [0];
            renderQueue(currentStructure, highlights);

        } else if (op === "empty()") {
            highlightLines(1);
            await delay(300);
            alert(currentStructure.length === 0 ? "Priority queue is empty" : "Priority queue is not empty");

        } else if (op === "size()") {
            highlightLines(1);
            await delay(300);
            alert(`Size = ${currentStructure.length}`);
        }
        priorityQueueData = [...currentStructure];
    }

    sendProgress(op);
    valueInput.value = "";
});

function sendProgress(operation) {
    const methodQueue = {
        "enqueue()": "enqueue",
        "dequeue()": "dequeue",
        "front()": "front",
        "back()": "back",
        "empty()": "empty",
        "size()": "size",
        "push()": "push",
        "pop()": "pop",
        "top()": "top"
    };

    // Decide topic based on type
    const topic =
        typeSelect.value === "priority_queue"
            ? "priority_queue Operations"
            : "queue Operations";

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            topic,
            subtopic: methodQueue[operation],
            value: true
        })
    })
        .then(res => res.json())
        .then(() => console.log(`✅ Progress updated for ${topic} → ${methodQueue[operation]}`))
        .catch(err => console.error("❌ Progress update error:", err));
}

// Navigation
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});



