import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { auth } from './firebase.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  postComment,
  fetchComments,
  deleteComment
} from './comment-api.js';

document.addEventListener("DOMContentLoaded", () => {
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  
  // Ensure the button exists before adding event listeners
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', function () {
      document.body.classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  } else {
    console.warn("⚠️ mobileNavToggleBtn not found. Ensure the button exists in the HTML.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Initialize components
  initScrollTop();
  aosInit();

  // Load dynamic content
  loadStats();
  loadSuccessStories();
  loadNews();
  loadAudits();
  loadPetitions();
  loadComments();
});
// Load stats from Firebase Firestore
async function loadStats() {
  try {
    const docRef = doc(db, "stats", "homepageStats");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.getElementById("stat-issues").setAttribute("data-purecounter-end", data.issuesReported);
      document.getElementById("stat-petitions").setAttribute("data-purecounter-end", data.petitionSignatures);
      document.getElementById("stat-audits").setAttribute("data-purecounter-end", data.projectsAudited);
      document.getElementById("stat-citizens").setAttribute("data-purecounter-end", data.citizensEngaged);
      new PureCounter();
    } else {
      console.warn("⚠️ No homepageStats document found in Firestore.");
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}
   /**
    * Apply .scrolled class to the body as the page is scrolled down
    */
   function toggleScrolled() {
     const selectBody = document.querySelector('body');
     const selectHeader = document.querySelector('#header');
     if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
     window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
   }
 
   document.addEventListener('scroll', toggleScrolled);
   window.addEventListener('load', toggleScrolled);
 
   /**
    * Hide mobile nav on same-page/hash links
    */
   document.querySelectorAll('#navmenu a').forEach(navmenu => {
     navmenu.addEventListener('click', () => {
       if (document.querySelector('.mobile-nav-active')) {
         mobileNavToogle();
       }
     });
 
   });
 
   /**
    * Toggle mobile nav dropdowns
    */
   document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
     navmenu.addEventListener('click', function(e) {
       e.preventDefault();
       this.parentNode.classList.toggle('active');
       this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
       e.stopImmediatePropagation();
     });
   });
 
   /**
    * Preloader
    */
   const preloader = document.querySelector('#preloader');
   if (preloader) {
     window.addEventListener('load', () => {
       preloader.remove();
     });
   }
 
   // Function to initialize scroll-to-top button
function initScrollTop() {
  const scrollTop = document.querySelector('.scroll-top'); // Ensure the button exists
  if (!scrollTop) {
    console.warn("⚠️ Scroll Top button not found in the DOM.");
    return;
  }

  // Toggle visibility of the scroll-to-top button
  function toggleScrollTop() {
    if (window.scrollY > 100) {
      scrollTop.classList.add('active');
    } else {
      scrollTop.classList.remove('active');
    }
  }

  // Scroll to top when the button is clicked
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Add event listeners for scrolling and page load
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);
}

   /**
    * Animation on scroll function and init
    */
   function aosInit() {
     AOS.init({
       duration: 600,
       easing: 'ease-in-out',
       once: true,
       mirror: false
     });
   }
   window.addEventListener('load', aosInit);
 
   /**
    * Initiate glightbox
    */
   const glightbox = GLightbox({
     selector: '.glightbox'
   });
 
   /**
    * Init swiper sliders
    */
   function initSwiper() {
     document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
       let config = JSON.parse(
         swiperElement.querySelector(".swiper-config").innerHTML.trim()
       );
 
       if (swiperElement.classList.contains("swiper-tab")) {
         initSwiperWithCustomPagination(swiperElement, config);
       } else {
         new Swiper(swiperElement, config);
       }
     });
   }
 
   window.addEventListener("load", initSwiper);
 
   /**
    * Initiate Pure Counter
    */
   new PureCounter();
 
   /**
    * Init isotope layout and filters
    */
   document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
     let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
     let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
     let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
 
     let initIsotope;
     imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
       initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
         itemSelector: '.isotope-item',
         layoutMode: layout,
         filter: filter,
         sortBy: sort
       });
     });
 
     isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
       filters.addEventListener('click', function() {
         isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
         this.classList.add('filter-active');
         initIsotope.arrange({
           filter: this.getAttribute('data-filter')
         });
         if (typeof aosInit === 'function') {
           aosInit();
         }
       }, false);
     });
 
   });
 
   /**
    * Frequently Asked Questions Toggle
    */
   document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
     faqItem.addEventListener('click', () => {
       faqItem.parentNode.classList.toggle('faq-active');
     });
   });
 
   /**
    * Correct scrolling position upon page load for URLs containing hash links.
    */ 
   window.addEventListener('load', function(e) {
     if (window.location.hash) {
       if (document.querySelector(window.location.hash)) {
         setTimeout(() => {
           let section = document.querySelector(window.location.hash);
           let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
           window.scrollTo({
             top: section.offsetTop - parseInt(scrollMarginTop),
             behavior: 'smooth'
           });
         }, 100);
       }
     }
   });
 
   /**
    * Navmenu Scrollspy
    */
   let navmenulinks = document.querySelectorAll('.navmenu a');
 
   function navmenuScrollspy() {
     navmenulinks.forEach(navmenulink => {
       if (!navmenulink.hash) return;
       let section = document.querySelector(navmenulink.hash);
       if (!section) return;
       let position = window.scrollY + 200;
       if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
         document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
         navmenulink.classList.add('active');
       } else {
         navmenulink.classList.remove('active');
       }
     })
   }
   window.addEventListener('load', navmenuScrollspy);
   document.addEventListener('scroll', navmenuScrollspy);

