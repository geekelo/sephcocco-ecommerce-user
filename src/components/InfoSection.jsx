import React from 'react';
import '../styles/InfoSection.css';

const InfoSection = ({ title, items }) => {
  return (
    <div className="info-section">
      <h3 className="info-section-title">{title}</h3>
      
      <div className="info-section-content">
        {items.map((item, index) => (
          <div key={index} className="info-item">
            <div className="info-label">{item.label}</div>
            <div className="info-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;