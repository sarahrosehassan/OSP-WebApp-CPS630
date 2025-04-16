<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5174"); // adjust as needed
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// DB connection
$conn = new mysqli("localhost", "root", "", "osp");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database error"]);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password_input = $data['password'] ?? '';

$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $input_hash = md5($user['salt'] . $password_input);

    if ($input_hash === $user['password_md5']) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_name'] = $user['name'];
        echo json_encode(["success" => true, "user" => [
            "id" => $user['user_id'],
            "name" => $user['name'],
            "email" => $user['email']
        ]]);
    } else {
        echo json_encode(["success" => false, "error" => "Incorrect password."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "User not found."]);
}
