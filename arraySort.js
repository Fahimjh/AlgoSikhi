const params = new URLSearchParams(window.location.search);
const size = params.get("size");
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

// Pseudocode lines
const pseudocodeData = {
    Bubble: {
        Ascending: [
            "FUNCTION bubbleSortAscending(array, size)",
            "  FOR i FROM 0 TO size - 2",
            "    FOR j FROM 0 TO size - i - 2",
            "      IF array[j] > array[j + 1] THEN",
            "        temp = array[j]",
            "        array[j] = array[j + 1]",
            "        array[j + 1] = temp",
            "      END IF",
            "    END FOR",
            "  END FOR",
            "END FUNCTION"
        ],
        Descending: [
            "FUNCTION bubbleSortDescending(array, size)",
            "  FOR i FROM 0 TO size - 2",
            "    FOR j FROM 0 TO size - i - 2",
            "      IF array[j] < array[j + 1] THEN",
            "        temp = array[j]",
            "        array[j] = array[j + 1]",
            "        array[j + 1] = temp",
            "      END IF",
            "    END FOR",
            "  END FOR",
            "END FUNCTION"
        ]
    },
    Selection: {
        Ascending: [
            "FUNCTION selectionSortAscending(array, size)",
            "  FOR i FROM 0 TO size - 2",
            "    minIndex = i",
            "    FOR j FROM i + 1 TO size - 1",
            "      IF array[j] < array[minIndex] THEN",
            "        minIndex = j",
            "      END IF",
            "    END FOR",
            "    SWAP array[i] WITH array[minIndex]",
            "  END FOR",
            "END FUNCTION"
        ],
        Descending: [
            "FUNCTION selectionSortDescending(array, size)",
            "  FOR i FROM 0 TO size - 2",
            "    maxIndex = i",
            "    FOR j FROM i + 1 TO size - 1",
            "      IF array[j] > array[maxIndex] THEN",
            "        maxIndex = j",
            "      END IF",
            "    END FOR",
            "    SWAP array[i] WITH array[maxIndex]",
            "  END FOR",
            "END FUNCTION"
        ]
    },
    Insertion: {
        Ascending: [
            "FUNCTION insertionSortAscending(array, size)",
            "  FOR i FROM 1 TO size - 1",
            "    key = array[i]",
            "    j = i - 1",
            "    WHILE j >= 0 AND array[j] > key",
            "      array[j + 1] = array[j]",
            "      j = j - 1",
            "    END WHILE",
            "    array[j + 1] = key",
            "  END FOR",
            "END FUNCTION"
        ],
        Descending: [
            "FUNCTION insertionSortDescending(array, size)",
            "  FOR i FROM 1 TO size - 1",
            "    key = array[i]",
            "    j = i - 1",
            "    WHILE j >= 0 AND array[j] < key",
            "      array[j + 1] = array[j]",
            "      j = j - 1",
            "    END WHILE",
            "    array[j + 1] = key",
            "  END FOR",
            "END FUNCTION"
        ]
    },
    Merge: {
        Ascending: [
            "FUNCTION mergeSortAscending(array, left, right)",
            "  IF left >= right THEN RETURN",
            "  mid = (left + right) / 2",
            "  mergeSortAscending(array, left, mid)",
            "  mergeSortAscending(array, mid + 1, right)",
            "  merge(array, left, mid, right)",
            "END FUNCTION",
            "",
            "FUNCTION merge(array, left, mid, right)",
            "  Create leftPart and rightPart",
            "  WHILE both parts not empty",
            "    IF left[i] <= right[j] THEN",
            "      array[k++] = left[i++]",
            "    ELSE",
            "      array[k++] = right[j++]",
            "    END IF",
            "  Copy remaining elements",
            "END FUNCTION"
        ],
        Descending: [
            "FUNCTION mergeSortDescending(array, left, right)",
            "  IF left >= right THEN RETURN",
            "  mid = (left + right) / 2",
            "  mergeSortDescending(array, left, mid)",
            "  mergeSortDescending(array, mid + 1, right)",
            "  merge(array, left, mid, right)",
            "END FUNCTION",
            "",
            "FUNCTION merge(array, left, mid, right)",
            "  Create leftPart and rightPart",
            "  WHILE both parts not empty",
            "    IF left[i] >= right[j] THEN",
            "      array[k++] = left[i++]",
            "    ELSE",
            "      array[k++] = right[j++]",
            "    END IF",
            "  Copy remaining elements",
            "END FUNCTION"
        ]
    }
};


