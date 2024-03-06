<?php


// Create a MySQLi database connection
$mysqli = new mysqli("localhost", "root", "", "mutall_users");

// Check for a connection error
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Assuming you have the values $member, $msg, $username, and $business defined earlier
$member = 123; // Replace with the actual value of $member
$msg = "Your message";
$username = "Your username"; // Define $username
$business = "Your business"; // Define $business

// Check if the 'member' value exists in the 'member' table
$checkQuery = "SELECT COUNT(*) FROM member WHERE member = ?";
$stmtCheck = $mysqli->prepare($checkQuery);
$stmtCheck->bind_param("i", $member);
$stmtCheck->execute();
$stmtCheck->bind_result($memberCount);
$stmtCheck->fetch();
$stmtCheck->close();

if ($memberCount === 0) {
    echo "Error: 'member' value does not exist in the 'member' table.";
} else {
    // 'member' value is valid, proceed with insertion
    // Prepare and execute the SQL query for inserting into 'msg' table
    $insertQuery = "INSERT INTO msg (text, date, member, username, business) VALUES (?, NOW(), ?, ?, ?)";
    $stmt = $mysqli->prepare($insertQuery);

    // Bind parameters
    $stmt->bind_param("siss", $msg, $member, $username, $business);

    if ($stmt->execute()) {
        echo "ok";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the statement and database connection
    $stmt->close();
}

// Close the database connection
$mysqli->close();

