<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");


$conn = new mysqli('localhost', 'root', '', 'osp');
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

function updateRecord($conn, $sql, $params, $types) {
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param($types, ...$params);
        if ($stmt->execute()) {
            return ["success" => true, "message" => "Record updated successfully"];
        } else {
            return ["success" => false, "message" => "Error: " . $stmt->error];
        }
        $stmt->close();
    } else {
        return ["success" => false, "message" => "Error: " . $conn->error];
    }
}


$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

$response = ["success" => false, "message" => "Invalid action"];

switch ($action) {
    case 'update_item':
        $response = updateRecord($conn, "UPDATE items SET item_name=?, price=?, made_in=? WHERE item_id=?",
            [$data['item_name'], $data['price'], $data['made_in'], $data['item_id']], "sdsi");
        break;
    case 'update_order':
        $response = updateRecord($conn, "UPDATE orders SET order_status=? WHERE order_id=?",
            [$data['order_status'], $data['order_id']], "si");
        break;
    case 'update_shopping_cart':
        $response = updateRecord($conn, "UPDATE shopping_cart SET quantity=? WHERE cart_id=?",
            [$data['quantity'], $data['cart_id']], "ii");
        break;
    case 'update_trip':
        $response = updateRecord($conn, "UPDATE trip SET destination_address=?, price=? WHERE trip_id=?",
            [$data['destination_address'], $data['price'], $data['trip_id']], "sdi");
        break;
    case 'update_truck':
        $response = updateRecord($conn, "UPDATE truck SET availability_code=? WHERE truck_id=?",
            [$data['availability_code'], $data['truck_id']], "si");
        break;
    case 'update_user':
        $response = updateRecord($conn, "UPDATE users SET full_name=?, phone=?, address=? WHERE user_id=?",
            [$data['full_name'], $data['phone'], $data['address'], $data['user_id']], "sssi");
        break;
}

echo json_encode($response);
$conn->close();
?>
