const params = new URLSearchParams(window.location.search);
const size = params.get("size");
const values = params.get("values");
let arrayValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5]; // fallback default

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
}
renderArray();

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function insertAt(index, value) {
    if (index < 0 || index > arrayValues.length) {
        alert("Invalid index for insertion.");
        return;
    }
    // Visual shift
    const cells = document.querySelectorAll('.cell');
    for (let i = cells.length - 1; i >= index; i--) {
        cells[i].style.transform = 'translateX(60px)';
    }
    await delay(400);

    arrayValues.splice(index, 0, value);
    renderArray();

    // Highlight inserted cell
    const inserted = document.querySelectorAll('.cell')[index];
    if (inserted) {
        inserted.classList.add('highlight');
        setTimeout(() => inserted.classList.remove('highlight'), 1000);
    }
}

async function deleteAt(index) {
    if (index < 0 || index >= arrayValues.length) {
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

const arraySearchBtn = document.querySelector(".arrSearch");
if (arraySearchBtn) {
    arraySearchBtn.addEventListener("click", () => {
        const size = arrayValues.length;
        const values = arrayValues.join(",");
        // If .sort-option exists, use its value; otherwise default to "Ascending"
        const order = document.querySelector(".sort-option")?.value || "Ascending";
        const url = `arraySearch.html?size=${size}&values=${encodeURIComponent(values)}&order=${order}`;
        window.location.href = url;
    });
}

const arraySortBtn = document.querySelector(".arrSort");
if (arraySortBtn) {
    arraySortBtn.addEventListener("click", () => {
        const size = arrayValues.length;
        const values = arrayValues.join(",");
        const order = document.querySelector(".sort-option")?.value || "Ascending";
        const url = `arraySort.html?size=${size}&values=${encodeURIComponent(values)}&order=${order}`;
        window.location.href = url;
    });
}
