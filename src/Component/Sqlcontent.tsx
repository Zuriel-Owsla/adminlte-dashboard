import React, { useState } from 'react';

const Sqlcontent: React.FC = () => {
  const [tableName, setTableName] = useState('');
  const [columnCount, setColumnCount] = useState(1); // Por defecto, comenzamos con una columna

  // Función para manejar la creación de la tabla (de momento no hará nada)
  const handleCreateTable = () => {
    console.log(`Nombre de la tabla: ${tableName}`);
    console.log(`Número de columnas: ${columnCount}`);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Crear nueva tabla</h3>
      </div>
      <div className="card-body">
        <form>
          <div className="form-group">
            <label htmlFor="tableName">Nombre de la tabla</label>
            <input
              type="text"
              className="form-control"
              id="tableName"
              placeholder="Ingrese el nombre de la tabla"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="columnCount">Número de columnas</label>
            <input
              type="number"
              className="form-control"
              id="columnCount"
              min="1"
              value={columnCount}
              onChange={(e) => setColumnCount(parseInt(e.target.value))}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={handleCreateTable}
          >
            Crear
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sqlcontent;
