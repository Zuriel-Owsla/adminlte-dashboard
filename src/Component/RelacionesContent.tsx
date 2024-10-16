import React, { useState, useEffect } from 'react';

const RelacionesContent: React.FC = () => {
  const [tablas, setTablas] = useState<string[]>([]); // aquí se guardarán las tablas de la BD
  const [tablaSeleccionada, setTablaSeleccionada] = useState(''); // tabla seleccionada por el usuario
  const [columnas, setColumnas] = useState<string[]>([]); // columnas de la tabla seleccionada
  const [columnaRelacionada, setColumnaRelacionada] = useState(''); // columna seleccionada para la relación
  const [tablaForanea, setTablaForanea] = useState(''); // Tabla a la cual se relacionará
  const [columnasForanea, setColumnasForanea] = useState<string[]>([]); // Columnas de la tabla foránea
  const [columnaForanea, setColumnaForanea] = useState(''); // Columna seleccionada de la tabla foránea
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [error, setError] = useState('');

  // obtener UUID de la sesión
  const sessionUUID = localStorage.getItem('sessionUUID');

  useEffect(() => {
    if (sessionUUID) {
      // obtener las tablas de la base de datos con el UUID actual
      fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'listTables',
          databaseName: sessionUUID, // mandamos el UUID como nombre de la base de datos
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.tables) {
            setTablas(data.tables); // establecemos las tablas que nos devuelve el servidor
          } else {
            setError('Error al obtener las tablas.');
          }
        })
        .catch((error) => {
          setError('Error en la conexión con el servidor.');
          console.error('Error:', error);
        });
    }
  }, [sessionUUID]);

  // obtener columnas de la tabla seleccionada
  const handleTablaChange = (tabla: string) => {
    setTablaSeleccionada(tabla);
    if (sessionUUID && tabla) {
      fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'listColumns',
          databaseName: sessionUUID,
          tableName: tabla,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.columns) {
            setColumnas(data.columns); // establecemos las columnas de la tabla
          } else {
            setError('Error al obtener las columnas.');
          }
        })
        .catch((error) => {
          setError('Error en la conexión al obtener las columnas.');
          console.error('Error:', error);
        });
    }
  };

  // obtener columnas de la tabla foránea seleccionada
  const handleTablaForaneaChange = (tabla: string) => {
    setTablaForanea(tabla);
    if (sessionUUID && tabla) {
      fetch('http://localhost/crear_tablas.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'listColumns',
          databaseName: sessionUUID,
          tableName: tabla,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.columns) {
            setColumnasForanea(data.columns); // establecemos las columnas de la tabla foránea
          } else {
            setError('Error al obtener las columnas de la tabla foránea.');
          }
        })
        .catch((error) => {
          setError('Error en la conexión al obtener las columnas.');
          console.error('Error:', error);
        });
    }
  };

  const handleCrearRelacion = () => {
    if (!tablaSeleccionada || !columnaRelacionada || !tablaForanea || !columnaForanea) {
      setError('Por favor, seleccione la tabla y columna para la relación.');
      return;
    }

    // simular la validación de tipos de datos compatibles
    if (columnaRelacionada === 'id' && columnaForanea === 'nombre') {
      setError('Error: No se pueden relacionar columnas de tipos de datos diferentes.');
      return;
    }

    // resetear el error si las columnas son compatibles
    setError('');
    setMensajeConfirmacion(
      `Relación creada con éxito entre la columna ${columnaRelacionada} de la tabla ${tablaSeleccionada} 
      y la columna ${columnaForanea} de la tabla ${tablaForanea}.`
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Gestionar Relaciones</h3>
      </div>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="tabla">Selecciona una tabla</label>
          <select
            id="tabla"
            className="form-control"
            value={tablaSeleccionada}
            onChange={(e) => handleTablaChange(e.target.value)}
          >
            <option value="">-- Selecciona una tabla --</option>
            {tablas.map((tabla) => (
              <option key={tabla} value={tabla}>
                {tabla}
              </option>
            ))}
          </select>
        </div>

        {tablaSeleccionada && (
          <div className="form-group">
            <label htmlFor="columna">Selecciona una columna para relacionar</label>
            <select
              id="columna"
              className="form-control"
              value={columnaRelacionada}
              onChange={(e) => setColumnaRelacionada(e.target.value)}
            >
              <option value="">-- Selecciona una columna --</option>
              {columnas.map((columna) => (
                <option key={columna} value={columna}>
                  {columna}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* segunda parte: Seleccionar la tabla foránea y su columna */}
        {tablaSeleccionada && (
          <>
            <hr />
            <div className="form-group">
              <label htmlFor="tablaForanea">Selecciona la tabla con la que se relacionará</label>
              <select
                id="tablaForanea"
                className="form-control"
                value={tablaForanea}
                onChange={(e) => handleTablaForaneaChange(e.target.value)}
              >
                <option value="">-- Selecciona una tabla foránea --</option>
                {tablas.map((tabla) => (
                  <option key={tabla} value={tabla}>
                    {tabla}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {tablaForanea && (
          <div className="form-group">
            <label htmlFor="columnaForanea">Selecciona una columna de la tabla foránea</label>
            <select
              id="columnaForanea"
              className="form-control"
              value={columnaForanea}
              onChange={(e) => setColumnaForanea(e.target.value)}
            >
              <option value="">-- Selecciona una columna --</option>
              {columnasForanea.map((columna) => (
                <option key={columna} value={columna}>
                  {columna}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* boton para crear relación */}
        {tablaForanea && columnaForanea && (
          <button className="btn btn-primary" onClick={handleCrearRelacion}>
            Crear Relación
          </button>
        )}

        {/* mensje de confirmación */}
        {mensajeConfirmacion && (
          <div className="alert alert-success mt-3">{mensajeConfirmacion}</div>
        )}

        {/* mensaje de error */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default RelacionesContent;
