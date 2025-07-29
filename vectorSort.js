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
const sortBtn = document.querySelector(".sortBtn");
const sortOption = document.querySelector(".sort-option");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for vector sort
const pseudocodeData = {
    sort: [
        "FUNCTION sort(vector, order)",
        "  IF order == 'Ascending' THEN",
        "    vector.sort((a, b) => a - b)",
        "  ELSE",
        "    vector.sort((a, b) => b - a)",
        "  END IF",
        "  RETURN sorted_vector",
        "END FUNCTION"
    ]
};

// Render pseudocode based on operation
function renderPseudocode() {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    
    codeContainer.innerHTML = "";
    const lines = pseudocodeData.sort;

    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

// Highlight specific pseudocode line
function highlightLine(index) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    
    const targetLine = document.getElementById(`line-${index}`);
    if (targetLine) targetLine.classList.add("highlight");
}

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
function renderVector(highlightIndices = [], sorted = false) {
    const vectorContainer = document.getElementById("vectorSort");
    vectorContainer.innerHTML = '';
    vectorValues.forEach((val, idx) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('highlight');
        if (sorted) cell.classList.add('sorted');
        vectorContainer.appendChild(cell);
    });
    document.getElementById("vectorSize").textContent = vectorValues.length;
    document.getElementById("vectorCapacity").textContent = vectorCapacity;
}

// Vector Create button 
const createVectorBtn = document.querySelector(".vecCreate");
if (createVectorBtn) {
    createVectorBtn.addEventListener("click", () => {
        window.location.href = "vector.html";
    });
}

// Built-in sort visualization
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function visualizeBuiltInSort(order = "Ascending") {
    renderPseudocode();
    renderVector();
    
    highlightLine(0); // FUNCTION sort
    await delay(500);
    
    highlightLine(1); // IF order check
    await delay(500);
    
    if (order === "Ascending") {
        highlightLine(2); // Ascending sort
    } else {
        highlightLine(4); // Descending sort
    }
    await delay(500);
    
    vectorValues.sort((a, b) => order === "Ascending" ? a - b : b - a);
    
    highlightLine(6); // RETURN
    renderVector([], true);
    
    // Progress update
    const token = localStorage.getItem("token");
    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Vector Sort",
                subtopic: "vecSort",
                value: true
            })
        }) .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for: vecSort");
        })
        .catch(err => console.error("Progress update failed:", err));
    }
}
// Sort button event
sortBtn.addEventListener("click", async () => {
    await visualizeBuiltInSort(sortOption.value);
});

// Initial render
renderVector();

// Vector Basic Operations button navigation
const vectorOprBtn = document.querySelector(".vecOpr");
if (vectorOprBtn) {
    vectorOprBtn.addEventListener("click", () => {
        const values = vectorValues.join(",");
        const url = `vectorBasic.html?size=${vectorValues.length}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    });
}

// Vector Advanced Operations button navigation
const vectorAdvancedBtn = document.querySelector(".vecAdvanced");
if (vectorAdvancedBtn) {
    vectorAdvancedBtn.addEventListener("click", () => {
        const values = vectorValues.join(",");
        const url = `vectorAdvanced.html?size=${vectorValues.length}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    });
}

homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
