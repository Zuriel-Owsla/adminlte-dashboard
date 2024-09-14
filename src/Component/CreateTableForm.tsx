import React from 'react';

interface CreateTableFormProps {
  tableName: string;
  columnCount: number;
  setTableName: (name: string) => void;
  setColumnCount: (count: number) => void;
  handleCreateTable: () => void;
}

const CreateTableForm: React.FC<CreateTableFormProps> = ({ tableName, columnCount, setTableName, setColumnCount, handleCreateTable }) => {
  return (
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
  );
};

export default CreateTableForm;
