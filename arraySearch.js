const params = new URLSearchParams(window.location.search);
const size = params.get("size");
const values = params.get("values");
const order = params.get("order") || "Ascending";
let arrayValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];

const pseudocodeData = {
    linear: {
        base: [
            "FUNCTION linearSearch(array, value)",
            "  FOR i FROM 0 TO length(array) - 1",
            "    IF array[i] == value THEN",
            "      RETURN i",
            "    END IF",
            "  END FOR",
            "  RETURN -1",
            "END FUNCTION"
        ]
    },
    binary: {
        ascending: [
            "FUNCTION binarySearchAscending(array, value)",
            "  LET left = 0",
            "  LET right = length(array) - 1",
            "  WHILE left <= right",
            "    LET mid = floor((left + right) / 2)",
            "    IF array[mid] == value THEN",
            "      RETURN mid",
            "    ELSE IF array[mid] < value THEN",
            "      left = mid + 1",
            "    ELSE",
            "      right = mid - 1",
            "    END IF",
            "  END WHILE",
            "  RETURN -1",
            "END FUNCTION"
        ],
        descending: [
            "FUNCTION binarySearchDescending(array, value)",
            "  LET left = 0",
            "  LET right = length(array) - 1",
            "  WHILE left <= right",
            "    LET mid = floor((left + right) / 2)",
            "    IF array[mid] == value THEN",
            "      RETURN mid",
            "    ELSE IF array[mid] > value THEN",
            "      left = mid + 1",
            "    ELSE",
            "      right = mid - 1",
            "    END IF",
            "  END WHILE",
            "  RETURN -1",
            "END FUNCTION"
        ]
    }
};

function renderPseudocode(method) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    
    codeContainer.innerHTML = "";
    let lines = [];
    
    if (method === "linear") {
        lines = pseudocodeData.linear.base;
    } else if (method === "binary") {
        lines = order === "Ascending" 
            ? pseudocodeData.binary.ascending 
            : pseudocodeData.binary.descending;
    }

    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

function highlightLine(index) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    
    const targetLine = document.getElementById(`line-${index}`);
    if (targetLine) targetLine.classList.add("highlight");
}

renderPseudocode("linear");

function renderArray() {
    const arrayContainer = document.getElementById("array");
    if (!arrayContainer) return;
    arrayContainer.innerHTML = '';
    arrayValues.forEach((val) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        arrayContainer.appendChild(cell);
    });
}
renderArray();

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const searchValueInput = document.querySelector(".search-value");
const searchMethodSelect = document.querySelector(".search-method");

searchMethodSelect.addEventListener("change", (e) => {
    renderPseudocode(e.target.value);
});

async function startSearch() {
    const searchValue = parseInt(searchValueInput.value);
    const searchMethod = searchMethodSelect.value;

    if (isNaN(searchValue)) {
        alert("Please enter a valid number to search.");
        return;
    }

    const cells = document.querySelectorAll("#array .cell");
    cells.forEach(cell => {
        cell.classList.remove("active", "found", "checked");
    });

    if (searchMethod === "linear") {
        await linearSearchVisualization(searchValue, cells);
    } else if (searchMethod === "binary") {
        await binarySearchVisualization(searchValue, cells);
    }

    updateProgress(searchMethod);
}

async function linearSearchVisualization(searchValue, cells) {
    highlightLine(0);
    await delay(300);
    
    let found = false;
    for (let i = 0; i < cells.length; i++) {
        highlightLine(1);
        cells[i].classList.add("active");
        await delay(600);
        
        highlightLine(2);
        if (parseInt(cells[i].textContent) === searchValue) {
            highlightLine(3);
            cells[i].classList.add("found");
            alert(`Value ${searchValue} found at index ${i}`);
            found = true;
            break;
        }
        
        cells[i].classList.remove("active");
        cells[i].classList.add("checked");
        await delay(300);
    }
    
    if (!found) {
        highlightLine(6);
        alert(`Value ${searchValue} not found`);
    }
}

async function binarySearchVisualization(searchValue, cells) {
    const lines = order === "Ascending" 
        ? pseudocodeData.binary.ascending 
        : pseudocodeData.binary.descending;
    
    highlightLine(0);
    await delay(300);
    
    let found = false;
    let left = 0;
    let right = cells.length - 1;
    
    highlightLine(1);
    highlightLine(2);
    await delay(500);
    
    while (left <= right) {
        highlightLine(3);
        const mid = Math.floor((left + right) / 2);
        
        highlightLine(4);
        cells[mid].classList.add("active");
        await delay(800);
        
        const midValue = parseInt(cells[mid].textContent);
        
        highlightLine(5);
        if (midValue === searchValue) {
            cells[mid].classList.add("found");
            alert(`Value ${searchValue} found at index ${mid}`);
            found = true;
            break;
        }
        
        cells[mid].classList.remove("active");
        cells[mid].classList.add("checked");
        
        if (order === "Ascending") {
            highlightLine(midValue < searchValue ? 7 : 9);
            if (midValue < searchValue) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        } else {
            highlightLine(midValue > searchValue ? 7 : 9);
            if (midValue > searchValue) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        await delay(500);
    }
    
    if (!found) {
        highlightLine(lines.length - 2);
        alert(`Value ${searchValue} not found`);
    }
}

function updateProgress(searchMethod) {
    const methodToSubtopic = {
        linear: "linearSearch",
        binary: "binarySearch",
    };

    const token = localStorage.getItem("token");
    if (!token || !methodToSubtopic[searchMethod]) return;

    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            topic: "Array Search",
            subtopic: methodToSubtopic[searchMethod],
            value: true
        })
    })
    .then(res => res.json())
    .catch(console.error);
}

const searchBtn = document.querySelector(".searchBtn");
if (searchBtn) searchBtn.addEventListener("click", startSearch);

const ArraySortBtn = document.querySelector(".arrSort");
if (ArraySortBtn) {
    ArraySortBtn.addEventListener("click", () => {
        const size = arrayValues.length;
        const values = arrayValues.join(",");
        const url = `arraySort.html?size=${size}&values=${encodeURIComponent(values)}&order=${order}`;
        window.location.href = url;
    });
}

const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");

if (startBtn && container) {
    startBtn.addEventListener("click", () => {
        container.classList.toggle("visualization-active");
        startBtn.innerText = container.classList.contains("visualization-active")
            ? "Close Visualization"
            : "Visualize Array Search";
    });
}

if (closeBtn && container && startBtn) {
    closeBtn.addEventListener("click", () => {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Search";
    });
}

const arrayUpdateBtn = document.querySelector(".arrUpdate");
if (arrayUpdateBtn) {
    arrayUpdateBtn.addEventListener("click", () => {
        const values = arrayValues.join(",");
        const url = `arrayUpdate.html?size=${size}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    });
}

const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});