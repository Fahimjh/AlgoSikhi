// Get params from URL
const params = new URLSearchParams(window.location.search);
const values = params.get("values");
let listValues = values ? values.split(",").map(Number) : [1, 2, 3, 4, 5];
let list2Values = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const operationsSelect = document.querySelector(".Operations");
const oprBtn = document.querySelector(".oprBtn");
const listBasicBtn = document.querySelector(".listBasic");
const homePageBtn = document.querySelector(".homePagebtn");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for deque operations
const pseudocodeData = {
    "push_back()": [
        "FUNCTION push_back(value)",
        "  IF value is empty OR value is not number THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE ",
        "    deque[size] = value",
        "    size = size + 1",
        "    RETURN(deque)",
        "END FUNCTION"
    ],
    "pop_back()": [
        "FUNCTION pop_back()",
        "  IF size <= 0 THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE",
        "    size = size - 1",
        "  END ELSE",
        "END FUNCTION"
    ],
    "push_front()": [
        "FUNCTION push_front(value)",
        "  IF value is empty OR value is not number THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE ",
        "    size = size + 1",
        "    shift elements to right",
        "    deque[0]=value",
        "    RETURN(deque)",
        "  END ELSE",
        "END FUNCTION"
    ],
    "pop_front()": [
        "FUNCTION pop_front()",
        "  IF size <= 0 THEN",
        "    RETURN(error)",
        "  END IF",
        "  ELSE",
        "    size = size - 1",
        "    shift values to left",
        "    RETURN(deque)",
        "  END Else",
        "END FUNCTION"
    ],
    "insert()": [
        "FUNCTION insert(list, position, value)",
        "  IF position < 0 OR position > list.length THEN",
        "    RETURN (error)",
        "  END IF",
        "  ELSE",
        "    SHIFT elements from position to right",
        "    SET list[position] = value",
        "    RETURN updated list",
        "  END ELSE",
        "END FUNCTION"
    ],
    "remove()": [
        "FUNCTION remove(list, value)",
        "   IF value NOT IN list THEN",
        "     RETURN (error)",
        "   END IF",
        "   ELSE",
        "     FIND index of value/values",
        "     SHIFT elements after index to left",
        "     RETURN (list)",
        "   END ELSE",
        "END FUNCTION"
    ],
    "merge()": [
        "FUNCTION merge(list1, list2)",
        "   Enter values for list 2",
        "   IF list2 is EMPTY",
        "      RETURN(error)",
        "   END IF",
        "   ELSE",
        "     list1 = list1 + list2",
        "     SORT(list1)",
        "     RETURN merged sorted list",
        "   END ELSE",
        "END FUNCTION"
    ],
};

// Render pseudocode based on operation
function renderPseudocode(operation) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;

    codeContainer.innerHTML = "";
    const lines = pseudocodeData[operation] || ["Select an operation to view pseudocode"];

    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

// Highlight specific pseudocode line/lines
function highlightLines(...indices) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));

    indices.forEach(index => {
        const targetLine = document.getElementById(`line-${index}`);
        if (targetLine) targetLine.classList.add("highlight");
    });
}

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Deque Operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
    }
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize List Operations";
});

// Show/hide input field based on selected operation
function toggleInputPlaceholder() {
    const op = operationsSelect.value;
    renderPseudocode(op);
    if (op === "pop_back()" || op === "pop_front()") {
        valueInput.style.display = "none";
    }
    else if (op === "insert()") {
        valueInput.style.display = "inline-block";
        valueInput.placeholder = "Position,Value (e.g. 2,99)";
    } else if (op === "merge()") {
        valueInput.style.display = "inline-block";
        valueInput.placeholder = "Values for list2 (e.g. 5,10,15)";
    } else if (op === "remove()") {
        valueInput.style.display = "inline-block";
        valueInput.placeholder = "Value to remove";
    } else if (op === "push_back()" || op === "push_front()") {
        valueInput.style.display = "inline-block";
        valueInput.placeholder = "Enter value";
    }
}
toggleInputPlaceholder();
operationsSelect.addEventListener("change", toggleInputPlaceholder);


