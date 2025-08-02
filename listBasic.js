// Declare deque values in the global scope
let listValues = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createlistBtn = document.querySelector(".crtlistBtn");
const valueInput = document.getElementById("value");
const operationsSelect = document.querySelector(".Operations");
const listOpsBtn = document.querySelector(".lstOps");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for vector advanced operations
const pseudocodeData = {
    listCreation: [
        "FUNCTION createList(values)",
        "  LET list = []",
        "  IF operation is initialize THEN",
        "    FILL list with values",
        "    RETURN {list}",
        "  END IF",
        "  ELSE IF operation is assign THEN",
        "     IF count<0 OR count>0 AND value is undefined THEN",
        "        RETURN (error)",
        "     Else",
        "        FILL list with value x times",
        "        RETURN {list}",
        "     END ELSE",
        "  END ELSE IF",
        "END FUNCTION"
    ]
};

// Render pseudocode based on operation
function renderPseudocode() {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    
    codeContainer.innerHTML = "";

    pseudocodeData.listCreation.forEach((line, index) => {
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
        startBtn.innerText = "Visualize list creations";// Close visualization
    } 
    else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";// Open visualization
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize list Operations";
});


// Toggle input visibility based on selected operation
function toggleValueInput() {
    renderPseudocode();
    const op = operationsSelect.value;
    valueInput.value = "";

    if (op === "initialize") {
        valueInput.placeholder = "Enter comma-separated values (e.g. 1,2,3)";
    } else if (op === "assign") {
        valueInput.placeholder = "Count,Value (e.g. 5,7)";
    }
}
toggleValueInput();
operationsSelect.addEventListener("change", toggleValueInput);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Create Deque based on operation
async function createlist() {
    highlightLines(0);
    const operation = operationsSelect.value;
    const val = valueInput.value.trim();

    if (!val) {
        listValues = [];
        renderlist();
        highlightLines(1);
        return;
    }

    if (operation === "initialize") {
        highlightLines(2);
        await delay(300);
        listValues = val.split(",").map(v => v.trim()).filter(v => v !== "");
        highlightLines(3);
        await delay(300);
        highlightLines(4);

    } 
    else if (operation === "assign") {
        highlightLines(5);

        const [countStr, valueStr] = val.split(",");
        const count = Number(countStr);
        const value = valueStr?.trim();

        if (isNaN(count) || count < 0 || value === undefined) {
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            await delay(300);
            highlightLines(8);
            alert("Enter valid count and value (e.g. 5,7)");
            return;
        }
        else{
            highlightLines(9);
            await delay(300);
            highlightLines(10);
            await delay(300);
            highlightLines(11);
            listValues = Array(count).fill(value);

        }
    }

    renderlist();
    updateProgress();
}
createlistBtn.addEventListener("click", createlist);

// Render list visually
function renderlist() {
    const listContainer = document.getElementById("list");
    listContainer.innerHTML = '';
    listValues.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        listContainer.appendChild(cell);
    });

}

// Update progress to backend
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
                topic: "list Introduction",
                subtopic: "listIntro",
                value: true
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for: listIntro");
        })
        .catch(err => console.error("❌ Progress update failed:", err));
    }
}

// Proceed to next page with deque values
listOpsBtn.addEventListener("click", () => {
    const values = listValues.join(",");
    if(values === "") {
        alert("The list is empty. Please provide valid values for the list before proceeding.");
    }
    else{
        const url = `listOperation.html?values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});

homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
