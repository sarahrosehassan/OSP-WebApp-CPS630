<?php
include '../db/db.php';

$products = $conn->query("SELECT * FROM Item_Table");
?>
