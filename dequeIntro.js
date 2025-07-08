
// Declare deque values in the global scope
let dequeValues = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createDequeBtn = document.querySelector(".crtDequeBtn");
const valueInput = document.getElementById("value");
const operationsSelect = document.querySelector(".Operations");
const dequeOpsBtn = document.querySelector(".dqOps");

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Vector Operations";// Close visualization
    } 
    else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";// Open visualization
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Vector Operations";
});


// Toggle input visibility based on selected operation
function toggleValueInput() {
    const op = operationsSelect.value;
    valueInput.value = "";

    if (op === "initialize") {
        valueInput.placeholder = "Enter comma-separated values (e.g. 1,2,3)";
    } else if (op === "assign") {
        valueInput.placeholder = "Count,Value (e.g. 5,7)";
    }
}
toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

// Create Deque based on operation
function createDeque() {
    const operation = operationsSelect.value;
    const val = valueInput.value.trim();

    if (!val) {
        dequeValues = [];
        renderDeque();
        return;
    }

    if (operation === "initialize") {
        dequeValues = val.split(",").map(v => v.trim()).filter(v => v !== "");
    } else if (operation === "assign") {
        const [countStr, valueStr] = val.split(",");
        const count = Number(countStr);
        const value = valueStr?.trim();

        if (isNaN(count) || count < 0 || value === undefined) {
            alert("Enter valid count and value (e.g. 5,7)");
            return;
        }
        dequeValues = Array(count).fill(value);
    }

    renderDeque();
    updateProgress();
}
createDequeBtn.addEventListener("click", createDeque);

// Render deque visually
function renderDeque() {
    const dequeContainer = document.getElementById("deque");
    dequeContainer.innerHTML = '';
    dequeValues.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        dequeContainer.appendChild(cell);
    });

}

// Update progress to backend
function updateProgress() {
    const token = localStorage.getItem("token");
    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Deque Introduction",
                subtopic: "dequeIntro",
                value: true
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for: dequeIntro");
        })
        .catch(err => console.error("❌ Progress update failed:", err));
    }
}

// Proceed to next page with deque values
dequeOpsBtn.addEventListener("click", () => {
    const size = dequeValues.length;
    const values = dequeValues.join(",");
    if (!size || values === "") {
        alert("Deque is empty. Please provide values before proceeding.");
    } else {
        const url = `dequeOperations.html?size=${size}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});

