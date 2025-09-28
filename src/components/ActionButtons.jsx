import React from 'react';
import '../styles/ActionButton.css';

const ActionButtons = ({ 
  onBuyNow, 
  onPending, 
  isCreatingOrder,
  isAddedToPending,
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

  // Determine button state
  const getButtonState = () => {
    if (isAddedToPending) {
      return {
        icon: '✓',
        text: 'Added to pending orders',
        className: 'success-active',
        disabled: false
      };
    } else if (isCreatingOrder) {
      return {
        icon: '⏳',
        text: 'Adding to pending...',
        className: 'creating-active',
        disabled: true
      };
    } else {
      return {
        icon: '⏱',
        text: 'Add to pending orders',
        className: '',
        disabled: false
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="action-buttons">
      <button 
        className={`btn secondary pending-order-button ${buttonState.className}`}
        onClick={handlePendingOrder}
        disabled={buttonState.disabled}
      >
        <span className="pending-icon">
          {buttonState.icon}
        </span>
        <span className="pending-text">
          {buttonState.text}
        </span>
      </button>
      <button className="btn primary" onClick={handleBuyNow}>Buy Now</button>
      {/* <button className="btn secondary">Make Enquiries</button> */}
    </div>
  );
};

export default ActionButtons;