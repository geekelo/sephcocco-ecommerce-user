import React from 'react';
import '../styles/ActionButton.css';

const ActionButtons = ({ onBuyNow }) => {
  const handleBuyNow = () => {
  
    onBuyNow();
  };

  return (
    <div className="action-buttons">
      <button className="btn primary" onClick={handleBuyNow}>Buy Now</button>
      <button className="btn secondary">Make Enquiries</button>
    </div>
  );
};

export default ActionButtons;