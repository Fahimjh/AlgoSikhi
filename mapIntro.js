// Declare map globally
let currentMapType = "map";
let mapData = []; // Array of { key: string, value: string }

// UI elements
const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createMapBtn = document.querySelector(".crtmapBtn");
const keyInput = document.getElementById("key");
const valueInput = document.getElementById("value");
const mapTypeSelect = document.querySelector(".types");
const mapOpsBtn = document.querySelector(".mapOps");

// Toggle visualization panel
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

// Track selected type
mapTypeSelect.addEventListener("change", () => {
    currentMapType = mapTypeSelect.value;
    keyInput.value = "";
    valueInput.value = "";
    mapData = [];
    renderMap(); // Clear view
});

// Create map
createMapBtn.addEventListener("click", () => {
    const keys = keyInput.value.trim().split(",").map(k => k.trim()).filter(k => k !== "");
    const values = valueInput.value.trim().split(",").map(v => v.trim()).filter(v => v !== "");

    if (keys.length === 0 || values.length === 0) {
        alert("Please enter both keys and values");
        return;
    }

    if (keys.length !== values.length) {
        alert("Keys and values count must match (e.g. 2 keys, 2 values)");
        return;
    }

    mapData = keys.map((k, i) => ({
        key: k,
        value: values[i]
    }));

    if (currentMapType === "map" || currentMapType === "multimap") {
        // Sort by key for visual consistency
        mapData.sort((a, b) => a.key.localeCompare(b.key));
    }

    renderMap();
    updateBackendProgress(currentMapType);
});

// Render map
function renderMap() {
    const mapContainer = document.getElementById("map");
    mapContainer.innerHTML = "";

    mapData.forEach(pair => {
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


// Backend progress update
function updateBackendProgress(type) {
    const token = localStorage.getItem("token");
    const subtopicMap = {
        "map": "mapIntro",
        "multimap": "multimapIntro",
        "unordered_map": "unorderedMapIntro"
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

// Proceed to next page with data
document.querySelector(".mapOps").addEventListener("click", () => {
    const params = new URLSearchParams();

    // Turn array of objects to key:value strings
    params.set("map", JSON.stringify(mapData));
    params.set("multimap", JSON.stringify(multimapData));
    params.set("unordered_map", JSON.stringify(unorderedMapData));

    window.location.href = `mapOperation.html?${params.toString()}`;
});

