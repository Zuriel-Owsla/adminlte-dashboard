import React, { useState } from 'react';
import './customStyles.css'; 

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'terminal'>('dashboard');

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
                <a
                  href="#"
                  className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveSection('dashboard')} // Cambia a Dashboard
                >
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </a>
              </li>

              {/* Opción del Terminal */}
              <li className="nav-item">
                <a
                  href="#"
                  className={`nav-link ${activeSection === 'terminal' ? 'active' : ''}`}
                  onClick={() => setActiveSection('terminal')} // Cambiamos a Terminal
                >
                  <i className="nav-icon fas fa-terminal"></i>
                  <p>Terminal</p>
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
                <h1>{activeSection === 'dashboard' ? 'Dashboard' : 'Terminal'}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="container-fluid">
            {/* Renderizado condicional del contenido basado en el estado activo */}
            {activeSection === 'dashboard' ? (
              <div className="row">
                {/* Contenido del Dashboard */}
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>150</h3>
                      <p>New Orders</p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <a href="/" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right"></i>
                    </a>
                  </div>
                </div>
                <div className="col-lg-3 col-6">
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>53%</h3>
                      <p>Bounce Rate</p>
                    </div>
                    <div className="icon">
                      <i className="fas fa-chart-bar"></i>
                    </div>
                    <a href="/" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // Al seleccionar Terminal
              <div className="row">
                <div className="col-12">
                  <textarea
                    className="form-control custom-textarea" // CSS
                    rows={10}
                    placeholder="Escribe tus sentencias SQL aquí..."
                  ></textarea>
                  <button className="btn btn-primary mt-3">Ejecutar</button> 
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
