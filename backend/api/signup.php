<?php

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start(); 


$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === 'http://localhost:5174') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit();
}


$data = json_decode(file_get_contents("php://input"), true);
$response = ['success' => false, 'error' => ''];

function generateSalt() {
    return bin2hex(random_bytes(16));
}

try {

    $required = ['name', 'email', 'password', 'phone', 'address', 'city_code'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    $email = $conn->real_escape_string($data['email']);


    $check = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        throw new Exception("Email already registered");
    }


    $salt = generateSalt();
    $password_hash = md5($salt . $data['password']);


    $stmt = $conn->prepare("INSERT INTO users (name, email, password_md5, salt, phone, address, city_code)
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param(
        "sssssss",
        $data['name'],
        $data['email'],
        $password_hash,
        $salt,
        $data['phone'],
        $data['address'],
        $data['city_code']
    );

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['user_id'] = $stmt->insert_id;
    } else {
        throw new Exception("Database error: " . $stmt->error);
    }

    $stmt->close();
    $check->close();
    $conn->close();

} catch (Exception $e) {
    $response['error'] = $e->getMessage();
    if (isset($check) && $check instanceof mysqli_stmt) $check->close();
    if (isset($conn) && $conn instanceof mysqli) $conn->close();
}


echo json_encode($response);
exit();
