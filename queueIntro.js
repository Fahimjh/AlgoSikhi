// === queueIntro.js ===
const typeSelect = document.querySelector(".types");
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const createBtn = document.querySelector(".crtqueueBtn");
const queueOpsBtn = document.querySelector(".queueOpsBtn");
const homePageBtn = document.querySelector(".homePageBtn");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

let queueValues = [];
let priorityQueueValues = [];


// Pseudocode data for stack creation
const pseudocodeData = {
    queue: [
        "FUNCTION createQueue(values)",
        "  IF values is empty THEN",
        "    RETURN error",
        "  END IF",
        "  LET queue = empty list",
        "  FOR EACH v IN values",
        "    ENQUEUE v TO queue",
        "  END FOR",
        "  RETURN queue",
        "END FUNCTION"
    ],
    priority_queue: [
        "FUNCTION createPriorityQueue(values)",
        "  IF values is empty THEN",
        "    RETURN error",
        "  END IF",
        "  LET pq = empty list",
        "  FOR EACH v IN values",
        "    ENQUEUE v TO pq",
        "  END FOR",
        "  SORT pq (descending)",
        "  RETURN pq",
        "END FUNCTION"
    ]
};

function renderPseudocode(type = typeSelect.value) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    const lines = pseudocodeData[type];
    if (!lines) return;
    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

function highlightLines(...indices) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    indices.forEach(index => {
        const targetLine = document.getElementById(`line-${index}`);
        if (targetLine) targetLine.classList.add("highlight");
    });
}


// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize queue creation";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(typeSelect.value);
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize queue creation";
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
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

createBtn.addEventListener("click", async () => {
    const raw = valueInput.value.trim();
    const selectedType = typeSelect.value;

    renderPseudocode(selectedType);

    if (!raw) {
        highlightLines(1);
        await delay(300);
        highlightLines(2);
        await delay(300);
        alert("Please enter some values.");
        return;
    }

    highlightLines(4); // LET queue/pq = empty list
    await delay(300);

    const values = raw.split(",").map(v => Number(v.trim())).filter(v => !isNaN(v));

    if (!values.length) {
        highlightLines(1);
        await delay(300);
        highlightLines(2);
        await delay(300);
        alert("Please enter valid numeric values.");
        return;
    }

    if (selectedType === "queue") {
        queueValues = [];
        for (let i = 0; i < values.length; i++) {
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            queueValues.push(values[i]);
            renderQueue(queueValues);
        }
        highlightLines(8); // RETURN queue
    } else {
        highlightLines(4);
        await delay(300);
        priorityQueueValues = [];
        for (let i = 0; i < values.length; i++) {
            highlightLines(5); // FOR EACH v IN values
            await delay(300);
            highlightLines(6);
            await delay(300);
            priorityQueueValues.push(values[i]);
            renderQueue(priorityQueueValues);
        }
        highlightLines(8); // SORT pq (descending)
        await delay(300);
        highlightLines(9);
        priorityQueueValues.sort((a, b) => b - a);
        renderQueue(priorityQueueValues);
    }

    valueInput.value = "";
    updateProgress(selectedType);
});

typeSelect.addEventListener("change", () => {
    document.getElementById("queue").innerHTML = "";
    renderPseudocode(typeSelect.value);
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
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});