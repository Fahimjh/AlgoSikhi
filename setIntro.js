// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container"); // Fix: This should target .container
const visualizationSection = document.querySelector(".visualization-section"); // For future use if needed
const valueInput = document.getElementById("value");
const typeSelect = document.querySelector(".types");
const createBtn = document.querySelector(".crtsetBtn");
const setOpsBtn = document.querySelector(".setOpsBtn");

// Toggle visualization section
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Set Creations";
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Set Creations";
});

// Render set values
function renderSet(setArr) {
    const setContainer = document.getElementById("set");
    setContainer.innerHTML = "";
    setArr.forEach(value => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = value;
        setContainer.appendChild(cell);
    });
}

// Create and visualize selected set
createBtn.addEventListener("click", () => {
    const selectedType = typeSelect.value;
    const raw = valueInput.value.trim();

    if (!raw) {
        alert("Please enter some values.");
        return;
    }

    const inputValues = raw.split(",").map(v => v.trim()).filter(v => v !== "");

    let finalValues = [];

    if (selectedType === "set" || selectedType === "unordered_set") {
        finalValues = [...new Set(inputValues)].sort();
    } else if (selectedType === "multiset") {
        finalValues = inputValues.sort();
    }

    renderSet(finalValues);
    updateBackendProgress(selectedType);

    // Save to URL
    const encoded = encodeURIComponent(JSON.stringify(finalValues.map(v => ({ value: v }))));
    const urlParam = `${selectedType}=${encoded}`;
    setOpsBtn.setAttribute("data-url", urlParam);
});

function updateBackendProgress(type) {
    const token = localStorage.getItem("token");
    const subtopicset = {
        set: "setIntro",
        multiset: "multisetIntro",
        unordered_set: "unordered_setIntro"
    };

    if (token && subtopicset[type]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Set Introduction",
                subtopic: subtopicset[type],
                value: true
            })
        })
        .then(res => res.json())
        .then(data => console.log("✅ Progress updated:", subtopicset[type]))
        .catch(err => console.error("❌ Progress update failed:", err));
    }
}

// Go to operations page
setOpsBtn.addEventListener("click", () => {
    const param = setOpsBtn.getAttribute("data-url");
    if (!param) {
        alert("Please create the set first.");
        return;
    }

    window.location.href = `setOperations.html?${param}`;
});
