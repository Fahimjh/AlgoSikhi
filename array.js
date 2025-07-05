// Declare arrayValues in the global scope
let arrayValues = []; // Initialize as an empty array
let arraySize = 0; // Track the declared size

const startBtn = document.getElementById("start-visualization");
const closeBtn = document.querySelector(".close-btn");
const container = document.querySelector(".container");
const theorySection = document.querySelector(".theory-section");
const visualizationSection = document.querySelector(".visualization-section");
const createArrayBtn = document.querySelector(".crtArrBtn");
const arraySortBtn = document.querySelector(".arrSort");

// Toggle visualization state
startBtn.addEventListener("click", () => {
    if (container.classList.contains("visualization-active")) {
        container.classList.remove("visualization-active");
        startBtn.innerText = "Visualize Array Creation";// Close visualization
    }
    else {
        container.classList.add("visualization-active");
        startBtn.innerText = "Close Visualization";// Open visualization
    }
});

// Close visualization using the close button
closeBtn.addEventListener("click", () => {
    container.classList.remove("visualization-active");
    startBtn.innerText = "Visualize Array Creation";
});

// Create array visualization
function createArray() {
    arraySize = parseInt(document.getElementById("array-size").value); // Store declared size
    const values = document.getElementById("array-values").value.split(",").map(v => v.trim());
    arrayValues = values; // Update the global arrayValues variable
    renderArray();

    // Progress update: only after user creates an array
    const token = localStorage.getItem("token");
    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/progress/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                topic: "Array Introduction",
                subtopic: "arrayCreate",
                value: true
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✅ Progress updated for: arrayCreate");
        })
        .catch(err => console.error("Progress update failed:", err));
    }
}

createArrayBtn.addEventListener("click", () => {
    createArray();
});

function renderArray() {
    const arrayContainer = document.getElementById("array");
    arrayContainer.innerHTML = ''; // Clear previous array
    arrayValues.forEach((val) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = val;
        arrayContainer.appendChild(cell);
    });
}

arraySortBtn.addEventListener("click", () => {
    const values = arrayValues.join(","); // Convert array to a comma-separated string

    if (!arraySize || values === "") {// Check if the array is empty
        alert("The array is empty. Please provide a valid size and values for the array before proceeding.");
    } else {
        const url = `arraySort.html?size=${arraySize}&values=${encodeURIComponent(values)}`;
        window.location.href = url; // Redirect to the new page with query parameters
    }
});


