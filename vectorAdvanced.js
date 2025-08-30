// Get params from URL
const params = new URLSearchParams(window.location.search);
let size = params.get("size");
const values = params.get("values");
let vectorValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];
let vectorCapacity = size ? Number(size) : vectorValues.length;
size = size ? Number(size) : vectorValues.length;
const dashBrdBtn = document.getElementById("dashBoard");


// For swap demo
let vector2 = [100, 200, 300];

// Pseudocode data for vector advanced operations
const pseudocodeData = {
    insert: [
        "FUNCTION insert(position, value)",
        "  IF position < 0 OR position > size THEN",
        "    RETURN error",
        "  END IF",
        "  IF size == capacity THEN",
        "    new_capacity = capacity == 0 ? 1 : capacity * 2",
        "    resize_vector(new_capacity)",
        "  END IF",
        "  SHIFT elements from position right",
        "  vector[position] = value",
        "  size = size + 1",
        "END FUNCTION"
    ],
    erase: [
        "FUNCTION erase(position)",
        "  IF position < 0 OR position >= size THEN",
        "    RETURN error",
        "  END IF",
        "  SHIFT elements from position+1 left",
        "  size = size - 1",
        "END FUNCTION"
    ],
    assign: [
        "FUNCTION assign(count, value)",
        "  IF count < 0 THEN",
        "    RETURN error",
        "  END IF",
        "  FILL vector with value count times",
        "  size = count",
        "END FUNCTION"
    ],
    swap: [
        "FUNCTION swap(vector2)",
        "  TEMP = this.vector",
        "  this.vector = vector2.vector",
        "  vector2.vector = TEMP",
        "  SWAP size and capacity",
        "END FUNCTION"
    ],
    begin_end: [
        "FUNCTION begin()",
        "  RETURN pointer to first element",
        "END FUNCTION",
        "FUNCTION end()",
        "  RETURN pointer after last element",
        "END FUNCTION"
    ],
    rbegin_rend: [
        "FUNCTION rbegin()",
        "  RETURN pointer to last element",
        "END FUNCTION",
        "FUNCTION rend()",
        "  RETURN pointer before first element",
        "END FUNCTION"
    ],
    iterate: [
        "FUNCTION iterate(start, end)",
        "  IF start < 0 OR end > size OR start >= end THEN",
        "    RETURN error",
        "  END IF",
        "  FOR i FROM start TO end-1",
        "    ACCESS vector[i]",
        "  END FOR",
        "END FUNCTION"
    ]
};

// Render pseudocode based on operation
function renderPseudocode(operation) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    
    codeContainer.innerHTML = "";
    const lines = pseudocodeData[operation] || ["Select an operation to view pseudocode"];

    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

