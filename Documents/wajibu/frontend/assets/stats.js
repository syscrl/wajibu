// DOM Elements
const statsElements = {
  reportedIssues: document.getElementById('reportedIssues'),
  activeCitizens: document.getElementById('activeCitizens'),
  petitionsSigned: document.getElementById('petitionsSigned'),
  resolvedIssues: document.getElementById('resolvedIssues'),
};

// Fetch Stats from Firebase
function fetchStats() {
  const statsRef = firebase.database().ref('stats');

  statsRef.on('value', (snapshot) => {
    const stats = snapshot.val();

    if (statsElements.reportedIssues) {
      statsElements.reportedIssues.textContent = stats.reportedIssues || 0;
    }
    if (statsElements.activeCitizens) {
      statsElements.activeCitizens.textContent = stats.activeCitizens || 0;
    }
    if (statsElements.petitionsSigned) {
      statsElements.petitionsSigned.textContent = stats.petitionsSigned || 0;
    }
    if (statsElements.resolvedIssues) {
      statsElements.resolvedIssues.textContent = stats.resolvedIssues || 0;
    }
  });
}

// Initialize Stats Fetching
document.addEventListener('DOMContentLoaded', fetchStats);