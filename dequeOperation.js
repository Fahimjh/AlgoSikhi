// Get params from URL
const params = new URLSearchParams(window.location.search);
const values = params.get("values");
let dequeValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const operationsSelect = document.querySelector(".Operations");
const oprBtn = document.querySelector(".oprBtn");
const listBasicBtn = document.querySelector(".listBasic");
const homePageBtn = document.querySelector(".homePage");
const pushBackInfo = document.getElementById("pushBackInfo"); // Optional info section
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for deque operations
const pseudocodeData = {
    "push_back()": [
        "FUNCTION push_back(value)",
        "  IF value is empty OR value is not number THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE ",
        "    deque[size] = value",
        "    size = size + 1",
        "    RETURN(deque)",
        "END FUNCTION"
    ],
    "pop_back()": [
        "FUNCTION pop_back()",
        "  IF size <= 0 THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE",
        "    size = size - 1",
        "  END ELSE",
        "END FUNCTION"
    ],
    "push_front()": [
        "FUNCTION push_front(value)",
        "  IF value is empty OR value is not number THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE ",
        "    size = size + 1",
        "    shift elements to right",
        "    deque[0]=value",
        "    RETURN(deque)",
        "  END ELSE",
        "END FUNCTION"
    ],
    "pop_front()": [
        "FUNCTION pop_front()",
        "  IF size <= 0 THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE",
        "    size = size - 1",
        "    shift values to left",
        "    RETURN(deque)",
        "  END Else",
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

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Deque Operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Deque Operations";
});

// Toggle input visibility based on selected operation
function toggleValueInput() {
    const op = operationsSelect.value;
    renderPseudocode(op);
    if (op === "pop_back()" || op === "pop_front()") {
        valueInput.style.display = "none"; // hide input
    } else {
        valueInput.style.display = "inline-block"; // show input
        valueInput.placeholder = (op === "push_back()")
            ? "Enter value for push_back"
            : (op === "push_front()")
            ? "Enter value for push_front"
            : "";
    }
}
toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

// Render deque visually
function renderDeque(highlightIndices = []) {
    const dequeContainer = document.getElementById("deque");
    dequeContainer.innerHTML = '';
    dequeValues.forEach((val, idx) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('active');
        dequeContainer.appendChild(cell);
    });
}

// Initial render
renderDeque();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Perform deque operation
oprBtn.addEventListener("click", async() => {
    const operation = operationsSelect.value;
    const val = valueInput.value.trim();

    if (pushBackInfo) pushBackInfo.style.display = "none";

    if (operation === "push_back()") {
        highlightLines(0);
        if (val === "" || isNaN(Number(val))) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);

            alert("Please enter a valid value to push.");
            return;
        }
        else{
            highlightLines(4);
            await delay(300);
            dequeValues.push(Number(val));
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            renderDeque([dequeValues.length - 1]);
            if (pushBackInfo) pushBackInfo.style.display = "block";
        }

    } else if (operation === "pop_back()") {
        highlightLines(0);
        if (dequeValues.length === 0) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            
            alert("Deque is already empty.");
            return;
        }
        else{
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            dequeValues.pop();
            renderDeque();
        }

    } else if (operation === "push_front()") {
        highlightLines(0);
        
        if (val === "" || isNaN(Number(val))) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            alert("Please enter a valid value to push.");
            return;
        }
        else{
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            await delay(300);
            highlightLines(8);
            dequeValues.unshift(Number(val));
            renderDeque([0]);
        }

    } else if (operation === "pop_front()") {
        highlightLines(0);
        if (dequeValues.length === 0) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            alert("Deque is already empty.");
            return;
        }
        else{
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            dequeValues.shift();
            renderDeque();
        }
    }

    // ✅ Progress update to backend
    const methodToSubtopic = {
        "push_back()": "pushBack",
        "pop_back()": "popBack",
        "push_front()": "pushFront",
        "pop_front()": "popFront"
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
                topic: "Deque Operations",
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

    valueInput.value = "";
});

// Navigation buttons
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
listBasicBtn.addEventListener("click", () => {
    window.location.href = "listBasic.html";
});
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});