<?php

require 'db_connection.php';

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the action is set and if it equals 'edit'
if (isset($_POST['action']) && $_POST['action'] == 'edit') {
    // Retrieve and sanitize POST data
    $id = $_POST['id'];
    $distributor = $conn->real_escape_string($_POST['distributor']);
    $brand_name = $conn->real_escape_string($_POST['brand_name']);
    $generic_name = $conn->real_escape_string($_POST['generic_name']);
    $purchase_price = floatval( $_POST['purchase_price']);
    $selling_date = floatval($_POST['selling_price']);
    $stock = intval($_POST['stock']);
    $expiry_date = $conn->real_escape_string($_POST['expiry_date']);

    // Update query
    $sql = "UPDATE inventory 
            SET distributor='$distributor', brand_name = '$brand_name', generic_name='$generic_name', purchase_price = '$purchase_price' , selling_price = '$selling_price', stock = '$stock', expiry_date = '$expiry_date'  
            WHERE product_id= $id"; 

    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . $conn->error;
    }
}

$conn->close();
?>