// Render main list
function renderList(highlightIndices = []) {
    const listContainer = document.getElementById("list");
    listContainer.innerHTML = "";
    listValues.forEach((val, idx) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        if (highlightIndices.includes(idx)) cell.classList.add('active');
        listContainer.appendChild(cell);
    });
}

// Render list2 if applicable
function renderList2() {
    const list2Container = document.getElementById("list2");
    list2Container.innerHTML = "";
    list2Values.forEach((val) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        list2Container.appendChild(cell);
    });
}

// Initial render
renderList();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
oprBtn.addEventListener("click", async () => {
    const op = operationsSelect.value;
    const val = valueInput.value.trim();

    if (op === "push_back()") {
        highlightLines(0);
        if (val === "" || isNaN(Number(val))) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);

            alert("Please enter a valid value to push.");
            return;
        }
        else {
            highlightLines(4);
            await delay(300);
            listValues.push(Number(val));
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            renderList([listValues.length - 1]);
        }

    }
    else if (op === "push_front()") {
        highlightLines(0);

        if (val === "" || isNaN(Number(val))) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            alert("Please enter a valid value to push.");
            return;
        }
        else {
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            await delay(300);
            highlightLines(8);
            listValues.unshift(Number(val));
            renderList([0]);
        }

    }
    else if (op === "pop_back()") {
        highlightLines(0);
        if (listValues.length === 0) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);

            alert("List is already empty.");
            return;
        }
        else {
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            listValues.pop();
            renderList();
        }

    }
    else if (op === "pop_front()") {
        highlightLines(0);
        if (listValues.length === 0) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            alert("Deque is already empty.");
            return;
        }
        else {
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            listValues.shift();
            renderList([listValues.pos]);
        }

    }
    else if (op === "insert()") {
        highlightLines(0);
        const [posStr, valueStr] = val.split(",");
        const pos = Number(posStr);
        const value = Number(valueStr);
        if (isNaN(pos) || isNaN(value) || pos < 0 || pos > listValues.length) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            alert("Enter valid position and value (e.g. 2,99)");
            return;
        }
        else {
            highlightLines(5);
            await delay(300);
            listValues.splice(pos, 0, value);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            await delay(300);
            renderList([pos]);
        }

    }
    else if (op === "remove()") {
        highlightLines(0);
        await delay(300);
        if (val === "") {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            alert("Enter a value to remove");
            return;
        }
        else {
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);
            listValues = listValues.filter(item => item != val);
            alert(`Removing all ${val} values from list`);
            renderList();
        }

    }
    else if (op === "merge()") {
        highlightLines(0);
        await delay(300);
        highlightLines(1);

        if (!val) {
            highlightLines(2);
            await delay(300);
            highlightLines(3);
            alert("Enter values for list2");
            return
        }
        else {
            highlightLines(5);
            await delay(300);
            highlightLines(6);
            await delay(300);
            highlightLines(7);

            list2Values = val.split(",").map(Number).filter(v => !isNaN(v));
            listValues = [...listValues, ...list2Values].sort((a, b) => a - b);
            renderList();
            renderList2();

        }
        const highlightIndices = [];

        list2Values.forEach(val => {
            const idx = listValues.indexOf(val);
            if (idx !== -1) {
                highlightIndices.push(idx);
            }
        });

        renderList(highlightIndices);

    }

    updateProgress(op);
    valueInput.value = "";
});


// Update progress to backend
function updateProgress(operation) {
    const methodToSubtopic = {
        "push_back()": "pushBack",
        "push_front()": "pushFront",
        "pop_back()": "popBack",
        "pop_front()": "popFront",
        "insert()": "insert",
        "remove()": "remove",
        "merge()": "merge"
    };

    const token = localStorage.getItem("token");
    if (token && methodToSubtopic[operation]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "list Operations",
                subtopic: methodToSubtopic[operation],
                value: true
            })
        })
            .then(res => res.json())
            .then(data => console.log("✅ Progress updated:", methodToSubtopic[operation]))
            .catch(err => console.error("❌ Progress update failed:", err));
    }
}

// Navigation
homePageBtn.addEventListener("click", () => window.location.href = "index.html");
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
