let setValues = [];
let multisetValues = [];
let unorderedSetValues = [];

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const visualizationSection = document.querySelector(".visualization-section");
const valueInput = document.getElementById("value");
const typeSelect = document.querySelector(".types");
const createBtn = document.querySelector(".crtsetBtn");
const setOpsBtn = document.querySelector(".setOpsBtn");

// Toggle visualization
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

// Render current set
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

// Create and visualize set
createBtn.addEventListener("click", () => {
    const selectedType = typeSelect.value;
    const raw = valueInput.value.trim();

    if (!raw) {
        alert("Please enter some values.");
        return;
    }

    const inputValues = raw.split(",").map(v => v.trim()).filter(v => v !== "");
    let finalValues = [];

    if (selectedType === "set") {
        // ✅ Remove duplicates first, then sort (numerically if needed)
        const unique = [...new Set(inputValues)];
        finalValues = unique.slice().sort((a, b) => {
            const na = Number(a), nb = Number(b);
            return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
        });
        setValues = finalValues;
    } else if (selectedType === "multiset") {
        // ✅ Keep duplicates, but sort properly
        finalValues = inputValues.slice().sort((a, b) => {
            const na = Number(a), nb = Number(b);
            return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
        });
        multisetValues = finalValues;
    } else if (selectedType === "unordered_set") {
        // ✅ Remove duplicates but do NOT sort
        finalValues = [];
        const seen = new Set();
        inputValues.forEach(v => {
            if (!seen.has(v)) {
                seen.add(v);
                finalValues.push(v);
            }
        });
        unorderedSetValues = finalValues;
    }

    renderSet(finalValues);
    updateBackendProgress(selectedType);
    updateDataURL();
    valueInput.value = "";
});

// Backend progress update
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

// Update data-url for navigation
function updateDataURL() {
    const buildParam = (type, values) =>
        `${type}=${encodeURIComponent(JSON.stringify(values.map(v => ({ value: v }))))}`;

    const params = [
        setValues.length ? buildParam("set", setValues) : null,
        multisetValues.length ? buildParam("multiset", multisetValues) : null,
        unorderedSetValues.length ? buildParam("unordered_set", unorderedSetValues) : null
    ].filter(Boolean).join("&");

    setOpsBtn.setAttribute("data-url", params);
}

// Navigate to setOperation with params
setOpsBtn.addEventListener("click", () => {
    const url = setOpsBtn.getAttribute("data-url");
    if (url) {
        window.location.href = `setOperation.html?${url}`;
    } else {
        alert("Please create a set first.");
    }
});
