document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    // Function to open sidebar
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    // Function to close sidebar
    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Event listeners
    menuToggleBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Close sidebar on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Add animation classes on page load
    setTimeout(() => {
        document.querySelector('.welcome-section').classList.add('fade-in');
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }, 100);

    // Add click handlers for buttons (placeholder functionality)
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary')) {
            console.log('Apply button clicked for:', e.target.closest('.scholarship-card').querySelector('.scholarship-title').textContent);
        }
        
        if (e.target.matches('.btn-outline')) {
            console.log('View details clicked for:', e.target.closest('.scholarship-card').querySelector('.scholarship-title').textContent);
        }

        if (e.target.matches('.sidebar-btn')) {
            console.log('Sidebar button clicked:', e.target.textContent.trim());
            closeSidebar(); // Close sidebar after selection
        }
    });

    // Search functionality (basic)
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        
        // This could be expanded to actually filter scholarships
        const scholarshipCards = document.querySelectorAll('.scholarship-card');
        scholarshipCards.forEach(card => {
            const title = card.querySelector('.scholarship-title').textContent.toLowerCase();
            const description = card.querySelector('.scholarship-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = searchTerm ? 'none' : 'block';
            }
        });
    });

    // Add smooth hover effects
    document.querySelectorAll('.scholarship-card, .stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Utility function for future expansions
function showToast(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    // This could be expanded to show actual toast notifications
}