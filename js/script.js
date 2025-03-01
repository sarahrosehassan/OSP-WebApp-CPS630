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
