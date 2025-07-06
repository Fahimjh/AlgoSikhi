const params = new URLSearchParams(window.location.search);
let size = params.get("size");
const values = params.get("values");
let arrayValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];

// Ensure size is a number and fallback to default array length if not provided
size = size ? Number(size) : arrayValues.length;

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

    // Update array size display
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
    if (!Number.isInteger(index) || index < 0 || index >= size) {
        alert("Invalid index for insertion.");
        return;
    }

    // Overwrite or shift if there is a hole
    if (!(index in arrayValues)) {
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
