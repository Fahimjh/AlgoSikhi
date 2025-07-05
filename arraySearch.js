const params = new URLSearchParams(window.location.search);
const size = params.get("size");
const values = params.get("values");
const order = params.get("order") || "Ascending"; // Default to Ascending if not provided
let arrayValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5]; // fallback default

console.log("Array Size:", size);
console.log("Array Values:", arrayValues);

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

// Use class selectors for search inputs
const searchValueInput = document.querySelector(".search-value");
const searchMethodSelect = document.querySelector(".search-method");

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
        let found = false;
        for (let i = 0; i < cells.length; i++) {
            cells[i].classList.add("active");
            await delay(600);
            if (parseInt(cells[i].textContent) === searchValue) {
                cells[i].classList.add("found");
                alert(`Your value ${searchValue} is found at index ${i}`);
                found = true;
                break;
            }
            cells[i].classList.remove("active");
            cells[i].classList.add("checked");
        }
        if (!found) {
            alert(`Your value ${searchValue} isn't found`);
        }
    } else if (searchMethod === "binary") {
        let found = false;
        let left = 0;
        let right = cells.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            cells[mid].classList.add("active");
            await delay(800);
            const midValue = parseInt(cells[mid].textContent);
            if (midValue === searchValue) {
                cells[mid].classList.add("found");
                alert(`Your value ${searchValue} is found at index ${mid}`);
                found = true;
                break;
            }
            cells[mid].classList.remove("active");
            cells[mid].classList.add("checked");
            if (order === "Ascending") {
                if (midValue < searchValue) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            } else { // Descending
                if (midValue > searchValue) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        if (!found) {
            alert(`Your value ${searchValue} isn't found`);
        }
    }

    // Progress update for Array Search
    const methodToSubtopic = {
        linear: "linearSearch",
        binary: "binarySearch",
    };

    const token = localStorage.getItem("token");

    if (token && methodToSubtopic[searchMethod]) {
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
            .then(data => {
                console.log("✅ Progress updated for:", methodToSubtopic[searchMethod]);
            })
            .catch(err => {
                console.error("❌ Progress update failed:", err);
            });
    }
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
        if (container.classList.contains("visualization-active")) {
            container.classList.remove("visualization-active");
            startBtn.innerText = "Visualize Array Search";
        } else {
            container.classList.add("visualization-active");
            startBtn.innerText = "Close Visualization";
        }
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
