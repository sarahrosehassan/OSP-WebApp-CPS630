<?php
// Enable CORS headers for a specific origin
header("Access-Control-Allow-Origin: http://localhost:5174"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Access-Control-Allow-Credentials: true"); 
header('Content-Type: application/json'); 

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // If the request is OPTIONS, just send the headers and exit
    exit(0);
}

// Enable error reporting for debugging (you can disable this in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Start session to check if the user is logged in
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
    exit();
}

// Database connection
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "osp";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit();
}

// Handle GET request to fetch available trucks
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $truck_sql = "SELECT truck_id, truck_code FROM truck WHERE availability_code = 'Available'";
    $truck_result = $conn->query($truck_sql);

    $trucks = [];

    if ($truck_result->num_rows > 0) {
        // Fetch all available trucks
        while ($row = $truck_result->fetch_assoc()) {
            $trucks[] = [
                'truck_id' => $row['truck_id'],
                'truck_code' => $row['truck_code']
            ];
        }

        echo json_encode([
            "success" => true,
            "trucks" => $trucks
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No available trucks found."
        ]);
    }
    exit();
}

// Handle POST request to handle the form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure all required POST variables are set
    $source_address = isset($_POST['branch']) ? $_POST['branch'] : '';
    $destination_address = isset($_POST['address']) ? $_POST['address'] : '';
    $truck_id = isset($_POST['truck']) ? $_POST['truck'] : '';
    $delivery_date = isset($_POST['date']) ? $_POST['date'] : '';
    $delivery_time = isset($_POST['time']) ? $_POST['time'] : '';
    $user_id = $_SESSION['user_id']; 
    $express_selected = isset($_POST['express']);

    // Debugging: Print the incoming POST data
    error_log("POST data: ");
    error_log("Truck ID: " . $truck_id);
    error_log("Source Address: " . $source_address);
    error_log("Destination Address: " . $destination_address);
    error_log("Delivery Date: " . $delivery_date);
    error_log("Delivery Time: " . $delivery_time);
    error_log("Express Shipping Selected: " . ($express_selected ? 'Yes' : 'No'));

    // Validate that all fields are provided
    $missingFields = [];

    if (!$source_address) $missingFields[] = "Source Address";
    if (!$destination_address) $missingFields[] = "Destination Address";
    if (!$truck_id) $missingFields[] = "Truck ID";
    if (!$delivery_date) $missingFields[] = "Delivery Date";
    if (!$delivery_time) $missingFields[] = "Delivery Time";

    // If any field is missing, return an error message with the specific missing fields
    if (count($missingFields) > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields: " . implode(", ", $missingFields)
        ]);
        exit();
    }

    // Fetch distance and duration using Google Maps API
    $api_key = "AIzaSyASHBscGYgpTSJGJ-UhSm0KeKJC7-YteVQ"; 
    $origin = urlencode($source_address);
    $destination = urlencode($destination_address);
    $url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=$origin&destinations=$destination&key=$api_key";

    // Debugging: Print URL
    error_log("Google Maps API URL: " . $url);

    // Get Google Maps API response
    $response = @file_get_contents($url); // Use @ to suppress warnings
    if ($response === FALSE) {
        echo json_encode([
            "success" => false,
            "message" => "Error fetching distance and duration from Google Maps"
        ]);
        exit();
    }

    $data = json_decode($response, true);

    if ($data['status'] === 'OK') {
        $distance = $data['rows'][0]['elements'][0]['distance']['value'] / 1000; // Distance in kilometers
        $duration = $data['rows'][0]['elements'][0]['duration']['text']; // Duration in text format

        // Debugging: Print calculated distance and duration
        error_log("Distance: " . $distance . " km");
        error_log("Duration: " . $duration);

        // Calculate price based on distance
        $price = ($distance > 5) ? 40 : 0;

        // Check Express Shipping eligibility (only valid until April 30, 2025)
        $today = new DateTime();
        $express_cutoff = new DateTime("2025-04-30");

        if ($express_selected && $today <= $express_cutoff) {
            $price += 10;
            $_SESSION['express_shipping'] = true;
        } else {
            $_SESSION['express_shipping'] = false;
        }

        // Check if the user already has a trip
        $check_sql = "SELECT * FROM trip WHERE user_id = '$user_id'";
        $check_result = $conn->query($check_sql);

        if ($check_result->num_rows > 0) {
            // Update existing trip details
            $update_sql = "UPDATE trip 
                SET source_address = '$source_address', 
                    destination_address = '$destination_address', 
                    distance = '$distance', 
                    truck_id = '$truck_id', 
                    price = '$price', 
                    express_shipping = " . ($express_selected ? 1 : 0) . " 
                WHERE user_id = '$user_id'";

            if ($conn->query($update_sql)) {
                echo json_encode([
                    "success" => true,
                    "message" => "Trip updated successfully",
                    "trip_details" => [
                        'source' => $source_address,
                        'destination' => $destination_address,
                        'distance' => $distance,
                        'duration' => $duration,
                        'price' => $price,
                    ]
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Error updating trip details: " . $conn->error
                ]);
            }
        } else {
            // Insert new trip details
            $insert_sql = "INSERT INTO trip 
                (source_address, destination_address, distance, truck_id, price, user_id, express_shipping) 
                VALUES ('$source_address', '$destination_address', '$distance', '$truck_id', '$price', '$user_id', " . ($express_selected ? 1 : 0) . ")";

            if ($conn->query($insert_sql)) {
                echo json_encode([
                    "success" => true,
                    "message" => "Trip created successfully",
                    "trip_details" => [
                        'source' => $source_address,
                        'destination' => $destination_address,
                        'distance' => $distance,
                        'duration' => $duration,
                        'price' => $price,
                    ]
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Error saving trip details: " . $conn->error
                ]);
            }
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Error fetching distance and duration from Google Maps"
        ]);
    }
}

$conn->close();
?>
