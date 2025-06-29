// Declare vector values and capacity in the global scope
let vectorValues = [];
let vectorCapacity = 0;

const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createVectorBtn = document.querySelector(".crtVecBtn");
const vectorSortBtn = document.querySelector(".vecSort");

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

// Create vector visualization
function createVector() {
    const valuesInput = document.getElementById("vector-values").value;
    if (!valuesInput.trim()) {
        vectorValues = [];
        vectorCapacity = 0;
        renderVector();
        return;
    }
    vectorValues = valuesInput.split(",").map(v => v.trim()).filter(v => v !== "");
    vectorCapacity = vectorValues.length; // Capacity matches initial size
    renderVector();
}

createVectorBtn.addEventListener("click", createVector);

function renderVector() {
    const vectorContainer = document.getElementById("vector");
    vectorContainer.innerHTML = '';
    vectorValues.forEach((val) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        vectorContainer.appendChild(cell);
    });
    // Update size and capacity display
    document.getElementById("vectorSize").textContent = vectorValues.length;
    document.getElementById("vectorCapacity").textContent = vectorCapacity;
}

vectorSortBtn.addEventListener("click", () => {
    const size = vectorValues.length;
    const values = vectorValues.join(",");
    if (!size || values === "") {
        alert("The vector is empty. Please provide values before proceeding.");
    } else {
        const url = `vectorSort.html?size=${size}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});



// function pushBack() {
//   const input = document.getElementById("vectorInput");
//   const value = input.value;
//   if (value === "") return;

//   if (vector.length >= capacity) {
//     capacity *= 2; // Simulating vector's growth
//   }

//   vector.push(parseInt(value));
//   input.value = "";
//   updateDisplay();
// }

// function popBack() {
//   if (vector.length > 0) {
//     vector.pop();
//     updateDisplay();
//   }
// }

// function clearVector() {
//   vector = [];
//   capacity = 4;
//   updateDisplay();
// }
