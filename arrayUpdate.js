const defaultSize = 5;
const params = new URLSearchParams(window.location.search);
let size = params.get("size") ? Number(params.get("size")) : defaultSize;
const values = params.get("values");

// Handle empty values properly
let arrayValues = values ? values.split(",").map(v => {
    v = v.trim();
    return v === "" ? null : Number(v);
}) : [1, 2, 3, 4, 5];

// Ensure array has correct size (pad with null)
if (arrayValues.length < size) {
    while (arrayValues.length < size) {
        arrayValues.push(null);
    }
} else if (arrayValues.length > size) {
    arrayValues = arrayValues.slice(0, size);
}

// Pseudocode data for array update operations
const pseudocodeData = {
    Insert: [
        "FUNCTION insertAt(array, index, value)",
        "  IF index < 0 OR index >= length(array) THEN",
        "    RETURN 'Invalid index'",
        "  END IF",
        "  array[index] = value  // Update value at index",
        "  RETURN array",
        "END FUNCTION"
    ],
    Delete: [
        "FUNCTION deleteAt(array, index)",
        "  IF index < 0 OR index >= length(array) THEN",
        "    RETURN 'Invalid index'",
        "  END IF",
        "  array[index] = ''",
        "  RETURN array",
        "END FUNCTION"
    ]
};

function renderPseudocode(operation) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    const lines = operation === "Insert" ? pseudocodeData.Insert : pseudocodeData.Delete;
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

const updateBtn = document.querySelector(".update");
const valueInput = document.querySelector(".value");
const indexInput = document.querySelector(".index");
const updateOption = document.querySelector(".update-option");

if (updateBtn) {
    updateBtn.addEventListener("click", async () => {
        const option = updateOption.value;
        const value = parseInt(valueInput.value);
        const index = parseInt(indexInput.value);

        // Always render the correct pseudocode before highlighting
        renderPseudocode(option);

        if (option === "Insert") {
            highlightLine(0);
            if (isNaN(value) || isNaN(index)) {
                alert("Please enter both value and index for insertion.");
                return;
            } else {
                if (!Number.isInteger(index) || index < 0 || index >= size) {
                    highlightLine(1);
                    await delay(300);
                    highlightLine(2);
                    alert("Invalid index for insertion.");
                    return;
                }
                else{
                    highlightLine(4);
                    await delay(300);
                    highlightLine(5);

                    arrayValues[index] = value;
                    renderArray();
                    const cell = document.querySelectorAll('.cell')[index];
                    if (cell) {
                        cell.classList.add('highlight');
                        setTimeout(() => cell.classList.remove('highlight'), 1000);
                    }
                }
            }
        } else if (option === "Delete") {
            highlightLine(0);
            if (isNaN(index)|| !Number.isInteger(index) || index < 0 || index >= size) {
                highlightLine(1);
                await delay(300);
                highlightLine(2);
                alert("Invalid index.");
                return;
            } 
            else {
                highlightLine(4);
                await delay(300);
                arrayValues[index] = null;
                highlightLine(5);
                renderArray();
            }
        }
        valueInput.value = "";
        indexInput.value = "";

        // Progress update for Array Update
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

if (updateOption && valueInput) {
    updateOption.addEventListener("change", () => {
        renderPseudocode(updateOption.value);
        if (updateOption.value === "Delete") {
            valueInput.style.display = "none";
        } else {
            valueInput.style.display = "";
        }
    });
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

const homePgBtn = document.getElementById("homePage");
const homePage = document.querySelector(".homePage");
const dashBrdBtn = document.getElementById("dashBoard");
if (homePgBtn) {
    homePgBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
if (homePage) {
    homePage.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
if (dashBrdBtn) {
    dashBrdBtn.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });
}
