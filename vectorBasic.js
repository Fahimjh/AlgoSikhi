// Get params from URL
const params = new URLSearchParams(window.location.search);
let size = params.get("size");
const values = params.get("values");
let vectorValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];
let vectorCapacity = size ? Number(size) : vectorValues.length;
size = size ? Number(size) : vectorValues.length;

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const oprBtn = document.querySelector(".oprBtn");
const operationsSelect = document.querySelector(".Operations");
const valueInput = document.getElementById("value");
const pushBackInfo = document.querySelector('.push_backInfo');

// Visualization section show/hide
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Vector Operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Vector Operations";
});

// Vector Create button 
const createVectorBtn = document.querySelector(".vecCreate");
if (createVectorBtn) {
    createVectorBtn.addEventListener("click", () => {
        window.location.href = "vector.html";
    });
}

// Render vector visualization
function renderVector(highlightIndices = [], sorted = false) {
    const vectorContainer = document.getElementById("vectorBasic");
    vectorContainer.innerHTML = '';
    vectorValues.forEach((val, idx) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('active'); // <-- use 'active'
        if (sorted) cell.classList.add('sorted');
        vectorContainer.appendChild(cell);
    });
    document.getElementById("vectorSize").textContent = vectorValues.length;
    document.getElementById("vectorCapacity").textContent = vectorCapacity;
}

// Hide value input unless push_back() or vector[i] is selected
function toggleValueInput() {
    if (
        operationsSelect.value === "push_back()" ||
        operationsSelect.value === "vector[i]"
    ) {
        valueInput.style.display = "inline-block";
    } else {
        valueInput.style.display = "none";
    }
}
toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

// Perform vector operation
oprBtn.addEventListener("click", () => {
    const operation = operationsSelect.value;
    const val = valueInput.value;

    // Hide push_backInfo by default
    pushBackInfo.style.display = "none";

    if (operation === "push_back()") {
        if (val === "" || isNaN(Number(val))) {
            alert("Please enter a valid value to push.");
            return;
        }
        vectorValues.push(Number(val));
        // Simulate capacity doubling
        if (vectorValues.length > vectorCapacity) {
            vectorCapacity = vectorCapacity === 0 ? 1 : vectorCapacity * 2;
        }
        renderVector([vectorValues.length - 1]);
        // Show push_backInfo only for push_back()
        pushBackInfo.style.display = "block";
    } else if (operation === "pop_back()") {
        if (vectorValues.length === 0) {
            alert("Vector is already empty.");
            return;
        }
        vectorValues.pop();
        renderVector();
    } else if (operation === "clear()") {
        vectorValues = [];
        renderVector();
    } else if (operation === "vector[i]") {
        if (val === "" || isNaN(Number(val))) {
            alert("Please enter a valid index.");
            return;
        }
        const idx = Number(val);
        if (idx < 0 || idx >= vectorValues.length) {
            alert("Index out of bounds.");
            return;
        }
        renderVector([idx]);
        alert(`vector[${idx}] = ${vectorValues[idx]}`);
    } else if (operation === "front()") {
        if (vectorValues.length === 0) {
            alert("Vector is empty.");
            return;
        }
        renderVector([0]);
        alert(`front() = ${vectorValues[0]}`);
    } else if (operation === "back()") {
        if (vectorValues.length === 0) {
            alert("Vector is empty.");
            return;
        }
        renderVector([vectorValues.length - 1]);
        alert(`back() = ${vectorValues[vectorValues.length - 1]}`);
    } else if (operation === "empty()") {
        alert(vectorValues.length === 0 ? "Vector is empty." : "Vector is not empty.");
        renderVector();
    }
    valueInput.value = "";

    // Progress update for Vector Basic Operations
    const methodToSubtopic = {
        "push_back()": "pushBack",
        "pop_back()": "popBack",
        "clear()": "clear",
        "size()": "size",
        "vector[i]": "vector[i]",
        "front()": "front",
        "back()": "back",
        "empty()": "empty"
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
                topic: "Vector Basic Operations",
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
});

// Initial render
renderVector();

// Vector Sort button navigation
const vectorSortBtn = document.querySelector(".vecSort");
if (vectorSortBtn) {
    vectorSortBtn.addEventListener("click", () => {
        const values = vectorValues.join(",");
        const url = `vectorSort.html?size=${vectorValues.length}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    });
}
