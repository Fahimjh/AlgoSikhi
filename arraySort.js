const params = new URLSearchParams(window.location.search);
const size = params.get("size");
const values = params.get("values");
let arrayValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5]; // fallback default

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

// Sorting logic
async function sort() {
    const sortMethod = document.querySelector(".sort-method").value;
    const sortOption = document.querySelector(".sort-option").value;
    const cells = document.querySelectorAll("#array .cell");

    if (sortMethod === "Bubble") {
        let n = arrayValues.length;
        let swapped;
        for (let i = 0; i < n - 1; i++) {
            swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                // Highlight compared cells
                cells[j].classList.add("active");
                cells[j + 1].classList.add("active");
                await delay(600);

                let shouldSwap = sortOption === "Ascending"
                    ? arrayValues[j] > arrayValues[j + 1]
                    : arrayValues[j] < arrayValues[j + 1];

                if (shouldSwap) {
                    // Swap in array
                    [arrayValues[j], arrayValues[j + 1]] = [arrayValues[j + 1], arrayValues[j]];
                    // Swap in DOM
                    cells[j].textContent = arrayValues[j];
                    cells[j + 1].textContent = arrayValues[j + 1];
                    swapped = true;
                }

                // Remove highlight
                cells[j].classList.remove("active");
                cells[j + 1].classList.remove("active");
            }
            // Mark the last sorted cell
            cells[n - i - 1].classList.add("sorted");
        }
        // Mark all as sorted at the end
        for (let cell of cells) {
            cell.classList.add("sorted");
        }
    }
    else if (sortMethod === "Selection") {
        let n = arrayValues.length;

        for (let i = 0; i < n - 1; i++) {
            let minOrMaxIdx = i;
            cells[minOrMaxIdx].classList.add("active");

            for (let j = i + 1; j < n; j++) {
                cells[j].classList.add("active");
                await delay(600);

                let condition = sortOption === "Ascending"
                    ? arrayValues[j] < arrayValues[minOrMaxIdx]
                    : arrayValues[j] > arrayValues[minOrMaxIdx];

                if (condition) {
                    cells[minOrMaxIdx].classList.remove("active");
                    minOrMaxIdx = j;
                    cells[minOrMaxIdx].classList.add("active");
                } else {
                    cells[j].classList.remove("active");
                }
            }

            if (minOrMaxIdx !== i) {
                [arrayValues[i], arrayValues[minOrMaxIdx]] = [arrayValues[minOrMaxIdx], arrayValues[i]];
                cells[i].textContent = arrayValues[i];
                cells[minOrMaxIdx].textContent = arrayValues[minOrMaxIdx];
            }

            cells[minOrMaxIdx].classList.remove("active");
            cells[i].classList.add("sorted");
        }

        // Mark last one as sorted
        cells[n - 1].classList.add("sorted");
    }

    else if (sortMethod === "Insertion") {
        let n = arrayValues.length;
        for (let i = 1; i < n; i++) {
            let key = arrayValues[i];
            let j = i - 1;

            cells[i].classList.add("active");
            await delay(600);

            while (
                j >= 0 &&
                (sortOption === "Ascending"
                    ? arrayValues[j] > key
                    : arrayValues[j] < key)
            ) {
                arrayValues[j + 1] = arrayValues[j];
                cells[j + 1].textContent = arrayValues[j];
                j--;

                await delay(600);
            }

            arrayValues[j + 1] = key;
            cells[j + 1].textContent = key;

            cells[i].classList.remove("active");
        }

        // Mark all as sorted
        for (let cell of cells) {
            cell.classList.add("sorted");
        }
    }

    else if (sortMethod === "Merge") {
        async function mergeSort(start, end) {
            if (start >= end) return;

            const mid = Math.floor((start + end) / 2);

            await mergeSort(start, mid);
            await mergeSort(mid + 1, end);
            await merge(start, mid, end);
        }

        async function merge(start, mid, end) {
            const left = arrayValues.slice(start, mid + 1);
            const right = arrayValues.slice(mid + 1, end + 1);

            let i = 0, j = 0, k = start;

            while (i < left.length && j < right.length) {
                cells[k].classList.add("active");
                await delay(600);

                let shouldTakeLeft = sortOption === "Ascending"
                    ? left[i] <= right[j]
                    : left[i] >= right[j];

                if (shouldTakeLeft) {
                    arrayValues[k] = left[i];
                    cells[k].textContent = left[i];
                    i++;
                } else {
                    arrayValues[k] = right[j];
                    cells[k].textContent = right[j];
                    j++;
                }

                cells[k].classList.remove("active");
                k++;
            }

            while (i < left.length) {
                cells[k].classList.add("active");
                await delay(600);

                arrayValues[k] = left[i];
                cells[k].textContent = left[i];
                cells[k].classList.remove("active");

                i++;
                k++;
            }

            while (j < right.length) {
                cells[k].classList.add("active");
                await delay(600);

                arrayValues[k] = right[j];
                cells[k].textContent = right[j];
                cells[k].classList.remove("active");

                j++;
                k++;
            }

            // Mark merged part as sorted
            for (let x = start; x <= end; x++) {
                cells[x].classList.add("sorted");
            }
        }

        await mergeSort(0, arrayValues.length - 1);
    }

}

const sortBtn = document.querySelector(".sortBtn");
if (sortBtn) sortBtn.addEventListener("click", sort);

// Array Create button 
const createArrayBtn = document.querySelector(".arrCreate");
if (createArrayBtn) {
    createArrayBtn.addEventListener("click", () => {
        window.location.href = "array.html";
    });
}


// Visualization section show/hide
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");

if (startBtn && container) {
    startBtn.addEventListener("click", () => {
        if (container.classList.contains("visualization-active")) {
            container.classList.remove("visualization-active");
            startBtn.innerText = "Visualize Array Sort";
        } else {
            container.classList.add("visualization-active");
            startBtn.innerText = "Close Visualization";
        }
    });
}

if (closeBtn && container && startBtn) {
    closeBtn.addEventListener("click", () => {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Sort";
    });
}

// Array Search button
const arraySearchBtn = document.querySelector(".arrSearch");
if (arraySearchBtn) {
    arraySearchBtn.addEventListener("click", () => {
        const size = arrayValues.length;
        const values = arrayValues.join(",");
        const sortOption = document.querySelector(".sort-option").value; // Get order
        const url = `arraySearch.html?size=${size}&values=${encodeURIComponent(values)}&order=${sortOption}`;
        window.location.href = url;
    });
}