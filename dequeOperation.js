// Get params from URL
const params = new URLSearchParams(window.location.search);
const values = params.get("values");
let dequeValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const operationsSelect = document.querySelector(".Operations");
const oprBtn = document.querySelector(".oprBtn");
const listBasicBtn = document.querySelector(".listBasic");
const homePageBtn = document.querySelector(".homePage");
const pushBackInfo = document.getElementById("pushBackInfo"); // Optional info section

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Deque Operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Deque Operations";
});

// Toggle input visibility based on selected operation
function toggleValueInput() {
    const op = operationsSelect.value;
    if (op === "pop_back()" || op === "pop_front()") {
        valueInput.style.display = "none"; // hide input
    } else {
        valueInput.style.display = "inline-block"; // show input
        valueInput.placeholder = (op === "push_back()")
            ? "Enter value for push_back"
            : (op === "push_front()")
            ? "Enter value for push_front"
            : "";
    }
}
toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

// Render deque visually
function renderDeque(highlightIndices = []) {
    const dequeContainer = document.getElementById("deque");
    dequeContainer.innerHTML = '';
    dequeValues.forEach((val, idx) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('active');
        dequeContainer.appendChild(cell);
    });
}

// Initial render
renderDeque();

// Perform deque operation
oprBtn.addEventListener("click", () => {
    const operation = operationsSelect.value;
    const val = valueInput.value.trim();

    if (pushBackInfo) pushBackInfo.style.display = "none";

    if (operation === "push_back()") {
        if (val === "" || isNaN(Number(val))) {
            alert("Please enter a valid value to push.");
            return;
        }
        dequeValues.push(Number(val));
        renderDeque([dequeValues.length - 1]);
        if (pushBackInfo) pushBackInfo.style.display = "block";

    } else if (operation === "pop_back()") {
        if (dequeValues.length === 0) {
            alert("Deque is already empty.");
            return;
        }
        dequeValues.pop();
        renderDeque();

    } else if (operation === "push_front()") {
        if (val === "" || isNaN(Number(val))) {
            alert("Please enter a valid value to push.");
            return;
        }
        dequeValues.unshift(Number(val));
        renderDeque([0]);

    } else if (operation === "pop_front()") {
        if (dequeValues.length === 0) {
            alert("Deque is already empty.");
            return;
        }
        dequeValues.shift();
        renderDeque();
    }

    // ✅ Progress update to backend
    const methodToSubtopic = {
        "push_back()": "pushBack",
        "pop_back()": "popBack",
        "push_front()": "pushFront",
        "pop_front()": "popFront"
    };

    const token = localStorage.getItem("token");

    if (token && methodToSubtopic[operation]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Deque Operations",
                subtopic: methodToSubtopic[operation],
                value: true
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for:", methodToSubtopic[operation]);
        })
        .catch(err => {
            console.error("❌ Progress update failed:", err);
        });
    }

    valueInput.value = "";
});

// Navigation buttons
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
listBasicBtn.addEventListener("click", () => {
    window.location.href = "listBasic.html";
});
