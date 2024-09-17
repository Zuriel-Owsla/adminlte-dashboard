import React, { useState } from 'react';
import CreateTableForm from './CreateTableForm';
import ColumnConfig from './ColumnConfig';

const Sqlcontent: React.FC = () => {
  const [tableName, setTableName] = useState('');
  const [columnCount, setColumnCount] = useState(1); // Número de columnas
  const [columns, setColumns] = useState<any[]>([]); // Array para almacenar las columnas
  const [showColumnConfig, setShowColumnConfig] = useState(false); // Controlar la visibilidad del formulario de columnas

  // Tipos de datos disponibles para las columnas
  const dataTypes = ['INT', 'VARCHAR', 'TEXT', 'DATE', 'BOOLEAN'];

  // Manejar la creación de las columnas y ocultar el formulario inicial
  const handleCreateTable = () => {
    // Inicializamos un array de columnas vacío con el número de columnas deseado
    const newColumns = Array.from({ length: columnCount }, () => ({
      name: '',
      type: 'INT',
      length: '',
      defaultValue: 'NULL',
      isPrimary: false,
      isAutoIncrement: false,
    }));
    setColumns(newColumns); // Guardamos las columnas generadas
    setShowColumnConfig(true); // Mostramos el formulario de configuración de columnas
  };

  // Manejar el cambio de los valores de cada columna
  const handleColumnChange = (index: number, key: string, value: any) => {
    const updatedColumns = [...columns];
    updatedColumns[index][key] = value;
    setColumns(updatedColumns); // Actualizamos el estado de las columnas
  };

  // Manejar la adición de nuevas columnas (Para que el sistema sea Dinamico)
  const addNewColumn = () => {
    const newColumn = {
      name: '',
      type: 'INT',
      length: '',
      defaultValue: 'NULL',
      isPrimary: false,
      isAutoIncrement: false,
    };
    setColumns([...columns, newColumn]); // Agregamos una nueva columna al array de columnas
  };

  // Manejar la eliminación de la última columna
  const removeLastColumn = () => {
    if (columns.length > 0) {
      setColumns(columns.slice(0, -1)); // Eliminar la última columna del array
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
                  dataTypes={dataTypes}
                  handleColumnChange={handleColumnChange}
                />
              ))}

              {/* boton para agregar nueva columna */}
              <button
                type="button"
                className="btn btn-success mt-3 me-3"
                onClick={addNewColumn}
              >
                Agregar nueva columna
              </button>

              {/* boton para quitar la última columna */}
              <button
                type="button"
                className="btn btn-danger mt-3"
                onClick={removeLastColumn}
              >
                Quitar última columna
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sqlcontent;
