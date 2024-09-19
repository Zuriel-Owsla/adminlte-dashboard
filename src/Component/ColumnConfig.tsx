import React, { useState, useEffect } from 'react';

interface ColumnConfigProps {
  index: number;
  column: any;
  handleColumnChange: (index: number, key: string, value: any) => void;
}

const ColumnConfig: React.FC<ColumnConfigProps> = ({
  index,
  column,
  handleColumnChange,
}) => {
  const [hasError, setHasError] = useState(false); // Para manejar la validación

  useEffect(() => {
    // Validar cuando el componente se monta o actualiza
    if (!column.name) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [column.name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!newValue) {
      setHasError(true); // Mostrar error si el nombre está vacío
    } else {
      setHasError(false); // Quitar error si se introduce un nombre
    }
    handleColumnChange(index, 'name', newValue);
  };

  const dataTypes = ['Texto', 'Número', 'Fecha', 'Fecha y Hora'];

  return (
    <div className="row mb-3">
      {/* Nombre de la columna */}
      <div className="col-md-4">
        <input
          type="text"
          className={`form-control ${hasError ? 'is-invalid' : ''}`} // Aplicar estilo de error
          placeholder="Nombre de la columna"
          value={column.name}
          onChange={handleNameChange} // Validar nombre de la columna
        />
        {hasError && (
          <div className="invalid-feedback">
            Por favor, ingrese un nombre para la columna.
          </div>
        )}
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
