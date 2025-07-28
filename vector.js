// Declare vector values and capacity in the global scope
let vectorValues = [];
let vectorCapacity = 0;

// DOM elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createVectorBtn = document.querySelector(".crtVecBtn");
const vectorBasicBtn = document.querySelector(".vecBasic");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Vector pseudocode data - creation only
const pseudocodeData = {
    vectorCreation: [
        "FUNCTION createVector(values)",
        "  LET vector = []",
        "  LET capacity = 0",
        "  IF values is empty THEN",
        "    RETURN {vector, capacity}",
        "  END IF",
        "  vector = values.split(',').filter(v => v ≠ '')",
        "  capacity = vector.length",
        "  RETURN {vector, capacity}",
        "END FUNCTION"
    ]
};

// Simplified renderPseudocode function
function renderPseudocode() {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    
    codeContainer.innerHTML = "";
    pseudocodeData.vectorCreation.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line; // No syntax highlighting
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

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Vector Operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode("creation"); // Default to creation pseudocode
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Vector Operations";
});

// Create vector visualization with pseudocode highlighting
async function createVector() {
    // Reset visualization
    const vectorContainer = document.getElementById("vector");
    vectorContainer.innerHTML = '';
    
    // Get input values
    const valuesInput = document.getElementById("vector-values").value;
    
    // Highlight pseudocode - initialization
    highlightLine(0); // FUNCTION
    await delay(500);
    highlightLine(1); // LET vector
    highlightLine(2); // LET capacity
    await delay(500);
    
    if (!valuesInput.trim()) {
        // Empty vector case
        highlightLine(3); // IF empty
        await delay(500);
        highlightLine(4); // RETURN
        await delay(300);
        
        vectorValues = [];
        vectorCapacity = 0;
        renderVector();
        return;
    }
    
    // Non-empty vector case
    highlightLine(6); // vector assignment
    await delay(500);
    highlightLine(7); // capacity assignment
    await delay(500);
    
    vectorValues = valuesInput.split(",").map(v => v.trim()).filter(v => v !== "");
    vectorCapacity = vectorValues.length;
    
    // Visualize the creation process
    for (let i = 0; i < vectorValues.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = vectorValues[i];
        vectorContainer.appendChild(cell);
        cell.classList.add("active");
        await delay(300);
        cell.classList.remove("active");
    }
    
    highlightLine(8); // RETURN
    await delay(300);
    
    renderVector();
    updateProgress();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

// Event listeners
createVectorBtn.addEventListener("click", createVector);

vectorBasicBtn.addEventListener("click", () => {
    const size = vectorValues.length;
    const values = vectorValues.join(",");
    if (!size || values === "") {
        alert("The vector is empty. Please provide values before proceeding.");
    } else {
        const url = `vectorBasic.html?size=${size}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});

homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// Initialize
renderPseudocode("creation");