// Highlight specific pseudocode line/lines
function highlightLines(...indices) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    
    indices.forEach(index => {
        const targetLine = document.getElementById(`line-${index}`);
        if (targetLine) targetLine.classList.add("highlight");
    });
}

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
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Vector Sort";
        renderPseudocode();
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Vector Sort";
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
    renderPseudocode(op);

    // Reset input fields and visibility
    value1.style.display = "none";
    value2.style.display = "none";
    value1.value = "";
    value2.value = "";

    if (op === "insert") {
        value1.style.display = "inline-block";
        value1.placeholder = "Index";

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

    showInsertInfo(op === "insert");
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

oprBtn.addEventListener("click", async() => {
    const operation = operationsSelect.value;
    const pos = Number(value1.value);
    const value = value2.value.trim();

    if (operation === "insert") {
        highlightLines(0);
        await delay(300);

        const numValue = Number(value);

        if (isNaN(pos) || isNaN(numValue) || pos < 0 || pos > vectorValues.length) {
            alert("Enter valid position and value");
            highlightLines(1, 2);
            await delay(300);
            return;
        }

        vectorValues.splice(pos, 0, numValue);

        if (vectorValues.length > vectorCapacity) {
            vectorCapacity = vectorCapacity === 0 ? 1 : vectorCapacity * 2;
            highlightLines(4, 5, 6);
            await delay(900);
        }

        highlightLines(7, 8, 9);
        renderVector([pos]);
    } else if (operation === "erase") {
        highlightLines(0);
        await delay(300);
        highlightLines(1);
        await delay(500);

        if (isNaN(pos) || pos < 0 || pos >= vectorValues.length) {
            alert("Enter valid position to erase.");
            highlightLines(2);
            await delay(300);
            return;
        } else {
            highlightLines(4);
            await delay(300);
            vectorValues.splice(pos, 1);
            renderVector();
            highlightLines(5, 6, 7);
            await delay(900);
            vectorCapacity = Math.max(vectorCapacity, vectorValues.length);
        }
    } else if (operation === "assign") {
        highlightLines(1);
        await delay(300);
        const [countStr, valueStr] = value.split(",");
        const count = Number(countStr);
        const valNum = Number(valueStr);

        if (isNaN(count) || isNaN(valNum) || count < 0) {
            alert("Enter valid count and value (e.g. 5,7)");
            highlightLines(2, 3);
            return;
        } else {
            highlightLines(4);
            await delay(300);
            vectorValues = new Array(count).fill(valNum);
            vectorCapacity = Math.max(vectorCapacity, count);
            highlightLines(5, 6, 7);
            await delay(900);
            renderVector([...Array(count).keys()]);
        }
    } else if (operation === "swap") {
        highlightLines(1);
        await delay(300);
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
        highlightLines(2);
        await delay(300);

        vectorValues = [...vector2];
        highlightLines(3, 4, 5);
        await delay(900);

        vectorCapacity = Math.max(vectorCapacity, vectorValues.length);
        renderVector();

        vectorTwoDisplay.style.display = "flex";
        vectorTwoDisplay.innerHTML = `<h4 style="width: 100%; text-align: center;">Vector 2 (User Input)</h4>`;
        vector2.forEach(val => {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.textContent = val;
            vectorTwoDisplay.appendChild(cell);
        });
    } else if (operation === "begin_end") {
        highlightLines(0, 3);
        await delay(400);

        if (vectorValues.length === 0) {
            alert("Vector is empty.");
            return;
        }

        renderVector([0, vectorValues.length - 1]);
        highlightLines(1, 4);
        await delay(400);
        alert(`begin() points to ${vectorValues[0]}, end() is after ${vectorValues[vectorValues.length - 1]}`);

    } else if (operation === "rbegin_rend") {
        highlightLines(0, 3);
        await delay(100);
        if (vectorValues.length === 0) {
            alert("Vector is empty.");
            return;
        }
        renderVector([vectorValues.length - 1, 0]);
        highlightLines(1, 4);
        await delay(300);
        alert(`rbegin() points to ${vectorValues[vectorValues.length - 1]}, rend() is before ${vectorValues[0]}`);

    } else if (operation === "iterate") {
        highlightLines(1);
        await delay(150);
        let start = 0, end = vectorValues.length;

        if (value) {
            const [startStr, endStr] = value.split(",");
            if (!isNaN(Number(startStr))) start = Number(startStr);
            if (!isNaN(Number(endStr))) end = Number(endStr);
        }

        if (start < 0 || end > vectorValues.length || start >= end) {
            highlightLines(1, 2);
            alert("Enter valid start,end (e.g. 0,3)");
            return;
        }
        highlightLines(3);
        await delay(300);
        const iterated = vectorValues.slice(start, end);
        renderVector([...Array(end - start).keys()].map(i => i + start));
        highlightLines(4, 5, 6);
        await delay(300);
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

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

function showInsertInfo(show) {
    const infoDiv = document.getElementById("insertInfo");
    if (!infoDiv) return;
    infoDiv.style.display = show ? "block" : "none";
}
