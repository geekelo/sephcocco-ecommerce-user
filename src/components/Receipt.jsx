import React from 'react';
import '../styles/Receipt.css';

const Receipt = ({ order, onClose }) => {
    console.log('receitorder', order);
    
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-overlay">
      <div className="receipt-container">
        {/* Screen-only buttons */}
        <div className="receipt-actions no-print">
          <button className="close-receipt-btn" onClick={onClose}>
            Close
          </button>
          <button className="print-receipt-btn" onClick={handlePrint}>
            Print Receipt
          </button>
        </div>

        {/* Printable Receipt */}
        <div className="receipt-content">
          {/* Header */}
          <div className="receipt-header">
            <div className="receipt-logo">
              <img 
                src="/logo.png" 
                alt="Company Logo" 
                className="logo-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="receipt-title">ORDER RECEIPT</h1>
            <p className="receipt-subtitle">Thank you for your purchase!</p>
          </div>

          {/* Order Details */}
          <div className="receipt-section">
            <div className="receipt-row">
              <span className="receipt-label">Order ID:</span>
              <span className="receipt-value">#{order.id}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Order Date:</span>
              <span className="receipt-value">{formatDate(order.created_at || order.order_date)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Delivery Date:</span>
              <span className="receipt-value">{formatDate(order.payment_details?.updated_at || order.completed_at)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status:</span>
              <span className="receipt-value receipt-status">{order.status}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">Customer Information</h2>
            <div className="receipt-row">
              <span className="receipt-label">Name:</span>
              <span className="receipt-value">{order?.customer?.name || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Phone:</span>
              <span className="receipt-value">{order.customer.phone_number || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Address:</span>
              <span className="receipt-value">{order.customer.address || 'N/A'}</span>
            </div>
          </div>

          {/* Product Information */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">Product Details</h2>
            <div className="receipt-product">
              <div className="receipt-product-image">
                {order.product?.main_image_url && (
                  <img 
                    src={order.product.main_image_url} 
                    alt={order.product?.name || 'Product'} 
                  />
                )}
              </div>
              <div className="receipt-product-details">
                <div className="receipt-product-name">{order.product?.name || 'Product'}</div>
                <div className="receipt-row">
                  <span className="receipt-label">Unit Price:</span>
                  <span className="receipt-value">₦{parseFloat(order.unit_price || 0).toFixed(2)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Quantity:</span>
                  <span className="receipt-value">{order.quantity || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">Payment Details</h2>
            <div className="receipt-row">
              <span className="receipt-label">Payment Method:</span>
              <span className="receipt-value">{order.payment_details?.payment_method || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Payment Status:</span>
              <span className="receipt-value">{order.payment_details?.status || 'N/A'}</span>
            </div>
            {order.payment_details?.transaction_id && (
              <div className="receipt-row">
                <span className="receipt-label">Transaction ID:</span>
                <span className="receipt-value">{order.payment_details.transaction_id}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="receipt-total-section">
            <div className="receipt-total-row">
              <span className="receipt-total-label">TOTAL AMOUNT:</span>
              <span className="receipt-total-value">₦{parseFloat(order.total_price || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="receipt-footer">
            <p className="receipt-footer-text">
              Thank you for shopping with us!
            </p>
            <p className="receipt-footer-text">
              For support, please contact us or visit our help center.
            </p>
            <p className="receipt-footer-small">
              This is a computer-generated receipt and does not require a signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;