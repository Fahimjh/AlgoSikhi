
// === STACK OPERATION JS ===

// Get params from URL
const params = new URLSearchParams(window.location.search);
const stackParam = params.get("stack");

function parseStack(str) {
    try {
        const parsed = str ? JSON.parse(decodeURIComponent(str)) : [];
        return parsed.map(obj => obj.value);
    } catch {
        return [];
    }
}

let stack = parseStack(stackParam);
if (!stack.length) stack = [10, 20, 30];

const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const stackContainer = document.getElementById("Stack");
const opSelect = document.querySelector(".Operations");
const valueInput = document.getElementById("value");
const oprBtn = document.querySelector(".oprStackBtn");
const homePageBtn = document.querySelector(".homePageBtn");
const queueIntroBtn = document.querySelector(".queueIntroBtn");

// === TOGGLE placeholder ===
function toggleInput() {
    const op = opSelect.value;
    if (op === "pop()" || op === "empty()" || op === "top()" || op === "size()") {
        valueInput.style.display = "none";
    } else {
        valueInput.style.display = "inline-block";
        valueInput.placeholder = op === "swap()" ? "Enter s2 values (e.g. 5,6)" : "Enter value";
    }
}
opSelect.addEventListener("change", toggleInput);
toggleInput();

// === TOGGLE VISUALIZATION SECTION ===
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Stack Operations";
});
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Stack Operations";
});

// === RENDER STACK ===
function renderStack(arr, highlights = []) {
    const stackContainer = document.getElementById("Stack");
    stackContainer.innerHTML = "";

    for (let i = arr.length - 1; i >= 0; i--) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = arr[i];
        if (highlights.includes(arr[i])) {
            cell.classList.add("active");
        }
        stackContainer.appendChild(cell);
    }
}
renderStack(stack);

// === HANDLE OPERATION ===
oprBtn.addEventListener("click", () => {
    const op = opSelect.value;
    const raw = valueInput.value.trim();
    const values = raw.split(",").map(v => v.trim()).filter(Boolean);
    let highlightTop = false;

    if ((op === "push()" || op === "swap()") && !raw) {
        alert("Please enter a value.");
        return;
    }

    if (op === "push()") {
        stack.push(values[0]);
        highlightTop = true;
    } else if (op === "pop()") {
        if (stack.length === 0) {
            alert("Stack is empty. Cannot pop.");
            return;
        }
        const popped = stack.pop();
        alert(`Popped: ${popped}`);
    } else if (op === "top()") {
        if (stack.length === 0) {
            alert("Stack is empty.");
        } else {
            alert(`Top: ${stack[stack.length - 1]}`);
            highlightTop = true;
        }
    } else if (op === "empty()") {
        alert(stack.length === 0 ? "Stack is empty" : "Stack is not empty");
    } else if (op === "size()") {
        alert(`Size = ${stack.length}`);
    } else if (op === "swap()") {
    const stack2 = values.map(v => v);
    const originalStack = [...stack];

    // Swap
    stack = stack2;

    alert(
        `✅ Swap Successful!\n\n` +
        `Original Stack (before swap): [${originalStack.join(", ")}]\n` +
        `New Stack (after swap): [${stack.join(", ")}]`
    );

    renderStack(stack, highlightTop ? [stack[stack.length - 1]] : []);
    return; // prevent double rendering below
}


    renderStack(stack, highlightTop);
    sendProgress(op);
    valueInput.value = "";
});

// === BACKEND PROGRESS UPDATE ===
function sendProgress(operation) {
    const methodStack = {
        "push()": "push",
        "pop()": "pop",
        "top()": "top",
        "empty()": "empty",
        "size()": "size",
        "swap()": "swap"
    };
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            topic: "Stack Operations",
            subtopic: methodStack[operation],
            value: true
        })
    })
    .then(res => res.json())
    .then(() => console.log(`✅ Progress updated for ${methodMap[operation]}`))
    .catch(err => console.error("❌ Progress update error:", err));
}

// === NAVIGATION ===
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
queueIntroBtn.addEventListener("click", () => {
    window.location.href = "queueIntro.html";
});