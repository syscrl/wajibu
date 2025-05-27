// DOM Elements
const issueGrid = document.getElementById('issueGrid');
const reportIssueForm = document.getElementById('reportIssueForm');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');

// Fetch Issues from Firebase
function fetchIssues() {
  fetch('assets/data/issues.json')
    .then((response) => response.json())
    .then((issues) => {
      issueGrid.innerHTML = ''; // Clear existing issues

      issues.forEach((issue) => {
        const issueCard = `
          <div class="col-lg-4 col-md-6 issue-card" data-category="${issue.category}" data-status="${issue.status}">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${issue.title}</h5>
                <p class="card-text">${issue.description}</p>
                <p class="text-muted"><strong>Location:</strong> ${issue.location}</p>
                <p class="text-muted"><strong>Status:</strong> ${issue.status}</p>
                <a href="issues-details.html?id=${issue.id}" class="btn btn-primary">View Details</a>
              </div>
            </div>
          </div>
        `;
        issueGrid.innerHTML += issueCard;
      });
    })
    .catch((error) => console.error('Error fetching issues:', error));
}

// Filter Issues
function filterIssues() {
  const category = categoryFilter.value;
  const status = statusFilter.value;

  const issueCards = issueGrid.querySelectorAll('.issue-card');
  issueCards.forEach((card) => {
    const matchesCategory = !category || card.dataset.category === category;
    const matchesStatus = !status || card.dataset.status === status;

    card.style.display = matchesCategory && matchesStatus ? '' : 'none';
  });
}

// Submit New Issue
if (reportIssueForm) {
  reportIssueForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('issueTitle').value;
    const description = document.getElementById('issueDescription').value;
    const location = document.getElementById('issueLocation').value;
    const category = document.getElementById('issueCategory').value;

    const newIssue = {
      title,
      description,
      location,
      category,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    database.ref('issues').push(newIssue, (error) => {
      if (error) {
        alert('Error submitting issue. Please try again.');
      } else {
        alert('Issue submitted successfully!');
        reportIssueForm.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('reportIssueModal'));
        modal.hide();
      }
    });
  });
}

// Event Listeners
if (categoryFilter && statusFilter) {
  categoryFilter.addEventListener('change', filterIssues);
  statusFilter.addEventListener('change', filterIssues);
}

// Initialize
fetchIssues();