import React, { useState } from 'react';

const LanguageSelection: React.FC = () => {
  const [language, setLanguage] = useState<string | null>(null);
  const [architecture, setArchitecture] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setArchitecture(null); // restablecer la arquitectura cuando cambia el idioma
  };

  const handleArchitectureChange = (selectedArchitecture: string) => {
    setArchitecture(selectedArchitecture);
    setShowSaveModal(true); // Mostrar el modal de guardar
  };
  const handleGoBack = () => {
    setLanguage(null); // restablecer la selección del lenguaje
    setArchitecture(null);
  };

  const handleSave = () => {
    setShowSaveModal(false);
    alert(`Configuración guardada: ${language} - ${architecture}`);
  };

  const handleCancel = () => {
    setShowSaveModal(false); // Cerramos el modal al presionar cancelar
  };

  return (
    <div>
      {/* Modal de selección de lenguaje y arquitectura */}
      {!showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-language-architecture">
  <h2>Configura tu proyecto</h2>

  {!language && (
    <div className="language-selection">
      <button onClick={() => handleLanguageChange('Java')}>
        <img src="/assets/java.svg" alt="Java Logo" />
        Java
      </button>
      <button onClick={() => handleLanguageChange('PHP')}>
        <img src="/assets/php_logo.svg" alt="PHP Logo" />
        PHP
      </button>
    </div>
  )}

{language && (
  <div className="architecture-selection">
    <h3>Selecciona la arquitectura para {language}</h3>
    {language === 'Java' && (
      <>
        <button onClick={() => handleArchitectureChange('MVC')} className="architecture-btn">MVC</button>
        <button onClick={() => handleArchitectureChange('API Rest')} className="architecture-btn">API Rest</button>
      </>
    )}
    {language === 'PHP' && (
      <>
        <button onClick={() => handleArchitectureChange('MVC')} className="architecture-btn">MVC</button>
        <button onClick={() => handleArchitectureChange('Standalone')} className="architecture-btn">Standalone</button>
      </>
    )}
    <button onClick={handleGoBack} className="btn btn-secondary back-button">
      <i className="fas fa-arrow-left"></i> 
    </button>
  </div>
)}

</div>

        </div>
      )}

      {/* Modal de confirmación */}
      {showSaveModal && (
         <>
        {/* Fondo oscuro con blur */}
        <div
        className="modal-backdrop fade show custom-backdrop"
        ></div>

        {/* Modal */}
        <div className="modal fade show" style={{ display: 'block' }} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Guardar Configuración</h5>
                <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCancel}
                ></button>
            </div>
            <div className="modal-body">
                <p>
                ¿Estás seguro de que deseas guardar esta configuración?
                <br />
                <strong>Lenguaje:</strong> {language}
                <br />
                <strong>Arquitectura:</strong> {architecture}
                </p>
            </div>
            <div className="modal-footer">
                <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                >
                Cancelar
                </button>
                <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                >
                Aceptar
                </button>
            </div>
            </div>
        </div>
        </div>
    </>
    )}
    </div>
  );
};

export default LanguageSelection;
