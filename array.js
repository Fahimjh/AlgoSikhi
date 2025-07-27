// Declare arrayValues in the global scope
let arrayValues = [];
let arraySize = 0;

const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const theorySection = document.querySelector(".theory-section");
const visualizationSection = document.querySelector(".visualization-section");
const createArrayBtn = document.querySelector(".crtArrBtn");
const arraySortBtn = document.querySelector(".arrSort");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode lines
const pseudocodeLines = [
    "1. Input array size and values",
    "2. Allocate contiguous memory for the array",
    "3. Insert values at each index",
    "4. Render array on screen",
    "5. End"
];

// Inject pseudocode lines into the DOM
function renderPseudocode() {
    const codeContainer = document.getElementById("pseudocode");
    codeContainer.innerHTML = "";
    pseudocodeLines.forEach((line, index) => {
        const lineElem = document.createElement("div");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

// Highlight a specific pseudocode line
function highlightLine(index) {
    pseudocodeLines.forEach((_, i) => {
        const line = document.getElementById(`line-${i}`);
        if (line) line.classList.remove("highlight");
    });
    const activeLine = document.getElementById(`line-${index}`);
    if (activeLine) activeLine.classList.add("highlight");
}

// Animate pseudocode highlights
async function highlightSequence() {
    for (let i = 0; i < pseudocodeLines.length; i++) {
        highlightLine(i);
        await new Promise(resolve => setTimeout(resolve, 700)); // 700ms delay
    }
}

// Toggle visualization view
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Creation";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(); // Ensure pseudocode is rendered when visualization starts
    }
});

// Close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Array Creation";
});

// Create array and highlight pseudocode
async function createArray() {
    highlightLine(0); // Start from first line
    await new Promise(resolve => setTimeout(resolve, 500));

    arraySize = parseInt(document.getElementById("array-size").value);
    const values = document.getElementById("array-values").value.split(",").map(v => v.trim());
    arrayValues = values;

    highlightLine(1);
    await new Promise(resolve => setTimeout(resolve, 500));

    highlightLine(2);
    await new Promise(resolve => setTimeout(resolve, 500));

    highlightLine(3);
    renderArray();
    await new Promise(resolve => setTimeout(resolve, 500));

    highlightLine(4);

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
                topic: "Array Introduction",
                subtopic: "arrayCreate",
                value: true
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Progress updated for: arrayCreate");
            })
            .catch(err => console.error("Progress update failed:", err));
    }
}

createArrayBtn.addEventListener("click", () => {
    createArray();
});

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

// Redirect to sorting page
arraySortBtn.addEventListener("click", () => {
    const values = arrayValues.join(",");
    if (!arraySize || values === "") {
        alert("The array is empty. Please provide a valid size and values before proceeding.");
    } else {
        const url = `arraySort.html?size=${arraySize}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});

homePgBtn.addEventListener("click", () => {
        const url = `index.html`;
        window.location.href = url;
});
dashBrdBtn.addEventListener("click", () => {
        const url = `dashboard.html`;
        window.location.href = url;
});
