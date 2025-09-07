import React from 'react';
import '../styles/InfoSection.css';

const InfoSection = ({ title, items }) => {
  
  // Helper function to format stage dates
  const formatStageDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // Helper function to get stage status class for styling
  const getStageClass = (stage) => {
    const stageString = String(stage || '').toLowerCase();
    
    switch (stageString) {
      case 'completed':
      case 'shipped':
      case 'delivered':
        return 'status-completed';
      case 'delivering':
      case 'confirmed':
        return 'status-processing';
      case 'pending':
      case 'awaiting':
      case 'awaiting payment approval':
        return 'status-pending';
      case 'cancelled':
      case 'rejected':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const capitalizeText = (text) => {
    if (!text) return '-';
    return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
  };

  // Function to render stages with dates
  const renderStages = (stages) => {
    if (!stages || !Array.isArray(stages) || stages.length === 0) {
      return <span>No stages available</span>;
    }
    
    return (
      <div className="stages-container">
        {stages.map((stageObj, index) => (
          <div key={index} className="stage-item">
            <span className={`status-badge ${getStageClass(stageObj.status)}`}>
              {capitalizeText(stageObj.status)} -  {formatStageDate(stageObj.date)}
            </span>
         
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="info-section">
      <h3 className="info-section-title">{title}</h3>
      
      <div className="info-section-content">
        {items.map((item, index) => (
          <div key={index} className="info-item">
            <div className="info-label">{item.label}</div>
            <div className="info-value">
              {item.isStages ? (
                renderStages(item.value)
              ) : (
                item.value
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;