// Retrieve values from URL
const params = new URLSearchParams(window.location.search);
const mapParam = params.get("map");
const multimapParam = params.get("multimap");
const unorderedMapParam = params.get("unordered_map");

// Helper to parse key-value pairs
function parseMapString(str) {
    try {
        return str ? JSON.parse(decodeURIComponent(str)) : [];
    } catch {
        return [];
    }
}

// Initial map data
let mapData = parseMapString(mapParam);
let multimapData = parseMapString(multimapParam);
let unorderedMapData = parseMapString(unorderedMapParam);

// Use default values if none
if (!mapData.length) {
    mapData = [{ key: "a", value: "1" }, { key: "b", value: "2" }];
}
if (!multimapData.length) {
    multimapData = [{ key: "a", value: "1" }, { key: "a", value: "2" }];
}
if (!unorderedMapData.length) {
    unorderedMapData = [{ key: "x", value: "99" }, { key: "y", value: "100" }];
}

// UI Elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const valueInput = document.getElementById("value");
const typeSelect = document.querySelector(".types");
const opSelect = document.querySelector(".Operations");
const oprBtn = document.querySelector(".oprmapBtn");
const setIntroBtn = document.querySelector(".setIntroBtn");
const homePageBtn = document.querySelector(".homePageBtn");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

const mapOpsPseudocode = {
    "insert()": {
        map: [
            "FUNCTION insert(map, key, value)",
            "  IF key exists in map THEN",
            "    RETURN error (duplicate key not allowed)",
            "  END IF",
            "  map[key] = value",
            "END FUNCTION"
        ],
        unordered_map: [
            "FUNCTION insert(unordered_map, key, value)",
            "  IF key exists in unordered_map THEN",
            "    RETURN error (duplicate key not allowed)",
            "  END IF",
            "  unordered_map[key] = value",
            "END FUNCTION"
        ],
        multimap: [
            "FUNCTION insert(multimap, key, value)",
            "  multimap.add(key, value) // allows duplicate keys",
            "END FUNCTION"
        ]
    },
    "emplace()": {
        map: [
            "FUNCTION emplace(map, key, value)",
            "  IF key exists in map THEN",
            "    RETURN error (duplicate key not allowed)",
            "  END IF",
            "  map[key] = value",
            "END FUNCTION"
        ],
        unordered_map: [
            "FUNCTION emplace(unordered_map, key, value)",
            "  IF key exists in unordered_map THEN",
            "    RETURN error (duplicate key not allowed)",
            "  END IF",
            "  unordered_map[key] = value",
            "END FUNCTION"
        ],
        multimap: [
            "FUNCTION emplace(multimap, key, value)",
            "  multimap.add(key, value) // allows duplicate keys",
            "END FUNCTION"
        ]
    },
    "count()": [
        "FUNCTION count(map, key)",
        "  count = 0",
        "  FOR EACH entry IN map",
        "    IF entry.key == key THEN",
        "      count = count + 1",
        "    END IF",
        "  END FOR",
        "  RETURN count",
        "END FUNCTION"
    ],
    "find()": [
        "FUNCTION find(map, key)",
        "  FOR EACH entry IN map",
        "    IF entry.key == key THEN",
        "      RETURN entry",
        "    END IF",
        "  END FOR",
        "  RETURN not found",
        "END FUNCTION"
    ],
    "erase()": [
        "FUNCTION erase(map, key)",
        "  REMOVE all entries with key from map",
        "END FUNCTION"
    ]
};

function renderPseudocode(operation, mapType = typeSelect.value) {
    const codeContainer = document.getElementById("pseudocode");
    if (!codeContainer) return;
    codeContainer.innerHTML = "";
    let lines = mapOpsPseudocode[operation];
    // Only get lines[mapType] if lines is not an array
    if (!Array.isArray(lines)) {
        lines = lines[mapType];
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

// Show pseudocode for initial operation and type
renderPseudocode(opSelect.value, typeSelect.value);
// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize map operations";
    } else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";
        renderPseudocode(opSelect.value, typeSelect.value); // <-- Add this line
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize map Operations";
});

// Placeholder update based on operation
function updatePlaceholder() {
    const operation = opSelect.value;
    renderPseudocode(operation, typeSelect.value);

    if (operation === "insert()" || operation === "emplace()") {
        valueInput.placeholder = "Enter {key,value} (e.g. {x,9})";
        valueInput.style.display = "";
    } else if (operation === "find()" || operation === "count()" || operation === "erase()") {
        valueInput.placeholder = "Enter key (e.g. x)";
        valueInput.style.display = "";
    } else {
        valueInput.placeholder = "";
        valueInput.style.display = "";
    }
}
opSelect.addEventListener("change", updatePlaceholder);
typeSelect.addEventListener("change", updatePlaceholder);
updatePlaceholder();

