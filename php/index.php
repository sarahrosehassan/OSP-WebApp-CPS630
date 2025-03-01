<?php
session_start(); // Ensure session starts correctly

include '../db/db.php'; // Database connection
include 'fetch_user.php'; // Fetch user details

error_reporting(E_ALL);
ini_set('display_errors', 1);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSP Web Application</title>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/script.js" defer></script>
</head>
<body>

    <!-- Include Navbar -->
    <?php include 'header.php'; ?>
    
    <main class="main-content">
    <br><br><br> <!-- Adds space -->
        <h1>Welcome to OSP Web App</h1>
        <p>Your one-stop solution for shopping, delivery, and payments.</p>
    </main>

</body>
</html>
