// Get params from URL
const params = new URLSearchParams(window.location.search);
let size = params.get("size");
const values = params.get("values");
let vectorValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];
let vectorCapacity = size ? Number(size) : vectorValues.length;
size = size ? Number(size) : vectorValues.length;

// For swap demo
let vector2 = [100, 200, 300];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const oprBtn = document.querySelector(".oprBtn");
const operationsSelect = document.querySelector(".Operations");
const vectorInfoSize = document.getElementById("vectorSize");
const vectorInfoCapacity = document.getElementById("vectorCapacity");
const vectorDisplay = document.getElementById("vectorAdvanced");
const vecSortBtn = document.querySelector(".vecSort");
const homePageBtn = document.querySelector(".homePage");

// Visualization section show/hide
startBtn.addEventListener("click", () => {
    container.classList.add("visualization-active");
});
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
});

// Render vector visualization
function renderVector(highlightIndices = []) {
    vectorDisplay.innerHTML = '';
    vectorValues.forEach((val, idx) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('active');
        vectorDisplay.appendChild(cell);
    });
    vectorInfoSize.textContent = vectorValues.length;
    vectorInfoCapacity.textContent = vectorCapacity;
}

// Hide/show value input based on operation
const value1 = document.getElementById("value1");
const value2 = document.getElementById("value2");
const vectorTwoDisplay = document.getElementById("vectorTwoDisplay");

function toggleValueInput() {
    const op = operationsSelect.value;

    // Reset input fields and visibility
    value1.style.display = "none";
    value2.style.display = "none";
    value1.value = "";
    value2.value = "";

    if (op === "insert") {
        value1.style.display = "inline-block";
        value1.placeholder = "Position";

        value2.style.display = "inline-block";
        value2.placeholder = "Value";
    } else if (op === "assign") {
        value2.style.display = "inline-block";
        value2.placeholder = "Count,Value (e.g. 5,7)";
    } else if (op === "erase") {
        value1.style.display = "inline-block";
        value1.placeholder = "Position to erase";
    } else if (op === "swap") {
        value2.style.display = "inline-block";
        value2.placeholder = "Enter values for vector2 (e.g. 1,2,3)";
        value1.style.display = "none";
    } else if (op === "iterate") {
        value2.style.display = "inline-block";
        value2.placeholder = "start,end (e.g. 0,3)";
    }

    vectorTwoDisplay.style.display = "none";
}

toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

// Mapping for backend progress update
const methodToSubtopic = {
    insert: "insert",
    erase: "erase",
    swap: "swap",
    begin_end: "begin_end",
    rbegin_rend: "rbegin_rend",
    iterate: "iterate",
    assign: "assign"
};

oprBtn.addEventListener("click", () => {
    const operation = operationsSelect.value;

    const value1 = document.getElementById("value1");
    const value2 = document.getElementById("value2");

    const pos = Number(value1.value);
    const value = value2.value.trim();

    if (operation === "insert") {
        const numValue = Number(value);

        if (isNaN(pos) || isNaN(numValue) || pos < 0 || pos > vectorValues.length) {
            alert("Enter valid position and value");
            return;
        }

        vectorValues.splice(pos, 0, numValue);

        if (vectorValues.length > vectorCapacity) {
            vectorCapacity = vectorCapacity === 0 ? 1 : vectorCapacity * 2;
        }

        renderVector([pos]);
    }

    else if (operation === "erase") {
        if (isNaN(pos) || pos < 0 || pos >= vectorValues.length) {
            alert("Enter valid position to erase.");
            return;
        }

        vectorValues.splice(pos, 1);
        renderVector();
        vectorCapacity = Math.max(vectorCapacity, vectorValues.length);
    }

    else if (operation === "assign") {
        const [countStr, valueStr] = value.split(",");
        const count = Number(countStr);
        const valNum = Number(valueStr);

        if (isNaN(count) || isNaN(valNum) || count < 0) {
            alert("Enter valid count and value (e.g. 5,7)");
            return;
        }

        vectorValues = new Array(count).fill(valNum);
        vectorCapacity = Math.max(vectorCapacity, count);

        // Highlight all newly assigned positions
        renderVector([...Array(count).keys()]);
    }

    else if (operation === "swap") {
    const inputValues = value2.value.trim();

    if (!inputValues) {
        alert("Please enter comma-separated values for Vector 2 (e.g. 1,2,3)");
        return;
    }

    const newVector2 = inputValues.split(",").map(num => Number(num.trim()));

    if (newVector2.some(isNaN)) {
        alert("Invalid input. Please enter only numbers separated by commas.");
        return;
    }

    vector2 = newVector2;

    // Replace vector1 with vector2 (not a swap)
    vectorValues = [...vector2];  // Use spread to avoid reference link

    vectorCapacity = Math.max(vectorCapacity, vectorValues.length);
    renderVector();

    // Show Vector 2 visibly
    vectorTwoDisplay.style.display = "flex";
    vectorTwoDisplay.innerHTML = `<h4 style="width: 100%; text-align: center;">Vector 2 (User Input)</h4>`;
    vector2.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        vectorTwoDisplay.appendChild(cell);
    });
}

    else if (operation === "begin_end") {
        if (vectorValues.length === 0) {
            alert("Vector is empty.");
            return;
        }

        renderVector([0, vectorValues.length - 1]);
        alert(`begin() points to ${vectorValues[0]}, end() is after ${vectorValues[vectorValues.length - 1]}`);

    } else if (operation === "rbegin_rend") {
        if (vectorValues.length === 0) {
            alert("Vector is empty.");
            return;
        }

        renderVector([vectorValues.length - 1, 0]);
        alert(`rbegin() points to ${vectorValues[vectorValues.length - 1]}, rend() is before ${vectorValues[0]}`);

    } else if (operation === "iterate") {
        let start = 0, end = vectorValues.length;

        if (value) {
            const [startStr, endStr] = value.split(",");
            if (!isNaN(Number(startStr))) start = Number(startStr);
            if (!isNaN(Number(endStr))) end = Number(endStr);
        }

        if (start < 0 || end > vectorValues.length || start >= end) {
            alert("Enter valid start,end (e.g. 0,3)");
            return;
        }

        const iterated = vectorValues.slice(start, end);
        renderVector([...Array(end - start).keys()].map(i => i + start));
        alert(`Iterated values: ${iterated.join(", ")}`);
    }

    // Progress update
    const token = localStorage.getItem("token");
    if (token && methodToSubtopic[operation]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Vector Advanced Operations",
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

    // Clear inputs
    value1.value = "";
    value2.value = "";
});

renderVector();

// Vector Advanced Operations button navigation
const vectorSortBtn = document.querySelector(".vecSort");
if (vectorSortBtn) {
    vectorSortBtn.addEventListener("click", () => {
        const values = vectorValues.join(",");
        const url = `vectorSort.html?size=${vectorValues.length}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    });
}
homePageBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

