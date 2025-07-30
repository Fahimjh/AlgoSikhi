//login Section
let login = document.querySelector(".login");
login.addEventListener("click", () => {
    window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", function () {
    const authAction = document.getElementById("auth-action");
    const notification = document.getElementById("notification-banner");
    const token = localStorage.getItem("token");

    document.querySelector('.close-notification')?.addEventListener('click', () => {
        notification.style.display = 'none';
    });

    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/auth/verifyToken", {
            headers: { Authorization: token }
        })
            .then(res => {
                if (res.ok) {
                    authAction.textContent = "DASHBOARD";
                    authAction.style.color = "#3f72af";
                    authAction.onclick = () => window.location.href = "dashboard.html";
                    notification.style.display = 'none'; // Hide if logged in
                } 
                else {
                    localStorage.clear();
                    authAction.textContent = "LOGIN";
                    authAction.onclick = () => window.location.href = "login.html";
                    showNotification();
                }
            })
            .catch(() => {
                localStorage.clear();
                authAction.textContent = "LOGIN";
                authAction.onclick = () => window.location.href = "login.html";
                showNotification();
            });
    } else {
        authAction.textContent = "LOGIN";
        authAction.onclick = () => window.location.href = "login.html";
        showNotification();
    }

    function showNotification() {
        // Only show if user hasn't previously dismissed it
        if (!localStorage.getItem('notificationDismissed')) {
            notification.style.display = 'flex';
        }
        // Set click handler to remember dismissal
        document.querySelector('.close-notification').addEventListener('click', () => {
            localStorage.setItem('notificationDismissed', 'true');
            notification.style.display = 'none';
        });
    }
});

const searchInput = document.querySelector(".search-input");
const searchButton = document.getElementById("search");
const allBoxes = document.querySelectorAll(".box");

function filterBoxes(query) {
    query = query.trim().toLowerCase();

    allBoxes.forEach(box => {
        const tags = box.dataset.category || "";
        const tagText = tags.toLowerCase();

        if (query === "" || tagText.includes(query)) {
            box.style.display = ""; // ← restore default (usually flex or block)
        } else {
            box.style.display = "none"; // ← hide when not matched
        }
    });
}

// Run when Search button is clicked
searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    filterBoxes(query);
});

// Optional: Run search on Enter key press
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButton.click();
    }
});

// Optional: Reset all boxes on page load
window.addEventListener("DOMContentLoaded", () => {
    filterBoxes(""); // show all
});


//firstRow
let arrayBox = document.querySelector(".arrayIntro");
let sortBox = document.querySelector(".sort");
let searchBox = document.querySelector(".search");
let updateBox = document.querySelector(".updation");

arrayBox.addEventListener("click", () => {
    window.location.href = "array.html";
});
sortBox.addEventListener("click", () => {
    window.location.href = "arraySort.html";
});
searchBox.addEventListener("click", () => {
    window.location.href = "arraySearch.html";
});
updateBox.addEventListener("click", () => {
    window.location.href = "arrayUpdate.html";
});


//SecondRow
let vectorBox = document.querySelector(".vectorIntro");
vectorBox.addEventListener("click", () => {
    window.location.href = "vector.html";
});
let vectorBasicBox = document.querySelector(".vectorBasic");
vectorBasicBox.addEventListener("click", () => {
    window.location.href = "vectorBasic.html";
});
let vectorSortBox = document.querySelector(".vectorSort");
vectorSortBox.addEventListener("click", () => {
    window.location.href = "vectorSort.html";
});
let vectorAdvanceBox = document.querySelector(".vectorAdvance");
vectorAdvanceBox.addEventListener("click", () => {
    window.location.href = "vectorAdvanced.html";
});

//thirdRow
let dequeBox = document.querySelector(".dequeIntro");
dequeBox.addEventListener("click", () => {
    window.location.href = "dequeIntro.html";
});
let dequeOpsBox = document.querySelector(".dequeOps");
dequeOpsBox.addEventListener("click", () => {
    window.location.href = "dequeOperation.html";
});
let listBox = document.querySelector(".listBasic");
listBox.addEventListener("click", () => {
    window.location.href = "listBasic.html";
});
let listOpsBox = document.querySelector(".listOperation");
listOpsBox.addEventListener("click", () => {
    window.location.href = "listOperation.html";
});

//fourthRow
let mapBox = document.querySelector(".mapIntro");
mapBox.addEventListener("click", () => {
    window.location.href = "mapIntro.html";
});
let mapOprBox = document.querySelector(".mapOperation");
mapOprBox.addEventListener("click", () => {
    window.location.href = "mapOperation.html";
});

let setBox = document.querySelector(".setIntro");
setBox.addEventListener("click", () => {
    window.location.href = "setIntro.html";
});
let setOprBox = document.querySelector(".setOperation");
setOprBox.addEventListener("click", () => {
    window.location.href = "setOperation.html";
});

//fifthRow
let stackBox = document.querySelector(".stackIntro");
stackBox.addEventListener("click", () => {
    window.location.href = "stackIntro.html";
});
let stackOprBox = document.querySelector(".stackOperation");
stackOprBox.addEventListener("click", () => {
    window.location.href = "stackOperation.html";
});

let queueBox = document.querySelector(".queueIntro");
queueBox.addEventListener("click", () => {
    window.location.href = "queueIntro.html";
});
let queueOprBox = document.querySelector(".queueOperation");
queueOprBox.addEventListener("click", () => {
    window.location.href = "queueOps.html";
});