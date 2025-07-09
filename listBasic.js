
// Declare deque values in the global scope
let listValues = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createlistBtn = document.querySelector(".crtlistBtn");
const valueInput = document.getElementById("value");
const operationsSelect = document.querySelector(".Operations");
const listOpsBtn = document.querySelector(".lstOps");

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
function createlist() {
    const operation = operationsSelect.value;
    const val = valueInput.value.trim();

    if (!val) {
        listValues = [];
        renderlist();
        return;
    }

    if (operation === "initialize") {
        listValues = val.split(",").map(v => v.trim()).filter(v => v !== "");
    } else if (operation === "assign") {
        const [countStr, valueStr] = val.split(",");
        const count = Number(countStr);
        const value = valueStr?.trim();

        if (isNaN(count) || count < 0 || value === undefined) {
            alert("Enter valid count and value (e.g. 5,7)");
            return;
        }
        listValues = Array(count).fill(value);
    }

    renderlist();
    updateProgress();
}
createlistBtn.addEventListener("click", createlist);

// Render list visually
function renderlist() {
    const listContainer = document.getElementById("list");
    listContainer.innerHTML = '';
    listValues.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        listContainer.appendChild(cell);
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
                topic: "list Introduction",
                subtopic: "listIntro",
                value: true
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for: listIntro");
        })
        .catch(err => console.error("❌ Progress update failed:", err));
    }
}

// Proceed to next page with deque values
listOpsBtn.addEventListener("click", () => {
    const values = listValues.join(",");
    if(values === "") {
        alert("The list is empty. Please provide valid values for the list before proceeding.");
    }
    else{
        const url = `listOperation.html?values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});

