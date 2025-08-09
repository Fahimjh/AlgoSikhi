// Retrieve values from URL
const params = new URLSearchParams(window.location.search);
const setParam = params.get("set");
const multisetParam = params.get("multiset");
const unorderedSetParam = params.get("unordered_set");

// Helper to parse incoming JSON-of-objects into a plain array of values
function parseSet(str) {
    try {
        const parsed = str ? JSON.parse(decodeURIComponent(str)) : [];
        return parsed.map(o => o.value);
    } catch {
        return [];
    }
}

// Initialize each container’s data, or fall back to defaults
let setData         = [...new Set(parseSet(setParam))].map(Number).sort((a,b)=>a-b);
let multisetData    = parseSet(multisetParam).map(Number).sort((a,b)=>a-b);
let unorderedSetData= (() => {
    const arr = parseSet(unorderedSetParam).map(Number);
    // preserve insertion order but remove duplicates
    const seen = new Set();
    return arr.filter(x => !seen.has(x) && seen.add(x));
})();

// Defaults if still empty
if (!setData.length)          setData = [1,3,5];
if (!multisetData.length)     multisetData = [1,1,3,5];
if (!unorderedSetData.length) unorderedSetData = [10,2,4];

// UI elements
const startBtn    = document.getElementById("start-visualization");
const closeBtn    = document.querySelector(".close-btn");
const container   = document.querySelector(".container");
const valueInput  = document.getElementById("value");
const typeSelect  = document.querySelector(".types");
const opSelect    = document.querySelector(".Operations");
const oprBtn      = document.querySelector(".oprsetBtn");
const homePageBtn = document.querySelector(".homePageBtn");
const homeBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

const setOpsPseudocode = {
    "insert()": {
        set: [
            "FUNCTION insert(set, value)",
            "  IF value IN set THEN",
            "    RETURN error (set does not allow duplicates)",
            "  END IF",
            "  ADD value TO set",
            "  SORT set (ascending)",
            "END FUNCTION"
        ],
        multiset: [
            "FUNCTION insert(multiset, value)",
            "  ADD value TO multiset",
            "  SORT multiset (ascending)",
            "END FUNCTION"
        ],
        unordered_set: [
            "FUNCTION insert(unordered_set, value)",
            "  IF value IN unordered_set THEN",
            "    RETURN error (no duplicates)",
            "  END IF",
            "  ADD value TO unordered_set",
            "END FUNCTION"
        ]
    },
    "emplace()": {
        set: [
            "FUNCTION emplace(set, value)",
            "  IF value IN set THEN",
            "    RETURN error (set does not allow duplicates)",
            "  END IF",
            "  ADD value TO set",
            "  SORT set (ascending)",
            "END FUNCTION"
        ],
        multiset: [
            "FUNCTION emplace(multiset, value)",
            "  ADD value TO multiset",
            "  SORT multiset (ascending)",
            "END FUNCTION"
        ],
        unordered_set: [
            "FUNCTION emplace(unordered_set, value)",
            "  IF value IN unordered_set THEN",
            "    RETURN error (no duplicates)",
            "  END IF",
            "  ADD value TO unordered_set",
            "END FUNCTION"
        ]
    },
    "count()": [
        "FUNCTION count(set, value)",
        "  count = 0",
        "  FOR EACH v IN set",
        "    IF v == value THEN",
        "      count = count + 1",
        "    END IF",
        "  END FOR",
        "  RETURN count",
        "END FUNCTION"
    ],
    "find()": [
        "FUNCTION find(set, value)",
        "  FOR EACH v IN set",
        "    IF v == value THEN",
        "      RETURN position",
        "    END IF",
        "  END FOR",
        "  RETURN not found",
        "END FUNCTION"
    ],
    "erase()": [
        "FUNCTION erase(set, value)",
        "  REMOVE all occurrences of value from set",
        "END FUNCTION"
    ],
    "lower_bound()": [
        "FUNCTION lower_bound(set, value)",
        "  SORT set (ascending)",
        "  FOR EACH v IN set",
        "    IF v >= value THEN",
        "      RETURN v",
        "    END IF",
        "  END FOR",
        "  RETURN not found",
        "END FUNCTION"
    ],
    "upper_bound()": [
        "FUNCTION upper_bound(set, value)",
        "  SORT set (ascending)",
        "  FOR EACH v IN set",
        "    IF v > value THEN",
        "      RETURN v",
        "    END IF",
        "  END FOR",
        "  RETURN not found",
        "END FUNCTION"
    ]
};

// Render pseudocode based on operation
function renderPseudocode(operation, type = typeSelect.value) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    let lines = setOpsPseudocode[operation];
    if (!Array.isArray(lines)) {
        lines = lines[type];
    }
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

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize set operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(opSelect.value, typeSelect.value);
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize map Operations";
});


typeSelect.addEventListener("change", () => {
    renderPseudocode(opSelect.value, typeSelect.value);
    updateData();
    toggleBoundOptions();
});
opSelect.addEventListener("change", () => {
    renderPseudocode(opSelect.value, typeSelect.value);
});

// Disable bound ops on unordered_set
function toggleBoundOptions() {
    const isUnordered = typeSelect.value === "unordered_set";
    Array.from(opSelect.options).forEach(opt => {
        if (opt.value.includes("bound")) opt.disabled = isUnordered;
    });
}
typeSelect.addEventListener("change", () => {
    updateData();
    toggleBoundOptions();
});
toggleBoundOptions();


