import React from 'react';
import '../styles/InfoSection.css';

const OrderStages = ({ stages }) => {
  if (!stages || !Array.isArray(stages) || stages.length === 0) {
    return null;
  }

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

  const capitalizeText = (text) => {
    if (!text) return '-';
    return String(text).charAt(0).toUpperCase() + String(text).slice(1).toLowerCase();
  };

  return (
    <div className="info-section">
      <h3 className="info-section-title">Order Stages</h3>
      <div className="info-section-content">
        <div className="info-item">
          <div className="info-label">Stages:</div>
          <div className="info-value">
            <div className="stages-container">
              {stages.map((stage, index) => (
                <div key={index} className="stage-item">
                  <span className={`status-badge stage-badge-font ${getStageClass(stage.status)}`}>
                    {capitalizeText(stage.status)} - {formatStageDate(stage.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStages;
