document.addEventListener("DOMContentLoaded", function () {
    console.log("script.js loaded!"); // Debugging

    // 🔹 Navbar Toggle for Mobile
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // 🔹 Authentication Modal Handling
    const authModal = document.getElementById("authModal");
    const openAuthModal = document.getElementById("openAuthModal");
    const closeModal = document.querySelector(".close");

    if (openAuthModal && authModal) {
        openAuthModal.addEventListener("click", function () {
            authModal.style.display = "block";
        });

        if (closeModal) {
            closeModal.addEventListener("click", function () {
                authModal.style.display = "none";
            });
        }

        window.addEventListener("click", function (event) {
            if (event.target === authModal) {
                authModal.style.display = "none";
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("script.js loaded!"); // Debugging

    // Select modal and buttons
    const authModal = document.getElementById("authModal");
    const openAuthModal = document.getElementById("openAuthModal");
    const closeModal = document.querySelector(".close");

    const showLogin = document.getElementById("showLogin");
    const showSignup = document.getElementById("showSignup");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    // Open modal when clicking Sign In button
    if (openAuthModal) {
        openAuthModal.addEventListener("click", function () {
            console.log("Sign In button clicked!"); // Debugging
            authModal.style.display = "block";
            loginForm.style.display = "block"; 
            signupForm.style.display = "none"; // Show login first
        });
    } else {
        console.error("Error: Sign In button not found!");
    }

    // Close modal when clicking "×"
    if (closeModal) {
        closeModal.addEventListener("click", function () {
            authModal.style.display = "none";
        });
    }

    // Close modal when clicking outside the modal
    window.addEventListener("click", function (event) {
        if (event.target === authModal) {
            authModal.style.display = "none";
        }
    });

    // Toggle between Sign In and Sign Up
    if (showLogin && showSignup && loginForm && signupForm) {
        showLogin.addEventListener("click", function () {
            console.log("Switching to Sign In"); // Debugging
            loginForm.style.display = "block";
            signupForm.style.display = "none";
            this.classList.add("active");
            showSignup.classList.remove("active");
        });

        showSignup.addEventListener("click", function () {
            console.log("Switching to Sign Up"); // Debugging
            signupForm.style.display = "block";
            loginForm.style.display = "none";
            this.classList.add("active");
            showLogin.classList.remove("active");
        });
    } else {
        console.error("Error: Login/Signup elements not found!");
    }
});
