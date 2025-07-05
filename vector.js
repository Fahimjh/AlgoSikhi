// Declare vector values and capacity in the global scope
let vectorValues = [];
let vectorCapacity = 0;

const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const createVectorBtn = document.querySelector(".crtVecBtn");
const vectorBasicBtn = document.querySelector(".vecBasic");

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Vector Operations";// Close visualization
    } 
    else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";// Open visualization
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Vector Operations";
});

// Create vector visualization
function createVector() {
    const valuesInput = document.getElementById("vector-values").value;
    if (!valuesInput.trim()) {
        vectorValues = [];
        vectorCapacity = 0;
        renderVector();
        return;
    }
    vectorValues = valuesInput.split(",").map(v => v.trim()).filter(v => v !== "");
    vectorCapacity = vectorValues.length; // Capacity matches initial size
    renderVector();

    // Progress update: only after user creates a vector
    const token = localStorage.getItem("token");
    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Vector Introduction",
                subtopic: "vectorIntro",
                value: true
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for: vectorIntro");
        })
        .catch(err => console.error("Progress update failed:", err));
    }
}

createVectorBtn.addEventListener("click", createVector);

function renderVector() {
    const vectorContainer = document.getElementById("vector");
    vectorContainer.innerHTML = '';
    vectorValues.forEach((val) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        vectorContainer.appendChild(cell);
    });
    // Update size and capacity display
    document.getElementById("vectorSize").textContent = vectorValues.length;
    document.getElementById("vectorCapacity").textContent = vectorCapacity;
}

vectorBasicBtn.addEventListener("click", () => {
    const size = vectorValues.length;
    const values = vectorValues.join(",");
    if (!size || values === "") {
        alert("The vector is empty. Please provide values before proceeding.");
    } else {
        const url = `vectorBasic.html?size=${size}&values=${encodeURIComponent(values)}`;
        window.location.href = url;
    }
});
