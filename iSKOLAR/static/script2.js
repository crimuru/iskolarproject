import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://ionsrqiqludrojmpbhfa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbnNycWlxbHVkcm9qbXBiaGZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgxMjE2NiwiZXhwIjoyMDc0Mzg4MTY2fQ.7aePHEM6jZbTf1Iivrv2n4KxX9LmHSdCu9SDjuAJHEg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Countdown timer function
function startDeadlineTimer(elementId, endDate) {
  const deadlineEl = document.getElementById(elementId);
  if (!deadlineEl) return;

  const targetDate = new Date(endDate).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      deadlineEl.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Deadline Passed`;
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    deadlineEl.innerHTML = `<i class="fa-regular fa-calendar-check"></i> Due in ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateTimer(); // initial call
  const interval = setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const profileToggle = document.getElementById('profileToggle');
  const profileDropdown = document.getElementById('profileDropdown');
  const scholarshipsContainer = document.querySelector('.scholarships-grid');
  const searchInput = document.querySelector('.search-input');

  // Sidebar toggle
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

  menuToggleBtn?.addEventListener('click', openSidebar);
  closeSidebarBtn?.addEventListener('click', closeSidebar);
  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Profile dropdown
  profileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.style.display =
      profileDropdown.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', () => {
    profileDropdown.style.display = 'none';
  });

  // Fade-in animation
  setTimeout(() => {
    document.querySelector('.welcome-section')?.classList.add('fade-in');
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      setTimeout(() => card.classList.add('fade-in'), index * 100);
    });
  }, 100);

  // Load scholarships
  async function loadScholarships() {
    scholarshipsContainer.innerHTML = `<div class="empty"><p>Loading scholarships...</p></div>`;

    const { data: posts, error } = await supabase.from('posts').select('*');

    if (error) {
      console.error('Error loading posts:', error);
      scholarshipsContainer.innerHTML = `<div class="empty"><p>Failed to load scholarships.</p></div>`;
      return;
    }

    if (!posts || posts.length === 0) {
      scholarshipsContainer.innerHTML = `<div class="empty"><p>No scholarships available yet.</p></div>`;
      return;
    }

    scholarshipsContainer.innerHTML = posts.map((post) => {
      const deadline = post.deadline ? new Date(post.deadline) : null;

      return `
        <div class="scholarship-card">
          <div class="card-header">
            <h3 class="scholarship-title">${post.title}</h3>
            <div class="card-buttons">
              <div class="tooltip">
                <button class="icon-btn">
                  <i class="fa-regular fa-bookmark"></i>
                </button>
                <span class="tooltiptext">Save this scholarship</span>
              </div>
              <div class="tooltip">
                <button class="icon-btn">
                  <i class="fa-solid fa-box-archive"></i>
                </button>
                <span class="tooltiptext">Archive this scholarship</span>
              </div>
              <div class="tooltip">
                <button class="icon-btn">
                  <i class="fa-regular fa-circle-check"></i>
                </button>
                <span class="tooltiptext">Apply for this scholarship</span>
              </div>
            </div>
          </div>

          <p class="scholarship-description">${post.description}</p>
          <p><i class="fa-solid fa-location-dot"></i> Location: ${post.location}</p>
          <div class="deadline-tag" id="deadline-${post.id}">
            <i class="fa-regular fa-calendar-check"></i> Due: ${deadline ? deadline.toDateString() : 'N/A'}
          </div>

          <a href="${post.scholarship_link}" target="_blank" class="view-link">View Scholarship Details</a>
        </div>
      `;
    }).join('');

    // Start countdown timers for each card
    posts.forEach(post => {
      if (post.deadline) {
        startDeadlineTimer(`deadline-${post.id}`, post.deadline);
      }
    });
  }

  loadScholarships();

  // Search filter
  searchInput?.addEventListener('input', function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll('.scholarship-card');
  let anyVisible = false;

  cards.forEach((card) => {
    const title = card.querySelector('.scholarship-title')?.textContent.toLowerCase() || '';
    const description = card.querySelector('.scholarship-description')?.textContent.toLowerCase() || '';

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
      anyVisible = true;
    } else {
      card.style.display = 'none';
    }
  });

  // Handle "No scholarships found" message
  let noMsg = document.querySelector('.no-scholarships');
  if (!anyVisible) {
    if (!noMsg) {
      const msg = document.createElement('div');
      msg.className = 'no-scholarships';
      msg.innerHTML = '<p>No scholarships found.</p>';
      scholarshipsContainer.appendChild(msg);
    }
  } else {
    if (noMsg) noMsg.remove();
  }
});


  // Handle Save / Archive / Apply (currently placeholder)
  function handleScholarshipAction(type, id) {
    showToast(`${type} clicked for post ${id}`, 'info');
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.apply-btn')) handleScholarshipAction('apply', e.target.dataset.id);
    if (e.target.closest('.save-btn')) handleScholarshipAction('save', e.target.dataset.id);
    if (e.target.closest('.archive-btn')) handleScholarshipAction('archive', e.target.dataset.id);
    if (e.target.matches('.sidebar-btn')) closeSidebar();
  });

});

// Toast message
function showToast(message, type = 'info') {
  console.log(`${type.toUpperCase()}: ${message}`);
}
