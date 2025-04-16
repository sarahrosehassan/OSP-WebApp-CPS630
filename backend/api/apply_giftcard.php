<?php
// Enable CORS for React frontend
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

// Validate session and POST data
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$gift_code = $input['gift_code'] ?? '';

if (!$gift_code) {
    echo json_encode(['success' => false, 'message' => 'Gift card code not provided.']);
    exit();
}

$user_id = $_SESSION['user_id'];

// DB Connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}

// Total: cart + trip + tax
$total_price = 0;

$cart_sql = "SELECT items.price, shopping_cart.quantity FROM shopping_cart 
             JOIN items ON shopping_cart.item_id = items.item_id 
             WHERE shopping_cart.user_id = '$user_id'";
$cart_result = $conn->query($cart_sql);
while ($row = $cart_result->fetch_assoc()) {
    $total_price += $row['price'] * $row['quantity'];
}

$trip_sql = "SELECT price FROM trip WHERE user_id = '$user_id' ORDER BY trip_id DESC LIMIT 1";
$trip_result = $conn->query($trip_sql);
if ($trip_result && $trip_result->num_rows > 0) {
    $trip_price = $trip_result->fetch_assoc()['price'];
    $total_price += $trip_price;
}

$total_price *= 1.13; // Add 13% tax

// Check gift card
$gift_sql = "SELECT * FROM gift_card WHERE code = '$gift_code' AND status = 'active'";
$gift_result = $conn->query($gift_sql);

if ($gift_result && $gift_result->num_rows > 0) {
    $gift = $gift_result->fetch_assoc();
    $gift_value = $gift['value'];

    $remaining = $total_price - $gift_value;

    $response = [
        'success' => true,
        'gift_value' => number_format($gift_value, 2),
        'fully_covered' => $gift_value >= $total_price,
        'remaining_amount' => $gift_value >= $total_price ? 0 : number_format($remaining, 2),
        'message' => $gift_value >= $total_price
            ? 'Gift card fully covers your order!'
            : "Gift card applied. Remaining to pay: $" . number_format($remaining, 2)
    ];

    $_SESSION['applied_gift_card'] = [
        'code' => $gift['code'],
        'id' => $gift['gift_card_id'],
        'value' => $gift_value
    ];
} else {
    $response = [
        'success' => false,
        'message' => 'Invalid or inactive gift card.'
    ];
}

echo json_encode($response);
?>