// Load navbar and footer
fetch("/frontend/components/navbar.html")
.then(res => res.text())
.then(data => {
  const headerPlaceholder = document.querySelector("#header-placeholder");
  if (headerPlaceholder) headerPlaceholder.innerHTML = data;
});

fetch("/frontend/components/footer.html")
.then(res => res.text())
.then(data => {
  const footerPlaceholder = document.querySelector("#footer-placeholder");
  if (footerPlaceholder) footerPlaceholder.innerHTML = data;
});


 // Load Success Stories dynamically from JSON
 function loadSuccessStories() {
  fetch("/frontend/assets/data/success-stories.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load success stories.");
      return response.json();
    })
    .then((stories) => {
      const container = document.getElementById("success-stories-container");
      if (!container) {
        console.warn("⚠️ success-stories-container not found in the DOM.");
        return;
      }

      stories.forEach((story) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        slide.innerHTML = `
          <div class="testimonial-item">
            <p>
              <i class="bx bxs-quote-alt-left quote-icon-left"></i>
              ${story.message}
              <i class="bx bxs-quote-alt-right quote-icon-right"></i>
            </p>
            <img src="${story.image}" class="testimonial-img" alt="${story.name}">
            <h3>${story.name}</h3>
            <h4>${story.role}</h4>
          </div>
        `;
        container.appendChild(slide);
      });

      // Initialize Swiper after dynamic content is loaded
      new Swiper(".testimonials-slider", {
        speed: 600,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });
    })
    .catch((error) => {
      console.error("Error loading success stories:", error);
    });
}
  
/// Load dynamic civic news
function loadNews() {
  fetch("/frontend/assets/data/news.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load news.");
      return response.json();
    })
    .then((newsItems) => {
      const newsContainer = document.getElementById("newsContainer");
      if (!newsContainer) {
        console.warn("⚠️ newsContainer not found in the DOM.");
        return;
      }

      newsItems.forEach((item) => {
        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6 d-flex align-items-stretch mb-4";

        card.innerHTML = `
                    <div class="card">
            <img src="${item.image}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
              <h5 class="card-title"><a href="news-details.html?id=${item.id}">${item.title}</a></h5>
              <p class="card-text">${item.content[0]}</p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">${formatDate(item.date)}</small>
                <span class="badge bg-primary">${item.category}</span>
              </div>
              <a href="news-details.html?id=${item.id}" class="btn btn-link p-0 mt-2">Read More</a>
            </div>
          </div>
        `;
        newsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading news:", error);
    });
}

function formatDate(dateStr) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-GB', options);
}

// Function to render audits
async function loadAudits() {
  try {
    const response = await fetch("/frontend/assets/data/audits.json");
    if (!response.ok) throw new Error("Failed to load audits.");
    const audits = await response.json();

    const auditsContainer = document.getElementById("audits-container");
    if (!auditsContainer) {
      console.warn("⚠️ audits-container not found in the DOM.");
      return;
    }

    audits.forEach((audit) => {
      const auditElement = document.createElement("div");
      auditElement.className = "col-lg-4 col-md-6 mb-4";

      auditElement.innerHTML = `
        <div class="card shadow-sm" data-aos="zoom-in">
          <img src="${audit.image}" class="card-img-top" alt="${audit.title}">
          <div class="card-body">
            <h5>${audit.title}</h5>
            <p>${audit.summary}</p>
          </div>
        </div>
      `;
      auditsContainer.appendChild(auditElement);
    });
  } catch (error) {
    console.error("Error loading audits:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.getElementById("comment-form");
  const loginForm = document.getElementById("login-form");
  const petitionGrid = document.getElementById("petitionGrid");

  if (!commentForm) {
    console.warn("⚠️ commentForm not found in the DOM.");
  }

  if (!loginForm) {
    console.warn("⚠️ loginForm not found in the DOM.");
  }

  if (!petitionGrid) {
    console.warn("⚠️ petitionGrid not found in the DOM.");
  }
});

const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      alert("Login successful!");
      window.location.href = "user-dashboard.html"; // Redirect to user dashboard after login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password. Please try again.");
    }
  });
} else {
  console.warn("⚠️ loginForm not found in the DOM.");
}

