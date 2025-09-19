document.addEventListener('DOMContentLoaded', function() {

    // -------------------------------
    // 1. Get current user from localStorage
    // -------------------------------
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!currentUser || !currentUser.email){
        window.location.href = 'login.html';
        return;
    }

    // -------------------------------
    // 2. Populate profile info
    // -------------------------------
    const userNameEl = document.getElementById("userName");
    const userEmailEl = document.getElementById("userEmail");
    const userMemberSinceEl = document.getElementById("userMemberSince");

    if(userNameEl) userNameEl.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    if(userEmailEl) userEmailEl.textContent = currentUser.email;
    if(userMemberSinceEl) userMemberSinceEl.textContent = currentUser.registeredDate || "Unknown";

    // -------------------------------
    // 3. Load bookings/watchlist
    // -------------------------------
    const bookingList = document.getElementById("watchlistList");
    if(bookingList){
        const bookings = JSON.parse(localStorage.getItem(`bookings_${currentUser.email}`)) || [];
        bookingList.innerHTML = "";

        if(bookings.length === 0){
            bookingList.innerHTML = "<p>No bookings yet. Explore movies and book your tickets!</p>";
        } else {
            bookings.forEach(b => {
                const bookingDiv = document.createElement("div");
                bookingDiv.classList.add("watchlist-item");
                bookingDiv.innerHTML = `
                    <p><strong>Movie/Series:</strong> ${b.name}</p>
                    <p><strong>Type:</strong> ${b.type}</p>
                    <p><strong>Price:</strong> ${b.price ? "₹" + b.price : "Free"}</p>
                    <p><strong>Date:</strong> ${b.date}</p>
                    <p><strong>Status:</strong> ${b.status || "Booked"}</p>
                `;
                bookingList.appendChild(bookingDiv);
            });
        }
    }

    // -------------------------------
    // 4. Profile dropdown toggle & logout
    // -------------------------------
    const profile = document.querySelector(".profile");
    const dropdown = document.querySelector(".profile-dropdown");
    if(profile && dropdown){
        profile.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!profile.contains(e.target)) dropdown.style.display = "none";
        });

        // Clear previous items and add logout
        dropdown.innerHTML = '';
        const logoutBtn = document.createElement("a");
        logoutBtn.textContent = "Logout";
        logoutBtn.style.cursor = "pointer";
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            alert("Logged out successfully!");
            window.location.href = "login.html";
        });
        dropdown.appendChild(logoutBtn);
    }

    // -------------------------------
    // 5. Search functionality
    // -------------------------------
    const searchInput = document.getElementById("searchInput");
    if(searchInput){
        // Redirect on input
        searchInput.addEventListener("input", function(e){
            const term = e.target.value.trim();
            if(term) window.location.href = `movies.html?search=${encodeURIComponent(term)}`;
        });

        // Populate search if redirected with query
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get("search");
        if(searchTerm) searchInput.value = searchTerm;

        // Filter listings
        const listingCards = document.querySelectorAll(".listing-card");
        if(listingCards.length && searchTerm){
            listingCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || "";
                const description = card.querySelector('p')?.textContent.toLowerCase() || "";
                card.style.display = (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) ? "block" : "none";
            });
        }
    }

    // -------------------------------
    // 6. Edit profile & password functions
    // -------------------------------
    window.toggleEditForm = function(){
        const form = document.getElementById("editProfileForm");
        if(form) form.classList.toggle("active");
    }

    window.updateProfile = function(e){
        e.preventDefault();
        const newName = document.getElementById("name").value.trim();
        const newEmail = document.getElementById("email").value.trim();

        if(!newName || !newEmail) return alert("All fields are required.");

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.email === currentUser.email);

        currentUser.firstName = newName.split(" ")[0] || newName;
        currentUser.lastName = newName.split(" ")[1] || "";
        currentUser.email = newEmail;

        users[index] = currentUser;
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("Profile updated successfully!");
        location.reload();
    }

    window.togglePasswordForm = function(){
        const form = document.getElementById("changePasswordForm");
        if(form) form.classList.toggle("active");
    }

    window.changePassword = function(e){
        e.preventDefault();
        const currentPwd = document.getElementById("currentPassword").value;
        const newPwd = document.getElementById("newPassword").value;

        if(currentPwd !== currentUser.password) return alert("Current password is incorrect.");

        currentUser.password = newPwd;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        users[index] = currentUser;

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        alert("Password changed successfully!");
        document.getElementById("changePasswordForm").reset();
        window.togglePasswordForm();
    }

    // -------------------------------
    // 7. Hamburger menu
    // -------------------------------
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const headerRight = document.getElementById('headerRight');
    const searchBar = document.querySelector('.search-bar');

    if(hamburgerBtn){
        hamburgerBtn.addEventListener('click', function(e){
            e.stopPropagation();
            navLinks.classList.toggle('active');
            headerRight.classList.toggle('active');
            searchBar.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        document.addEventListener('click', function(e){
            if(!navLinks.contains(e.target) && !headerRight.contains(e.target) && !hamburgerBtn.contains(e.target) && !searchBar.contains(e.target)){
                navLinks.classList.remove('active');
                headerRight.classList.remove('active');
                searchBar.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        });
    }

});
