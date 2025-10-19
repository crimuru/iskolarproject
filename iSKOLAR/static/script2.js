document.addEventListener('DOMContentLoaded', function() {

    // === UNIVERSAL STORAGE HANDLERS ===
    function getPosts() {
        return JSON.parse(localStorage.getItem("allPosts")) || [];
    }

    function savePosts(posts) {
        localStorage.setItem("allPosts", JSON.stringify(posts));
    }

    // === PAGE SETUP ===
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');
    const scholarshipsContainer = document.querySelector('.scholarship-list'); // your card section container

    // === SIDEBAR TOGGLE ===
    profileToggle.addEventListener('click', function(event) {
        event.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', function() {
        profileDropdown.style.display = 'none';
    });
    profileDropdown.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; 
    }

    menuToggleBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // === FADE-IN ANIMATIONS ===
    setTimeout(() => {
        document.querySelector('.welcome-section').classList.add('fade-in');
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);

    // === LOAD SCHOLARSHIPS FROM LOCALSTORAGE ===
    function loadScholarships() {
        const posts = getPosts();
        scholarshipsContainer.innerHTML = "";

        if (posts.length === 0) {
            scholarshipsContainer.innerHTML = `
                <div class="empty">
                    <p>No scholarships available yet.</p>
                </div>
            `;
            return;
        }

        posts.forEach((post) => {
            const card = document.createElement('div');
            card.className = 'scholarship-card';
            card.innerHTML = `
                <h3 class="scholarship-title">${post.title}</h3>
                <p class="scholarship-description">${post.description}</p>
                <p><strong>📍 Location:</strong> ${post.location}</p>
                <p><strong>🗓️ Deadline:</strong> ${post.deadline}</p>
                <a href="${post.scholarshipLink}" target="_blank" class="view-link">View Scholarship</a>

                <div class="card-buttons">
                    <button class="btn-outline save-btn" data-id="${post.id}">Save</button>
                    <button class="btn-outline archive-btn" data-id="${post.id}">Archive</button>
                    <button class="btn-primary apply-btn" data-id="${post.id}">Apply</button>
                </div>
            `;
            scholarshipsContainer.appendChild(card);
        });
    }

    // === SAVE / ARCHIVE / APPLY ===
    function handleScholarshipAction(type, id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (!post) return;

        const keyMap = {
            save: "savedScholarships",
            archive: "archivedScholarships",
            apply: "appliedScholarships"
        };

        const storageKey = keyMap[type];
        let list = JSON.parse(localStorage.getItem(storageKey)) || [];

        // avoid duplicates
        if (!list.find(p => p.id === post.id)) {
            list.push(post);
            localStorage.setItem(storageKey, JSON.stringify(list));
            showToast(`${post.title} added to ${type}d scholarships!`, 'success');
        } else {
            showToast(`${post.title} is already in ${type}d scholarships.`, 'warning');
        }
    }

    // === GLOBAL CLICK HANDLER ===
    document.addEventListener('click', function(e) {
        if (e.target.matches('.apply-btn')) {
            handleScholarshipAction('apply', e.target.dataset.id);
        }

        if (e.target.matches('.save-btn')) {
            handleScholarshipAction('save', e.target.dataset.id);
        }

        if (e.target.matches('.archive-btn')) {
            handleScholarshipAction('archive', e.target.dataset.id);
        }

        if (e.target.matches('.sidebar-btn')) {
            closeSidebar();
        }
    });

    // === SEARCH FUNCTION ===
    const searchInput = document.querySelector('.search-input');
    if (searchInput) { 
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.scholarship-card');
            cards.forEach(card => {
                const title = card.querySelector('.scholarship-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.scholarship-description')?.textContent.toLowerCase() || '';
                card.style.display = (title.includes(searchTerm) || description.includes(searchTerm)) ? 'block' : 'none';
            });
        });
    }

    // === HOVER EFFECTS ===
    document.querySelectorAll('.scholarship-card, .stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // === INITIAL LOAD ===
    loadScholarships();
});


// === TOAST ===
function showToast(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
}
