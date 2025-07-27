const params = new URLSearchParams(window.location.search);
let size = params.get("size") ? Number(params.get("size")) : defaultSize;
const values = params.get("values");

// Handle empty values properly
let arrayValues = values ? values.split(",").map(v => {
    v = v.trim();
    return v === "" ? null : Number(v); // Convert empty to null
}) : [1, 2, 3, 4, 5];

// Ensure array has correct size
if (arrayValues.length < size) {
    while (arrayValues.length < size) {
        arrayValues.push(null); // Pad with null
    }
} else if (arrayValues.length > size) {
    arrayValues = arrayValues.slice(0, size);
}

// Ensure array matches the specified size
if (arrayValues.length > size) {
    arrayValues = arrayValues.slice(0, size);
} else if (arrayValues.length < size) {
    // Pad with empty values if needed
    while (arrayValues.length < size) {
        arrayValues.push("");
    }
}

// Pseudocode data for array update operations
const pseudocodeData = {
    insert: [
        "FUNCTION insertAt(array, index, value)",
        "  IF index < 0 OR index >= length(array) THEN",
        "    RETURN 'Invalid index'",
        "  END IF",
        "  array[index] = value  // Update value at index",
        "  RETURN array",
        "END FUNCTION"
    ],
    delete: [
        "FUNCTION deleteAt(array, index)",
        "  IF index < 0 OR index >= length(array) THEN",
        "    RETURN 'Invalid index'",
        "  END IF",
        "  array[index] = ''  // Empty the value at index",
        "  RETURN array",
        "END FUNCTION"
    ]
};

// Render pseudocode based on selected operation
function renderPseudocode(operation) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    
    codeContainer.innerHTML = "";
    const lines = operation === "Insert" ? pseudocodeData.insert : pseudocodeData.delete;

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

// Initialize with insert pseudocode
renderPseudocode("Insert");

function renderArray() {
    const arrayContainer = document.getElementById("array");
    if (!arrayContainer) return;
    arrayContainer.innerHTML = '';
    arrayValues.forEach((val, idx) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        cell.setAttribute("data-index", idx);
        arrayContainer.appendChild(cell);
    });

    const arrSizeDiv = document.querySelector(".arrSize h3");
    if (arrSizeDiv) {
        arrSizeDiv.textContent = `Array Size = ${size}`;
    }
}
renderArray();

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function insertAt(index, value) {
    index = Number(index);
    if (!Number.isInteger(index) || index < 0 ) {
        alert("Invalid index for insertion.");
        return;
    }
    else if (!Number.isInteger(index) || index >= size) {
        alert("Max size exceeds! Delete values to enter more.");
        return;
    }

    // Overwrite or shift if there is a hole
    else if (!(index in arrayValues)) {
        arrayValues.splice(index, 0, value);
        if (arrayValues.length > size) {
            arrayValues.length = size;
        }
    } else {
        arrayValues[index] = value;
    }

    renderArray();

    // Highlight affected cell
    const cell = document.querySelectorAll('.cell')[index];
    if (cell) {
        cell.classList.add('highlight');
        setTimeout(() => cell.classList.remove('highlight'), 1000);
    }
}

async function deleteAt(index) {
    index = Number(index);
    if (!Number.isInteger(index) || index < 0 || index >= size) {
        alert("Invalid index for deletion.");
        return;
    }
    // Highlight cell to be deleted
    const cells = document.querySelectorAll('.cell');
    if (cells[index]) {
        cells[index].style.background = "red";
    }
    await delay(600);

    arrayValues.splice(index, 1);
    // Pad with empty string to keep array at original size
    while (arrayValues.length < size) {
        arrayValues.push("");
    }
    renderArray();
}

const updateBtn = document.querySelector(".update");
if (updateBtn) {
    updateBtn.addEventListener("click", async () => {
        const valueInput = document.querySelector(".value");
        const indexInput = document.querySelector(".index");
        const option = document.querySelector(".update-option").value;
        const value = parseInt(valueInput.value);
        const index = parseInt(indexInput.value);

        if (option === "Insert") {
            if (isNaN(value) || isNaN(index)) {
                alert("Please enter both value and index for insertion.");
                return;
            }
            await insertAt(index, value);
        } else if (option === "Delete") {
            if (isNaN(index)) {
                alert("Please enter index for deletion.");
                return;
            }
            await deleteAt(index);
        }
        valueInput.value = "";
        indexInput.value = "";

        // Progress update for Array Update (move this inside the handler)
        const methodToSubtopic = {
            Insert: "Insertion",
            Delete: "Deletion",
        };

        const token = localStorage.getItem("token");

        if (token && methodToSubtopic[option]) {
            fetch("https://algosikhibackend.onrender.com/api/progress/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    topic: "Array Update",
                    subtopic: methodToSubtopic[option],
                    value: true
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("✅ Progress updated for:", methodToSubtopic[option]);
                })
                .catch(err => {
                    console.error("❌ Progress update failed:", err);
                });
        }
    });
}

// Visualization section show/hide
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const visualizationSection = document.querySelector(".visualization-section");

if (startBtn && visualizationSection) {
    startBtn.addEventListener("click", () => {
        visualizationSection.style.display = "flex";
        container.classList.add("visualization-active");
    });
}
if (closeBtn && visualizationSection) {
    closeBtn.addEventListener("click", () => {
        visualizationSection.style.display = "none";
        container.classList.remove("visualization-active");
    });
}


const valueInput = document.querySelector(".value");
const updateOption = document.querySelector(".update-option");

if (updateOption && valueInput) {
    updateOption.addEventListener("change", () => {
        if (updateOption.value === "Delete") {
            valueInput.style.display = "none";
        } else {
            valueInput.style.display = "";
        }
    });

    // Initialize on page load
    if (updateOption.value === "Delete") {
        valueInput.style.display = "none";
    }
}

const arraySearchBtn = document.querySelector(".arrSearch");
if (arraySearchBtn) {
    arraySearchBtn.addEventListener("click", () => {
        const values = arrayValues.join(",");
        const order = document.querySelector(".sort-option")?.value || "Ascending";
        const url = `arraySearch.html?size=${size}&values=${encodeURIComponent(values)}&order=${order}`;
        window.location.href = url;
    });
}

const homePageBtn = document.querySelector(".homePage");
homePageBtn.addEventListener("click",()=>{
    window.location.href="index.html";
});

const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");
homePgBtn.addEventListener("click", () => {
    const url = `index.html`;
    window.location.href = url;
});
dashBrdBtn.addEventListener("click", () => {
    const url = `dashboard.html`;
    window.location.href = url;
});
