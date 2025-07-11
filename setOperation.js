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

// Show/hide visualization panel
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize Set Operations";
});
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Set Operations";
});

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

// Main operation handler
oprBtn.addEventListener("click", () => {
    const type = typeSelect.value;
    const op   = opSelect.value;
    const raw  = valueInput.value.trim();
    let highlights = [];  // values to highlight after op

    // parse numeric input
    const val = Number(raw);
    if (op !== "count()" && (raw === "" || isNaN(val))) {
        return alert("Please enter a valid number.");
    }

    // magic reference to the right array
    let arr = currentData;

    if (op === "insert()" || op === "emplace()") {
        // set & unordered_set: only if not already present
        if (type === "set" || type === "unordered_set") {
            if (arr.includes(val)) {
                alert(`${val} already present. Set doesn't allow duplicates.`);
                return;
            }
            else if (!arr.includes(val)) {
                arr.push(val);
                highlights = [val];
            }
        } else {
            // multiset: always push
            arr.push(val);
            highlights = [val];
        }
    }
    else if (op === "count()") {
        const cnt = arr.filter(x => x === val).length;
        alert(`Count for ${val} → ${cnt}`);
        return; // don't re-render data or update backend for pure count
    }else if (op === "find()") {
    const positions = arr
        .map((x, idx) => x === val ? idx : -1)
        .filter(idx => idx !== -1);
    if (positions.length) {
        alert(`✅ Found ${val} at position${positions.length > 1 ? "s" : ""}: ${positions.join(", ")}`);
        highlights = positions;    // we’ll highlight by index now
    } else {
        alert(`❌ ${val} not found`);
    }
}

// 2) ERASE: always remove *all* occurrences of that key/value
else if (op === "erase()") {
    const before = arr.length;
    arr = arr.filter(x => x !== val);
    const removed = before - arr.length;
    alert(removed
        ? `🗑️ Removed ${removed} occurrence${removed > 1 ? "s" : ""} of ${val}`
        : `⚠️ No ${val} to remove`);
}

    else if (op === "lower_bound()" || op === "upper_bound()") {
        // only for ordered types
        if (type === "set" || type === "multiset") {
            arr.sort((a,b)=>a-b);
            if (op === "lower_bound()") {
                const lb = arr.find(x => x >= val);
                if (lb !== undefined) highlights = [lb];
                else alert("No lower_bound found");
            } else {
                const ub = arr.find(x => x > val);
                if (ub !== undefined) highlights = [ub];
                else alert("No upper_bound found");
            }
        }
    }

    // now normalize data back into our three sources
    if (type === "set") {
        // dedupe + sort
        setData = Array.from(new Set(arr)).map(Number).sort((a,b)=>a-b);
        currentData = setData;
    } else if (type === "unordered_set") {
        // dedupe, preserve insertion order
        const seen = new Set();
        unorderedSetData = arr.filter(x => !seen.has(x) && seen.add(x));
        currentData = unorderedSetData;
    } else {
        // multiset: just sort
        multisetData = arr.slice().map(Number).sort((a,b)=>a-b);
        currentData = multisetData;
    }

    // push progress update
    updateProgress(type, op);

    // re-render with any highlights
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
    fetch("https://algosikhibackend.onrender.com/api/progress/update", {
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
    }).catch(console.error);
}

// nav
homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
