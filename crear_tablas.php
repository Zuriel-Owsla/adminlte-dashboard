<?php
// Habilitar CORS para permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Datos de conexión a mysql
$servername = "localhost";
$username = "root";
$password = "";

// Función para generar un nombre aleatorio para la base de datos
function generateRandomDatabaseName() {
    return 'db_' . uniqid();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Leer el cuerpo de la solicitud como JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // Verificar que 'sqlQuery' esté presente
    if (!isset($data['sqlQuery']) || empty(trim($data['sqlQuery']))) {
        echo json_encode(['message' => "Error: El campo 'sqlQuery' es obligatorio."]);
        exit();
    }

    $sqlQuery = trim($data['sqlQuery']);
    $responseMessages = []; // Arreglo para almacenar los mensajes

    // Si se proporciona 'databaseName', la reutilizamos
    if (isset($data['databaseName']) && !empty($data['databaseName'])) {
        $databaseName = $data['databaseName'];
    } else {
        echo json_encode(['message' => "Error: No se proporcionó el nombre de la base de datos."]);
        exit();
    }

    // Establecer conexión a MySQL
    $conn = new mysqli($servername, $username, $password);

    if ($conn->connect_error) {
        echo json_encode(['message' => "Conexión fallida: " . $conn->connect_error]);
        exit();
    }

    // Comprobamos si la base de datos existe
    $dbCheckQuery = "SHOW DATABASES LIKE '$databaseName'";
    $dbCheckResult = $conn->query($dbCheckQuery);

    if ($dbCheckResult->num_rows === 0) {
        // Si la base de datos no existe, la creamos
        $createDbQuery = "CREATE DATABASE `$databaseName`";
        if ($conn->query($createDbQuery) === TRUE) {
            $responseMessages[] = "Base de datos '$databaseName' creada con éxito.";
            // Cerrar la conexión y reabrirla 
            $conn->close();
            $conn = new mysqli($servername, $username, $password);
            if ($conn->connect_error) {
                echo json_encode(['message' => "Error al reconectar a MySQL: " . $conn->connect_error]);
                exit();
            }
        } else {
            echo json_encode(['message' => "Error al crear la base de datos: " . $conn->error]);
            $conn->close();
            exit();
        }
    }

    // Seleccionar la base de datos para ejecutar el CREATE TABLE
    if (!$conn->select_db($databaseName)) {
        echo json_encode(['message' => "Error: No se pudo seleccionar la base de datos '$databaseName'."]);
        $conn->close();
        exit();
    }

    // Ejecutar la consulta SQL (ejemplo: CREATE TABLE)
    if ($conn->multi_query($sqlQuery)) {
        do {
            if ($result = $conn->store_result()) {
                while ($row = $result->fetch_assoc()) {
                    // Proceso de los resultados si es necesario
                }
                $result->free();
            }

            if ($conn->errno) {
                echo json_encode(['message' => "Error al ejecutar la consulta: " . $conn->error]);
                $conn->close();
                exit();
            }
        } while ($conn->more_results() && $conn->next_result());

        $responseMessages[] = "Consultas SQL ejecutadas con éxito.";
    } else {
        echo json_encode(['message' => "Error al ejecutar las consultas: " . $conn->error]);
        $conn->close();
        exit();
    }

    // Cerrar la conexión
    $conn->close();

    // Devolver todos los mensajes en formato JSON
    echo json_encode([
        'databaseName' => $databaseName,
        'messages' => $responseMessages,
    ]);
} else {
    echo json_encode(['message' => "Método no soportado. Utiliza POST para enviar la sentencia SQL."]);
}
?>