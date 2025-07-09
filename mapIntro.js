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

// Toggle visualization section
startBtn.addEventListener("click", () => {
    container.classList.toggle("visualization-active");
    startBtn.innerText = container.classList.contains("visualization-active")
        ? "Close Visualization"
        : "Visualize map Creations";
});

closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize map Creations";
});

// Update current map type
mapTypeSelect.addEventListener("change", () => {
    currentMapType = mapTypeSelect.value;
    keyInput.value = "";
    valueInput.value = "";
    renderMap(getCurrentMapData());
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

// Create map from inputs
createMapBtn.addEventListener("click", () => {
    const keys = keyInput.value.trim().split(",").map(k => k.trim()).filter(k => k !== "");
    const values = valueInput.value.trim().split(",").map(v => v.trim()).filter(v => v !== "");

    if (keys.length === 0 || values.length === 0) {
        alert("Please enter both keys and values.");
        return;
    }

    if (keys.length !== values.length) {
        alert("Keys and values count must match (e.g. 2 keys, 2 values).");
        return;
    }

    let data = keys.map((k, i) => ({
        key: k,
        value: values[i]
    }));

    if (currentMapType === "map" || currentMapType === "multimap") {
        data.sort((a, b) => a.key.localeCompare(b.key)); // sorted by key
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
        unordered_map: "unorderedMapIntro"
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
