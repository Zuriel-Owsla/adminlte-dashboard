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

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Crear nueva tabla</h3>
      </div>
      <div className="card-body">
        {/* Mostrar el formulario inicial solo si no se ha hecho clic en "Crear" */}
        {!showColumnConfig && (
          <CreateTableForm
            tableName={tableName}
            columnCount={columnCount}
            setTableName={setTableName}
            setColumnCount={setColumnCount}
            handleCreateTable={handleCreateTable}
          />
        )}

        {/* Mostrar el formulario de configuración de columnas si ya se ha hecho clic en "Crear" */}
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sqlcontent;
