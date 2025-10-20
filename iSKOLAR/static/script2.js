import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://ionsrqiqludrojmpbhfa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbnNycWlxbHVkcm9qbXBiaGZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgxMjE2NiwiZXhwIjoyMDc0Mzg4MTY2fQ.7aePHEM6jZbTf1Iivrv2n4KxX9LmHSdCu9SDjuAJHEg";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', function () {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const profileToggle = document.getElementById('profileToggle');
  const profileDropdown = document.getElementById('profileDropdown');
  const scholarshipsContainer = document.querySelector('.scholarships-grid');
  const searchInput = document.querySelector('.search-input');

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

  profileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.style.display =
      profileDropdown.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', () => {
    profileDropdown.style.display = 'none';
  });

  setTimeout(() => {
    document.querySelector('.welcome-section')?.classList.add('fade-in');
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      setTimeout(() => card.classList.add('fade-in'), index * 100);
    });
  }, 100);

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
      const postedAt = post.created_at ? new Date(post.created_at) : null;

      return `
        <div class="scholarship-card">
          <div class="deadline-tag">Deadline: ${deadline ? deadline.toDateString() : 'N/A'}</div>
          <h3 class="scholarship-title">${post.title}</h3>
          <p class="scholarship-description">${post.description}</p>

          <div class="timer-section">
            <div class="timer posted" data-posted="${postedAt}">Posted: --</div>
            <div class="timer remaining" data-deadline="${deadline}">Time Remaining: --</div>
          </div>

          <p><strong>📍 Location:</strong> ${post.location}</p>
          <a href="${post.scholarship_link}" target="_blank" class="view-link">View Scholarship</a>
          <div class="card-buttons">
            <button class="btn-outline save-btn" data-id="${post.id}">Save</button>
            <button class="btn-outline archive-btn" data-id="${post.id}">Archive</button>
            <button class="btn-primary apply-btn" data-id="${post.id}">Apply</button>
          </div>
        </div>
      `;
    }).join('');

    startTimers();
  }

  function startTimers() {
    setInterval(() => {
      const now = new Date();

      document.querySelectorAll('.timer.posted').forEach((el) => {
        const posted = new Date(el.dataset.posted);
        if (!posted || isNaN(posted)) return;
        const diff = Math.floor((now - posted) / 1000);
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        el.textContent = `Posted: ${d}d ${h}h ${m}m ${s}s ago`;
      });

      document.querySelectorAll('.timer.remaining').forEach((el) => {
        const deadline = new Date(el.dataset.deadline);
        if (!deadline || isNaN(deadline)) return;
        const diff = Math.floor((deadline - now) / 1000);
        if (diff < 0) {
          el.textContent = `Expired`;
          el.style.color = "red";
          return;
        }
        const d = Math.floor(diff / 86400);
        const h = Math.floor((diff % 86400) / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        el.textContent = `Time Remaining: ${d}d ${h}h ${m}m ${s}s`;
      });
    }, 1000);
  }

  function handleScholarshipAction(type, id) {
    const cards = Array.from(document.querySelectorAll('.scholarship-card'));
    const postEl = cards.find((c) => c.querySelector(`[data-id="${id}"]`));
    if (!postEl) return;

    const post = {
      id,
      title: postEl.querySelector('.scholarship-title')?.textContent || '',
      description: postEl.querySelector('.scholarship-description')?.textContent || '',
    };

    const keyMap = {
      save: 'savedScholarships',
      archive: 'archivedScholarships',
      apply: 'appliedScholarships',
    };

    const storageKey = keyMap[type];
    let list = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (!list.find((p) => p.id === post.id)) {
      list.push(post);
      localStorage.setItem(storageKey, JSON.stringify(list));
      showToast(`${post.title} added to ${type}d scholarships!`, 'success');
    } else {
      showToast(`${post.title} is already in ${type}d scholarships.`, 'warning');
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.matches('.apply-btn')) handleScholarshipAction('apply', e.target.dataset.id);
    if (e.target.matches('.save-btn')) handleScholarshipAction('save', e.target.dataset.id);
    if (e.target.matches('.archive-btn')) handleScholarshipAction('archive', e.target.dataset.id);
    if (e.target.matches('.sidebar-btn')) closeSidebar();
  });

  searchInput?.addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.scholarship-card');
    cards.forEach((card) => {
      const title = card.querySelector('.scholarship-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.scholarship-description')?.textContent.toLowerCase() || '';
      card.style.display =
        title.includes(searchTerm) || description.includes(searchTerm)
          ? 'block'
          : 'none';
    });
  });

  loadScholarships();
});

function showToast(message, type = 'info') {
  console.log(`${type.toUpperCase()}: ${message}`);
}
