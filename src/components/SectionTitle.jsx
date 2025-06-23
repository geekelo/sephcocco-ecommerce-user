import '../styles/SectionTitle.css'
import React from 'react';


export const SectionTitle = ({ title, seeAllLink = "#" }) => {
    return (
      <div className="section-title-container">
        <h2 className="section-title">{title}</h2>
        
      </div>
    );
  };