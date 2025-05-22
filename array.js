const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const theorySection = document.querySelector(".theory-section");
const visualizationSection = document.getElementById("visualization-section");
const createArrayBtn=document.querySelector(".crtArrBtn");
const arraySearchBtn=document.querySelector(".arrSearch");

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        // Close visualization
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Creation";
    } else {
        // Open visualization
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Array Creation";
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
createArrayBtn.addEventListener("click",()=>{
    createArray();
});

function renderArray() {
    const arrayContainer = document.getElementById("array");
    arrayContainer.innerHTML = ''; // Clear previous array
    arrayValues.forEach((val) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        arrayContainer.appendChild(cell);
    });
}
arraySearchBtn.addEventListener("click",()=>{
    window.location.href="arraySearch.html";
});