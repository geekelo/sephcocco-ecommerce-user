import React from 'react';
import '../styles/ActionButton.css';

const ActionButtons = ({ onBuyNow, onPending, isPending }) => {
  const handleBuyNow = () => {
  
    onBuyNow();
  };
  const handlePendingOrder = () => {
  
    onPending();  
  };
  return (
    <div className="action-buttons">
           <button 
              className={` btn secondary pending-order-button ${isPending ? 'pending-active' : ''}`}
              onClick={handlePendingOrder}
              disabled={isPending}
            >
              <span className="pending-icon">
                {isPending ? '✓' : '⏱'}
              </span>
              <span className="pending-text">
                {isPending ? 'Added to pending orders' : 'Add to pending orders'}
              </span>
            </button>
      <button className="btn primary" onClick={handleBuyNow}>Buy Now</button>
      {/* <button className="btn secondary">Make Enquiries</button> */}
    </div>
  );
};

export default ActionButtons;