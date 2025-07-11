let stackValues = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const createBtn = document.querySelector(".crtStackBtn");
const stackOpsBtn = document.querySelector(".StackOpsBtn");
const stackContainer = document.getElementById("stack");

// Toggle visualization section
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Stack Creation";
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Stack Creation";
});

// Render stack values vertically (top at the bottom)
function renderStack(arr) {
    stackContainer.innerHTML = "";

    // Reverse the array so top appears on top visually
    const reversed = [...arr].reverse();

    reversed.forEach(val => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = val;
        stackContainer.appendChild(cell);
    });
}


// Handle stack creation
createBtn.addEventListener("click", () => {
    const raw = valueInput.value.trim();
    if (!raw) {
        alert("Please enter values separated by commas.");
        return;
    }

    stackValues = raw
        .split(",")
        .map(v => v.trim())
        .filter(v => v !== "");

    renderStack(stackValues);

    // Update backend progress
    updateProgress();

    // Set data-url for Stack Operations button
    const encoded = encodeURIComponent(JSON.stringify(stackValues.map(v => ({ value: v }))));
    stackOpsBtn.setAttribute("data-url", `stack=${encoded}`);

    // Clear input
    valueInput.value = "";
});

// Update backend progress
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
