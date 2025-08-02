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
const oprBtn = document.querySelector(".oprBtn");
const operationsSelect = document.querySelector(".Operations");
const valueInput = document.getElementById("value");
const pushBackInfo = document.querySelector('.push_backInfo');
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for vector operations
const pseudocodeData = {
    "push_back()": [
        "FUNCTION push_back(value)",
        "  IF size == capacity THEN",
        "    new_capacity = capacity == 0 ? 1 : capacity * 2",
        "    resize_vector(new_capacity)",
        "  END IF",
        "  vector[size] = value",
        "  size = size + 1",
        "END FUNCTION"
    ],
    "pop_back()": [
        "FUNCTION pop_back()",
        "  IF size > 0 THEN",
        "    size = size - 1",
        "  END IF",
        "END FUNCTION"
    ],
    "clear()": [
        "FUNCTION clear()",
        "  size = 0",
        "END FUNCTION"
    ],
    "vector[i]": [
        "FUNCTION operator[](index)",
        "  IF index < 0 OR index >= size THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN vector[index]",
        "END FUNCTION"
    ],
    "front()": [
        "FUNCTION front()",
        "  IF size == 0 THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN vector[0]",
        "END FUNCTION"
    ],
    "back()": [
        "FUNCTION back()",
        "  IF size == 0 THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN vector[size-1]",
        "END FUNCTION"
    ],
    "empty()": [
        "FUNCTION empty()",
        "IF size==0",
        "  RETURN True",
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
        startBtn.innerText = "Visualize Vector Operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Vector Operations";
});

// Vector Create button 
const createVectorBtn = document.querySelector(".vecCreate");
if (createVectorBtn) {
    createVectorBtn.addEventListener("click", () => {
        window.location.href = "vector.html";
    });
}

// Render vector visualization
function renderVector(highlightIndices = [], sorted = false) {
    const vectorContainer = document.getElementById("vectorBasic");
    vectorContainer.innerHTML = '';
    vectorValues.forEach((val, idx) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('active'); // <-- use 'active'
        if (sorted) cell.classList.add('sorted');
        vectorContainer.appendChild(cell);
    });
    document.getElementById("vectorSize").textContent = vectorValues.length;
    document.getElementById("vectorCapacity").textContent = vectorCapacity;
}

// Hide value input unless push_back() or vector[i] is selected
function toggleValueInput() {
    renderPseudocode(operationsSelect.value);
    if (
        operationsSelect.value === "push_back()" ||
        operationsSelect.value === "vector[i]"
    ) {
        valueInput.style.display = "inline-block";
    } else {
        valueInput.style.display = "none";
    }
}
toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

// Perform vector operation
oprBtn.addEventListener("click", () => {
    const operation = operationsSelect.value;
    const val = valueInput.value;
    pushBackInfo.style.display = "none";

    if (operation === "push_back()") {
        highlightLine(0); // FUNCTION push_back
        setTimeout(() => {
            highlightLine(1); // IF size == capacity
            setTimeout(() => {
                highlightLine(2); // resize_vector
                setTimeout(() => {
                    highlightLine(3); // vector[size] = value
                    highlightLine(4); // size increment
                    
                    if (val === "" || isNaN(Number(val))) {
                        alert("Please enter a valid value to push.");
                        return;
                    }
                    vectorValues.push(Number(val));
                    if (vectorValues.length > vectorCapacity) {
                        vectorCapacity = vectorCapacity === 0 ? 1 : vectorCapacity * 2;
                    }
                    renderVector([vectorValues.length - 1]);
                    pushBackInfo.style.display = "block";
                }, 500);
            }, 500);
        }, 500);
    } 
    else if (operation === "pop_back()") {
        highlightLine(0); // FUNCTION pop_back
        setTimeout(() => {
            highlightLine(1); // IF size > 0
            highlightLine(2); // size decrement
            
            if (vectorValues.length === 0) {
                alert("Vector is already empty.");
                return;
            }
            vectorValues.pop();
            renderVector();
        }, 500);
    } 
    else if (operation === "clear()") {
        highlightLine(0); // FUNCTION clear
        highlightLine(1); // size = 0
        
        vectorValues = [];
        renderVector();
    } 
    else if (operation === "vector[i]") {
        highlightLine(0); // FUNCTION operator[]
        setTimeout(() => {
            const idx = Number(val);
            
            if (val === "" || isNaN(Number(val))) {
                alert("Please enter a valid index.");
                highlightLine(1); 
                highlightLine(2); 
                return;
            }
            else if (idx < 0 || idx >= vectorValues.length) {
                alert("Index out of bounds.");
                highlightLine(1); 
                highlightLine(2); 
                return;
            }
            else{
                renderVector([idx]);
                alert(`vector[${idx}] = ${vectorValues[idx]}`);
                highlightLine(3); // IF index check
                highlightLine(4); // RETURN vector[index]

            }
        }, 500);
    } 
    else if (operation === "front()") {
        highlightLine(0); // FUNCTION front
        setTimeout(() => {
            
            if (vectorValues.length === 0) {
                alert("Vector is empty.");
                highlightLine(1); // IF size == 0
                highlightLine(2); // RETURN vector[0]
                return;
            }
            else{
                renderVector([0]);
                alert(`front() = ${vectorValues[0]}`);
                highlightLine(4);
            }
        }, 500);
    } 
    else if (operation === "back()") {
        highlightLine(0); // FUNCTION back
        setTimeout(() => {
            highlightLine(1); // IF size == 0
            highlightLine(2); // RETURN vector[size-1]
            
            if (vectorValues.length === 0) {
                alert("Vector is empty.");
                return;
            }
            renderVector([vectorValues.length - 1]);
            alert(`back() = ${vectorValues[vectorValues.length - 1]}`);
        }, 500);
    } 
    else if (operation === "empty()") {
        highlightLine(0); // FUNCTION empty
        highlightLine(1); // RETURN size == 0
        
        alert(vectorValues.length === 0 ? "Vector is empty." : "Vector is not empty.");
        renderVector();
    }
    
    valueInput.value = "";

    // Progress update code remains the same...
    const methodToSubtopic = {
        "push_back()": "pushBack",
        "pop_back()": "popBack",
        "clear()": "clear",
        "size()": "size",
        "vector[i]": "vector[i]",
        "front()": "front",
        "back()": "back",
        "empty()": "empty"
    };

    const token = localStorage.getItem("token");
    if (token && methodToSubtopic[operation]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Vector Basic Operations",
                subtopic: methodToSubtopic[operation],
                value: true
            })
        }).catch(console.error);
    }
});

// Initial render
renderVector();

// Vector Sort button navigation
const vectorSortBtn = document.querySelector(".vecSort");
if (vectorSortBtn) {
    vectorSortBtn.addEventListener("click", () => {
        const values = vectorValues.join(",");
        const url = `vectorSort.html?size=${vectorValues.length}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    });
}

homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});