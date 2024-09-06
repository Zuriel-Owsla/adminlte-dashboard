import React from 'react'

const TableroContent: React.FC = () => {
  return (
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
  );
};

export default TableroContent;
