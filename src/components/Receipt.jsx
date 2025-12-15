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
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Build the complete HTML for the receipt
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: #fff;
              color: #333;
            }
            
            .receipt-content {
              max-width: 800px;
              margin: 0 auto;
            }
            
            .receipt-header {
              text-align: center;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 2px solid #ff6b35;
            }
            
            .logo-image {
              max-width: 150px;
              height: auto;
              margin-bottom: 10px;
            }
            
            .receipt-title {
              font-size: 18px;
              font-weight: 700;
              color: #ff6b35;
              margin: 10px 0;
              letter-spacing: 1px;
            }
            
            .receipt-subtitle {
              font-size: 14px;
              color: #666;
              margin: 5px 0 0 0;
            }
            
            .receipt-section {
              margin-bottom: 10px;
              padding: 10px 0;
              border-bottom: 1px solid #e0e0e0;
            }
            
            .receipt-section:last-of-type {
              border-bottom: none;
            }
            
            .receipt-section-title {
              font-size: 16px;
              font-weight: 600;
              color: #ff6b35;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .receipt-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 4px 0;
            }
            
            .receipt-label {
              font-weight: 500;
              color: #666;
              font-size: 14px;
            }
            
            .receipt-value {
              font-weight: 400;
              color: #333;
              font-size: 14px;
              text-align: right;
             
            }
            
            .receipt-status {
              color: #4caf50;
              font-weight: 600;
              text-transform: capitalize;
            }
            
            .receipt-product {
              display: flex;
              gap: 15px;
              padding: 10px 0;
            }
            
            .receipt-product-image {
              width: 40px;
              height: 40px;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #e0e0e0;
              flex-shrink: 0;
            }
            
            .receipt-product-image img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .receipt-product-details {
              flex: 1;
            }
            
            .receipt-product-name {
              font-weight: 600;
              font-size: 15px;
              color: #333;
              margin-bottom: 8px;
            }
            
            .receipt-total-section {
              margin: 10px 0 10px;
              padding: 10px;
              background-color: #f9f9f9;
              border-radius: 8px;
              border: 2px solid #ff6b35;
            }
            
            .receipt-total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .receipt-total-label {
              font-size: 18px;
              font-weight: 700;
              color: #333;
              letter-spacing: 0.5px;
            }
            
            .receipt-total-value {
              font-size: 24px;
              font-weight: 700;
              color: #ff6b35;
            }
            
            .receipt-footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
            
            .receipt-footer-text {
              font-size: 14px;
              color: #666;
              margin: 5px 0;
            }
            
            .receipt-footer-small {
              font-size: 11px;
              color: #999;
              margin-top: 15px;
              font-style: italic;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .receipt-total-section {
                background-color: #f9f9f9 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .receipt-title,
              .receipt-section-title,
              .receipt-total-value {
                color: #ff6b35 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .receipt-status {
                color: #4caf50 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-content">
            <!-- Header -->
            <div class="receipt-header">
              <div class="receipt-logo">
                <img 
                  src="/logo.png" 
                  alt="Company Logo" 
                  class="logo-image"
                  onerror="this.style.display='none'"
                />
              </div>
              <h1 class="receipt-title">ORDER RECEIPT</h1>
              <p class="receipt-subtitle">Thank you for your purchase!</p>
            </div>

            <!-- Order Details -->
            <div class="receipt-section">
              <div class="receipt-row">
                <span class="receipt-label">Order ID:</span>
                <span class="receipt-value">#${order?.id || 'N/A'}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Order Date:</span>
                <span class="receipt-value">${formatDate(order?.created_at || order?.order_date)}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Delivery Date:</span>
                <span class="receipt-value">${formatDate(order?.payment_details?.updated_at || order?.completed_at)}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Status:</span>
                <span class="receipt-value receipt-status">${order?.status || 'N/A'}</span>
              </div>
            </div>

            <!-- Product Information -->
            <div class="receipt-section">
              <h2 class="receipt-section-title">Product Details</h2>
              <div class="receipt-product">
                <div class="receipt-product-image">
                  ${order?.product?.main_image_url ? 
                    `<img src="${order.product.main_image_url}" alt="${order.product?.name || 'Product'}" />` 
                    : ''}
                </div>
                <div class="receipt-product-details">
                  <div class="receipt-product-name">${order?.product?.name || 'Product'}</div>
                  <div class="receipt-row">
                    <span class="receipt-label">Unit Price:</span>
                    <span class="receipt-value">₦${parseFloat(order?.unit_price || 0).toFixed(2)}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Quantity:</span>
                    <span class="receipt-value">${order?.quantity || 1}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Information -->
            <div class="receipt-section">
              <h2 class="receipt-section-title">Payment Details</h2>
              <div class="receipt-row">
                <span class="receipt-label">Payment Method:</span>
                <span class="receipt-value" style="text-transform: capitalize;">${order?.payment_details?.payment_method || 'N/A'}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">Payment Status:</span>
                <span class="receipt-value" style="text-transform: capitalize;">${order?.payment_details?.status || 'N/A'}</span>
              </div>
              ${order?.payment_details?.transaction_id ? `
                <div class="receipt-row">
                  <span class="receipt-label">Transaction ID:</span>
                  <span class="receipt-value">${order.payment_details.transaction_id}</span>
                </div>
              ` : ''}
            </div>

            <!-- Total -->
            <div class="receipt-total-section">
              <div class="receipt-total-row">
                <span class="receipt-total-label">TOTAL AMOUNT:</span>
                <span class="receipt-total-value">₦${parseFloat(order?.total_price || 0).toFixed(2)}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="receipt-footer">
              <p class="receipt-footer-text">
                Thank you for shopping with us!
              </p>
              <p class="receipt-footer-text">
                For support, please contact us or visit our help center.
              </p>
              <p class="receipt-footer-small">
                This is a computer-generated receipt and does not require a signature.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    // Write the HTML to the new window
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Wait for images to load before printing
    printWindow.onload = function() {
           printWindow.print();
    };
  };

  return (
    <div className="receipt-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
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
              <span className="receipt-value">#{order?.id}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Order Date:</span>
              <span className="receipt-value">{formatDate(order?.created_at || order?.order_date)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Delivery Date:</span>
              <span className="receipt-value">{formatDate(order?.payment_details?.updated_at || order?.completed_at)}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status:</span>
              <span className="receipt-value receipt-status">{order?.status}</span>
            </div>
          </div>

          {/* Product Information */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">Product Details</h2>
            <div className="receipt-product">
              <div className="receipt-product-image">
                {order.product?.main_image_url && (
                  <img 
                    src={order?.product?.main_image_url} 
                    alt={order?.product?.name || 'Product'} 
                  />
                )}
              </div>
              <div className="receipt-product-details">
                <div className="receipt-product-name">{order.product?.name || 'Product'}</div>
                <div className="receipt-row">
                  <span className="receipt-label">Unit Price:</span>
                  <span className="receipt-value">₦{parseFloat(order?.unit_price || 0).toFixed(2)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Quantity:</span>
                  <span className="receipt-value">{order?.quantity || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">Payment Details</h2>
            <div className="receipt-row">
              <span className="receipt-label">Payment Method:</span>
              <span className="receipt-value" style={{textTransform: 'capitalize'}}>{order?.payment_details?.payment_method || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Payment Status:</span>
              <span className="receipt-value" style={{textTransform: 'capitalize'}}>{order?.payment_details?.status || 'N/A'}</span>
            </div>
            {order?.payment_details?.transaction_id && (
              <div className="receipt-row">
                <span className="receipt-label">Transaction ID:</span>
                <span className="receipt-value" >{order?.payment_details?.transaction_id}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="receipt-total-section">
            <div className="receipt-total-row">
              <span className="receipt-total-label">TOTAL AMOUNT:</span>
              <span className="receipt-total-value">₦{parseFloat(order?.total_price || 0).toFixed(2)}</span>
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