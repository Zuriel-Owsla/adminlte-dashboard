import React, { useState } from 'react';
import { generarUUID } from './generadorUUID'; 
import '../estilos.css';

const Consola: React.FC = () => {
  const [sqlCommand, setSqlCommand] = useState('');
  const [databaseUUID, setDatabaseUUID] = useState(generarUUID());  // Generamos un UUID

  // Función para limpiar la sentencia SQL (remover lo que esté después del paréntesis)
  const sanitizeSQL = (sql: string): string => {
    const regex = /(CREATE (DATABASE|TABLE).+?;)/i;
    const match = sql.match(regex);
    return match ? match[0] : ''; // si hay coincidencia, devuelve la parte valida, si no, devuelve vacío
  };

  // Función que maneja la ejecución de la sentencia SQL
  const handleExecute = async () => {
    if (!sqlCommand) {
      alert('Por favor, ingresa una sentencia SQL válida.');
      return;
    }

    // Limpiamos la sentencia SQL antes de enviarla
    const cleanedSQL = sanitizeSQL(sqlCommand);

    if (!cleanedSQL) {
      alert('Sentencia SQL no válida.');
      return;
    }

    try {
      const response = await fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          database: databaseUUID, // Usamos el UUID generado
          datos: cleanedSQL,      // Enviamos la sentencia SQL limpia
        }),
      });

      const result = await response.text();
      console.log(result);

      if (response.ok) {
        alert('Sentencia ejecutada con éxito.');
      } else {
        alert(`Error: ${result}`);
      }
    } catch (error) {
      // verificar errores desde consola
      if (error instanceof Error) {
        console.error('Error al ejecutar la sentencia:', error.message);
        alert(`Hubo un error al ejecutar la sentencia: ${error.message}`);
      } else {
        console.error('Error desconocido:', error);
        alert('Hubo un error desconocido al ejecutar la sentencia.');
      }
    }
  };

  return (
    <div>
      <textarea //texarea
        className="form-control custom-textarea" // CSS
        rows={10}
        placeholder="Escribe tus sentencias SQL aquí..."
        value={sqlCommand}
        onChange={(e) => setSqlCommand(e.target.value)}
      ></textarea>
      <button className="btn btn-primary mt-3" onClick={handleExecute}>Ejecutar</button> 
    </div>
  );
};

export default Consola;
