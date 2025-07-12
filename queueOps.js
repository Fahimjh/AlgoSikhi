// === QUEUE OPERATIONS JS ===

const params = new URLSearchParams(window.location.search);
const queueParam = params.get("queue");

function parseQueue(str) {
    try {
        const parsed = str ? JSON.parse(decodeURIComponent(str)) : [];
        return parsed.map(obj => Number(obj.value));
    } catch {
        return [];
    }
}

let queue = parseQueue(queueParam);
if (!queue.length) queue = [10, 20, 30];

const typeSelect = document.querySelector(".types");
const opSelect = document.querySelector(".Operations");
const valueInput = document.getElementById("value");
const performBtn = document.querySelector(".oprqueueBtn");
const queueContainer = document.getElementById("queue");
const closeBtn = document.querySelector(".close-btn");
const homePageBtn = document.querySelector(".homePageBtn");
const startBtn = document.getElementById("start-visualization");

// === Toggle Visualization Section ===
startBtn.addEventListener("click", () => {
    document.querySelector(".container").classList.toggle("visualization-active");
    startBtn.innerText = document.querySelector(".container").classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Queue operation";
});
closeBtn.addEventListener("click", () => {
    document.querySelector(".container").classList.remove("visualization-active");
    startBtn.innerText = "Visualize Queue operation";
});

// === Render Queue ===
function renderQueue(arr, highlights = []) {
    queueContainer.innerHTML = "";
    arr.forEach((val) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        if (highlights.includes(val)) {
            cell.classList.add("active");
        }
        queueContainer.appendChild(cell);
    });
}

renderQueue(queue);

// === Toggle Input Field & Operation Options ===
const allOps = {
    queue: ["enqueue()", "dequeue()", "front()", "rear()", "empty()", "size()"],
    priority_queue: ["push()", "pop()", "top()", "empty()", "size()"]
};

function updateOperations() {
    const selectedType = typeSelect.value;
    opSelect.innerHTML = "";
    allOps[selectedType].forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        opSelect.appendChild(option);
    });
    toggleInputField();
}
typeSelect.addEventListener("change", updateOperations);
opSelect.addEventListener("change", toggleInputField);
updateOperations();

function toggleInputField() {
    const op = opSelect.value;
    const noInputOps = ["dequeue()", "front()", "rear()", "pop()", "top()", "empty()", "size()"];
    valueInput.style.display = noInputOps.includes(op) ? "none" : "inline-block";
    valueInput.placeholder = "Enter value";
}

// === Perform Operation ===
performBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const op = opSelect.value;
    const val = valueInput.value.trim();
    let highlights = [];

    if (!val && !["dequeue()", "front()", "rear()", "pop()", "top()", "empty()", "size()"].includes(op)) {
        alert("Please enter a value.");
        return;
    }

    if (type === "queue") {
        if (op === "enqueue()") {
            const num = Number(val);
            queue.push(num); // add to rear (right)
            highlights = [num];
        } else if (op === "dequeue()") {
            if (!queue.length) return alert("Queue is empty.");
            const removed = queue.shift(); // remove from front (left)
            alert(`Dequeued: ${removed}`);
        } else if (op === "front()") {
            if (!queue.length) return alert("Queue is empty.");
            alert(`Front: ${queue[0]}`);
            highlights = [queue[0]];
        } else if (op === "rear()") {
            if (!queue.length) return alert("Queue is empty.");
            alert(`Rear: ${queue[queue.length - 1]}`);
            highlights = [queue[queue.length - 1]];
        } else if (op === "empty()") {
            alert(queue.length === 0 ? "Queue is empty" : "Not empty");
        } else if (op === "size()") {
            alert(`Size = ${queue.length}`);
        }
    }

    else if (type === "priority_queue") {
        if (op === "push()") {
            const num = Number(val);
            queue.push(num); // insert normally
            queue.sort((a, b) => b - a); // keep descending order
            highlights = [num];
        } else if (op === "pop()") {
            if (!queue.length) return alert("Priority Queue is empty.");
            const removed = queue.shift(); // remove highest priority from front
            alert(`Popped: ${removed}`);
        } else if (op === "top()") {
            if (!queue.length) return alert("Priority Queue is empty.");
            alert(`Top: ${queue[0]}`);
            highlights = [queue[0]];
        } else if (op === "empty()") {
            alert(queue.length === 0 ? "Priority Queue is empty" : "Not empty");
        } else if (op === "size()") {
            alert(`Size = ${queue.length}`);
        }
    }

    renderQueue(queue, highlights);
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
