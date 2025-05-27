document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const issueId = params.get("id");
  
    fetch("assets/data/issues.json")
      .then(res => res.json())
      .then(data => {
        const issue = data.find(i => i.id === issueId);
        if (!issue) {
          document.getElementById("issue-title").textContent = "Issue not found.";
          return;
        }
  
        document.getElementById("issue-title").textContent = issue.title;
        document.getElementById("issue-meta").innerHTML = `
          <strong>Status:</strong> ${capitalize(issue.status)} |
          <strong>Category:</strong> ${capitalize(issue.category)} |
          <strong>Location:</strong> ${issue.location}
        `;
        document.getElementById("issue-description").textContent = issue.description;
        document.getElementById("issue-votes").textContent = `Votes: ${issue.votes}`;
      });
  
    function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  
    // Optional: handle vote button (no backend in JSON mode)
    document.getElementById("vote-button").addEventListener("click", () => {
      alert("Vote submitted! (This is a placeholder — connect to Firebase to make it real.)");
    });
  });
  