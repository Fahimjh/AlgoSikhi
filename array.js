// Declare arrayValues in the global scope
let arrayValues = [];
let arraySize = 0;

// DOM elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createArrayBtn = document.querySelector(".crtArrBtn");
const arraySortBtn = document.querySelector(".arrSort");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Enhanced pseudocode data
const pseudocodeData = {
    arrayCreation: [
        "FUNCTION createArray(size, values)",
        "  IF size <= 0 OR values.length ≠ size THEN",
        "    RETURN error",
        "  END IF",
        "  LET array = new Array(size)",
        "  FOR i FROM 0 TO size - 1",
        "    array[i] = Number(values[i])",
        "  END FOR",
        "  RETURN array",
        "END FUNCTION"
    ]
};

// Inject pseudocode lines into the DOM with better formatting
function renderPseudocode() {
    const codeContainer = document.getElementById("pseudocode");
    codeContainer.innerHTML = "";
    const lines = pseudocodeData.arrayCreation;

    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        
        // Style keywords
        if (line.match(/\b(FUNCTION|IF|THEN|ELSE|END|FOR|LET|RETURN)\b/)) {
            lineElem.innerHTML = line.replace(
                /\b(FUNCTION|IF|THEN|ELSE|END|FOR|LET|RETURN)\b/g, 
                '<span class="keyword">$&</span>'
            );
        } 
        // Style variables
        else if (line.match(/\b(array|size|values|i)\b/)) {
            lineElem.innerHTML = line.replace(
                /\b(array|size|values|i)\b/g,
                '<span class="variable">$&</span>'
            );
        }
        else {
            lineElem.textContent = line;
        }
        
        codeContainer.appendChild(lineElem);
    });
}

// Highlight a specific pseudocode line
function highlightLine(index) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    const targetLine = document.getElementById(`line-${index}`);
    if (targetLine) targetLine.classList.add("highlight");
}

// Create array with proper visualization flow
async function createArray() {
    // Reset any previous state
    const arrayContainer = document.getElementById("array");
    arrayContainer.innerHTML = '';
    
    // Get inputs first
    const sizeInput = parseInt(document.getElementById("array-size").value);
    const valuesInput = document.getElementById("array-values").value;
    const values = valuesInput.split(",").map(v => v.trim());
    
    // Step 1: FUNCTION declaration
    highlightLine(0);
    await delay(500);
    
    // Step 2: Validate inputs - only highlight if invalid
    if (!sizeInput || sizeInput <= 0 || values.length !== sizeInput) {
        highlightLine(1); // Validation check
        await delay(500);
        if (!sizeInput || sizeInput <= 0) {
            alert("Please enter a valid array size (positive integer)");
        } else {
            alert(`Number of values (${values.length}) doesn't match array size (${sizeInput})`);
        }
        return; // Exit if invalid
    }
    
    // Only proceed to array creation if validation passes
    highlightLine(3); // Allocation
    await delay(500);
    
    arraySize = sizeInput;
    arrayValues = new Array(arraySize);
    
    // Visualize empty array cells
    for (let i = 0; i < arraySize; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell empty';
        cell.textContent = '';
        arrayContainer.appendChild(cell);
    }
    await delay(800);
    
    // Step 3: Initialize elements
    highlightLine(5); // Initialization
    await delay(500);
    
    for (let i = 0; i < arraySize; i++) {
        highlightLine(6); // FOR loop
        highlightLine(7); // Assignment
        
        const numValue = Number(values[i]);
        arrayValues[i] = isNaN(numValue) ? 0 : numValue;
        
        const cells = document.querySelectorAll("#array .cell");
        cells[i].classList.remove("empty");
        cells[i].textContent = arrayValues[i];
        cells[i].classList.add("active");
        
        await delay(600);
        cells[i].classList.remove("active");
    }
    
    // Step 4: Completion
    highlightLine(9);
    await delay(300);
    
    updateProgress();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

function updateProgress() {
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
        .then(console.log)
        .catch(console.error);
    }
}

// Event listeners
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Array Creation";
    renderPseudocode();
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Array Creation";
});

createArrayBtn.addEventListener("click", createArray);

arraySortBtn.addEventListener("click", () => {
    if (arrayValues.length === 0) {
        alert("Please create an array first");
    } else {
        window.location.href = `arraySort.html?size=${arraySize}&values=${encodeURIComponent(arrayValues.join(","))}`;
    }
});

homePgBtn.addEventListener("click", () => window.location.href = "index.html");
dashBrdBtn.addEventListener("click", () => window.location.href = "dashboard.html");

// Initialize
renderPseudocode();