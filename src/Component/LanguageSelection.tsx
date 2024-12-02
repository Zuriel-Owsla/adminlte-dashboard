import React, { useState, useEffect } from 'react';
import { generarUUID } from './generadorUUID';

interface LanguageSelectionProps {
  sessionUUID: string | null;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ sessionUUID }) => {
  const [storedUUID, setStoredUUID] = useState<string | null>(sessionStorage.getItem('sessionUUID'));
  const [language, setLanguage] = useState<string | null>(null);
  const [architecture, setArchitecture] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showLanguageArchitectureModal, setShowLanguageArchitectureModal] = useState<boolean>(false);

  useEffect(() => {
    if (sessionUUID && sessionUUID !== storedUUID) {
      sessionStorage.setItem('sessionUUID', sessionUUID);
      setStoredUUID(sessionUUID);
  
      // reiniciamos los estados relevantes para el flujo del modal
      setLanguage(null);
      setArchitecture(null);
      setShowSaveModal(false);
      setShowLanguageArchitectureModal(true);
    }
  }, [sessionUUID, storedUUID]);
  

  const handleRegenerateUUID = () => {
    const newUUID = generarUUID();
    sessionStorage.setItem('sessionUUID', newUUID);
    setStoredUUID(newUUID);
    setLanguage(null);
    setArchitecture(null);
    setShowSaveModal(false);
    setShowLanguageArchitectureModal(true);
  };  

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setArchitecture(null);
  };

  const handleArchitectureChange = (selectedArchitecture: string) => {
    setArchitecture(selectedArchitecture);
    setShowSaveModal(true);
  };

  const handleSave = () => {
    if (storedUUID && language && architecture) {
      localStorage.setItem(
        'projectConfig',
        JSON.stringify({ sessionUUID: storedUUID, language, architecture })
      );
      console.log(`Configuración guardada: UUID=${storedUUID}, Lenguaje=${language}, Arquitectura=${architecture}`);
      alert(`Configuración guardada: ${language} - ${architecture}`);
      setShowLanguageArchitectureModal(false);
      setShowSaveModal(false);
    } else {
      console.error('No se pudo guardar la configuración. Verifica los valores.');
    }
  };

  const handleCancel = () => {
    // reiniciamos los estados relevantes para el flujo del modal
    setLanguage(null);
    setArchitecture(null);
    setShowSaveModal(false);
    setShowLanguageArchitectureModal(true);
  };
  

  return (
    <div>
      {showLanguageArchitectureModal && !showSaveModal && (
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
            {language !== null && !architecture && (
              <div className="architecture-selection">
                <h3>Selecciona la arquitectura para {language}</h3>
                {language === 'Java' && (
                  <>
                    <button
                      onClick={() => handleArchitectureChange('MVC')}
                      className="architecture-btn"
                    >
                      MVC
                    </button>
                    <button
                      onClick={() => handleArchitectureChange('API Rest')}
                      className="architecture-btn"
                    >
                      API Rest
                    </button>
                  </>
                )}
                {language === 'PHP' && (
                  <>
                    <button
                      onClick={() => handleArchitectureChange('MVC')}
                      className="architecture-btn"
                    >
                      MVC
                    </button>
                    <button
                      onClick={() => handleArchitectureChange('Standalone')}
                      className="architecture-btn"
                    >
                      Standalone
                    </button>
                  </>
                )}
                <button
                  onClick={() => setLanguage(null)}
                  className="btn btn-secondary back-button"
                >
                  <i className="fas fa-arrow-left"></i> Regresar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {showSaveModal && (
        <>
          <div className="modal-backdrop fade show custom-backdrop"></div>
          <div className="modal fade show" style={{ display: 'block' }} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Guardar Configuración</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleCancel}></button>
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
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSave}>
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