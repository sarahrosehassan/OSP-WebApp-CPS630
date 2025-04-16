<?php
// Enable CORS for React frontend
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Preflight check
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

$user_id = $_SESSION['user_id'];

// --- Cart Total Calculation ---
$total_price = 0;
$cart_sql = "SELECT items.price, shopping_cart.quantity 
             FROM shopping_cart 
             JOIN items ON shopping_cart.item_id = items.item_id 
             WHERE shopping_cart.user_id = '$user_id'";
$cart_result = $conn->query($cart_sql);
while ($row = $cart_result->fetch_assoc()) {
    $total_price += $row['price'] * $row['quantity'];
}

// --- Delivery Fee from Trip ---
$trip_sql = "SELECT trip_id, price FROM trip 
             WHERE user_id = '$user_id' 
             ORDER BY trip_id DESC 
             LIMIT 1";
$trip_result = $conn->query($trip_sql);

$trip_id = null;
$delivery_fee = 0;

if ($trip_result->num_rows > 0) {
    $trip = $trip_result->fetch_assoc();
    $trip_id = $trip['trip_id'];
    $delivery_fee = floatval($trip['price']);
    $total_price += $delivery_fee;
}

$total_price *= 1.13; // 13% tax
$total_price = round($total_price, 2); // round to 2 decimal places

// --- Handle GET request (for payment preview) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        "success" => true,
        "total_price" => $total_price,
        "delivery_fee" => $delivery_fee
    ]);
    exit();
}

// --- Handle POST request (payment processing) ---
$input = json_decode(file_get_contents("php://input"), true);

$payment_method = $input['payment_method'] ?? '';
$payment_code = '';

if ($payment_method === 'gift') {
    $gift_code = $input['gift_card_code'] ?? '';
    $gift_sql = "SELECT * FROM gift_card WHERE code = '$gift_code' AND status = 'active'";
    $gift_result = $conn->query($gift_sql);

    if ($gift_result->num_rows > 0) {
        $gift = $gift_result->fetch_assoc();
        $gift_value = floatval($gift['value']);

        if ($gift_value >= $total_price) {
            $payment_code = $gift_code;
        } else {
            $remaining = $total_price - $gift_value;
            $payment_code = $gift_code . " + card";
        }
        $conn->query("UPDATE gift_card SET status = 'used' WHERE gift_card_id = " . $gift['gift_card_id']);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid or inactive gift card code."]);
        exit();
    }
} else {
    $payment_code = $input['payment_code'] ?? '';
}

// --- Optional: Save card hash securely ---
if (!empty($input['card_number'])) {
    $card_number = $input['card_number'];
    $card_salt = bin2hex(random_bytes(8));
    $card_hash = md5($card_salt . $card_number);

    $update_card_sql = "UPDATE users SET card_md5 = ?, card_salt = ? WHERE user_id = ?";
    $stmt = $conn->prepare($update_card_sql);
    $stmt->bind_param("ssi", $card_hash, $card_salt, $user_id);
    $stmt->execute();
    $stmt->close();
}

// --- Insert order ---
if ($trip_id) {
    $price_salt = bin2hex(random_bytes(8));
    $price_md5 = md5($price_salt . $total_price);

    $insert_sql = "INSERT INTO orders (total_price, price_md5, price_salt, payment_code, user_id, trip_id) 
                   VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insert_sql);
    $stmt->bind_param("dssssi", $total_price, $price_md5, $price_salt, $payment_code, $user_id, $trip_id);

    if ($stmt->execute()) {
        $conn->query("DELETE FROM shopping_cart WHERE user_id = '$user_id'");
        echo json_encode(["success" => true, "message" => "Order placed successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error placing order: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Trip not found."]);
}

$conn->close();
?>
