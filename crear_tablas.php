<?php
//agregar en 'C:\xampp\htdocs'
// Permitir CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Datos de conexión a MySQL
$servername = "localhost";
$username = "root"; 
$password = ""; 

// Función para limpiar y validar el nombre de la base de datos y la tabla
function sanitizeInput($input) {
    return preg_replace('/[^a-zA-Z0-9_]/', '', $input);
}

// Verifica si los datos han sido enviados por POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $database = sanitizeInput(trim($_POST['database']));
    $datos = trim($_POST['datos']); // Las columnas o sentencias SQL que envías desde React

    // Establece conexión a MySQL
    $conn = new mysqli($servername, $username, $password);

    // Verifica la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Crea la base de datos si no existe
    $sql = "CREATE DATABASE IF NOT EXISTS $database";
    if ($conn->query($sql) === TRUE) {
        echo "Base de datos '$database' creada con éxito.<br>";
    } else {
        die("Error al crear la base de datos: " . $conn->error);
    }

    // Selecciona la base de datos usando el UUID
    $conn->select_db($database);

    // Ejecuta la sentencia SQL (por ejemplo, CREATE TABLE)
    $sql = $datos; 
    if ($conn->query($sql) === TRUE) {
        echo "Sentencia SQL ejecutada con éxito: $datos<br>";
    } else {
        die("Error al ejecutar la sentencia SQL: " . $conn->error);
    }

    // Cierra la conexión
    $conn->close();
}
?>
