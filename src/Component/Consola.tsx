import React, { useState } from 'react';
import { generarUUID } from './generadorUUID'; 
import '../estilos.css';

const Consola: React.FC = () => {
  const [sqlCommand, setSqlCommand] = useState('');

  // Función para limpiar y reemplazar el nombre de la base de datos
  const processSQL = (sql: string) => {
    // Expresión regular para identificar la sentencia CREATE DATABASE
    const createDbRegex = /CREATE DATABASE\s+([a-zA-Z0-9_]+);?/i;
    const createTableRegex = /CREATE TABLE\s+([a-zA-Z0-9_]+)\s*\((.+)\);?/i;

    if (createDbRegex.test(sql)) {
      // Generamos un nuevo UUID para cada CREATE DATABASE
      const newUUID = generarUUID();
      console.log(`Generando nuevo UUID para la base de datos: ${newUUID}`);
      // Guardamos el UUID en sessionStorage para esta sesión
      sessionStorage.setItem('currentDatabaseUUID', newUUID);
      const cleanedSQL = sql.replace(createDbRegex, `CREATE DATABASE ${newUUID};`);
      return { cleanedSQL, newUUID };
    } else if (createTableRegex.test(sql)) {
      // Si el usuario intenta crear una tabla
      const databaseUUID = sessionStorage.getItem('currentDatabaseUUID');
      if (!databaseUUID) {
        alert('Por favor, crea una base de datos primero.');
        return { cleanedSQL: null, newUUID: null };
      }

      // Procesamos la sentencia de CREATE TABLE y asignamos tipos de datos predeterminados
      const match = createTableRegex.exec(sql);
      if (!match) {
        alert('Error: Formato de CREATE TABLE no válido.');
        return { cleanedSQL: null, newUUID: null };
      }

      const tableName = match[1];
      let columns = match[2].split(',').map(column => column.trim());

      // Almacenamos las columnas procesadas
      let processedColumns: string[] = [];
      let foreignKeys: string[] = []; // Para almacenar las llaves foráneas
      let columnNames: Set<string> = new Set(); // Para rastrear las columnas y evitar duplicados

      // Procesamos las columnas de llaves foráneas primero para asegurar que se manejen correctamente
      columns.forEach((col) => {
        const foreignKeyRegex = /FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i;
        const foreignKeyMatch = foreignKeyRegex.exec(col);

        if (foreignKeyMatch) {
          const foreignKeyColumn = foreignKeyMatch[1].trim(); // Columna que será llave foránea
          const referencedTable = foreignKeyMatch[2].trim(); // Tabla referenciada
          const referencedColumn = foreignKeyMatch[3].trim(); // Columna referenciada

          // Añadimos la columna y la llave foránea solo si no se ha añadido antes
          if (!columnNames.has(foreignKeyColumn)) {
            processedColumns.push(`${foreignKeyColumn} INT`); // Aseguramos que la columna sea INT
            foreignKeys.push(`FOREIGN KEY (${foreignKeyColumn}) REFERENCES ${referencedTable}(${referencedColumn})`);
            columnNames.add(foreignKeyColumn); // Marcamos que esta columna ya ha sido agregada
          }
        }
      });

      // Procesamos el resto de las columnas
      columns.forEach((col, idx) => {
        // No procesamos las columnas que ya son llaves foráneas
        if (!columnNames.has(col)) {
          // Primera columna es la llave primaria (INT AUTO_INCREMENT)
          if (idx === 0) {
            processedColumns.push(`${col} INT AUTO_INCREMENT PRIMARY KEY`);
          } else {
            // Para las demás columnas asumimos VARCHAR(255), excepto las llaves foráneas
            processedColumns.push(`${col} VARCHAR(255)`);
          }
          columnNames.add(col); // Marcamos que la columna ha sido agregada
        }
      });

      // Añadimos las llaves foráneas al final de las columnas procesadas
      processedColumns = processedColumns.concat(foreignKeys);

      const cleanedSQL = `CREATE TABLE ${tableName} (${processedColumns.join(', ')});`;
      console.log(`Sentencia SQL modificada: ${cleanedSQL}`);
      return { cleanedSQL, newUUID: databaseUUID };
    }

    return { cleanedSQL: sql, newUUID: null }; // Si no es CREATE DATABASE o CREATE TABLE
  };

  const handleExecute = async () => {
    if (!sqlCommand) {
      alert('Por favor, ingresa una sentencia SQL válida.');
      return;
    }

    // Procesamos la sentencia SQL
    const { cleanedSQL, newUUID } = processSQL(sqlCommand.trim());

    if (!cleanedSQL) return;

    try {
      const response = await fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseName: newUUID, // Enviamos el UUID de la base de datos actual
          sqlQuery: cleanedSQL,  // Sentencia SQL procesada
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
