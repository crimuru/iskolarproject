document.addEventListener('DOMContentLoaded', function() {
    
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const profileToggle = document.getElementById('profileToggle');
    const profileDropdown = document.getElementById('profileDropdown');

    
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

   
    setTimeout(() => {
        document.querySelector('.welcome-section').classList.add('fade-in');
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);

    
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary')) {
            console.log('Apply button clicked for:', e.target.closest('.scholarship-card').querySelector('.scholarship-title').textContent);
        }
        
        if (e.target.matches('.btn-outline')) {
            console.log('View details clicked for:', e.target.closest('.scholarship-card').querySelector('.scholarship-title').textContent);
        }

        if (e.target.matches('.sidebar-btn')) {
            console.log('Sidebar button clicked:', e.target.textContent.trim());
            closeSidebar(); 
        }
    });

    
    // --- MAIN SCHOLARSHIP SEARCH ---
const searchInput = document.querySelector('.search-input');
if (searchInput) { 
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching scholarships for:', searchTerm);

        const scholarshipCards = document.querySelectorAll('.scholarship-card');
        scholarshipCards.forEach(card => {
            const title = card.querySelector('.scholarship-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.scholarship-description')?.textContent.toLowerCase() || '';

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = searchTerm ? 'none' : 'block';
            }
        });
    });
}



    
    document.querySelectorAll('.scholarship-card, .stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
});


function showToast(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
}

