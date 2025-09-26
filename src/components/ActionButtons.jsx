import React from 'react';
import '../styles/ActionButton.css';

const ActionButtons = ({ 
  onBuyNow, 
  onPending, 
  isPending, 
  isCreatingOrder,
  onShowAuthModal, 
  isAuthenticated 
}) => {
  console.log('checking',isAuthenticated);
  
  const handleBuyNow = () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      onShowAuthModal();
      return;
    }
    onBuyNow();
  };

  const handlePendingOrder = () => {
    // Check if user is authenticated before proceeding
    if (!isAuthenticated) {
      onShowAuthModal();
      return;
    }
    onPending();  
  };

  return (
    <div className="action-buttons">
      <button 
        className={`btn secondary pending-order-button ${isPending ? 'pending-active' : ''}`}
        onClick={handlePendingOrder}
        disabled={isPending || isCreatingOrder}
      >
        <span className="pending-icon">
          {isPending ? '✓' : isCreatingOrder ? '⏳' : '⏱'}
        </span>
        <span className="pending-text">
          {isPending ? 'Added to pending orders' : isCreatingOrder ? 'Adding to pending...' : 'Add to pending orders'}
        </span>
      </button>
      <button className="btn primary" onClick={handleBuyNow}>Buy Now</button>
      {/* <button className="btn secondary">Make Enquiries</button> */}
    </div>
  );
};

export default ActionButtons;