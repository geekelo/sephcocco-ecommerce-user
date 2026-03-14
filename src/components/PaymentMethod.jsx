import { CheckCircle, CreditCard, Landmark, Copy, MapPin,Check, AlertTriangle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import BankDetails from './BankDetails'

import '../styles/PaymentMethod.css'
import { usePayment } from '../hooks/usePayment';
import { usePaymentVerify } from '../hooks/usePaymentVerify';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser';
import PaystackPayment from './PaystackButton';
import { AuthModals } from './AuthModal';
import '../styles/OrderSummary.css'
export default function PaymentMethod({address, totalCost,orderCost, locations,   selectedLocation,
  setSelectedLocation,
  deliveryCost,
  setDeliveryCost, selectedOrders, product, quantity, orderId, onPaymentComplete, userEmail}) {

  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state for verification
  
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const activeOutlet = getActiveOutlet()
  const activeUser = localStorage.getItem('userEmail')

  
  const { mutateAsync: payment } = usePayment()
  const { mutateAsync: paymentVerify } = usePaymentVerify()
  const transactionId = localStorage.getItem('pay-ref')
  
  // Prevent page close during verification
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isVerifying) {
        e.preventDefault();
        e.returnValue = 'Payment is being verified. Please do not close this page.';
        return 'Payment is being verified. Please do not close this page.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isVerifying]);
  
  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token || !userEmail) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };
    // Handle location change
