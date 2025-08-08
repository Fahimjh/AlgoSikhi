// Track current map type
let currentMapType = "map";

// Store separate data for each map type
let mapData = [];
let multimapData = [];
let unorderedMapData = [];

// UI elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createMapBtn = document.querySelector(".crtmapBtn");
const keyInput = document.getElementById("key");
const valueInput = document.getElementById("value");
const mapTypeSelect = document.querySelector(".types");
const mapOpsBtn = document.querySelector(".mapOps");
const homePgBtn = document.getElementById("homePage");
const dashBrdBtn = document.getElementById("dashBoard");

// Pseudocode data for vector advanced operations
const pseudocodeData = {
    map: [
        "FUNCTION createMap(keys, values)",
        "  IF length(keys) != length(values) THEN",
        "    RETURN error",
        "  END IF",
        "  LET seen = empty set",
        "  FOR i FROM 0 TO length(keys)-1",
        "    IF keys[i] IN seen THEN",
        "      RETURN error (duplicate key not allowed)",
        "    END IF",
        "    seen.add(keys[i])",
        "    map[keys[i]] = values[i]",
        "  END FOR",
        "  SORT map by key (ascending)",
        "  RETURN map",
        "END FUNCTION"
    ],
    unordered_map: [
        "FUNCTION createUnorderedMap(keys, values)",
        "  IF length(keys) != length(values) THEN",
        "    RETURN error",
        "  END IF",
        "  LET seen = empty set",
        "  FOR i FROM 0 TO length(keys)-1",
        "    IF keys[i] IN seen THEN",
        "      RETURN error (duplicate key not allowed)",
        "    END IF",
        "    seen.add(keys[i])",
        "    unordered_map[keys[i]] = values[i]",
        "  END FOR",
        "  RETURN unordered_map (no sorting)",
        "END FUNCTION"
    ],
    multimap: [
        "FUNCTION createMultimap(keys, values)",
        "  IF length(keys) != length(values) THEN",
        "    RETURN error",
        "  END IF",
        "  FOR i FROM 0 TO length(keys)-1",
        "    multimap.add(keys[i], values[i])",
        "  END FOR",
        "  SORT multimap by key (ascending)",
        "  RETURN multimap",
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
        startBtn.innerText = "Visualize map creations";// Close visualization
    } 
    else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";// Open visualization
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize map Operations";
});


// Update current map type
mapTypeSelect.addEventListener("change", () => {
    currentMapType = mapTypeSelect.value;
    keyInput.value = "";
    valueInput.value = "";
    renderMap(getCurrentMapData());
    renderPseudocode(currentMapType); // <-- Add this line
});

// Get current map type's data
function getCurrentMapData() {
    if (currentMapType === "map") return mapData;
    if (currentMapType === "multimap") return multimapData;
    return unorderedMapData;
}

// Set current map type's data
function setCurrentMapData(data) {
    if (currentMapType === "map") mapData = data;
    else if (currentMapType === "multimap") multimapData = data;
    else unorderedMapData = data;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

createMapBtn.addEventListener("click", async () => {

    const keys = keyInput.value.trim().split(",").map(k => k.trim()).filter(k => k !== "");
    const values = valueInput.value.trim().split(",").map(v => v.trim()).filter(v => v !== "");

    // Error: missing keys/values
    if (keys.length === 0 || values.length === 0) {
        highlightLines(1, 2);
        await delay(300);
        alert("Please enter both keys and values.");
        return;
    }
    // Error: count mismatch
    if (keys.length !== values.length) {
        highlightLines(1, 2);
        await delay(300);
        alert("Keys and values count must match (e.g. 2 keys, 2 values).");
        return;
    }

    let data = [];

    if (currentMapType === "map") {
        const seen = new Set();
        for (let i = 0; i < keys.length; i++) {
            if (seen.has(keys[i])) {
                highlightLines(6, 7);
                await delay(300);
                alert(`Duplicate key "${keys[i]}" not allowed in map.`);
                return;
            }
            else{
                seen.add(keys[i]);
                data.push({ key: keys[i], value: values[i] });
                highlightLines(9); 
                await delay(300);
                highlightLines(10);
                await delay(300);
                highlightLines(12);
                await delay(300);
                highlightLines(13);
                await delay(300);
                data.sort((a, b) => a.key.localeCompare(b.key));
            }
        }
    } else if (currentMapType === "unordered_map") {
        const seen = new Set();
        for (let i = 0; i < keys.length; i++) {
            if (seen.has(keys[i])) {
                highlightLines(6, 7);
                await delay(300);
                alert(`Duplicate key "${keys[i]}" not allowed in unordered_map.`);
                return;
            }else{
                highlightLines(9);
                await delay(300);
                seen.add(keys[i]);
                highlightLines(10); 
                await delay(300);
                highlightLines(12); 
                data.push({ key: keys[i], value: values[i] });
            }
        }
    } else if (currentMapType === "multimap") {
        for (let i = 0; i < keys.length; i++) {
            highlightLines(4);
            await delay(300);
            highlightLines(5);
            await delay(300);
            data.push({ key: keys[i], value: values[i] });
        }
        highlightLines(7);
        await delay(300);
        highlightLines(8);
        data.sort((a, b) => a.key.localeCompare(b.key));
    }

    setCurrentMapData(data);
    renderMap(data);
    updateBackendProgress(currentMapType);
});

// Render key-value pairs as two-column view
function renderMap(data = mapData) {
    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = "";

    data.forEach(pair => {
        const row = document.createElement("div");
        row.className = "map-row";

        const keyCell = document.createElement("div");
        keyCell.className = "cell";
        keyCell.textContent = pair.key;

        const valueCell = document.createElement("div");
        valueCell.className = "cell";
        valueCell.textContent = pair.value;

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        mapContainer.appendChild(row);
    });
}

// Update backend progress
function updateBackendProgress(type) {
    const token = localStorage.getItem("token");
    const subtopicMap = {
        map: "mapIntro",
        multimap: "multimapIntro",
        unordered_map: "unordered_mapIntro"
    };

    if (token && subtopicMap[type]) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Map Introduction",
                subtopic: subtopicMap[type],
                value: true
            })
        })
        .then(res => res.json())
        .then(data => console.log("✅ Progress updated:", subtopicMap[type]))
        .catch(err => console.error("❌ Progress update failed:", err));
    }
}

// Proceed to next page with all 3 map types
mapOpsBtn.addEventListener("click", () => {
    const params = new URLSearchParams();
    params.set("map", JSON.stringify(mapData));
    params.set("multimap", JSON.stringify(multimapData));
    params.set("unordered_map", JSON.stringify(unorderedMapData));
    window.location.href = `mapOperation.html?${params.toString()}`;
});
homePgBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

dashBrdBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// On page load
renderPseudocode(currentMapType);
