<?php

session_start();


header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5174"); 
header("Access-Control-Allow-Credentials: true"); 


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['item_id'])) {
    $user_id = $_SESSION['user_id'];
    $item_id = intval($_POST['item_id']); 


    $delete_sql = "DELETE FROM shopping_cart WHERE user_id = ? AND item_id = ?";
    $stmt = $conn->prepare($delete_sql);
    

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Failed to prepare query']);
        exit();
    }

    $stmt->bind_param("ii", $user_id, $item_id);


    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Item removed from cart']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error removing item from cart']);
    }


    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
