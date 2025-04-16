<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database connection
$conn = new mysqli('localhost', 'root', '', 'osp');
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$action = $input['action'] ?? '';

switch ($action) {
    case 'insert_item':
        $stmt = $conn->prepare("INSERT INTO items (item_name, item_image, price, made_in) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssds", $input['item_name'], $input['item_image'], $input['price'], $input['made_in']);
        break;

    case 'insert_order':
        $stmt = $conn->prepare("INSERT INTO orders (user_id, trip_id, total_price, payment_code, order_status) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iisss", $input['user_id'], $input['trip_id'], $input['total_price'], $input['payment_code'], $input['order_status']);
        break;

    case 'insert_cart':
        $stmt = $conn->prepare("INSERT INTO shopping_cart (user_id, item_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiid", $input['user_id'], $input['item_id'], $input['quantity'], $input['price']);
        break;

    case 'insert_trip':
        $stmt = $conn->prepare("INSERT INTO trip (user_id, truck_id, source_address, destination_address, distance, price) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iissdd", $input['user_id'], $input['truck_id'], $input['source_address'], $input['destination_address'], $input['distance'], $input['price']);
        break;

    case 'insert_truck':
        $stmt = $conn->prepare("INSERT INTO truck (truck_code, availability_code) VALUES (?, ?)");
        $stmt->bind_param("ss", $input['truck_code'], $input['availability_code']);
        break;

    case 'insert_user':
        $password_hashed = password_hash($input['password'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, address, city_code) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $input['name'], $input['email'], $password_hashed, $input['phone'], $input['address'], $input['city_code']);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid or missing action."]);
        exit();
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Data inserted successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