const handleLocationChange = (e) => {
  const locationId = e.target.value;
  setSelectedLocation(locationId);

  const selectedLoc = locations?.find(
    (loc) => String(loc.id) === String(locationId)
  );

  if (selectedLoc) {
    const cost = parseFloat(selectedLoc.logistics_price || 0);
    console.log('Selected location:', selectedLoc.location, 'Cost:', cost);
    setDeliveryCost(cost);
  } else {
    setDeliveryCost(0);
  }
};

  const handleBankTransfer = () => {
    if (!checkAuthentication()) return;
    
    setPaymentMethod('bank');
    setShowBankDetails(true);
  };
  
  const handleOnlinePayment = () => {
    if (!checkAuthentication()) return;
    
    setPaymentMethod('online');
    setShowBankDetails(false);
  };

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBankPayment = async () => {
    if (!checkAuthentication()) return;
    
    setIsProcessing(true);
    setIsVerifying(true); // Start verification state
    
    // Fixed: Handle both single product and multiple selected orders
    const orderIds = [orderId];
    
    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: orderIds,
        amount: Number(totalCost),
         delivery_location_id: selectedLocation,
        payment_method: 'bank',
        transaction_id: transactionId 
      }
    };
    
    console.log('Bank Payment Payload:', payload);
    
    try {
      const result = await payment({ active_outlet: activeOutlet, payload: payload });
      console.log('Bank payment result:', result);
      setIsVerifying(false);

      onPaymentComplete?.();
    } catch (error) {
      console.error('Payment failed:', error);
      setIsVerifying(false); // End verification state before alert
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle successful Paystack payment
  const handlePaystackSuccess = async (response) => {
    if (!checkAuthentication()) return;
    
    console.log('Paystack payment successful:', response);
    
    setIsProcessing(true);
    setIsVerifying(true); // Start verification state
    
    // Verify payment with Paystack first
    const verifyPayload = {
      reference: response.reference
    };

    try {
      // Fixed: Handle both single product and multiple selected orders for Paystack
      const orderIds = [orderId];
      
      console.log('Processing payment for order IDs:', orderIds);
      
      const paymentPayload = {
        [`sephcocco_${activeOutlet}_payment`]: {
          orders_ids: orderIds,
          amount: Number(totalCost),
          delivery_location_id: selectedLocation,
          payment_method: 'online',
          transaction_id: response.reference,
          paystack_reference: response.reference,
          status: response.status
        }
      };
      
      console.log('Paystack Payment Payload:', paymentPayload);
      
      const paymentResult = await payment({ active_outlet: activeOutlet, payload: paymentPayload });
      console.log('Payment created:', paymentResult);
      
      const verificationResult = await paymentVerify({ active_outlet: activeOutlet, payload: verifyPayload });
      console.log('Payment verification result:', verificationResult);
      
      setIsVerifying(false); // End verification state before alerts
      
      if (verificationResult.payment.status) {
        console.log("Payment verified ✅");
        // alert('Payment successful! Your order has been confirmed.');
        onPaymentComplete?.();
      } else {
        console.log("Payment verification failed ❌");
        alert('Payment verification failed. Please contact support with reference: ' + response.reference);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setIsVerifying(false); // End verification state before alert
      alert('Payment successful but verification failed. Please contact support with reference: ' + response.reference);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Paystack payment closure/cancellation
  const handlePaystackClose = () => {
    console.log('Paystack payment closed');
  };

  // Generate a unique reference for Paystack
  const generatePaystackReference = () => {
    return `${orderId}_${Date.now()}`;
  };

  // Get user email from multiple sources with proper priority
  const getEmailForPayment = () => {
    return activeUser || userEmail || '';
  };

  // Handle auth success
  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Handle closing auth modals
  const handleCloseAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  // Fixed: Calculate display information based on available data
  const getOrderDisplayInfo = () => {
    if (selectedOrders && selectedOrders.length > 0) {
      const totalItems = selectedOrders.reduce((sum, order) => sum + (order.quantity || quantity || 1), 0);
      return {
        itemCount: selectedOrders.length,
        totalItems: totalItems,
        displayText: selectedOrders.length > 1 ? `${selectedOrders.length} items` : selectedOrders[0]?.name || product?.name
      };
    }
    
    return {
      itemCount: 1,
      totalItems: quantity || 1,
      displayText: product?.name || 'Product'
    };
  };

  const orderInfo = getOrderDisplayInfo();

  return (
    <>
      <div className="order-right-column">

        <div className="checkout-section payment-section">
            <div className="order-status-info">
            <div className="order-id-container">
              {/* <p className='order-id'>
                <strong>Order Number:</strong> {orderId}
                <button 
                  className="copy-button-order"
                  onClick={handleCopyOrderId}
                  title={copied ? 'Copied!' : 'Copy Order ID'}
                >
                  {copied ? <Check size={16} color='#000' /> : <Copy size={16} color='#000' />}
                </button>
              </p> */}
            </div>
            <p><small>✅ Order created successfully</small></p>
            <p><small>📦 {orderInfo.displayText} (Qty: {orderInfo.totalItems})</small></p>
          </div>
                     {/* Location Dropdown */}
        <div className="form-group">
               <h3 className="section-title">Delivery Location <span style={{color: 'red' }}>*</span></h3>
        
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            required
            className="location-select"
          >
            <option value="">Select delivery location </option>
            {locations?.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location} - ₦{parseFloat(location.logistics_price).toLocaleString()}
              </option>
            ))}
          </select>
       
        </div>
          <h3 className="section-title">Payment Method</h3>
          
        
          
          <div className="payment-options">
     
            <div 
              className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''} ${isVerifying ? 'disabled' : ''}`}
              onClick={isVerifying ? undefined : handleBankTransfer}
              style={{ opacity: isVerifying ? 0.6 : 1, cursor: isVerifying ? 'not-allowed' : 'pointer' }}
            >
              <div className="payment-option-inner">
                <div className="payment-option-icon">
                  <Landmark size={24} />
                </div>
                <div className="payment-option-label">Bank Transfer / Cash </div>
                {paymentMethod === 'bank' && (
                  <div className="payment-selected">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            </div>
            
            <div 
              className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''} ${isVerifying ? 'disabled' : ''}`}
              onClick={isVerifying ? undefined : handleOnlinePayment}
              style={{ opacity: isVerifying ? 0.6 : 1, cursor: isVerifying ? 'not-allowed' : 'pointer' }}
            >
              <div className="payment-option-inner">
                <div className="payment-option-icon">
                  <CreditCard size={24} />
                </div>
                <div className="payment-option-label">Online Payment</div>
                {paymentMethod === 'online' && (
                  <div className="payment-selected">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
 
        <div className="checkout-section order-total-section">
          <div className="order-total-row">
            <span>Subtotal ({orderInfo.totalItems} item{orderInfo.totalItems > 1 ? 's' : ''})</span>
            <span>₦{parseFloat(orderCost || 0).toFixed(2)}</span>
          </div>
            <div className="order-total-row">
            <span>Delivery Cost </span>
            <span> {deliveryCost > 0 ? `₦${deliveryCost.toLocaleString()}` : '₦0'}</span>
          </div>
          <div className="order-total-row grand-total">
            <span>Total</span>
            <span>₦{parseFloat(totalCost || 0).toFixed(2)}</span>
          </div>
        </div>

        {paymentMethod === 'bank' && showBankDetails && (
          <BankDetails transactionId={transactionId}/>
        )}

        {/* Conditional rendering based on payment method */}
        {paymentMethod === 'bank' ? (
          <button 
            className="checkout-button"
            onClick={handleBankPayment}
            disabled={isProcessing || isVerifying || selectedLocation === ''}
          >
            {isProcessing ? 'Verifying Payment...' : 'I have paid'}
          </button>
        ) : paymentMethod === 'online' ? (
          <div className="paystack-button-container">
            <PaystackPayment
              email={getEmailForPayment()} 
              amount={totalCost}
              reference={generatePaystackReference()}
              onSuccess={handlePaystackSuccess}
              onClose={handlePaystackClose}
              disabled={isProcessing || isVerifying || selectedLocation === ''}
            />
          </div>
        ) : (
          <button 
            className="checkout-button disabled"
            disabled
          >
             {selectedLocation === '' ? 'Select Delivery Location' : 'Select Payment Method'}
          </button>
        )}
      </div>

      {/* Payment Verification Modal */}
      {isVerifying && (
        <div className="verification-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div className="verification-modal" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '450px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              backgroundColor: '#f39c12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={30} color="white" />
            </div>
            
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
              color: '#333'
            }}>
              Payment Verification in Progress
            </h3>
            
            <p style={{
              fontSize: '16px',
              lineHeight: '1.5',
              margin: '0 0 24px 0',
              color: '#666'
            }}>
              We are currently verifying your payment. This process may take a few moments.
            </p>
   
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#666'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #f39c12',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span>Processing...</span>
            </div>
            
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}