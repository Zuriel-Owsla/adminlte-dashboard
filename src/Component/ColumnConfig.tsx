import React from 'react';

interface ColumnConfigProps {
  index: number;
  column: any;
  dataTypes: string[];
  handleColumnChange: (index: number, key: string, value: any) => void;
}

const ColumnConfig: React.FC<ColumnConfigProps> = ({ index, column, dataTypes, handleColumnChange }) => {
  return (
    <div className="row mb-3">
      {/* Nombre de la columna */}
      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre"
          value={column.name}
          onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
        />
      </div>

      {/* Tipo de dato */}
      <div className="col-md-2">
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

      {/* Longitud */}
      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          placeholder="Longitud"
          value={column.length}
          onChange={(e) => handleColumnChange(index, 'length', e.target.value)}
        />
      </div>

      {/* Valor por defecto */}
      <div className="col-md-2">
        <select
          className="form-control"
          value={column.defaultValue}
          onChange={(e) => handleColumnChange(index, 'defaultValue', e.target.value)}
        >
          <option value="NULL">NULL</option>
          <option value="CURRENT_TIMESTAMP">CURRENT_TIMESTAMP</option>
        </select>
      </div>

      {/* Checkbox para llave primaria */}
      <div className="col-md-2">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={column.isPrimary}
            onChange={(e) => handleColumnChange(index, 'isPrimary', e.target.checked)}
          />
          <label className="form-check-label">Primaria</label>
        </div>
      </div>

      {/* Checkbox para auto-increment */}
      <div className="col-md-2">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={column.isAutoIncrement}
            onChange={(e) => handleColumnChange(index, 'isAutoIncrement', e.target.checked)}
          />
          <label className="form-check-label">Auto-increment</label>
        </div>
      </div>
    </div>
  );
};

export default ColumnConfig;
