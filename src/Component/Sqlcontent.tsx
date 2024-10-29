import React, { useState, useEffect } from 'react';
import CreateTableForm from './CreateTableForm';
import ColumnConfig from './ColumnConfig';
import config from '../config';

const Sqlcontent: React.FC = () => {
  const [tableName, setTableName] = useState('');
  const [columnCount, setColumnCount] = useState(1);
  const [columns, setColumns] = useState<any[]>([]);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [foreignTables, setForeignTables] = useState<string[]>([]); // Para las tablas relacionadas

  // Manejar la creación de columnas y cargar tablas para llaves foráneas
  const handleCreateTable = () => {
    const newColumns = Array.from({ length: columnCount }, () => ({
      name: '',
      type: 'Texto',
      isNullable: false,
      isPrimaryKey: false,
      isUnique: false,
      isForeignKey: false,
      relatedTable: '',
      relatedColumn: '',
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    }));
    setColumns(newColumns);
    setShowColumnConfig(true);

    // Cargar las tablas para llaves foráneas
    fetch(`${config.apiBaseUrl}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'listTables', databaseName: localStorage.getItem('sessionUUID') }),
    })
      .then((response) => response.json())
      .then((data) => setForeignTables(data.tables))
      .catch((error) => console.error('Error al obtener tablas:', error));
  };

  // Manejar el cambio de los valores de cada columna
  const handleColumnChange = (index: number, key: string, value: any) => {
    const updatedColumns = [...columns];
    updatedColumns[index][key] = value;
    setColumns(updatedColumns);

    // Verificar si el formulario está configurado
    const isFormFilled = updatedColumns.some(col => col.name || col.type !== 'Texto' || col.isNullable);
    setFormFilled(isFormFilled);
  };

  // Añadir una nueva columna
  const addNewColumn = () => {
    const newColumn = {
      name: '',
      type: 'Texto',
      isNullable: false,
      isPrimaryKey: false,
      isUnique: false,
      isForeignKey: false,
      relatedTable: '',
      relatedColumn: '',
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    };
    setColumns([...columns, newColumn]);
  };

  // Eliminar la última columna
  const removeLastColumn = () => {
    if (columns.length > 0) {
      setColumns(columns.slice(0, -1));
    }
  };

  // Generar la sentencia SQL
  const generateSQL = () => {
    if (!tableName || columns.length === 0) {
      alert('Por favor, ingrese un nombre de tabla y al menos una columna.');
      return null;
    }

    let sql = `CREATE TABLE ${tableName} (`;
    const columnNamesSet = new Set();
    const foreignKeys: string[] = [];

    columns.forEach((col, idx) => {
      if (columnNamesSet.has(col.name)) {
        alert(`Error: La columna "${col.name}" está duplicada.`);
        return null;
      }

      columnNamesSet.add(col.name);
      let sqlType = '';

      switch (col.type) {
        case 'Texto': sqlType = 'VARCHAR(255)'; break;
        case 'Número': sqlType = 'INT'; break;
        case 'Fecha': sqlType = 'DATE'; break;
        case 'Fecha y Hora': sqlType = 'DATETIME'; break;
        default: sqlType = 'VARCHAR(255)';
      }

      sql += `${col.name} ${sqlType}`;
      if (!col.isNullable) {
        sql += ' NOT NULL';
      }

      // Llave primaria
      if (col.isPrimaryKey) {
        sql += ' PRIMARY KEY';
      }

      // Índice único
      if (col.isUnique) {
        sql += ' UNIQUE';
      }

    // llave foránea
    if (col.isForeignKey) {
      // construimos la clausula de la llave foranea sin on delete ni on update inicialmente
      let foreignKeyClause = `FOREIGN KEY (${col.name}) REFERENCES ${col.relatedTable}(${col.relatedColumn})`;

      // agregamos on delete solo si se selecciono una opción válida
      if (col.onDelete && col.onDelete !== 'RESTRICT') {
        foreignKeyClause += ` ON DELETE ${col.onDelete}`;
      }

      // agregamos on updatesolo si se selecciono una opción válida
      if (col.onUpdate && col.onUpdate !== 'RESTRICT') {
        foreignKeyClause += ` ON UPDATE ${col.onUpdate}`;
      }

      foreignKeys.push(foreignKeyClause);
    }


      if (idx < columns.length - 1) {
        sql += ', ';
      }
    });

    if (foreignKeys.length > 0) {
      sql += ', ' + foreignKeys.join(', ');
    }

    sql += ');';

    console.log(`Sentencia SQL generada: ${sql}`);
    return sql;
  };

  // Enviar el SQL generado al servidor
  const handleSubmit = async () => {
    const sql = generateSQL();
    if (!sql) return;

    const databaseUUID = localStorage.getItem('sessionUUID');
    if (!databaseUUID) {
      alert('Error: No se encontró el UUID de la base de datos.');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseName: databaseUUID,
          sqlQuery: sql,
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
      console.error('Error:', error);
      alert('Hubo un error al ejecutar la sentencia.');
    }
  };

  // Crear una nueva tabla y reiniciar el formulario
  const handleNewTable = () => {
    if (formFilled) {
      const confirmReset = window.confirm('¿Seguro que quieres crear una nueva tabla? Tu configuración actual se perderá.');
      if (!confirmReset) return;
    }

    setTableName('');
    setColumnCount(1);
    setColumns([]);
    setShowColumnConfig(false);
    setFormFilled(false);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Crear nueva tabla</h3>
      </div>
      <div className="card-body">
        {!showColumnConfig && (
          <CreateTableForm
            tableName={tableName}
            columnCount={columnCount}
            setTableName={setTableName}
            setColumnCount={setColumnCount}
            handleCreateTable={handleCreateTable}
          />
        )}

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
                  foreignTables={foreignTables} // Pasamos las tablas foráneas para su selección
                />
              ))}

              <button type="button" className="btn btn-success mt-3 me-3" onClick={addNewColumn}>
                Agregar nueva columna
              </button>
              <button type="button" className="btn btn-danger mt-3 me-3" onClick={removeLastColumn}>
                Quitar última columna
              </button>
              <button type="button" className="btn btn-primary mt-3" onClick={handleSubmit}>
                Crear Tabla
              </button>
              <button type="button" className="btn btn-warning mt-3 ms-3" onClick={handleNewTable}>
                Crear nueva tabla
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sqlcontent;
