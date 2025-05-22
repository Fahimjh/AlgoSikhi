const startBtn = document.getElementById("start-visualization");
const closeBtn = document.getElementById("close-btn");
const theorySection = document.querySelector(".theory-section");
const visualizationSection = document.getElementById("visualization-section");

// Show visualization and shrink theory to 50%
startBtn.addEventListener("click", () => {
  theorySection.classList.add("half-width");
  visualizationSection.classList.remove("hidden");
});

// Hide visualization and expand theory to 100%
closeBtn.addEventListener("click", () => {
  theorySection.classList.remove("half-width");
  visualizationSection.classList.add("hidden");
});


document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-visualization");
    const closeBtn = document.getElementById("close-btn");
    const container = document.querySelector(".container");

    // Show visualization and shrink theory section
    startBtn.addEventListener("click", () => {
        container.classList.add("visualization-active");
    });

    // Hide visualization and expand theory section
    closeBtn.addEventListener("click", () => {
        container.classList.remove("visualization-active");
    });
});

// Create array visualization
function createArray() {
    const size = parseInt(document.getElementById("array-size").value);
    const values = document.getElementById("array-values").value.split(",").map(v => v.trim());

    if (values.length !== size) {
        alert("Number of values doesn't match the size.");
        return;
    }

    arrayValues = values;
    renderArray();
}

function renderArray() {
    const arrayContainer = document.getElementById("array");
    arrayContainer.innerHTML = '';
    arrayValues.forEach((val) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        arrayContainer.appendChild(cell);
    });
}
