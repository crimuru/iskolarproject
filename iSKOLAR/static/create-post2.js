const saveBtn = document.getElementById("savePostBtn");
const editingIdField = document.getElementById("editingId");

const preview = {
  title: document.getElementById("preview-title"),
  description: document.getElementById("preview-description"),
  location: document.getElementById("preview-location"),
  qualifications: document.getElementById("preview-qualifications"),
  deadline: document.getElementById("preview-deadline"),
  posted: document.getElementById("preview-posted"),
  remaining: document.getElementById("preview-remaining"),
  link: document.getElementById("preview-link"),
};

let postedDate = new Date();
let deadlineDate = null;

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");

  console.log("Edit ID detected:", editId);

  if (editId) {
    // Pre-fill form from query parameters
    document.getElementById("title").value = params.get("title") || "";
    document.getElementById("description").value = params.get("description") || "";
    document.getElementById("location").value = params.get("location") || "";
    document.getElementById("qualifications").value = params.get("qualifications") || "";
    document.getElementById("deadline").value = params.get("deadline") || "";
    document.getElementById("scholarshipLink").value = params.get("link") || "";
    editingIdField.value = editId;

    saveBtn.textContent = "Update Scholarship";
    postedDate = new Date();
  }

  updatePreview();
});

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function updatePreview() {
  const title = document.getElementById("title").value || "Your Scholarship Title";
  const descriptionText = document.getElementById("description").value || "Add a compelling description for your scholarship...";
  const location = document.getElementById("location").value || "Your City or Country";
  const qualificationsText = document.getElementById("qualifications").value || "Eligibility criteria will appear here.";
  const deadlineVal = document.getElementById("deadline").value;
  const link = document.getElementById("scholarshipLink").value || "#";

  preview.title.textContent = title;
  preview.description.innerHTML = descriptionText.replace(/\n/g, "<br>");
  preview.location.textContent = location;
  preview.qualifications.innerHTML = qualificationsText.replace(/\n/g, "<br>");
  preview.link.href = link;

  if (deadlineVal) {
    deadlineDate = new Date(deadlineVal);
    preview.deadline.textContent = deadlineDate.toDateString();
  } else {
    preview.deadline.textContent = "No deadline yet";
  }
}

function updateTimers() {
  const now = new Date();
  if (postedDate) {
    const diffPosted = now - postedDate;
    preview.posted.textContent = `Posted ${formatTime(diffPosted)} ago`;
  }

  if (deadlineDate) {
    const diffDeadline = deadlineDate - now;
    if (diffDeadline <= 0) {
      preview.remaining.textContent = "Expired";
      preview.remaining.classList.add("expired");
    } else {
      preview.remaining.textContent = `Remaining ${formatTime(diffDeadline)}`;
      const daysLeft = Math.floor(diffDeadline / (1000 * 60 * 60 * 24));
      preview.remaining.classList.remove("expired", "warning");
      if (daysLeft <= 3) preview.remaining.classList.add("warning");
    }
  }
}

setInterval(updateTimers, 1000);
document.querySelectorAll("input, textarea").forEach(el => el.addEventListener("input", updatePreview));

saveBtn.addEventListener("click", async e => {
  e.preventDefault();

  const post = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    location: document.getElementById("location").value.trim(),
    qualifications: document.getElementById("qualifications").value.trim(),
    postedDate: postedDate.toISOString(),
    deadline: document.getElementById("deadline").value,
    scholarshipLink: document.getElementById("scholarshipLink").value.trim(),
  };

  const editId = editingIdField.value;
  let endpoint = "/admin-page/create-post/";
  let successMessage = "🎉 Scholarship created successfully!";

  if (editId) {
    endpoint = `/edit-post/${editId}/`;
    successMessage = "✅ Scholarship updated successfully!";
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    const data = await res.json();
    if (data.success) {
      alert(successMessage);
      window.location.href = "/admin-page/posts/";
    } else {
      alert("❌ Failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error saving post.");
  }
});

function viewAllPosts() {
  window.location.href = "/admin-page/posts/";
}
