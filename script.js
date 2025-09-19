// -------------------------------
// 1. Check login
// -------------------------------
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || !currentUser.email) {
    alert("Please login first to continue.");
    window.location.href = 'login.html';
}

// -------------------------------
// 2. Profile dropdown
// -------------------------------
const profileDropdown = document.getElementById("profileDropdown");
if (profileDropdown) {
    profileDropdown.innerHTML = `
      <a href="profile.html">My Account</a>
      <a href="bookings.html">My Bookings</a>
      <a href="#" id="logoutLink">Logout</a>
    `;

    const profile = document.querySelector(".profile");
    const dropdown = document.querySelector(".profile-dropdown");

    if (profile && dropdown) {
        profile.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
        });

        document.addEventListener("click", (e) => {
            if (!profile.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });
    }

    // Logout handler
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }
}

// -------------------------------
// 3. Update watchlist/bookings count
// -------------------------------
function updateWatchlistCount() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const bookings = JSON.parse(localStorage.getItem(`bookings_${currentUser.email}`)) || [];
    const watchlistCount = bookings.reduce((total, item) => total + (item.quantity || 1), 0);

    const watchlistElement = document.querySelector(".watchlist-count");
    if (watchlistElement) {
        watchlistElement.textContent = watchlistCount;
    }
}
updateWatchlistCount();

// -------------------------------
// 4. Search functionality
// -------------------------------
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", function (e) {
        const searchValue = e.target.value.trim();
        if (searchValue) {
            window.location.href = `movies.html?search=${encodeURIComponent(searchValue)}`;
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search");
    if (searchTerm) {
        searchInput.value = searchTerm;
        filterContent(searchTerm.toLowerCase());
    }
}

function filterContent(searchTerm) {
    const contentCards = document.querySelectorAll(".content-card");
    contentCards.forEach((card) => {
        const name = card.querySelector("h3")?.textContent.toLowerCase() || "";
        card.style.display = name.includes(searchTerm) ? "block" : "none";
    });
}

// -------------------------------
// 5. Hamburger menu
// -------------------------------
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const headerRight = document.getElementById('headerRight');
const searchBar = document.querySelector('.search-bar');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        navLinks?.classList.toggle('active');
        headerRight?.classList.toggle('active');
        searchBar?.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        if (!navLinks?.contains(e.target) && !headerRight?.contains(e.target) && !hamburgerBtn.contains(e.target) && !searchBar?.contains(e.target)) {
            navLinks?.classList.remove('active');
            headerRight?.classList.remove('active');
            searchBar?.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        }
    });
}

// -------------------------------
// 6. Booking & Payment functions
// -------------------------------
function bookAndPay(id, name, price, type) {
    // Redirect with parameters
    window.location.href = `payments.html?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&type=${encodeURIComponent(type)}`;
}

function watchNow(id) {
    window.location.href = `watch.html?id=${encodeURIComponent(id)}`;
}
