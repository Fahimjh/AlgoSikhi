const params = new URLSearchParams(window.location.search);
const size = params.get("size");
const values = params.get("values");
let arrayValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];

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
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                cells[j].classList.add("active");
                cells[j + 1].classList.add("active");
                await delay(600);

                let shouldSwap = sortOption === "Ascending"
                    ? arrayValues[j] > arrayValues[j + 1]
                    : arrayValues[j] < arrayValues[j + 1];

                if (shouldSwap) {
                    [arrayValues[j], arrayValues[j + 1]] = [arrayValues[j + 1], arrayValues[j]];
                    cells[j].textContent = arrayValues[j];
                    cells[j + 1].textContent = arrayValues[j + 1];
                }

                cells[j].classList.remove("active");
                cells[j + 1].classList.remove("active");
            }
            cells[n - i - 1].classList.add("sorted");
        }
        for (let cell of cells) {
            cell.classList.add("sorted");
        }

    } else if (sortMethod === "Selection") {
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
        cells[n - 1].classList.add("sorted");

    } else if (sortMethod === "Insertion") {
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

        for (let cell of cells) {
            cell.classList.add("sorted");
        }

    } else if (sortMethod === "Merge") {
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

            for (let x = start; x <= end; x++) {
                cells[x].classList.add("sorted");
            }
        }

        await mergeSort(0, arrayValues.length - 1);
    }

    // ✅ Common progress update for all sorting methods
    const methodToSubtopic = {
        Bubble: "bubbleSort",
        Selection: "selectionSort",
        Insertion: "insertionSort",
        Merge: "mergeSort"
    };

    const token = localStorage.getItem("token");

    if (token && methodToSubtopic[sortMethod]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Array Sorting",
                subtopic: methodToSubtopic[sortMethod],
                value: true
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Progress updated for:", methodToSubtopic[sortMethod]);
            })
            .catch(err => {
                console.error("❌ Progress update failed:", err);
            });
    }
}

const sortBtn = document.querySelector(".sortBtn");
if (sortBtn) sortBtn.addEventListener("click", sort);

const createArrayBtn = document.querySelector(".arrCreate");
if (createArrayBtn) {
    createArrayBtn.addEventListener("click", () => {
        window.location.href = "array.html";
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
            : "Visualize Array Sort";
    });
}

if (closeBtn && container && startBtn) {
    closeBtn.addEventListener("click", () => {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Sort";
    });
}

const arraySearchBtn = document.querySelector(".arrSearch");
if (arraySearchBtn) {
    arraySearchBtn.addEventListener("click", () => {
        const values = arrayValues.join(",");
        const sortOption = document.querySelector(".sort-option").value;
        const url = `arraySearch.html?size=${size}&values=${encodeURIComponent(values)}&order=${sortOption}`;
        window.location.href = url;
    });
}
