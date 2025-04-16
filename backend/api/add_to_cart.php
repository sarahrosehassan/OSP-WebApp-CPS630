<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");

session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['item_id'])) {
    $item_id = intval($_POST['item_id']); // Ensure it's an integer

    // Fetch the item's price
    $price_sql = "SELECT price FROM items WHERE item_id = ?";
    $stmt = $conn->prepare($price_sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $price_result = $stmt->get_result();

    if ($price_result->num_rows > 0) {
        $price_row = $price_result->fetch_assoc();
        $price = $price_row['price'];

        // Check if the item is already in the cart
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
                echo json_encode(["success" => true, "message" => "Item quantity updated in the cart"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error updating item quantity: " . $conn->error]);
            }
        } else {
            // Item does not exist, insert new row with quantity 1
            $insert_sql = "INSERT INTO shopping_cart (user_id, item_id, quantity, price) VALUES (?, ?, 1, ?)";
            $stmt = $conn->prepare($insert_sql);
            $stmt->bind_param("iid", $user_id, $item_id, $price);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Item added to cart successfully"]);
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
