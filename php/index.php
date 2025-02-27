<?php
// Start session and include database connection
session_start();
include '../db/db.php';  // Database connection file
include 'fetch_products.php';  // Fetch products from DB
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

    <!-- Include Navbar -->
    <?php include 'header.php'; ?>

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

    <!-- Link External JavaScript -->
    <script src="../js/script.js"></script>

</body>
</html>
