document.addEventListener("DOMContentLoaded", function () {
    console.log("auth.js loaded!"); // Debugging

    const signinForm = document.getElementById("signinForm");
    const signupForm = document.getElementById("signupForm");
    const loginError = document.getElementById("loginError");

    // 🔹 Check Authentication on Page Load
    fetch("../auth/protect.php")
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                console.log("User not authenticated, showing modal.");
                const authModal = document.getElementById("authModal");
                if (authModal) {
                    authModal.style.display = "block";
                }
            }
        })
        .catch(error => console.error("Error checking authentication:", error));

    // 🔹 Handle Sign In via AJAX
    if (signinForm) {
        signinForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(signinForm);

            fetch("../auth/signin.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Login successful, reloading page...");
                    window.location.reload();
                } else {
                    loginError.style.display = "block"; // Show error message
                }
            })
            .catch(error => console.error("Error logging in:", error));
        });
    }

    // 🔹 Handle Sign Up via AJAX
    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const formData = new FormData(signupForm);

            fetch("../auth/signup.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Sign-up successful! Please log in.");
                    window.location.href = "../index.php";
                } else {
                    alert("Error signing up. Try again.");
                }
            })
            .catch(error => console.error("Error signing up:", error));
        });
    }

    // 🔹 Toggle between Sign In and Sign Up
    const showLogin = document.getElementById("showLogin");
    const showSignup = document.getElementById("showSignup");
    const loginForm = document.getElementById("loginForm");
    const signupFormContainer = document.getElementById("signupForm");

    if (showLogin && showSignup && loginForm && signupFormContainer) {
        showLogin.addEventListener("click", function () {
            loginForm.style.display = "block";
            signupFormContainer.style.display = "none";
            this.classList.add("active");
            showSignup.classList.remove("active");
        });

        showSignup.addEventListener("click", function () {
            signupFormContainer.style.display = "block";
            loginForm.style.display = "none";
            this.classList.add("active");
            showLogin.classList.remove("active");
        });
    }
});
