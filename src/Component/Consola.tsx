import React, { useState } from 'react';
import { generarUUID } from './generadorUUID'; 
import '../estilos.css';

const Consola: React.FC = () => {
  const [sqlCommand, setSqlCommand] = useState('');
  const [databaseUUID, setDatabaseUUID] = useState(() => {
    // Recuperamos el UUID de localStorage
    let storedUUID = localStorage.getItem('databaseUUID');
    // Si existe en localStorage, eliminamos los guiones por si acaso fueron guardados
    if (storedUUID) {
      storedUUID = storedUUID.replace(/-/g, ''); // Aseguramos que no haya guiones
    } else {
      // Si no está en localStorage, generamos uno nuevo y lo guardamos sin guiones
      storedUUID = generarUUID();
      localStorage.setItem('databaseUUID', storedUUID);
    }
    console.log(`Nombre de la base de datos UUID sin guiones (final): ${storedUUID}`);  // Depuración
    return storedUUID;
  });

  // Función para limpiar y reemplazar el nombre de la base de datos
  const processSQL = (sql: string) => {
    // Expresión regular para identificar la sentencia CREATE DATABASE
    const regex = /CREATE DATABASE\s+([a-zA-Z0-9_]+);?/i;
    if (regex.test(sql)) {
      // Si la sentencia es CREATE DATABASE, reemplazamos el nombre por el UUID sin guiones
      const cleanedSQL = sql.replace(regex, `CREATE DATABASE ${databaseUUID};`);
      console.log(`Sentencia SQL modificada: ${cleanedSQL}`);  // Depuración
      return cleanedSQL;
    }
    return sql; // Si no es CREATE DATABASE, retornamos la sentencia original
  };

  const handleExecute = async () => {
    if (!sqlCommand) {
      alert('Por favor, ingresa una sentencia SQL válida.');
      return;
    }

    // Procesamos la sentencia SQL
    const processedSQL = processSQL(sqlCommand.trim());

    try {
      const response = await fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseName: databaseUUID, // Enviamos el UUID como nombre de la base de datos
          sqlQuery: processedSQL,      // Sentencia SQL procesada
        }),
      });

      const result = await response.json();  // Capturamos la respuesta del servidor
      console.log(result);  // Mostramos la respuesta en la consola

      if (response.ok) {
        alert('Sentencia ejecutada con éxito.');
        // Guardamos el UUID en localStorage
        localStorage.setItem('databaseUUID', databaseUUID);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      // Manejamos los errores
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
      <textarea
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
