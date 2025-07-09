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

// Show/hide input field based on selected operation
function toggleInputPlaceholder() {
    const op = operationsSelect.value;
    if(op==="pop_back()" || op === "pop_front()"){
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

// Visualization toggle
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize List Operations";
});
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize List Operations";
});

// Render main list
function renderList() {
    const listContainer = document.getElementById("list");
    listContainer.innerHTML = "";
    listValues.forEach((val) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
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

// Perform operation
oprBtn.addEventListener("click", () => {
    const op = operationsSelect.value;
    const val = valueInput.value.trim();

    if (op === "push_back()") {
        if (val === "" || isNaN(Number(val))) return alert("Enter a valid number");
        listValues.push(Number(val));

    } else if (op === "push_front()") {
        if (val === "" || isNaN(Number(val))) return alert("Enter a valid number");
        listValues.unshift(Number(val));

    } else if (op === "pop_back()") {
        if (listValues.length === 0) return alert("List is empty");
        listValues.pop();

    } else if (op === "pop_front()") {
        if (listValues.length === 0) return alert("List is empty");
        listValues.shift();

    } else if (op === "insert()") {
        const [posStr, valueStr] = val.split(",");
        const pos = Number(posStr);
        const value = Number(valueStr);
        if (isNaN(pos) || isNaN(value) || pos < 0 || pos > listValues.length)
            return alert("Enter valid position and value (e.g. 2,99)");
        listValues.splice(pos, 0, value);

    } else if (op === "remove()") {
        if (val === "") return alert("Enter a value to remove");
        listValues = listValues.filter(item => item != val);

    } else if (op === "merge()") {
        if (!val) return alert("Enter values for list2");

        list2Values = val.split(",").map(Number).filter(v => !isNaN(v));

        const isSorted = list2Values.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
        if (!isSorted) {
            alert("List2 was not sorted. Sorting automatically before merging.");
            list2Values.sort((a, b) => a - b);
        }

        // Sort both lists before merging
        listValues.sort((a, b) => a - b);
        listValues = [...listValues, ...list2Values].sort((a, b) => a - b);
    }

    renderList();
    if (op === "merge()") renderList2();
    else document.getElementById("list2").innerHTML = "";

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
