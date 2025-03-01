<?php
include '../db/db.php';

$user = null;
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $user_query = $conn->prepare("SELECT * FROM User_Table WHERE User_Id = ?");
    $user_query->bind_param("i", $user_id);
    $user_query->execute();
    $user = $user_query->get_result()->fetch_assoc();
}
?>
