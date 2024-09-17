import React, { useState, useEffect } from 'react';
import { generarUUID } from './generadorUUID'; 
import '../estilos.css';

const Consola: React.FC = () => {
  const [sqlCommand, setSqlCommand] = useState('');
  const [sessionUUID, setSessionUUID] = useState<string | null>(null);

  // Al cargar el componente, generamos o recuperamos el UUID de localStorage
  useEffect(() => {
    let storedUUID = localStorage.getItem('sessionUUID');
    
    if (!storedUUID) {
      storedUUID = generarUUID();
      localStorage.setItem('sessionUUID', storedUUID); 
    }
    
    setSessionUUID(storedUUID); 
    console.log(`UUID de la sesión: ${storedUUID}`);
  }, []);

  // Función para regenerar el UUID manualmente
  const regenerateUUID = () => {
    const newUUID = generarUUID();
    localStorage.setItem('sessionUUID', newUUID);
    setSessionUUID(newUUID);
    console.log(`Nuevo UUID generado manualmente: ${newUUID}`);
  };

  // Función para limpiar y reemplazar el nombre de la base de datos
  const processSQL = (sql: string) => {
    const createDbRegex = /CREATE DATABASE\s+([a-zA-Z0-9_]+);?/i;
    const createTableRegex = /CREATE TABLE\s+([a-zA-Z0-9_]+)\s*\((.+)\);?/i;

    if (createDbRegex.test(sql)) {
      if (!sessionUUID) {
        alert('Error: No se ha generado un UUID para la sesión.');
        return { cleanedSQL: null, newUUID: null };
      }

      const cleanedSQL = sql.replace(createDbRegex, `CREATE DATABASE ${sessionUUID};`);
      return { cleanedSQL, newUUID: sessionUUID };

    } else if (createTableRegex.test(sql)) {
      if (!sessionUUID) {
        alert('Error: No se ha generado un UUID para la sesión.');
        return { cleanedSQL: null, newUUID: null };
      }

      const match = createTableRegex.exec(sql);
      if (!match) {
        alert('Error: Formato de CREATE TABLE no válido.');
        return { cleanedSQL: null, newUUID: null };
      }

      const tableName = match[1];
      let columns = match[2].split(',').map(column => column.trim());

      let processedColumns: string[] = [];
      let foreignKeys: string[] = []; 
      let columnNames: Set<string> = new Set(); 

      columns.forEach((col) => {
        const foreignKeyRegex = /FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i;
        const foreignKeyMatch = foreignKeyRegex.exec(col);

        if (foreignKeyMatch) {
          const foreignKeyColumn = foreignKeyMatch[1].trim(); 
          const referencedTable = foreignKeyMatch[2].trim(); 
          const referencedColumn = foreignKeyMatch[3].trim(); 

          if (!columnNames.has(foreignKeyColumn)) {
            processedColumns.push(`${foreignKeyColumn} INT`); 
            foreignKeys.push(`FOREIGN KEY (${foreignKeyColumn}) REFERENCES ${referencedTable}(${referencedColumn})`);
            columnNames.add(foreignKeyColumn); 
          }
        }
      });

      columns.forEach((col, idx) => {
        if (!columnNames.has(col)) {
          if (idx === 0) {
            processedColumns.push(`${col} INT AUTO_INCREMENT PRIMARY KEY`);
          } else {
            processedColumns.push(`${col} VARCHAR(255)`);
          }
          columnNames.add(col); 
        }
      });

      processedColumns = processedColumns.concat(foreignKeys);

      const cleanedSQL = `CREATE TABLE ${tableName} (${processedColumns.join(', ')});`;
      console.log(`Sentencia SQL modificada: ${cleanedSQL}`);
      return { cleanedSQL, newUUID: sessionUUID };
    }

    return { cleanedSQL: sql, newUUID: null }; 
  };

  const handleExecute = async () => {
    if (!sqlCommand) {
      alert('Por favor, ingresa una sentencia SQL válida.');
      return;
    }

    const { cleanedSQL, newUUID } = processSQL(sqlCommand.trim());

    if (!cleanedSQL) return;

    try {
      const response = await fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseName: newUUID, 
          sqlQuery: cleanedSQL,  
        }),
      });

      const result = await response.json();  
      console.log(result);  

      if (response.ok) {
        alert('Sentencia ejecutada con éxito.');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
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
        className="form-control custom-textarea" 
        rows={10}
        placeholder="Escribe tus sentencias SQL aquí..."
        value={sqlCommand}
        onChange={(e) => setSqlCommand(e.target.value)}
      ></textarea>
      <button className="btn btn-primary mt-3 custom-button" onClick={handleExecute}>Ejecutar</button>
      <button className="btn btn-secondary mt-3 custom-button" onClick={regenerateUUID}>Regenerar UUID</button>
    </div>
  );
};

export default Consola;
