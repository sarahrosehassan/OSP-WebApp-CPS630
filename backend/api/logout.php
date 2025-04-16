<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: http://localhost:5174"); // Adjust if using a different frontend port
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

session_start();
session_unset();
session_destroy();

// Respond with JSON success
echo json_encode([
    "success" => true,
    "message" => "Logged out successfully."
]);
exit();
?>