let currentUser = null;
const adminEmails = ["admin1@wajibu.org", "admin2@wajibu.org"];

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const commentForm = document.getElementById("comment-form");
  const loginSection = document.getElementById("login-box");

  if (user) {
    if (commentForm) commentForm.classList.remove("d-none");
    if (loginSection) loginSection.classList.add("d-none");
  } else {
    if (commentForm) commentForm.classList.add("d-none");
    if (loginSection) loginSection.classList.remove("d-none");
  }

  loadComments();
});

function formatTimestamp(timestamp) {
  const date = timestamp?.toDate?.() || new Date();
  return date.toLocaleString();
}

// Function to load petitions
function loadPetitions() {
  const grid = document.getElementById("petitionGrid");
  if (!grid) {
    console.warn("⚠️ petitionGrid not found in the DOM.");
    return;
  }

  if (typeof firebase === "undefined" || !firebase.apps.length) {
    console.error("⚠️ Firebase is not initialized. Ensure Firebase is properly configured.");
    return;
  }

  const db = firebase.firestore();
  const auth = firebase.auth();

  db.collection("petitions").orderBy("createdAt", "desc").get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        grid.innerHTML = "<p class='text-muted'>No petitions found. Be the first to create one!</p>";
        return;
      }

      querySnapshot.forEach((doc, index) => {
        const data = doc.data();
        const petitionId = doc.id;

        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6";
        card.setAttribute("data-aos", "fade-up");
        card.setAttribute("data-aos-delay", `${100 * (index + 1)}`);

        card.innerHTML = `
          <div class="card petition-card" data-id="${petitionId}">
            <h3><a href="${data.link || '#'}" class="stretched-link">${data.title}</a></h3>
            <p>${data.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <button class="btn btn-sm btn-success sign-btn">Sign This Petition</button>
              <span class="badge bg-secondary">${data.signaturesCount || 0} signatures</span>
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading petitions:", error);
      grid.innerHTML = "<p class='text-danger'>Failed to load petitions. Please try again later.</p>";
    });
}


// Handle Create Petition Form Submission
document.getElementById("createPetitionForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("petitionTitle").value;
  const description = document.getElementById("petitionDescription").value;
  const image = document.getElementById("petitionImage").value || "";

  // Show loading spinner
  document.getElementById("loadingSpinner").classList.remove("d-none");

  db.collection("petitions").add({
    title,
    description,
    image,
    signaturesCount: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  })
    .then(() => {
      // Hide loading spinner
      document.getElementById("loadingSpinner").classList.add("d-none");

      // Show success toast
      const toast = new bootstrap.Toast(document.getElementById("successToast"));
      toast.show();

      // Reset form
      document.getElementById("createPetitionForm").reset();
    })
    .catch((error) => {
      console.error("Error creating petition:", error);
    });
});

// Handle Petition Detail Modal
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("stretched-link")) {
    e.preventDefault();

    const petitionId = e.target.closest(".petition-card").dataset.id;

    db.collection("petitions").doc(petitionId).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();

          document.getElementById("modalPetitionTitle").textContent = data.title;
          document.getElementById("modalPetitionImage").src = data.image || "assets/img/default-petition.jpg";
          document.getElementById("modalPetitionDescription").textContent = data.description;
          document.getElementById("modalSignaturesCount").textContent = `${data.signaturesCount} signatures`;

          const modal = new bootstrap.Modal(document.getElementById("petitionDetailModal"));
          modal.show();
        }
      })
      .catch((error) => {
        console.error("Error fetching petition details:", error);
      });
  }
});

// Handle Petition Signing
document.getElementById("signPetitionBtn").addEventListener("click", () => {
  const petitionId = document.querySelector(".petition-card[data-id]").dataset.id;

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to sign petitions.");
    return;
  }

  const signatureRef = db.collection("petitions").doc(petitionId).collection("signatures").doc(user.uid);

  signatureRef.get()
    .then((doc) => {
      if (doc.exists) {
        alert("You have already signed this petition.");
      } else {
        signatureRef.set({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db.collection("petitions").doc(petitionId).update({
          signaturesCount: firebase.firestore.FieldValue.increment(1),
        });

        alert("Thank you for signing!");
      }
    })
    .catch((error) => {
      console.error("Error signing petition:", error);
    });
});

// Handle Delete Account Form Submission
document.getElementById("deleteAccountForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;
  const password = document.getElementById("password").value;

  if (!user) {
    alert("You must be logged in to delete your account.");
    return;
  }

  // Reauthenticate the user
  const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
  user.reauthenticateWithCredential(credential)
    .then(() => {
      // Delete the user account
      user.delete()
        .then(() => {
          alert("Your account has been deleted successfully.");
          window.location.href = "index.html"; // Redirect to the homepage
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          alert("Failed to delete your account. Please try again later.");
        });
    })
    .catch((error) => {
      console.error("Error reauthenticating:", error);
      alert("Incorrect password. Please try again.");
    });
});