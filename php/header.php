<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include '../db/db.php'; // Include database connection
include 'fetch_user.php'; // Fetch user details
?>

<header>
    <nav class="navbar">
        <div class="nav-left">
            <a href="index.php" class="logo">
                <img src="../img/OSP-logo.png" alt="OSP Logo" class="logo-img">
            </a>
            <ul class="nav-menu">
                <li><a href="logo.php">System Logo</a></li>
                <li><a href="about.php">About Us</a></li>
                <li><a href="shopping.php">Shopping Cart</a></li>
                <li><a href="services.php">Types of Services</a></li>
                <li><a href="delivery.php">Delivery</a></li>
                <li><a href="payment.php">Payment</a></li>
            </ul>
        </div>

        <!-- Navbar Right -->
        <div class="nav-right">
            <?php if ($user): ?>
                <span>Welcome, <?= htmlspecialchars($user['Name']) ?> (Balance: $<?= number_format($user['Balance'], 2) ?>)</span>
                <a href="logout.php" class="btn">Logout</a>
            <?php else: ?>
                <button class="btn" id="openAuthModal">Sign In</button>
            <?php endif; ?>
        </div>
    </nav>

    <!-- Authentication Modal (Hidden by Default) -->
    <div id="authModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="auth-tabs">
                <button id="showLogin" class="active">Sign In</button>
                <button id="showSignup">Sign Up</button>
            </div>
            <div id="loginForm">
                <h2>Sign In</h2>
                <form action="../auth/signin.php" method="POST">
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Sign In</button>
                </form>
            </div>
            <div id="signupForm" style="display: none;">
            <h2>Sign Up</h2>
            <form action="../auth/signup.php" method="POST">
                <input type="text" name="name" placeholder="Full Name" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="text" name="login_id" placeholder="Username (Login ID)" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="text" name="tel_no" placeholder="Phone Number" required>
                <input type="text" name="address" placeholder="Mailing Address" required>
                <button type="submit">Sign Up</button>
</form>

        </div>
    </div>
</div>


</header>
