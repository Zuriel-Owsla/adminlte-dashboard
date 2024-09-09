import React, { useState } from 'react';
import { generarUUID } from './generadorUUID'; 
import '../estilos.css';

const Consola: React.FC = () => {
  const [sqlCommand, setSqlCommand] = useState('');

  // Función para limpiar y reemplazar el nombre de la base de datos
  const processSQL = (sql: string) => {
    // Expresión regular para identificar la sentencia CREATE DATABASE
    const regex = /CREATE DATABASE\s+([a-zA-Z0-9_]+);?/i;
    if (regex.test(sql)) {
      // Generamos un nuevo UUID para cada CREATE DATABASE
      const newUUID = generarUUID();
      console.log(`Generando nuevo UUID para la base de datos: ${newUUID}`);
      const cleanedSQL = sql.replace(regex, `CREATE DATABASE ${newUUID};`);
      return { cleanedSQL, newUUID }; // Devolvemos la SQL procesada y el nuevo UUID
    }
    return { cleanedSQL: sql, newUUID: null }; // Si no es CREATE DATABASE, retornamos la sentencia original y null
  };

  const handleExecute = async () => {
    if (!sqlCommand) {
      alert('Por favor, ingresa una sentencia SQL válida.');
      return;
    }

    // Procesamos la sentencia SQL
    const { cleanedSQL, newUUID } = processSQL(sqlCommand.trim());

    try {
      const response = await fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseName: newUUID ? newUUID : 'default_db', // Enviamos el nuevo UUID o un valor por defecto
          sqlQuery: cleanedSQL,      // Sentencia SQL procesada
        }),
      });

      const result = await response.json();  // Capturamos la respuesta del servidor
      console.log(result);  // Mostramos la respuesta en la consola

      if (response.ok) {
        alert('Sentencia ejecutada con éxito.');
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
