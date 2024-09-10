<?php
// Habilitar CORS para permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar solicitud OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Datos de conexión a MySQL
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
        // Si no hay nombre de base de datos, generamos uno nuevo
        $databaseName = generateRandomDatabaseName();
    }

    // Establecer conexión a MySQL
    $conn = new mysqli($servername, $username, $password);

    if ($conn->connect_error) {
        echo json_encode(['message' => "Conexión fallida: " . $conn->connect_error]);
        exit();
    }

    // Si la consulta es CREATE DATABASE, intentamos crear la base de datos
    if (preg_match('/CREATE DATABASE/i', $sqlQuery)) {
        $createDbQuery = "CREATE DATABASE $databaseName";
        if ($conn->query($createDbQuery) === TRUE) {
            $responseMessages[] = "Base de datos '$databaseName' creada con éxito.";
        } else {
            echo json_encode(['message' => "Error al crear la base de datos: " . $conn->error]);
            $conn->close();
            exit();
        }
    } else {
        // Si la consulta es otra por ejemplo CREATE TABLE, seleccionamos la base de datos y ejecutamos la consulta
        $conn->select_db($databaseName);

        // Ejecutar la consulta SQL (ejemplo: CREATE TABLE)
        if ($conn->multi_query($sqlQuery)) {
            do {
                // Almacenamos el primer conjunto de resultados
                if ($result = $conn->store_result()) {
                    while ($row = $result->fetch_assoc()) {
                        // Manejamos el resultado si es necesario
                    }
                    $result->free();
                }
                // Verificamos errores
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
