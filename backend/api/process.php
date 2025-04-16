<?php

header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

$cart_sql = "
    SELECT items.item_name, items.price, shopping_cart.quantity
    FROM shopping_cart
    JOIN items ON shopping_cart.item_id = items.item_id
    WHERE shopping_cart.user_id = '$user_id'
";
$cart_result = $conn->query($cart_sql);

$trip_sql = "
    SELECT trip.trip_id, trip.source_address, trip.destination_address, trip.distance, trip.price AS delivery_fee, truck.truck_code
    FROM trip
    JOIN truck ON trip.truck_id = truck.truck_id
    WHERE trip.user_id = '$user_id'
    ORDER BY trip.trip_id DESC
    LIMIT 1
";
$trip_result = $conn->query($trip_sql);
$trip = $trip_result->fetch_assoc();

$total_amount = 0;
$cart_items = [];

if ($cart_result->num_rows > 0) {
    while ($row = $cart_result->fetch_assoc()) {
        $item_total = $row['price'] * $row['quantity'];
        $total_amount += $item_total;
        $cart_items[] = [
            "name" => $row['item_name'],
            "price" => $row['price'],
            "quantity" => $row['quantity'],
            "total" => $item_total
        ];
    }
}

$delivery_fee = isset($trip['delivery_fee']) ? $trip['delivery_fee'] : 0;
$final_total = $total_amount + $delivery_fee;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode([
        "success" => true,
        "cart_items" => $cart_items,
        "trip_details" => [
            "trip_id" => $trip['trip_id'] ?? null,
            "source_address" => $trip['source_address'] ?? '',
            "destination_address" => $trip['destination_address'] ?? '',
            "distance" => $trip['distance'] ?? '',
            "truck_code" => $trip['truck_code'] ?? '',
            "delivery_fee" => $delivery_fee
        ]
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payment_code = $_POST['payment_code'] ?? '';
    $card_number = $_POST['card_number'] ?? '';
    $expiry_date = $_POST['expiry_date'] ?? '';
    $cvv = $_POST['cvv'] ?? '';

    $trip_id = $trip['trip_id'];

    $insert_sql = "
        INSERT INTO orders (total_price, payment_code, user_id, trip_id)
        VALUES ('$final_total', '$payment_code', '$user_id', '$trip_id')
    ";

    if ($conn->query($insert_sql)) {
        // Clear the user's cart
        $conn->query("DELETE FROM shopping_cart WHERE user_id = '$user_id'");

        echo json_encode([
            "success" => true,
            "message" => "Payment successful! Thank you for your order.",
            "order_details" => [
                "cart_items" => $cart_items,
                "delivery_fee" => $delivery_fee,
                "total_amount" => $total_amount,
                "final_total" => $final_total
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error saving order: " . $conn->error
        ]);
    }

    exit();
}

echo json_encode([
    "success" => false,
    "message" => "Invalid request method. Use GET to fetch or POST to process payment."
]);

$conn->close();
?>
