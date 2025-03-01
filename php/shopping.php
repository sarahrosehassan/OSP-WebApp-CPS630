<?php
session_start();
include '../db/db.php'; // Database connection
include 'fetch_products.php'; // Fetch product data

error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop - OSP Web App</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/script.js" defer></script>
</head>
<body>

    <!-- Include Navbar -->
    <?php include 'header.php'; ?>

    <main>
        <h1>Shop Products</h1>

        <!-- Shopping Cart Area -->
        <div class="cart-container">
            <h2>Shopping Cart</h2>
            <div id="cart" class="cart" ondrop="drop(event)" ondragover="allowDrop(event)">
                <p>Drag items here</p>
            </div>
            <button onclick="checkout()">Checkout</button>
        </div>

        <!-- Product List -->
        <div class="product-list">
            <?php while ($row = $products->fetch_assoc()): ?>
                <div class="product" draggable="true" ondragstart="drag(event)" 
                     data-id="<?= $row['Item_Id'] ?>" 
                     data-name="<?= htmlspecialchars($row['Item_Name']) ?>" 
                     data-price="<?= number_format($row['Price'], 2) ?>">
                    <h3><?= htmlspecialchars($row['Item_Name']) ?></h3>
                    <p>Price: $<?= number_format($row['Price'], 2) ?></p>
                    <p>Made in: <?= htmlspecialchars($row['Made_In']) ?></p>
                </div>
            <?php endwhile; ?>
        </div>
    </main>
    
    <script src="../js/script.js" defer></script>
    <script src="../js/cart.js" defer></script>


</body>
</html>
