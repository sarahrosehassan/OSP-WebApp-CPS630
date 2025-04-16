<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit();
}

$conn = new mysqli("localhost", "root", "", "osp");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$search_query = $data['search_query'] ?? '';

if (!$search_query) {
    echo json_encode(["success" => false, "message" => "Missing search query"]);
    exit();
}

$sql = "SELECT orders.order_id, orders.user_id, orders.total_price, orders.payment_code, orders.order_status, orders.created_at, users.name 
        FROM orders 
        JOIN users ON orders.user_id = users.user_id 
        WHERE orders.order_id = ? OR orders.user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $search_query, $search_query);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode([
    "success" => true,
    "orders" => $orders
]);

$conn->close();
?>
