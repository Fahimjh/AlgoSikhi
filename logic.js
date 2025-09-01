// Authentication and notification functionality
document.addEventListener("DOMContentLoaded", function () {
    const authAction = document.getElementById("auth-action");
    const notification = document.getElementById("notification-banner");
    const closeBtn = document.querySelector(".close-notification");
    const token = localStorage.getItem("token");

    // Always show notification if not logged in
    if (!token) {
        notification.classList.remove("hidden");
    } else {
        notification.classList.add("hidden");
    }

    // Hide notification when close button is clicked, but show again on next refresh if not logged in
    closeBtn.addEventListener("click", function () {
        notification.classList.add("hidden");
    });

    if (token) {
        fetch("https://algosikhibackend.onrender.com/api/auth/verifyToken", {
            headers: { Authorization: token }
        })
            .then(res => {
                if (res.ok) {
                    authAction.textContent = "DASHBOARD";
                    authAction.style.background = "rgba(255, 255, 255, 0.3)";
                    authAction.onclick = () => window.location.href = "dashboard.html";
                    notification.classList.add('hidden');
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
        if (!localStorage.getItem('notificationDismissed')) {
            notification.classList.remove('hidden');
        }
    }

    // Search functionality
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.getElementById("search");
    const allCards = document.querySelectorAll(".category-card");

    function filterCards(query) {
        query = query.trim().toLowerCase();

        allCards.forEach(card => {
            const tags = card.dataset.category || "";
            const tagText = tags.toLowerCase();
            const titleElem = card.querySelector('.card-title');
            const title = titleElem ? titleElem.textContent.toLowerCase() : "";
            const descriptionElem = card.querySelector('p');
            const description = descriptionElem ? descriptionElem.textContent.toLowerCase() : "";

            if (query === "" || tagText.includes(query) || title.includes(query) || description.includes(query)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    searchButton.addEventListener("click", () => {
        const query = searchInput.value;
        filterCards(query);
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchButton.click();
        }
    });

    // Category navigation
    const categoryToFile = {
        "array introduction": "array.html",
        "array sort": "arraySort.html",
        "array search": "arraySearch.html",
        "array update": "arrayUpdate.html",
        "vector introduction": "vector.html",
        "vector operations basic": "vectorBasic.html",
        "vector sort": "vectorSort.html",
        "vector operations advanced": "vectorAdvanced.html",
        "deque introduction": "dequeIntro.html",
        "deque operations": "dequeOperation.html",
        "list introduction": "listBasic.html",
        "list operations": "listOperation.html",
        "map introduction": "mapIntro.html",
        "map operations": "mapOperation.html",
        "set introduction": "setIntro.html",
        "set operations": "setOperation.html",
        "stack introduction": "stackIntro.html",
        "stack operations": "stackOperation.html",
        "queue introduction": "queueIntro.html",
        "queue operations": "queueOps.html"
    };

    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category && categoryToFile[category]) {
                window.location.href = categoryToFile[category];
            }
        });
    });
});