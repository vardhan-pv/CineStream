document.addEventListener('DOMContentLoaded', function() {

    // -------------------------------
    // 1. Check login
    // -------------------------------
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!currentUser || !currentUser.email){
        window.location.href = 'login.html';
        return;
    }

    // -------------------------------
    // 2. Populate profile dropdown
    // -------------------------------
    const profileDropdown = document.getElementById("profileDropdown");
    if(profileDropdown){
        profileDropdown.innerHTML = `
            <a href="profile.html">My Account</a>
            <a href="bookings.html">My Bookings</a>
            <a href="#" id="logoutLink">Logout</a>
        `;
        const logoutLink = document.getElementById('logoutLink');
        logoutLink.addEventListener('click', function(e){
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // -------------------------------
    // 3. Update watchlist/bookings count
    // -------------------------------
    function updateWatchlistCount() {
        const bookings = JSON.parse(localStorage.getItem(`bookings_${currentUser.email}`)) || [];
        const countEl = document.querySelector('.watchlist-count');
        if(countEl){
            const totalCount = bookings.reduce((sum, item) => sum + item.quantity, 0);
            countEl.textContent = totalCount;
        }
    }
    updateWatchlistCount();

    // -------------------------------
    // 4. Book & Pay redirect
    // -------------------------------
    window.bookAndPay = function(id, name, price, type) {
        window.location.href = `payments.html?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&type=${encodeURIComponent(type)}`;
    }

    // -------------------------------
    // 5. Profile dropdown toggle
    // -------------------------------
    const profile = document.querySelector('.profile');
    const dropdown = document.querySelector('.profile-dropdown');
    if(profile && dropdown){
        profile.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
        });
        document.addEventListener('click', (e) => {
            if(!profile.contains(e.target)) dropdown.style.display = 'none';
        });
    }

    // -------------------------------
    // 6. Search functionality
    // -------------------------------
    const searchInput = document.getElementById('searchInput');
    if(searchInput){
        // Input search
        searchInput.addEventListener('input', function(e){
            const term = e.target.value.trim().toLowerCase();
            const contentCards = document.querySelectorAll('.content-card');
            contentCards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || "";
                card.style.display = name.includes(term) ? 'block' : 'none';
            });
        });

        // Handle search query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        if(searchTerm){
            searchInput.value = searchTerm;
            const contentCards = document.querySelectorAll('.content-card');
            contentCards.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || "";
                card.style.display = name.includes(searchTerm.toLowerCase()) ? 'block' : 'none';
            });
        }
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
            navLinks?.classList.toggle('active');
            headerRight?.classList.toggle('active');
            searchBar?.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });

        document.addEventListener('click', function(e){
            if(!navLinks?.contains(e.target) && !headerRight?.contains(e.target) && !hamburgerBtn.contains(e.target) && !searchBar?.contains(e.target)){
                navLinks?.classList.remove('active');
                headerRight?.classList.remove('active');
                searchBar?.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        });
    }
});