// Render key-value pairs with optional highlight
function renderMap(mapArr, highlightKeys = []) {
    if (!Array.isArray(highlightKeys)) highlightKeys = [highlightKeys];

    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = "";

    mapArr.forEach(pair => {
        const row = document.createElement("div");
        row.className = "map-row";

        const keyCell = document.createElement("div");
        keyCell.className = "cell";
        keyCell.textContent = `🔑 ${pair.key}`;

        const valCell = document.createElement("div");
        valCell.className = "cell";
        valCell.textContent = `📦 ${pair.value}`;

        if (highlightKeys.includes(pair.key)) {
            keyCell.classList.add("active");
            valCell.classList.add("active");
        }

        row.appendChild(keyCell);
        row.appendChild(valCell);
        mapContainer.appendChild(row);
    });
}

// Initial render (based on default selected type)
let currentType = typeSelect.value;
let currentData =
    currentType === "map" ? mapData :
        currentType === "multimap" ? multimapData :
            unorderedMapData;
renderMap(currentData);

// Re-render when map type changes
typeSelect.addEventListener("change", () => {
    currentType = typeSelect.value;
    currentData = currentType === "map" ? mapData :
        currentType === "multimap" ? multimapData :
            unorderedMapData;
    renderMap(currentData);
    renderPseudocode(opSelect.value, currentType); // <-- Add this line
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Handle operation button
oprBtn.addEventListener("click", async () => {
    const mapType = typeSelect.value;
    const operation = opSelect.value;
    const val = valueInput.value.trim();

    renderPseudocode(operation); // Show pseudocode for selected operation

    let targetMap =
        mapType === "map" ? mapData :
            mapType === "multimap" ? multimapData :
                unorderedMapData;

    const [rawKey, rawValue] = operation === "insert()" && val.startsWith("{") && val.endsWith("}")
        ? val.slice(1, -1).split(",").map(v => v.trim())
        : val.split(",").map(v => v.trim());

    const key = rawKey;
    const value = rawValue;

    if (operation === "insert()" || operation === "emplace()") {
        highlightLines(0); // FUNCTION insert/emplace
        await delay(200);
        if (!key || !value) {
            highlightLines(1, 2);
            await delay(200);
            alert("Please provide both key and value.");
            return;
        }
        if (mapType === "map" || mapType === "unordered_map") {
            const exists = targetMap.find(entry => entry.key === key);
            if (exists) {
                highlightLines(1, 2);
                await delay(200);
                alert("Key already exists in map/unordered_map.");
                return;
            }
        }
        highlightLines(4);
        await delay(200);
        targetMap.push({ key, value });
        // Update global data
        if (mapType === "map") mapData = targetMap;
        else if (mapType === "multimap") multimapData = targetMap;
        else unorderedMapData = targetMap;
        renderMap(targetMap, key);
    } else if (operation === "count()") {
        highlightLines( 3);
        await delay(300);
        const matchedEntries = targetMap.filter(entry => entry.key === key);
        const count = matchedEntries.length;
        highlightLines(7);
        await delay(300);
        alert(`Count for key "${key}" = ${count}`);
        renderMap(targetMap, matchedEntries.map(e => e.key));
    } else if (operation === "find()") {
        const foundEntries = targetMap.filter(entry => entry.key === key);
        if (foundEntries.length > 0) {
            highlightLines(2);
            await delay(300);
            highlightLines(3);
            alert(`✅ Found ${foundEntries.length} occurrence(s) of key "${key}"`);
            renderMap(targetMap, foundEntries.map(e => e.key));
        } else {
            highlightLines(6);
            alert("❌ Not found");
            renderMap(targetMap);
        }
    } else if (operation === "erase()") {
        highlightLines(0);
        await delay(300);
        targetMap = targetMap.filter(entry => entry.key !== key);
        if (mapType === "map") mapData = targetMap;
        else if (mapType === "multimap") multimapData = targetMap;
        else unorderedMapData = targetMap;
        highlightLines(1);
        renderMap(targetMap);
    }

    sendProgressUpdate(mapType, operation);
    valueInput.value = "";
});

// Backend progress update
function sendProgressUpdate(mapType, operation) {
    const methodMap = {
        "insert()": "insert",
        "emplace()": "emplace",
        "count()": "count",
        "find()": "find",
        "erase()": "erase"
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
            topic: `${mapType} Operations`,
            subtopic: methodMap[operation],
            value: true
        })
    })
        .then(res => res.json())
        .then(data => console.log(`✅ Progress updated: ${mapType} → ${methodMap[operation]}`))
        .catch(err => console.error("❌ Failed to update progress:", err));
}

homePageBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
// Go to next section
setIntroBtn.addEventListener("click", () => {
    window.location.href = "setIntro.html";
});
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

