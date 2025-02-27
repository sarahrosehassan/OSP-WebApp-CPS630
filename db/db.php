<?php
$host = "127.0.0.1";
$user = "root";
$pass = "";
$db_name = "osp_db";

$conn = new mysqli($host, $user, $pass);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if it doesn’t exist
$sql = "CREATE DATABASE IF NOT EXISTS $db_name";
if (!$conn->query($sql)) {
    die("Error creating database: " . $conn->error);
}

$conn->select_db($db_name);

// Load and execute db.sql
$sqlFile = __DIR__ . '/../db/db.sql';

if (file_exists($sqlFile)) {
    $sqlContent = file_get_contents($sqlFile);
    if ($conn->multi_query($sqlContent)) {
        // echo "Tables imported successfully.<br>";
    
        // Process all results from multi_query to free up connection
        while ($conn->more_results()) {
            $conn->next_result();
        }
    } else {
        echo "Error importing tables: " . $conn->error . "<br>";
    }
}

// Close connection 
//$conn->close();
?>
