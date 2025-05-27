// Initialize Firestore
const db = firebase.firestore();

// Add News
document.getElementById("addNewsForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("newsTitle").value;
  const category = document.getElementById("newsCategory").value;
  const content = document.getElementById("newsContent").value;

  db.collection("news").add({
    title,
    category,
    content,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).then(() => {
    alert("News added successfully!");
    document.getElementById("addNewsForm").reset();
    loadNews();
  });
});

// Add Issue
document.getElementById("addIssueForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("issueTitle").value;
  const description = document.getElementById("issueDescription").value;

  db.collection("issues").add({
    title,
    description,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  }).then(() => {
    alert("Issue added successfully!");
    document.getElementById("addIssueForm").reset();
    loadIssues();
  });
});

// Load News
function loadNews() {
  const newsTable = document.getElementById("newsTable");
  newsTable.innerHTML = "";

  db.collection("news").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.title}</td>
          <td>${data.category}</td>
          <td>${data.content}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteNews('${doc.id}')">Delete</button>
          </td>
        </tr>
      `;
      newsTable.innerHTML += row;
    });
  });
}

// Delete News
function deleteNews(id) {
  if (confirm("Are you sure you want to delete this news?")) {
    db.collection("news").doc(id).delete().then(() => {
      alert("News deleted successfully!");
      loadNews();
    });
  }
}

// Load Issues
function loadIssues() {
  const issuesTable = document.getElementById("issuesTable");
  issuesTable.innerHTML = "";

  db.collection("issues").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.title}</td>
          <td>${data.description}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteIssue('${doc.id}')">Delete</button>
          </td>
        </tr>
      `;
      issuesTable.innerHTML += row;
    });
  });
}

// Delete Issue
function deleteIssue(id) {
  if (confirm("Are you sure you want to delete this issue?")) {
    db.collection("issues").doc(id).delete().then(() => {
      alert("Issue deleted successfully!");
      loadIssues();
    });
  }
}

// Load Comments
function loadComments() {
  const commentsTable = document.getElementById("commentsTable");
  commentsTable.innerHTML = "";

  db.collection("auditComments").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td>${data.comment}</td>
          <td>${data.user}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteComment('${doc.id}')">Delete</button>
          </td>
        </tr>
      `;
      commentsTable.innerHTML += row;
    });
  });
}

// Delete Comment
function deleteComment(id) {
  if (confirm("Are you sure you want to delete this comment?")) {
    db.collection("auditComments").doc(id).delete().then(() => {
      alert("Comment deleted successfully!");
      loadComments();
    });
  }
}

// Delete News
function deleteNews(id) {
  if (confirm("Are you sure you want to delete this news?")) {
    db.collection("news").doc(id).delete().then(() => {
      alert("News deleted successfully!");
      loadNews(); // Reload the news table after deletion
    }).catch((error) => {
      console.error("Error deleting news:", error);
      alert("Failed to delete news. Please try again.");
    });
  }
}

// Delete Issue
function deleteIssue(id) {
  if (confirm("Are you sure you want to delete this issue?")) {
    db.collection("issues").doc(id).delete().then(() => {
      alert("Issue deleted successfully!");
      loadIssues(); // Reload the issues table after deletion
    }).catch((error) => {
      console.error("Error deleting issue:", error);
      alert("Failed to delete issue. Please try again.");
    });
  }
}

// Load all data on page load
window.onload = () => {
  loadNews();
  loadComments();
  loadIssues();
};