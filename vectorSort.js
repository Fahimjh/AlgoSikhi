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

// Visualization section show/hide
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Vector Sort";
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
    renderVector();
    await delay(700);

    vectorValues.sort((a, b) => order === "Ascending" ? a - b : b - a);

    // Color all cells as sorted
    renderVector([], true);
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

