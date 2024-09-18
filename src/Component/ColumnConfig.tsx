import React from 'react';

interface ColumnConfigProps {
  index: number;
  column: any;
  handleColumnChange: (index: number, key: string, value: any) => void;
}

const ColumnConfig: React.FC<ColumnConfigProps> = ({ index, column, handleColumnChange }) => {
  // Definir tipos de datos 
  const dataTypes = ['Texto', 'Número', 'Fecha', 'Fecha y Hora'];

  return (
    <div className="row mb-3">
      {/* Nombre de la columna */}
      <div className="col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre"
          value={column.name}
          onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
        />
      </div>

      {/* Tipo de dato */}
      <div className="col-md-4">
        <select
          className="form-control"
          value={column.type}
          onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
        >
          {dataTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Checkbox para null */}
      <div className="col-md-4">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={column.isNullable}
            onChange={(e) => handleColumnChange(index, 'isNullable', e.target.checked)}
          />
          <label className="form-check-label">Nulo</label>
        </div>
      </div>
    </div>
  );
};

export default ColumnConfig;
