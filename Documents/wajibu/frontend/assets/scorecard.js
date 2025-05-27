// Initialize Firestore
const db = firebase.firestore();

// DOM Elements
const scorecardContainer = document.getElementById("scorecardContainer");
const bestPerformers = document.getElementById("bestPerformers");
const worstPerformers = document.getElementById("worstPerformers");
const commentsList = document.getElementById("commentsList");
const selectCounty = document.getElementById("selectCounty");
const selectOffice = document.getElementById("selectOffice");
const searchBar = document.getElementById("searchBar");

// Load Scorecards
function loadScorecards() {
  scorecardContainer.innerHTML = ""; // Clear existing scorecards

  db.collection("officials").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const card = `
        <div class="col-md-4">
          <div class="card">
            <img src="${data.photo || 'assets/img/official-placeholder.jpg'}" class="card-img-top" alt="Official Photo">
            <div class="card-body">
              <h5 class="card-title">${data.name}</h5>
              <p class="card-text">${data.office}, ${data.county}</p>
              <p class="card-text"><strong>Performance Score:</strong> ${data.performanceScore}%</p>
              <div class="rating">
                <span class="text-success">👍 ${data.upvotes || 0}</span>
                <span class="text-danger ms-3">👎 ${data.downvotes || 0}</span>
              </div>
              <button class="btn btn-primary mt-3" onclick="viewDetails('${doc.id}')">View Details</button>
            </div>
          </div>
        </div>
      `;
      scorecardContainer.innerHTML += card;
    });
  });
}

// Load Leaderboard
function loadLeaderboard() {
  bestPerformers.innerHTML = ""; // Clear existing best performers
  worstPerformers.innerHTML = ""; // Clear existing worst performers

  db.collection("officials").orderBy("performanceScore", "desc").limit(10).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = `<li class="list-group-item">${data.name} - ${data.performanceScore}%</li>`;
      bestPerformers.innerHTML += listItem;
    });
  });

  db.collection("officials").orderBy("performanceScore", "asc").limit(10).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = `<li class="list-group-item">${data.name} - ${data.performanceScore}%</li>`;
      worstPerformers.innerHTML += listItem;
    });
  });
}

// View Details in Modal
function viewDetails(id) {
  db.collection("officials").doc(id).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      document.querySelector("#officialDetailsModal h3").textContent = data.name;
      document.querySelector("#officialDetailsModal p strong").textContent = `${data.office}, ${data.county}`;
      document.querySelector("#officialDetailsModal p:nth-of-type(2)").textContent = `Performance Score: ${data.performanceScore}%`;

      // Load Timeline of Promises
      const timeline = data.promises || [];
      const timelineList = document.querySelector("#officialDetailsModal ul");
      timelineList.innerHTML = "";
      timeline.forEach((promise) => {
        timelineList.innerHTML += `<li>${promise}</li>`;
      });

      // Load Public Comments
      const comments = data.comments || [];
      commentsList.innerHTML = "";
      comments.forEach((comment) => {
        commentsList.innerHTML += `<li>${comment}</li>`;
      });

      // Show Modal
      const modal = new bootstrap.Modal(document.getElementById("officialDetailsModal"));
      modal.show();
    }
  });
}

// Filter Scorecards
function filterScorecards() {
  const county = selectCounty.value;
  const office = selectOffice.value;
  const searchQuery = searchBar.value.toLowerCase();

  scorecardContainer.innerHTML = ""; // Clear existing scorecards

  db.collection("officials").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const matchesCounty = county === "Select County" || data.county === county;
      const matchesOffice = office === "Select Office" || data.office === office;
      const matchesSearch = data.name.toLowerCase().includes(searchQuery) || data.office.toLowerCase().includes(searchQuery);

      if (matchesCounty && matchesOffice && matchesSearch) {
        const card = `
          <div class="col-md-4">
            <div class="card">
              <img src="${data.photo || 'assets/img/official-placeholder.jpg'}" class="card-img-top" alt="Official Photo">
              <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <p class="card-text">${data.office}, ${data.county}</p>
                <p class="card-text"><strong>Performance Score:</strong> ${data.performanceScore}%</p>
                <div class="rating">
                  <span class="text-success">👍 ${data.upvotes || 0}</span>
                  <span class="text-danger ms-3">👎 ${data.downvotes || 0}</span>
                </div>
                <button class="btn btn-primary mt-3" onclick="viewDetails('${doc.id}')">View Details</button>
              </div>
            </div>
          </div>
        `;
        scorecardContainer.innerHTML += card;
      }
    });
  });
}

// Event Listeners
selectCounty.addEventListener("change", filterScorecards);
selectOffice.addEventListener("change", filterScorecards);
searchBar.addEventListener("input", filterScorecards);

// Load Data on Page Load
window.onload = () => {
  loadScorecards();
  loadLeaderboard();
};