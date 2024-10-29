import React, { useState } from 'react';
import Consola from './Consola'; 
import TableroContent from './TableroContent';
import Sqlcontent from './Sqlcontent';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'terminal' | 'sql'>('dashboard');

  return (
    <div className="wrapper">
      {/* Barra lateral */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="/" className="brand-link">
          <span className="brand-text font-weight-light">AdminLTE</span>
        </a>
        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
              {/* Opción del Dashboard */}
              <li className="nav-item">
                <a href="#" className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveSection('dashboard')}>
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Tablero</p>
                </a>
              </li>

              {/* Opción del Terminal */}
              <li className="nav-item">
                <a href="#"
                  className={`nav-link ${activeSection === 'terminal' ? 'active' : ''}`}
                  onClick={() => setActiveSection('terminal')}>
                  <i className="nav-icon fas fa-terminal"></i>
                  <p>Terminal</p>
                </a>
              </li>

              {/* Opción SQL */}
              <li className="nav-item">
                <a href="#"
                  className={`nav-link ${activeSection === 'sql' ? 'active' : ''}`}
                  onClick={() => setActiveSection('sql')}>
                  <i className="nav-icon fas fa-database"></i>
                  <p>SQL</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{activeSection === 'dashboard' ? 'Tablero' : activeSection === 'terminal' ? 'Terminal' : 'SQL'}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="container-fluid">
            {/* Renderizado condicional del contenido basado en la sección activa */}
            {activeSection === 'dashboard' && <TableroContent />}
            {activeSection === 'terminal' && <Consola />}
            {activeSection === 'sql' && <Sqlcontent />}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
