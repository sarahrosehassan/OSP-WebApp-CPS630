<?php
session_start();
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

        <!-- Navbar Right (Only Sign In & Logout Options) -->
        <div class="nav-right">
            <?php if ($user): ?>
                <span>Welcome, <?= htmlspecialchars($user['Name']) ?> (Balance: $<?= number_format($user['Balance'], 2) ?>)</span>
                <a href="logout.php" class="btn">Logout</a>
            <?php else: ?>
                <a href="signin.php" class="btn">Sign In</a>
            <?php endif; ?>
        </div>
    </nav>
</header>
