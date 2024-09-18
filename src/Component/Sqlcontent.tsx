import React, { useState } from 'react';
import CreateTableForm from './CreateTableForm';
import ColumnConfig from './ColumnConfig';

const Sqlcontent: React.FC = () => {
  const [tableName, setTableName] = useState('');
  const [columnCount, setColumnCount] = useState(1); // Número de columnas
  const [columns, setColumns] = useState<any[]>([]); // Array para almacenar las columnas
  const [showColumnConfig, setShowColumnConfig] = useState(false); // Controlar la visibilidad del formulario de columnas

  // Manejar la creación de las columnas y ocultar el formulario inicial
  const handleCreateTable = () => {
    const newColumns = Array.from({ length: columnCount }, () => ({
      name: '',
      type: 'Texto', // Predeterminado a 'Texto'
      isNullable: false, // Checkbox para indicar si es null
    }));
    setColumns(newColumns); // guardamos las columnas generadas
    setShowColumnConfig(true); // mostramos el formulario de configuraciin de las columnas
  };

  // Manejar el cambio de los valores de cada columna
  const handleColumnChange = (index: number, key: string, value: any) => {
    const updatedColumns = [...columns];
    updatedColumns[index][key] = value;
    setColumns(updatedColumns); // actualizamos el estado de las columnas
  };

  // Manejar la adición de nuevas columnas (Para que el sistema sea Dinamico)
  const addNewColumn = () => {
    const newColumn = {
      name: '',
      type: 'Texto', // Predeterminado a 'Texto'
      isNullable: false,
    };
    setColumns([...columns, newColumn]); // Agregamos una nueva columna al array de columnas
  };

  // Manejar la eliminación de la última columna
  const removeLastColumn = () => {
    if (columns.length > 0) {
      setColumns(columns.slice(0, -1)); // Eliminar la última columna del array
    }
  };

  // Función para generar el SQL para crear la tabla
  const generateSQL = () => {
    if (!tableName || columns.length === 0) {
      alert('Por favor, ingrese un nombre de tabla y al menos una columna.');
      return null;
    }

    // Iniciar la sentencia SQL
    let sql = `CREATE TABLE ${tableName} (`;

    // Set para verificar duplicados en los nombres de columnas
    const columnNamesSet = new Set();

    // Recorrer las columnas y agregar sus nombres y tipos al SQL
    columns.forEach((col, idx) => {
      if (columnNamesSet.has(col.name)) {
        alert(`Error: La columna "${col.name}" está duplicada.`);
        return null; // Terminar la ejecución si hay duplicados
      }
      
      columnNamesSet.add(col.name); // Añadir el nombre de la columna al set

      let sqlType = '';

      switch (col.type) {
        case 'Texto': sqlType = 'VARCHAR(255)'; break;
        case 'Número': sqlType = 'INT'; break;
        case 'Fecha': sqlType = 'DATE'; break;
        case 'Fecha y Hora': sqlType = 'DATETIME'; break;
        default: sqlType = 'VARCHAR(255)'; // Valor predeterminado
      }      

        // para cada columna, agregamos su nombre y tipo de dato al SQL
        sql += `${col.name} ${sqlType}`;

        // Si la columna no permite valores nulos, agregamos not null
        if (!col.isNullable) {
          sql += ' NOT NULL';
        }

        // Si no es la última columna, agregaremos una , para el SQL
        if (idx < columns.length - 1) {
          sql += ', ';
        }
      });


    sql += ');'; // Cerrar la sentencia

    console.log(`Sentencia SQL generada: ${sql}`);
    return sql;
  };

  // función para enviar la sentencia SQL al backend
  const handleSubmit = async () => {
    const sql = generateSQL();
    if (!sql) return;

    // obtenemos el UUID de la base de datos del localStorage
    const databaseUUID = localStorage.getItem('sessionUUID');
    if (!databaseUUID) {
      alert('Error: No se encontró el UUID de la base de datos.');
      return;
    }

    try {
      const response = await fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseName: databaseUUID, 
          sqlQuery: sql, // Enviar la sentencia SQL generada
        }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert('Tabla creada con éxito.');
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
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Crear nueva tabla</h3>
      </div>
      <div className="card-body">
        {/* Mostramos el formulario inicial solo si no se ha hecho clic en "Crear" */}
        {!showColumnConfig && (
          <CreateTableForm
            tableName={tableName}
            columnCount={columnCount}
            setTableName={setTableName}
            setColumnCount={setColumnCount}
            handleCreateTable={handleCreateTable}
          />
        )}

        {/* Mostramos el formulario de configuración de columnas si ya se ha dado clic en "crear" */}
        {showColumnConfig && (
          <div className="mt-4">
            <h4>Configurar columnas</h4>
            <form>
              {columns.map((col, index) => (
                <ColumnConfig
                  key={index}
                  index={index}
                  column={col}
                  handleColumnChange={handleColumnChange}
                />
              ))}

              {/* Botón para agregar nueva columna */}
              <button
                type="button"
                className="btn btn-success mt-3 me-3"
                onClick={addNewColumn}
              >
                Agregar nueva columna
              </button>

              {/* Botón para quitar la última columna */}
              <button
                type="button"
                className="btn btn-danger mt-3 me-3"
                onClick={removeLastColumn}
              >
                Quitar última columna
              </button>

              {/* Botón para crear la tabla */}
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleSubmit}
              >
                Crear Tabla
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sqlcontent;
