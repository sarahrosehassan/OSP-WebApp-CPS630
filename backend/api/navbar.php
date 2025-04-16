<?php
header("Access-Control-Allow-Origin: http://localhost:5174"); // Or your frontend URL
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// DB connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Default response
$response = [
    "loggedIn" => false,
    "user" => null,
    "cartCount" => 0
];

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Get user info
    $stmt = $conn->prepare("SELECT user_id, name, email, user_type FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $response["loggedIn"] = true;
        $response["user"] = $user;

        // Count cart items
        $cartQuery = $conn->prepare("SELECT SUM(quantity) as total FROM shopping_cart WHERE user_id = ?");
        $cartQuery->bind_param("i", $user_id);
        $cartQuery->execute();
        $cartResult = $cartQuery->get_result();
        if ($cartRow = $cartResult->fetch_assoc()) {
            $response["cartCount"] = (int)$cartRow['total'];
        }
        $cartQuery->close();
    }

    $stmt->close();
}

$conn->close();
echo json_encode($response);
