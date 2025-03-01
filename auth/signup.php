<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

include '../db/db.php'; // Connect to database

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $login_id = $_POST['login_id'] ?? ''; // New field for Username
    $password = $_POST['password'] ?? '';
    $tel_no = $_POST['tel_no'] ?? '';
    $address = $_POST['address'] ?? '';

    // Validate input fields
    if (empty($name) || empty($email) || empty($login_id) || empty($password) || empty($tel_no) || empty($address)) {
        die("Error: All fields are required.");
    }

    // Hash password for security
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check if email or username is already registered
    $stmt = $conn->prepare("SELECT * FROM User_Table WHERE Email = ? OR Login_Id = ?");
    $stmt->bind_param("ss", $email, $login_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        die("Error: Email or Username is already registered.");
    }

    // Insert new user into database
    $stmt = $conn->prepare("INSERT INTO User_Table (Name, Email, Login_Id, Password, Tel_No, Address) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $email, $login_id, $hashed_password, $tel_no, $address);

    if ($stmt->execute()) {
        $_SESSION["user_id"] = $stmt->insert_id; // Store user ID in session
        header("Location: ../php/index.php"); // Redirect to homepage
        exit();
    } else {
        die("Error: Could not register user. " . $stmt->error);
    }

    $stmt->close();
}

$conn->close();
?>


