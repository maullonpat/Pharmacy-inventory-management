<?php

// Create connection
require 'db_connection.php';

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data
$search = isset($_GET['search']) ? $_GET['search'] : '';
$sql = "SELECT * FROM inventory";
if ($search) {
    $sql .= " WHERE generic_name LIKE '%$search%' OR brand_name  LIKE '%$search%'";
}
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();
?>