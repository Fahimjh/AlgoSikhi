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
if (!mapData.length && !multimapData.length && !unorderedMapData.length) {
    mapData = [{ key: "a", value: "1" }, { key: "b", value: "2" }];
    multimapData = [{ key: "a", value: "1" }, { key: "a", value: "2" }];
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

// Toggle visualization section
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active") ? "Close Visualization" : "Visualize map Creations";
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize map Creations";
});

// Toggling placeholder
function updatePlaceholder() {
    const operation = opSelect.value;
    if (operation === "insert()") {
        valueInput.placeholder = "Enter {key,value} (e.g. {x,9})";
    } else {
        valueInput.placeholder = "Enter key,value (e.g. x,9)";
    }
}
opSelect.addEventListener("change", updatePlaceholder);
updatePlaceholder();

// Render Function
function renderMap(mapArr) {
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

        row.appendChild(keyCell);
        row.appendChild(valCell);
        mapContainer.appendChild(row);
    });
}

// Initial render
renderMap(mapData);

// Operation Button Click
oprBtn.addEventListener("click", () => {
    const mapType = typeSelect.value;
    const operation = opSelect.value;
    const val = valueInput.value.trim();

    let targetMap = mapType === "map" ? mapData : mapType === "multimap" ? multimapData : unorderedMapData;

    const [rawKey, rawValue] = operation === "insert()" && val.startsWith("{") && val.endsWith("}")
        ? val.slice(1, -1).split(",").map(v => v.trim())
        : val.split(",").map(v => v.trim());

    const key = rawKey, value = rawValue;

    // Operations
    if (operation === "insert()" || operation === "emplace()") {
        if (!key || !value) {
            alert("Please provide both key and value.");
            return;
        }

        if (mapType === "map" || mapType === "unordered_map") {
            const exists = targetMap.find(entry => entry.key === key);
            if (!exists) targetMap.push({ key, value });
        } else if (mapType === "multimap") {
            targetMap.push({ key, value });
        }

    } else if (operation === "count()") {
        const count = targetMap.filter(entry => entry.key === key).length;
        alert(`Count for key "${key}" = ${count}`);

    } else if (operation === "find()") {
        const found = targetMap.find(entry => entry.key === key);
        alert(found ? `✅ Found: ${found.key} → ${found.value}` : "❌ Not found");

    } else if (operation === "erase()") {
        targetMap = targetMap.filter(entry => entry.key !== key);
        if (mapType === "map") mapData = targetMap;
        else if (mapType === "multimap") multimapData = targetMap;
        else unorderedMapData = targetMap;
    }

    renderMap(targetMap);
    sendProgressUpdate(mapType, operation);
    valueInput.value = "";
});

// Backend Progress Update
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

// Move to set introduction
setIntroBtn.addEventListener("click", () => {
    window.location.href = "setIntro.html";
});
