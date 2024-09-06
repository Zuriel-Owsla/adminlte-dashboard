import React from 'react';
import '../estilos.css'


const Consola: React.FC = () => {
  return (
    <div>
      <textarea
        className="form-control custom-textarea" // CSS
        rows={10}
        placeholder="Escribe tus sentencias SQL aquí..."
        ></textarea>
        <button className="btn btn-primary mt-3">Ejecutar</button> 
    </div>
  );
};

export default Consola
