<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
include 'db.php'; // Database connection file

// Fetch products
$products = $conn->query("SELECT * FROM Item_Table");

// Check if user is logged in
$user = null;
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $user_query = $conn->prepare("SELECT * FROM User_Table WHERE User_Id = ?");
    $user_query->bind_param("i", $user_id);
    $user_query->execute();
    $user = $user_query->get_result()->fetch_assoc();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSP Web Application</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-left">
                <a href="index.php" class="logo">
                    <img src="../img/OSP-logo.png" alt="OSP Logo" class="logo-img">
                </a>
                <ul class="nav-menu">
                    <li><a href="index.php">Home</a></li>
                    <li><a href="logo.php">System Logo</a></li>
                    <li><a href="about.php">About Us</a></li>
                    <li><a href="shopping.php">Shopping Cart</a></li>
                    <li><a href="services.php">Types of Services</a></li>
                    <li><a href="delivery.php">Delivery</a></li>
                    <li><a href="payment.php">Payment</a></li>
                </ul>
            </div>
            <div class="nav-right">
                <?php if ($user): ?>
                    <span>Welcome, <?= htmlspecialchars($user['Name']) ?> (Balance: $<?= number_format($user['Balance'], 2) ?>)</span>
                    <a href="logout.php" class="btn">Logout</a>
                <?php else: ?>
                    <a href="signin.php" class="btn">Sign In</a>
                    <a href="signup.php" class="btn btn-outline">Sign Up</a>
                <?php endif; ?>
            </div>
        </nav>
    </header>
    <main>
        <h1>Welcome to OSP Web App</h1>
        <p>Your one-stop solution for shopping, delivery, and payments.</p>

        <h2>Available Products</h2>
        <div class="product-list">
            <?php while ($row = $products->fetch_assoc()): ?>
                <div class="product">
                    <h3><?= htmlspecialchars($row['Item_Name']) ?></h3>
                    <p>Price: $<?= number_format($row['Price'], 2) ?></p>
                    <p>Made in: <?= htmlspecialchars($row['Made_In']) ?></p>
                    <form action="add_to_cart.php" method="POST">
                        <input type="hidden" name="item_id" value="<?= $row['Item_Id'] ?>">
                        <label>Quantity: <input type="number" name="quantity" value="1" min="1"></label>
                        <p></p>
                        <button type="submit">Add to Cart</button>
                    </form>
                </div>
            <?php endwhile; ?>
        </div>
    </main>
</body>
</html>
