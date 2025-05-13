import { Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';
import '../styles/OrderSummary.css';

export default function PaymentOrderSummary({
  product,
  setAddress,
  quantity,
  setQuantity,
  address,
  showPaymentOnMobile,
  selectedOrders
}) {
  const [notes, setNotes] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stockCount) {
      setQuantity(quantity + 1);
    }
  };
  
  return (
    <div className="order-left-column">
      <div className="checkout-section">
        <h3 className="section-title">Order Summary</h3>
        
        {/* If we have selected orders, show them individually */}
        {selectedOrders && selectedOrders.length > 0 ? (
          <div className="order-items">
            {selectedOrders.map((order) => (
              <div className="order-item" key={order.id}>
                <div className="order-item-image">
                  <img
                    src={order.image}
                    alt={order.name}
                  />
                </div>
                <div className="order-item-details">
                  <h4>{order.name}</h4>
                  
                  <div className="item-price-row">
                    <p className="item-price">${order.price.toFixed(2)}</p>
                    <div>
                      <p className="quantity-label">Quantity: <span className="quantity-value">{order.quantity}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Otherwise, show the single product
          <div className="order-item">
            <div className="order-item-image">
              <img
                src={product.images[0]}
                alt={product.name}
              />
            </div>
            <div className="order-item-details">
              <h4>{product.name}</h4>
              
              <div className="item-price-row">
                <p className="item-price">${product.price.toFixed(2)}</p>
                <div>
                  <p className="quantity-label">Total Quantity: <span className="quantity-value">{quantity}</span></p>
                </div>
              </div>
              
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                
                <button
                  className="quantity-btn"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stockCount}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="checkout-section">
        <h3 className="section-title">Delivery Information</h3>
        <div className="form-group">
          <label htmlFor="address">Delivery Address *</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your complete delivery address"
            rows={3}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumbers">Active Phone Numbers *</label>
          <textarea
            id="phoneNumbers"
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
            placeholder="Enter phone numbers separated by commas"
            rows={2}
            required
          />
          <small className="phone-note">You may receive a call to discuss delivery fees if needed.</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions for delivery"
            rows={2}
          />
        </div>
      </div>
      
      {/* Next button for mobile */}
      <button
        className="next-button-mobile"
        onClick={showPaymentOnMobile}
      >
        Continue to Payment
      </button>
    </div>
  );
}