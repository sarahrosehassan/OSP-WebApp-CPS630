<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = new mysqli('localhost', 'root', '', 'osp');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$table = $data['table'] ?? '';
$filter = trim($data['filter'] ?? '');

if (!$table) {
    echo json_encode(['success' => false, 'message' => 'Table name is required.']);
    exit();
}

$sql = "SELECT * FROM `$table`";
if (!empty($filter)) {
    if (strpos($filter, '=') !== false || stripos($filter, 'LIKE') !== false) {
        $sql .= " WHERE $filter";
    } else {
        $sql .= " WHERE user_id LIKE '%$filter%'";
    }
}

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode(['success' => true, 'table' => $table, 'data' => $rows]);
} else {
    echo json_encode(['success' => false, 'message' => 'No records found.']);
}

$conn->close();
?>
