// === STACK OPERATION JS ===

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
const homeBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

const stackOpsPseudocode = {
    "push()": [
        "FUNCTION push(stack, value)",
        "  PUSH value TO stack",
        "END FUNCTION"
    ],
    "pop()": [
        "FUNCTION pop(stack)",
        "  IF stack is empty THEN",
        "    RETURN error",
        "  END IF",
        "  POP top value FROM stack",
        "END FUNCTION"
    ],
    "top()": [
        "FUNCTION top(stack)",
        "  IF stack is empty THEN",
        "    RETURN error",
        "  END IF",
        "  RETURN top value OF stack",
        "END FUNCTION"
    ],
    "empty()": [
        "FUNCTION empty(stack)",
        "  RETURN stack.length == 0",
        "END FUNCTION"
    ],
    "size()": [
        "FUNCTION size(stack)",
        "  RETURN stack.length",
        "END FUNCTION"
    ],
    "swap()": [
        "FUNCTION swap(stack1, stack2)",
        "  temp = stack1",
        "  stack1 = stack2",
        "  stack2 = temp",
        "END FUNCTION"
    ]
};

function renderPseudocode(operation) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    const lines = stackOpsPseudocode[operation];
    if (!lines) return;
    lines.forEach((line, idx) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${idx}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

function highlightLines(...indices) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    indices.forEach(idx => {
        const target = document.getElementById(`line-${idx}`);
        if (target) target.classList.add("highlight");
    });
}

startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize stack operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(opSelect.value);
    }
});
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize stack operations";
});
opSelect.addEventListener("change", () => {
    renderPseudocode(opSelect.value);
    toggleInput();
});

function toggleInput() {
    const op = opSelect.value;
    if (["pop()", "empty()", "top()", "size()"].includes(op)) {
        valueInput.style.display = "none";
    } else {
        valueInput.style.display = "inline-block";
        valueInput.placeholder = op === "swap()" ? "Enter s2 values (e.g. 5,6)" : "Enter value";
    }
}
toggleInput();

function renderStack(arr, highlights = []) {
    if (!Array.isArray(highlights)) highlights = [];
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

oprBtn.addEventListener("click", async () => {
    const op = opSelect.value;
    const raw = valueInput.value.trim();
    const values = raw.split(",").map(v => v.trim()).filter(Boolean);
    let highlights = [];

    renderPseudocode(op);

    if ((op === "push()" || op === "swap()") && !raw) {
        alert("Please enter a value.");
        return;
    }

    if (op === "push()") {
        highlightLines(0);
        await delay(300);
        const val = values[0];
        stack.push(val);
        highlightLines(1);
        await delay(300);
        highlights = [val];

    } 
    else if (op === "pop()") {
        highlightLines(0);
        await delay(300);
        if (stack.length === 0) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            await delay(300);
            alert("Stack is empty. Cannot pop.");
            return;
        }
        highlightLines(4);
        await delay(300);
        const popped = stack.pop();
        alert(`Popped: ${popped}`);

    } 
    else if (op === "top()") {
        highlightLines(0);
        await delay(200);
        if (stack.length === 0) {
            highlightLines(1);
            await delay(300);
            highlightLines(2);
            await delay(300);
            alert("Stack is empty.");
        } 
        else {
            highlightLines(4);
            await delay(300);
            const topVal = stack[stack.length - 1];
            alert(`Top: ${topVal}`);
            highlights = [topVal];
        }

    } 
    else if (op === "empty()") {
        highlightLines(1);
        await delay(300);
        alert(stack.length === 0 ? "Stack is empty" : "Stack is not empty");

    } else if (op === "size()") {
        highlightLines(1);
        await delay(300);
        alert(`Size = ${stack.length}`);

    } else if (op === "swap()") {
        highlightLines(0);
        await delay(300);
        const stack2 = values.map(v => v);
        highlightLines(1);
        await delay(300);
        const originalStack = [...stack];
        stack = stack2;
        highlightLines(2);
        await delay(300);
        highlightLines(3);
        await delay(300);
        alert(
            `✅ Swap Successful!\n\n` +
            `Original Stack (before swap): [${originalStack.join(", ")}]\n` +
            `New Stack (after swap): [${stack.join(", ")}]`
        );
        renderStack(stack, stack); // highlight all
        sendProgress(op);
        valueInput.value = "";
        return;
    }

    renderStack(stack, highlights);
    sendProgress(op);
    valueInput.value = "";
});

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
        .then(() => console.log(`✅ Progress updated for ${methodStack[operation]}`))
        .catch(err => console.error("❌ Progress update error:", err));
}

// === NAVIGATION ===
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
queueIntroBtn?.addEventListener("click", () => {
    window.location.href = "queueIntro.html";
});

// Show pseudocode for initial operation
renderPseudocode(opSelect.value);
