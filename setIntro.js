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
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for map advanced operations
const pseudocodeData = {
    set: [
        "FUNCTION createSet(values)",
        "  IF values is empty THEN",
        "    RETURN error",
        "  END IF",
        "  LET unique = empty set",
        "  FOR EACH v IN values",
        "    IF v NOT IN unique THEN",
        "      ADD v TO unique",
        "    END IF",
        "  END FOR",
        "  SORT unique (ascending)",
        "  RETURN unique",
        "END FUNCTION"
    ],
    multiset: [
        "FUNCTION createMultiset(values)",
        "  IF values is empty THEN",
        "    RETURN error",
        "  END IF",
        "  LET multiset = empty list",
        "  FOR EACH v IN values",
        "    ADD v TO multiset",
        "  END FOR",
        "  SORT multiset (ascending)",
        "  RETURN multiset",
        "END FUNCTION"
    ],
    unordered_set: [
        "FUNCTION createUnorderedSet(values)",
        "  IF values is empty THEN",
        "    RETURN error",
        "  END IF",
        "  LET unique = empty set",
        "  FOR EACH v IN values",
        "    IF v NOT IN unique THEN",
        "      ADD v TO unique",
        "    END IF",
        "  END FOR",
        "  RETURN unique (no sorting)",
        "END FUNCTION"
    ]
};

// Render pseudocode based on operation
function renderPseudocode(type = currentMapType) {
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
        startBtn.innerText = "Visualize set creations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(typeSelect.value); // Show pseudocode for selected set type
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize map Operations";
});


typeSelect.addEventListener("change", () => {
    renderPseudocode(typeSelect.value);
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Create and visualize set
createBtn.addEventListener("click", async () => {
    const selectedType = typeSelect.value;
    const raw = valueInput.value.trim();

    renderPseudocode(selectedType); // Always show correct pseudocode

    if (!raw) {
        highlightLines(1);
        await delay(300);
        highlightLines(2); // Highlight error lines
        alert("Please enter some values.");
        return;
    }

    const inputValues = raw.split(",").map(v => v.trim()).filter(v => v !== "");
    let finalValues = [];

    if (selectedType === "set") {
        highlightLines(4);
        await delay(300);
        highlightLines(5);
        await delay(300);
        highlightLines(6);
        await delay(300);
        highlightLines(7);
        
        const unique = [...new Set(inputValues)];
        finalValues = unique.slice().sort((a, b) => {
            const na = Number(a), nb = Number(b);
            return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
        });
        highlightLines(10); // Highlight sort
        await delay(300);
        setValues = finalValues;
        highlightLines(11);
        await delay(300);
    } 
    else if (selectedType === "multiset") {
        highlightLines(4);
        await delay(300);
        highlightLines(5);
        await delay(300);
        highlightLines(6);
        finalValues = inputValues.slice().sort((a, b) => {
            const na = Number(a), nb = Number(b);
            return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
        });
        multisetValues = finalValues;
        highlightLines(8);
        await delay(300);
        highlightLines(9);
    } else if (selectedType === "unordered_set") {
        highlightLines(4);
        await delay(300);
        highlightLines(5);
        await delay(300);
        highlightLines(6);
        finalValues = [];
        const seen = new Set();
        inputValues.forEach(v => {
            if (!seen.has(v)) {
                seen.add(v);
                finalValues.push(v);
            }
        });
        highlightLines(8);
        await delay(300);
        highlightLines(9);
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
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});