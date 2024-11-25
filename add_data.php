<?php

// Create connection
require 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve and sanitize POST data
  $distributor = $conn->real_escape_string($_POST['distributor']);
  $brand_name = $conn->real_escape_string($_POST['brand_name']);
  $generic_name = $conn->real_escape_string($_POST['generic_name']);
  $purchase_price = doubleval($_POST['purchase_price']);
  $selling_price = doubleval($_POST['selling_price']);
  $stock = intval($_POST['stock']);
  $expiry_date = $conn->real_escape_string($_POST['expiry_date']);

  // Check if a matching product exists
  $checkSql = "SELECT stock FROM inventory 
               WHERE distributor= '$distributor' 
                 AND brand_name='$brand_name' 
                 AND generic_name='$generic_name'  
                 AND purchase_price=$purchase_price  
                 AND selling_price=$selling_price 
                 AND expiry_date='$expiry_date'";

  $result = $conn->query($checkSql);

  if ($result->num_rows > 0) {
      // Product exists, so update the stock
      $row = $result->fetch_assoc();
      $newStock = $row['stock'] + $stock;
      $updateSql = "UPDATE inventory 
                    SET stock=$newStock 
                    WHERE distributor= '$distributor' 
                 AND brand_name='$brand_name' 
                 AND generic_name='$generic_name'  
                 AND purchase_price=$purchase_price  
                 AND selling_price=$selling_price 
                 AND expiry_date='$expiry_date'";

      if ($conn->query($updateSql) === TRUE) {
          echo "Stock updated successfully";
      } else {
          echo "Error updating stock: " . $conn->error;
      }
  } else {
      // Product does not exist, so insert a new record
      $insertSql = "INSERT INTO inventory (distributor, brand_name, generic_name, purchase_price, selling_price, stock, expiry_date) 
                    VALUES ('$distributor', '$brand_name', '$generic_name', $purchase_price, $selling_price, $stock, '$expiry_date')";

      if ($conn->query($insertSql) === TRUE) {
          echo "New product added successfully";
      } else {
          echo "Error: " . $insertSql . "<br>" . $conn->error;
      }
  }
}

$conn->close();
?>
