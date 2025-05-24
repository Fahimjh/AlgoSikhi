const params = new URLSearchParams(window.location.search);
const size = params.get("size");
const values = params.get("values");
let arrayValues = values ? values.split(",").map(Number) : [];

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
    const method = searchMethodSelect.value;

    if (isNaN(searchValue)) {
        alert("Please enter a valid number to search.");
        return;
    }

    const cells = document.querySelectorAll("#array .cell");
    cells.forEach(cell => {
        cell.classList.remove("active", "found", "checked");
    });

    if (method === "linear") {
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
    } else if (method === "binary") {
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
            if (midValue < searchValue) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        if (!found) {
            alert(`Your value ${searchValue} isn't found`);
        }
    }
}

const searchBtn = document.querySelector(".searchBtn");
if (searchBtn) searchBtn.addEventListener("click", startSearch);

const createArrayBtn=document.querySelector(".arrCreate");
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");

if (startBtn && container) {
    startBtn.addEventListener("click", () => {
        if (container.classList.contains("visualization-active")) {
            container.classList.remove("visualization-active");
            startBtn.innerText = "Visualize Array Creation";
        } else {
            container.classList.add("visualization-active");
            startBtn.innerText = "Close Visualization";
        }
    });
}

if (closeBtn && container && startBtn) {
    closeBtn.addEventListener("click", () => {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Creation";
    });
}

// Array Create button 
createArrayBtn.addEventListener("click", () => {
    window.location.href = "array.html"; 
});

// Array Sort button
const arraySortBtn = document.querySelector(".arrSort");
if (arraySortBtn) {
    arraySortBtn.addEventListener("click", () => {
        const size = arrayValues.length;
        const values = arrayValues.join(",");
        if (!size || values === "") {
            alert("The array is empty. Please provide a valid size and values for the array before proceeding.");
        } else {
            const url = `arraySort.html?size=${size}&values=${encodeURIComponent(values)}`;
            window.location.href = url;
        }
    });
}