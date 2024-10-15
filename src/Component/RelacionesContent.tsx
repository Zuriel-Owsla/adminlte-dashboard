import React, { useState, useEffect } from 'react';

const RelacionesContent: React.FC = () => {
  const [tablas, setTablas] = useState<string[]>([]); // aqui se guardarán las tablas de la BD
  const [tablaSeleccionada, setTablaSeleccionada] = useState(''); // tabla seleccionada por el usuario
  const [columnas, setColumnas] = useState<string[]>([]); // columnas de la tabla seleccioada
  const [columnaRelacionada, setColumnaRelacionada] = useState(''); // columna selecionada para la relación
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');

  useEffect(() => {
    // simular la obtención de tablas de la BD
    setTablas(['clientes', 'productos', 'ventas']); // simulación de tablas de una base de datos
  }, []);

  const handleTablaChange = (tabla: string) => {
    setTablaSeleccionada(tabla);
    // simular la obtención de columnas de la tabla seleccionada
    if (tabla === 'clientes') {
      setColumnas(['id', 'nombre', 'direccion']);
    } else if (tabla === 'productos') {
      setColumnas(['id', 'nombre', 'precio']);
    } else if (tabla === 'ventas') {
      setColumnas(['id', 'fecha', 'cliente_id']);
    }
  };

  const handleCrearRelacion = () => {
    if (!tablaSeleccionada || !columnaRelacionada) {
      alert('Por favor, seleccione una tabla y una columna para crear la relación.');
      return;
    }
    // Mensaje de confirmación (simulacion de la creacion de la relacion )
    setMensajeConfirmacion(`Relación creada con éxito entre la columna seleccionada y la tabla ${tablaSeleccionada}.`);
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

        {tablaSeleccionada && columnaRelacionada && (
          <button className="btn btn-primary" onClick={handleCrearRelacion}>
            Crear Relación
          </button>
        )}

        {mensajeConfirmacion && (
          <div className="alert alert-success mt-3">
            {mensajeConfirmacion}
          </div>
        )}
      </div>
    </div>
  );
};

export default RelacionesContent;
