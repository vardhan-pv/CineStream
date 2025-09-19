document.addEventListener('DOMContentLoaded', function() {

    // -------------------------------
    // 1. Get current user and check login
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
    // 3. Initialize watchlist
    // -------------------------------
    function updateWatchlistCount() {
        const watchlist = JSON.parse(localStorage.getItem(`watchlist_${currentUser.email}`)) || [];
        const watchlistCountEl = document.querySelector('.watchlist-count');
        if(watchlistCountEl){
            const count = watchlist.reduce((total, item) => total + item.quantity, 0);
            watchlistCountEl.textContent = count;
        }
    }
    updateWatchlistCount();

    // -------------------------------
    // 4. Movie data
    // -------------------------------
    const movieData = {
        'm1': { name: 'QUANTUM AIVIDE', price: 250, type: 'movie' },
        'm2': { name: 'THE MIDNIGHT ALLY', price: 200, type: 'movie' },
        'm3': { name: 'LOVE AT FIRST BYTE', price: 300, type: 'movie' },
        'm4': { name: 'THE WHISPERING WOODS', price: 280, type: 'movie' },
        'm5': { name: 'CRIMSON TIDE', price: 270, type: 'movie' },
        'm6': { name: 'THE WHISPERING LABYRINTH', price: 270, type: 'movie' }
    };

    // -------------------------------
    // 5. Render booking summary
    // -------------------------------
    function renderBookingSummary() {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        const orderItemsContainer = document.getElementById('orderItems');
        const orderSummaryContainer = document.getElementById('orderSummary');

        if (!orderItemsContainer || !orderSummaryContainer) return;

        if (!movieId || !movieData[movieId]) {
            orderSummaryContainer.innerHTML = '<p class="empty-cart">No movie selected.</p>';
            return;
        }

        const movie = movieData[movieId];
        orderItemsContainer.innerHTML = `<p>${movie.name} (1) - ₹${movie.price.toFixed(2)}</p>`;
        const totalElement = document.createElement('p');
        totalElement.className = 'total';
        totalElement.textContent = `Total: ₹${movie.price.toFixed(2)}`;
        orderItemsContainer.appendChild(totalElement);
    }
    renderBookingSummary();

    // -------------------------------
    // 6. Handle COD form submission
    // -------------------------------
    const codForm = document.getElementById('codForm');
    if(codForm){
        codForm.addEventListener('submit', function(e){
            e.preventDefault();

            const urlParams = new URLSearchParams(window.location.search);
            const movieId = urlParams.get('id');
            if(!movieId || !movieData[movieId]){
                alert('No movie selected.');
                window.location.href = 'index.html';
                return;
            }
            const movie = movieData[movieId];

            const name = document.getElementById('name').value.trim();
            const address = document.getElementById('address').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if(!name || !address || !/^\d{10}$/.test(phone.replace(/\D/g,''))){
                alert('Please fill all fields correctly.');
                return;
            }

            const ticketId = Date.now().toString().slice(-6);
            const bookingDate = new Date().toLocaleDateString('en-US', {
                year:'numeric', month:'short', day:'numeric'
            });

            // Save booking
            const bookings = JSON.parse(localStorage.getItem(`bookings_${currentUser.email}`)) || [];
            bookings.push({
                ticketId, id: movieId, name: movie.name, price: movie.price,
                type: movie.type, quantity:1, date: bookingDate, status:'Confirmed',
                paymentMethod:'Cash on Delivery', deliveryDetails:{name,address,phone}
            });
            localStorage.setItem(`bookings_${currentUser.email}`, JSON.stringify(bookings));

            // Update watchlist
            const watchlist = JSON.parse(localStorage.getItem(`watchlist_${currentUser.email}`)) || [];
            const existingItem = watchlist.find(item=>item.id===movieId);
            if(existingItem) existingItem.quantity += 1;
            else watchlist.push({id:movieId,name:movie.name,price:movie.price,type:movie.type,quantity:1,date:bookingDate,status:'Confirmed'});
            localStorage.setItem(`watchlist_${currentUser.email}`, JSON.stringify(watchlist));

            alert(`Booking confirmed! Ticket ID: ${ticketId}`);
            window.location.href = 'bookings.html';
        });
    }

    // -------------------------------
    // 7. Profile dropdown toggle
    // -------------------------------
    const profile = document.querySelector('.profile');
    const dropdown = document.querySelector('.profile-dropdown');
    if(profile && dropdown){
        profile.addEventListener('click', ()=> {
            dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
        });
        document.addEventListener('click', (e)=>{
            if(!profile.contains(e.target)) dropdown.style.display = 'none';
        });
    }

    // -------------------------------
    // 8. Search functionality
    // -------------------------------
    const searchInput = document.getElementById('searchInput');
    if(searchInput){
        searchInput.addEventListener('input', function(e){
            const searchTerm = e.target.value.trim();
            if(searchTerm) window.location.href = `movies.html?search=${encodeURIComponent(searchTerm)}`;
        });

        // Filter listings if search term in URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        if(searchTerm){
            searchInput.value = searchTerm;
            const listingCards = document.querySelectorAll('.listing-card');
            listingCards.forEach(card=>{
                const title = card.querySelector('h3')?.textContent.toLowerCase()||"";
                const description = card.querySelector('p')?.textContent.toLowerCase()||"";
                card.style.display = (title.includes(searchTerm.toLowerCase())||description.includes(searchTerm.toLowerCase()))?"block":"none";
            });
        }
    }

    // -------------------------------
    // 9. Hamburger menu
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
