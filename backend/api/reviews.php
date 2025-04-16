<?php

header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
$user_id = $_SESSION['user_id'] ?? null;


$conn = new mysqli("localhost", "root", "", "osp");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$user_id) {
        echo json_encode(["success" => false, "message" => "User not logged in"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);

    $item_id = intval($data['item_id'] ?? 0);
    $ranking = intval($data['ranking'] ?? 0);
    $shipping = intval($data['shipping_rating'] ?? 0);
    $delivery = intval($data['delivery_rating'] ?? 0);
    $service = intval($data['service_rating'] ?? 0);
    $text = trim($data['review'] ?? '');

    $missing = [];
    if (!$item_id) $missing[] = 'item_id';
    if (!$ranking) $missing[] = 'ranking';
    if (!$shipping) $missing[] = 'shipping_rating';
    if (!$delivery) $missing[] = 'delivery_rating';
    if (!$service) $missing[] = 'service_rating';
    if (empty($text)) $missing[] = 'review';

    if (!empty($missing)) {
        echo json_encode([
            "success" => false,
            "message" => "Missing fields: " . implode(', ', $missing),
            "received" => $data
        ]);
        exit();
    }

    $safe_text = $conn->real_escape_string($text);

    $sql = "INSERT INTO reviews (user_id, item_id, ranking_number, shipping_rating, delivery_rating, service_rating, review_text) 
            VALUES ($user_id, $item_id, $ranking, $shipping, $delivery, $service, '$safe_text')";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Review submitted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error submitting review: " . $conn->error]);
    }

    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['item_id'])) {
        echo json_encode(["success" => false, "message" => "Missing item_id"]);
        exit();
    }

    $item_id = intval($_GET['item_id']);


    $item_sql = "SELECT * FROM items WHERE item_id = $item_id";
    $item_result = $conn->query($item_sql);
    if (!$item_result || $item_result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Item not found"]);
        exit();
    }
    $item = $item_result->fetch_assoc();


    $reviews_sql = "SELECT r.*, u.email 
                    FROM reviews r 
                    JOIN users u ON r.user_id = u.user_id 
                    WHERE r.item_id = $item_id 
                    ORDER BY r.created_at DESC";
    $reviews_result = $conn->query($reviews_sql);

    $reviews = [];
    while ($row = $reviews_result->fetch_assoc()) {
        $reviews[] = [
            "email" => $row["email"],
            "ranking_number" => $row["ranking_number"],
            "shipping_rating" => $row["shipping_rating"],
            "delivery_rating" => $row["delivery_rating"],
            "service_rating" => $row["service_rating"],
            "review_text" => $row["review_text"],
            "created_at" => $row["created_at"]
        ];
    }

    echo json_encode([
        "success" => true,
        "item" => $item,
        "reviews" => $reviews
    ]);
    exit();
}


echo json_encode(["success" => false, "message" => "Unsupported request method"]);