// Render function with optional highlights
function renderSet(arr, highlightIndices = []) {
    const setContainer = document.getElementById("set");
    setContainer.innerHTML = "";
    arr.forEach((v, idx) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.textContent = v;
        if (highlightIndices.includes(idx)) {
            cell.classList.add("active");
        }
        setContainer.appendChild(cell);
    });
}


// Keep track of which dataset we're showing
let currentData;
function updateData() {
    const t = typeSelect.value;
    if (t === "set")          currentData = setData;
    else if (t === "multiset") currentData = multisetData;
    else                       currentData = unorderedSetData;
    renderSet(currentData);
}
updateData();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Main operation handler
oprBtn.addEventListener("click", async () => {
    const type = typeSelect.value;
    const op   = opSelect.value;
    const raw  = valueInput.value.trim();
    let highlights = [];

    const val = Number(raw);
    let arr = currentData;

    renderPseudocode(op, type);

    if ((op === "insert()" || op === "emplace()") && (raw === "" || isNaN(val))) {
        highlightLines(1);
        await delay(300);
        highlightLines(2);
        alert("Please enter a valid number.");
        return;
    }

    if (op === "insert()" || op === "emplace()") {
        highlightLines(0);
        await delay(300);
        if (type === "set" || type === "unordered_set") {
            if (arr.includes(val)) {
                highlightLines( 2);
                await delay(300);
                alert(`${val} already present. Set doesn't allow duplicates.`);
                return;
            }
            highlightLines(4);
            await delay(300);
            arr.push(val);
            highlights = [arr.indexOf(val)];
            if (type === "set") {
                arr.sort((a, b) => a - b);
                highlightLines(5);
                await delay(300);
            }
        } else {
            arr.push(val);
            highlightLines(1);
            await delay(300);
            highlights = [arr.indexOf(val)];
            highlightLines(2);
            await delay(300);
            arr.sort((a, b) => a - b);
        }
    }
    else if (op === "count()") {
        highlightLines( 3);
        await delay(300);
        const cnt = arr.filter(x => x === val).length;
        highlightLines(7);
        await delay(300);
        alert(`Count for ${val} → ${cnt}`);
    }
    else if (op === "find()") {
        highlightLines(1);
        await delay(300);
        const positions = arr
            .map((x, idx) => x === val ? idx : -1)
            .filter(idx => idx !== -1);
        if (positions.length) {
            highlightLines(3);
            alert(`✅ Found ${val} at position${positions.length > 1 ? "s" : ""}: ${positions.join(", ")}`);
            highlights = positions;
        } else {
            highlightLines(6);
            alert(`❌ ${val} not found`);
        }
    }
    else if (op === "erase()") {
        highlightLines(0);
        await delay(200);
        const before = arr.length;
        arr = arr.filter(x => x !== val);
        const removed = before - arr.length;
        highlightLines(1);
        alert(removed
            ? `🗑️ Removed ${removed} occurrence${removed > 1 ? "s" : ""} of ${val}`
            : `⚠️ No ${val} to remove`);
    }
    else if (op === "lower_bound()" || op === "upper_bound()") {
        highlightLines(1);
        await delay(300);
        arr.sort((a, b) => a - b);
        let bound;
        if (op === "lower_bound()") {
            bound = arr.find(x => x >= val);
        } else {
            bound = arr.find(x => x > val);
        }
        if (bound !== undefined) {
            highlightLines(3);
            await delay(300);
            highlightLines(4);
            await delay(300);
            alert(`${op.replace("_", " ")} for ${val} → ${bound}`);
            highlights = [arr.indexOf(bound)];
        } else {
            highlightLines(8);
            await delay(300);
            alert("No bound found");
        }
    }

    // Update global data
    if (type === "set") {
        setData = Array.from(new Set(arr)).sort((a, b) => a - b);
        currentData = setData;
    } else if (type === "unordered_set") {
        const seen = new Set();
        unorderedSetData = arr.filter(x => !seen.has(x) && seen.add(x));
        currentData = unorderedSetData;
    } else {
        multisetData = arr.slice().sort((a, b) => a - b);
        currentData = multisetData;
    }

    updateProgress(type, op);
    renderSet(currentData, highlights);
    valueInput.value = "";
});

// send backend update
function updateProgress(type, op) {
    const methodMap = {
        "insert()"       : "insert",
        "emplace()"      : "emplace",
        "count()"        : "count",
        "find()"         : "find",
        "erase()"        : "erase",
        "lower_bound()"  : "lowerBound",
        "upper_bound()"  : "upperBound"
    }[op];
    const token = localStorage.getItem("token");
    if (!token || !methodMap) return;

    // Use async/await for try/catch
    (async () => {
        try {
            const response = await fetch("https://algosikhibackend.onrender.com/api/progress/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    topic: `${type} Operations`,
                    subtopic: methodMap,
                    value: true
                })
            });
            if (!response.ok) throw new Error("Progress update failed");
            const data = await response.json();
            console.log(`✅ Progress updated: ${type} → ${methodMap}`, data);
        } catch (err) {
            console.error(`❌ Progress update error: ${type} → ${methodMap}`, err);
        }
    })();
}

// nav
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// Show pseudocode for initial operation and type
renderPseudocode(opSelect.value, typeSelect.value);
