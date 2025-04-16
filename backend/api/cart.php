<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session to check if the user is logged in
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Set CORS headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5174"); 
header("Access-Control-Allow-Credentials: true"); 

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Fetch cart items for the logged-in user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT items.item_id, items.item_name, shopping_cart.quantity, items.price 
            FROM shopping_cart 
            JOIN items ON shopping_cart.item_id = items.item_id 
            WHERE shopping_cart.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $cart_items = [];
    while ($row = $result->fetch_assoc()) {
        $cart_items[] = $row;
    }

    echo json_encode([
        "success" => true,
        "items" => $cart_items
    ]);
    exit();
}

// Handle item drop into the cart (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['item_id'])) {
    $item_id = intval($_POST['item_id']); // Ensure it's an integer

    // Fetch item price from the database
    $price_sql = "SELECT price FROM items WHERE item_id = ?";
    $stmt = $conn->prepare($price_sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $price_result = $stmt->get_result();

    if ($price_result->num_rows > 0) {
        $price_row = $price_result->fetch_assoc();
        $price = $price_row['price'];

        // Check if the item already exists in the cart
        $check_sql = "SELECT * FROM shopping_cart WHERE user_id = ? AND item_id = ?";
        $stmt = $conn->prepare($check_sql);
        $stmt->bind_param("ii", $user_id, $item_id);
        $stmt->execute();
        $check_result = $stmt->get_result();

        if ($check_result->num_rows > 0) {
            // Item exists, update the quantity
            $update_sql = "UPDATE shopping_cart SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?";
            $stmt = $conn->prepare($update_sql);
            $stmt->bind_param("ii", $user_id, $item_id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Item quantity updated in the cart!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error updating item quantity: " . $conn->error]);
            }
        } else {
            // Item does not exist in the cart, insert a new row
            $insert_sql = "INSERT INTO shopping_cart (user_id, item_id, quantity, price) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($insert_sql);
            $stmt->bind_param("iiid", $user_id, $item_id, $quantity = 1, $price);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Item added to cart!"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error adding item to cart: " . $conn->error]);
            }
        }
    } else {
        echo json_encode(["success" => false, "message" => "Item not found"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request: item_id not provided or incorrect method"]);
}

$conn->close();
?>
