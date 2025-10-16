import { Minus, Plus, Loader2, MapPin } from 'lucide-react'
import React from 'react'
import '../styles/OrderSummary.css'

export default function OrderSummary({
  product,
  setAddress,
  setPhoneNumbers,
  setNotes,
  quantity,
  setQuantity,
  locations = [],

  address,
  phoneNumbers,
  notes,
  showPaymentOnMobile,
  onProceedToPayment,
  orderCreated,
  isCreatingOrder
}) {
  console.log('dd',product);
  console.log('locations', locations);
  
  const decreaseQuantity = () => {
    if (quantity > 1 && !orderCreated) {
      setQuantity(quantity - 1);
    }
  };

  const orderCost = product?.price * quantity || 0;
  // const totalCost = orderCost + deliveryCost;

  const increaseQuantity = () => {
    console.log('Increasing quantity from', quantity, 'to', quantity + 1);
    
    if (quantity < product.amount_in_stock && !orderCreated) {
      setQuantity(quantity + 1);
    }
  };



  const isFormValid = address.trim() && phoneNumbers.trim();

  const handleContinueClick = () => {
    if (orderCreated) {
      showPaymentOnMobile();
    } else {
      onProceedToPayment();
    }
  };

  return (
    <div className="order-left-column">
      <div className="checkout-section">
        <h3 className="section-title">Order Summary</h3>
        <div className="order-item">
          <div className="order-item-image">
            <img
              src={product.main_image_url}
              alt={product.name}
            />
          </div>
          <div className="order-item-details">
            <h4>{product.name}</h4>
            
            <div className="item-price-row">
              <p className="item-price">₦{parseFloat(orderCost).toFixed(2)}</p>
              <div>
                <p className="quantity-label">Total Quantity: <span className="quantity-value">{quantity}</span></p>
              </div>
            </div>
            
            {/* Fixed quantity selector with proper display */}
            <div className="quantity-selector">
              <button
                className="order-quantity-btn"
                onClick={decreaseQuantity}
                disabled={quantity <= 1 || orderCreated}
                type="button"
              >
                <Minus size={16} />
              </button>
              
              {/* Add quantity display */}
              <span className="quantity-display">{quantity}</span>
              
              <button
                className="order-quantity-btn"
                onClick={increaseQuantity}
                disabled={quantity >= product.amount_in_stock || orderCreated}
                type="button"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Stock info for debugging */}
            <p className="stock-info">
              Available: {product.amount_in_stock} | Current: {quantity}
            </p>
          </div>
        </div>
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
            disabled={orderCreated}
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
            disabled={orderCreated}
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
            disabled={orderCreated}
          />
        </div>
      </div>
{/* 

      <div className="checkout-section cost-breakdown">
        <h3 className="section-title">Cost Breakdown</h3>
        <div className="cost-row">
          <span className="cost-label">Order Cost ({quantity} item{quantity > 1 ? 's' : ''})</span>
          <span className="cost-value">₦{orderCost.toLocaleString()}</span>
        </div>
        <div className="cost-row">
          <span className="cost-label">Delivery Cost</span>
          <span className="cost-value">
            {deliveryCost > 0 ? `₦${deliveryCost.toLocaleString()}` : '₦0'}
          </span>
        </div>
        <div className="cost-row total-cost">
          <span className="cost-label">Total Cost</span>
          <span className="cost-value">₦{totalCost.toLocaleString()}</span>
        </div>
        {/* {selectedLocation && deliveryCost > 0 && (
          <p className="cost-formula">
            ₦{orderCost.toLocaleString()} + ₦{deliveryCost.toLocaleString()} = ₦{totalCost.toLocaleString()}
          </p>
        )} 
      </div>

      {/* Action button for both mobile and desktop */}
      <button
        className={`create-order-button ${!isFormValid && !orderCreated ? 'disabled' : ''}`}
        onClick={handleContinueClick}
        disabled={(!isFormValid && !orderCreated) || isCreatingOrder}
        type="button"
      >
        {isCreatingOrder ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Creating Order...
          </>
        ) : orderCreated ? (
          'Continue to Payment ➡️'
        ) : (
          'Create Order'
        )}
      </button>
    </div>
  )
}