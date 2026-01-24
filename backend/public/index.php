<?php
// CORS Headers for React Frontend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Load Controllers
require_once '../controllers/AuthController.php';
require_once '../controllers/ProductController.php';
require_once '../controllers/OrderController.php';

$auth = new AuthController();
$product = new ProductController();
$order = new OrderController();

// Route Matching
if ($uri === '/api/login' && $method === 'POST') {
    $auth->login();
} elseif ($uri === '/api/register' && $method === 'POST') {
    $auth->register();
} elseif ($uri === '/api/products' && $method === 'GET') {
    $product->getAll();
} elseif ($uri === '/api/orders/create' && $method === 'POST') {
    $order->createOrder();
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Endpoint not found"]);
}
?>