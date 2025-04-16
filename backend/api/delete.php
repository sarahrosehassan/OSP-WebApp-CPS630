<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Connect to DB
$conn = new mysqli('localhost', 'root', '', 'osp');
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit();
}

// Decode incoming JSON
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['action'])) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

$action = $data['action'];

function deleteRecord($conn, $table, $column, $id, $successMsg) {
    $id = intval($id);
    $sql = "DELETE FROM $table WHERE $column = $id";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => $successMsg]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
    exit();
}

// Match action
switch ($action) {
    case 'delete_item':
        deleteRecord($conn, 'items', 'item_id', $data['item_id'], 'Item deleted successfully!');
        break;
    case 'delete_order':
        deleteRecord($conn, 'orders', 'order_id', $data['order_id'], 'Order deleted successfully!');
        break;
    case 'delete_cart':
        deleteRecord($conn, 'shopping_cart', 'cart_id', $data['cart_id'], 'Cart entry deleted successfully!');
        break;
    case 'delete_trip':
        deleteRecord($conn, 'trip', 'trip_id', $data['trip_id'], 'Trip deleted successfully!');
        break;
    case 'delete_truck':
        deleteRecord($conn, 'truck', 'truck_id', $data['truck_id'], 'Truck deleted successfully!');
        break;
    case 'delete_user':
        deleteRecord($conn, 'users', 'user_id', $data['user_id'], 'User deleted successfully!');
        break;
    default:
        echo json_encode(["success" => false, "message" => "Unknown action"]);
        exit();
}
?>
