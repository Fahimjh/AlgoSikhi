//login Section
let login = document.querySelector(".login");
login.addEventListener("click", () => {
    window.location.href = "login.html";
});
document.addEventListener("DOMContentLoaded", function () {
    const authAction = document.getElementById("auth-action");
    const token = localStorage.getItem("token");

    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/auth/verifyToken", {
            headers: { Authorization: token }
        })
        .then(res => {
            if (res.ok) {
                authAction.textContent = "DASHBOARD";
                authAction.style.color = "#3f72af";
                authAction.onclick = () => window.location.href = "dashboard.html";
            } else {
                localStorage.clear();
                authAction.textContent = "LOGIN";
                authAction.onclick = () => window.location.href = "login.html";
            }
        })
        .catch(() => {
            localStorage.clear();
            authAction.textContent = "LOGIN";
            authAction.onclick = () => window.location.href = "login.html";
        });
    } else {
        authAction.textContent = "LOGIN";
        authAction.onclick = () => window.location.href = "login.html";
    }
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