// Inject pseudocode lines into the DOM
function renderPseudocode(method, order) {
    const codeContainer = document.getElementById("pseudocode");
    codeContainer.innerHTML = "";
    const lines = pseudocodeData[method]?.[order] || [];

    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre"); // better formatting
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

function highlightLine(index, duration = 300) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    
    const targetLine = document.getElementById(`line-${index}`);
    if (targetLine) {
        targetLine.classList.add("highlight");
        
        // Auto-remove highlight after duration
        setTimeout(() => {
            targetLine.classList.remove("highlight");
        }, duration);
    }
}

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

function resetVisualization() {
    const cells = document.querySelectorAll("#array .cell");
    cells.forEach(cell => {
        cell.classList.add("reset");
        setTimeout(() => {
            cell.classList.remove("active", "sorted", "shifting", "partition", "reset");
        }, 300);
    });
}

const initialMethod = document.querySelector(".sort-method").value;
const initialOrder = document.querySelector(".sort-option").value;
renderPseudocode(initialMethod, initialOrder);
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
            highlightLine(1); // Outer loop
            for (let j = 0; j < n - i - 1; j++) {
                highlightLine(2); // Inner loop
                cells[j].classList.add("active");
                cells[j + 1].classList.add("active");
                await delay(600);

                highlightLine(3); // Comparison
                let shouldSwap = sortOption === "Ascending"
                    ? arrayValues[j] > arrayValues[j + 1]
                    : arrayValues[j] < arrayValues[j + 1];

                if (shouldSwap) {
                    highlightLine(4); // Swap lines
                    [arrayValues[j], arrayValues[j + 1]] = [arrayValues[j + 1], arrayValues[j]];
                    cells[j].textContent = arrayValues[j];
                    cells[j + 1].textContent = arrayValues[j + 1];
                    await delay(300); // Extra delay for swap visualization
                }

                cells[j].classList.remove("active");
                cells[j + 1].classList.remove("active");
            }
            // Mark the correctly placed element
            cells[n - i - 1].classList.add("sorted");
            await delay(300); // Pause to show sorted element
        }
        cells[0].classList.add("sorted"); // First element is automatically sorted

    } else if (sortMethod === "Selection") {
        let n = arrayValues.length;
        for (let i = 0; i < n - 1; i++) {
            highlightLine(1); // Outer loop
            let minOrMaxIdx = i;
            cells[minOrMaxIdx].classList.add("active");
            highlightLine(2); // Initialize min/max

            for (let j = i + 1; j < n; j++) {
                highlightLine(3); // Inner loop
                cells[j].classList.add("active");
                await delay(600);

                highlightLine(4); // Comparison
                let condition = sortOption === "Ascending"
                    ? arrayValues[j] < arrayValues[minOrMaxIdx]
                    : arrayValues[j] > arrayValues[minOrMaxIdx];

                if (condition) {
                    cells[minOrMaxIdx].classList.remove("active");
                    minOrMaxIdx = j;
                    cells[minOrMaxIdx].classList.add("active");
                    await delay(300);
                } else {
                    cells[j].classList.remove("active");
                }
            }

            highlightLine(5); // Swap
            if (minOrMaxIdx !== i) {
                [arrayValues[i], arrayValues[minOrMaxIdx]] = [arrayValues[minOrMaxIdx], arrayValues[i]];
                cells[i].textContent = arrayValues[i];
                cells[minOrMaxIdx].textContent = arrayValues[minOrMaxIdx];
                await delay(500); // Extra delay for swap
            }

            cells[minOrMaxIdx].classList.remove("active");
            cells[i].classList.add("sorted");
        }
        cells[n - 1].classList.add("sorted");
    } else if (sortMethod === "Insertion") {
        let n = arrayValues.length;
        for (let i = 1; i < n; i++) {
            highlightLine(1); // Outer loop
            let key = arrayValues[i];
            let j = i - 1;

            cells[i].classList.add("active");
            await delay(600);

            while (j >= 0 && (sortOption === "Ascending"
                ? arrayValues[j] > key
                : arrayValues[j] < key)) {
                highlightLine(2); // While condition
                arrayValues[j + 1] = arrayValues[j];
                cells[j + 1].textContent = arrayValues[j];
                cells[j].classList.add("shifting");
                await delay(600);

                highlightLine(3); // Shift operation
                j--;
                cells[j + 1].classList.remove("shifting");
            }

            highlightLine(4); // Insertion
            arrayValues[j + 1] = key;
            cells[j + 1].textContent = key;
            cells[i].classList.remove("active");
            await delay(300);
        }

        // Mark all as sorted at the end
        for (let cell of cells) {
            cell.classList.add("sorted");
        }
    } else if (sortMethod === "Merge") {
        async function mergeSort(start, end) {
        highlightLine(0); // Function start
        if (start >= end) {
            highlightLine(1); // Base case return
            await delay(300);
            return;
        }

        highlightLine(2); // Calculate mid
        const mid = Math.floor((start + end) / 2);
        await delay(300);

        // Visualize partition
        for (let x = start; x <= end; x++) {
            cells[x].classList.add("partition");
        }
        await delay(500);

        highlightLine(3); // Left sort
        await mergeSort(start, mid);

        highlightLine(4); // Right sort
        await mergeSort(mid + 1, end);

        // Remove partition visualization
        for (let x = start; x <= end; x++) {
            cells[x].classList.remove("partition");
        }

        highlightLine(5); // Merge
        await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
        highlightLine(7); // Function start
        const left = arrayValues.slice(start, mid + 1);
        const right = arrayValues.slice(mid + 1, end + 1);
        await delay(300);

        highlightLine(8); // Initialize pointers
        let i = 0, j = 0, k = start;
        await delay(300);

        while (i < left.length && j < right.length) {
            highlightLine(9); // While condition
            cells[k].classList.add("active");
            await delay(300);

            highlightLine(10); // Comparison
            let shouldTakeLeft = sortOption === "Ascending" 
                ? left[i] <= right[j] 
                : left[i] >= right[j];

            if (shouldTakeLeft) {
                highlightLine(11); // Take from left
                arrayValues[k] = left[i];
                cells[k].textContent = left[i];
                i++;
            } else {
                highlightLine(13); // Take from right
                arrayValues[k] = right[j];
                cells[k].textContent = right[j];
                j++;
            }

            highlightLine(15); // Increment k
            k++;
            cells[k-1].classList.remove("active");
            await delay(300);
        }

        while (i < left.length) {
            highlightLine(17); // Copy remaining left
            cells[k].classList.add("active");
            arrayValues[k] = left[i];
            cells[k].textContent = left[i];
            i++;
            k++;
            cells[k-1].classList.remove("active");
            await delay(300);
        }

        while (j < right.length) {
            highlightLine(20); // Copy remaining right
            cells[k].classList.add("active");
            arrayValues[k] = right[j];
            cells[k].textContent = right[j];
            j++;
            k++;
            cells[k-1].classList.remove("active");
            await delay(300);
        }

        // Mark this merged section as sorted
        for (let x = start; x <= end; x++) {
            cells[x].classList.add("sorted");
        }
        await delay(300);
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
const sortMethodDropdown = document.querySelector(".sort-method");
const sortOrderDropdown = document.querySelector(".sort-option");

sortMethodDropdown.addEventListener("change", () => {
    const method = sortMethodDropdown.value;
    const order = sortOrderDropdown.value;
    resetVisualization();  // Add this line
    renderPseudocode(method, order);
});

sortOrderDropdown.addEventListener("change", () => {
    const method = sortMethodDropdown.value;
    const order = sortOrderDropdown.value;
    resetVisualization();  // Add this line
    renderPseudocode(method, order);
});


if (startBtn && container) {
    startBtn.addEventListener("click", () => {
        container.classList.toggle("visualization-active");
        startBtn.innerText = container.classList.contains("visualization-active")
            ? "Close Visualization"
            : "Visualize Array Sort";
        const method = document.querySelector(".sort-method").value;
        const order = document.querySelector(".sort-option").value;
        resetVisualization();  // Add this line
        renderPseudocode(method, order);
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
        const sortOption = document.querySelector(".sort-option").value;
        const nonEmptyValues = arrayValues.map(v => v === "" ? "" : v);
        const url = `arraySearch.html?size=${size}&values=${encodeURIComponent(nonEmptyValues)}&order=${sortOption}`;
        window.location.href = url;
    });
}

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


