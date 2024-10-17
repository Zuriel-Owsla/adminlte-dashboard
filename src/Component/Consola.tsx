import React, { useState, useEffect } from 'react';
import { generarUUID } from './generadorUUID';
import '../estilos.css';
import config from '../config'; // Importar el archivo de configuración

const Consola: React.FC = () => {
  const [sqlCommand, setSqlCommand] = useState('');
  const [sessionUUID, setSessionUUID] = useState<string | null>(null);

  useEffect(() => {
    let storedUUID = localStorage.getItem('sessionUUID');
    if (!storedUUID) {
      storedUUID = generarUUID();
      localStorage.setItem('sessionUUID', storedUUID); 
    }
    setSessionUUID(storedUUID); 
    console.log(`UUID de la sesión: ${storedUUID}`);
  }, []);

  const regenerateUUID = () => {
    const newUUID = generarUUID();
    localStorage.setItem('sessionUUID', newUUID);
    setSessionUUID(newUUID);
    console.log(`Nuevo UUID generado manualmente: ${newUUID}`);
  };

  const processSQL = (sql: string) => {
    const createDbRegex = /CREATE DATABASE\s+([a-zA-Z0-9_]+);?/i;
    const createTableRegex = /CREATE TABLE\s+([a-zA-Z0-9_]+)\s*\(([\s\S]+?)\);/gi;

    let modifiedSQL = sql;
    const cleanedSQLs: string[] = [];

    if (createDbRegex.test(sql)) {
      if (!sessionUUID) {
        alert('Error: No se ha generado un UUID para la sesión.');
        return null;
      }

      modifiedSQL = sql.replace(createDbRegex, `CREATE DATABASE ${sessionUUID};`);
      cleanedSQLs.push(modifiedSQL);
      return cleanedSQLs;

    } else {
      let match;
      while ((match = createTableRegex.exec(sql)) !== null) {
        const tableName = match[1];
        let columns = match[2].split(',').map(column => column.trim());

        let processedColumns: string[] = [];
        let primaryKeyColumn: string | null = null;
        let foreignKeys: string[] = [];
        let autoIncrementDetected = false;

        columns.forEach((col) => {
          const columnRegex = /([a-zA-Z0-9_]+)\s+([a-zA-Z]+(?:\(\d+\))?)(\s+NOT\s+NULL)?(\s+PRIMARY\s+KEY)?(\s+AUTO_INCREMENT)?/i;
          const foreignKeyRegex = /FOREIGN KEY\s*\(([^)]+)\)\s*REFERENCES\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i;
          
          const columnMatch = columnRegex.exec(col);
          const foreignKeyMatch = foreignKeyRegex.exec(col);

          if (foreignKeyMatch) {
            const foreignKeyColumn = foreignKeyMatch[1].trim();
            const referencedTable = foreignKeyMatch[2].trim();
            const referencedColumn = foreignKeyMatch[3].trim();

            foreignKeys.push(`FOREIGN KEY (${foreignKeyColumn}) REFERENCES ${referencedTable}(${referencedColumn})`);
          } else if (columnMatch) {
            const columnName = columnMatch[1];
            const columnType = columnMatch[2];
            const notNull = columnMatch[3] ? 'NOT NULL' : '';
            const primaryKey = columnMatch[4] ? 'PRIMARY KEY' : '';
            const autoIncrement = columnMatch[5] ? 'AUTO_INCREMENT' : '';

            let columnDefinition = `${columnName} ${columnType} ${notNull}`;

            // Si hay AUTO_INCREMENT, lo marcamos y aseguramos que sea llave primaria
            if (autoIncrement) {
              autoIncrementDetected = true;
              columnDefinition += ' AUTO_INCREMENT PRIMARY KEY';
            } else if (primaryKey) {
              primaryKeyColumn = columnName;
            }

            processedColumns.push(columnDefinition.trim());
          }
        });

        // Si hay una llave primaria sin AUTO_INCREMENT, lo agregamos al final
        if (!autoIncrementDetected && primaryKeyColumn) {
          processedColumns.push(`PRIMARY KEY (${primaryKeyColumn})`);
        }

        // Añadimos las claves foráneas al final
        processedColumns = processedColumns.concat(foreignKeys);

        const cleanedSQL = `CREATE TABLE ${tableName} (${processedColumns.join(', ')});`;
        cleanedSQLs.push(cleanedSQL);
      }

      console.log(`Sentencias SQL generadas: ${cleanedSQLs.join('\n')}`);
      return cleanedSQLs;
    }
  };

  const handleExecute = async () => {
    if (!sqlCommand) {
      alert('Por favor, ingresa una sentencia SQL válida.');
      return;
    }

    const cleanedSQLs = processSQL(sqlCommand.trim());

    if (!cleanedSQLs) return;

    try {
      for (const cleanedSQL of cleanedSQLs) {
        const response = await fetch(`${config.apiBaseUrl}`, { // usamos la url del archivo de configuración
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            databaseName: sessionUUID,
            sqlQuery: cleanedSQL,
          }),
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
          alert(`Error: ${result.message}`);
          break;
        }
      }

      alert('Sentencias SQL ejecutadas con éxito.');
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
