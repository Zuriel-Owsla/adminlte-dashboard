import React from 'react';

const Tutorial: React.FC = () => {
  return (
    <div className="row">
      {/* Flecha apuntando al widget de Tutorial */}
      <div className="col-4 text-center arrow-container">
        <i className="fas fa-arrow-left arrow-tutorial"></i>
        <p className="arrow-tutorial-text">Tutorial</p>
      </div>

      {/* Flecha apuntando al widget de Terminal */}
      <div className="col-4 text-center arrow-container">
        <i className="fas fa-arrow-left arrow-terminal"></i>
        <p className="arrow-terminal-text">Terminal</p>
      </div>

      {/* Flecha apuntando al widget de SQL */}
      <div className="col-4 text-center arrow-container">
        <i className="fas fa-arrow-left arrow-sql"></i>
        <p className="arrow-sql-text">SQL</p>
      </div>
    </div>
  );
};

export default Tutorial;
