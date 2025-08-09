let stackValues = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const createBtn = document.querySelector(".crtStackBtn");
const stackOpsBtn = document.querySelector(".StackOpsBtn");
const stackContainer = document.getElementById("stack");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for stack creation
const pseudocodeData = {
    stack: [
        "FUNCTION createStack(values)",
        "  IF values is empty THEN",
        "    RETURN error",
        "  END IF",
        "  LET stack = empty list",
        "  FOR EACH v IN values",
        "    PUSH v TO stack",
        "  END FOR",
        "  RETURN stack",
        "END FUNCTION"
    ]
};

function renderPseudocode(type = "stack") {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    const lines = pseudocodeData[type];
    if (!lines) return;
    lines.forEach((line, index) => {
        const lineElem = document.createElement("pre");
        lineElem.id = `line-${index}`;
        lineElem.textContent = line;
        codeContainer.appendChild(lineElem);
    });
}

function highlightLines(...indices) {
    const allLines = document.querySelectorAll("#pseudocode pre");
    allLines.forEach(line => line.classList.remove("highlight"));
    indices.forEach(index => {
        const targetLine = document.getElementById(`line-${index}`);
        if (targetLine) targetLine.classList.add("highlight");
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize stack creation";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode("stack");
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize stack creation";
});

// Render stack values vertically (top at the bottom)
function renderStack(arr) {
    stackContainer.innerHTML = "";
    const reversed = [...arr].reverse();
    reversed.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        stackContainer.appendChild(cell);
    });
}

// Handle stack creation
createBtn.addEventListener("click", async () => {
    const raw = valueInput.value.trim();
    renderPseudocode("stack");

    if (!raw) {
        highlightLines(1);
        await delay(300);
        highlightLines(2);
        await delay(300);
        alert("Please enter values separated by commas.");
        return;
    }

    highlightLines(3);
    await delay(300);

    const values = raw
        .split(",")
        .map(v => v.trim())
        .filter(v => v !== "");

    stackValues = [];
    highlightLines(4);
    await delay(300);
    for (let i = 0; i < values.length; i++) {
        highlightLines(5);
        await delay(300);
        highlightLines(6);
        await delay(300);
        highlightLines(8);
        stackValues.push(values[i]);
        renderStack(stackValues);
    }

    highlightLines(6);
    await delay(200);

    updateProgress();

    const encoded = encodeURIComponent(JSON.stringify(stackValues.map(v => ({ value: v }))));
    stackOpsBtn.setAttribute("data-url", `stack=${encoded}`);

    valueInput.value = "";
});

function updateProgress() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            topic: "Stack Introduction",
            subtopic: "stackIntro",
            value: true
        })
    })
        .then(res => res.json())
        .then(data => console.log("✅ Stack progress updated"))
        .catch(err => console.error("❌ Failed to update progress:", err));
}

stackOpsBtn.addEventListener("click", () => {
    const url = stackOpsBtn.getAttribute("data-url");
    if (url) {
        window.location.href = `stackOperation.html?${url}`;
    } else {
        alert("Please create a stack first.");
    }
});
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});