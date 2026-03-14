import { CheckCircle, CreditCard, Landmark, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import BankDetails from './BankDetails';
import PaymentSuccessModal from './PaymentSuccessModal';
import PaystackPayment from './PaystackButton';

import { usePayment } from '../hooks/usePayment';
import { usePaymentVerify } from '../hooks/usePaymentVerify';
import '../styles/PaymentPaymentMethod.css';
import '../styles/OrderSummary.css'
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser';
import { AuthModals } from './AuthModal';

export default function PaymentPaymentMethod({
  product,
  quantity,
  onPaymentComplete,
  locations,
  totalCost,
  selectedOrders,
}) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // New state for verification
     const [deliveryCost, setDeliveryCost] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const totalAmount = totalCost + deliveryCost;
 
  
  const { mutateAsync: payment } = usePayment();
  const { mutateAsync: paymentVerify } = usePaymentVerify();


  const transactionId = localStorage.getItem('pay-ref');
  const activeOutlet = getActiveOutlet();
  const activeUser = localStorage.getItem('userEmail');
  

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
  // Handle bank payment
  const handleBankPayment = async () => {
    if (!checkAuthentication()) return;
    if (!paymentMethod) return;

    setIsProcessing(true);
    setIsVerifying(true); // Start verification state

    const orderIds = selectedOrders?.map(order => order.id);

    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: orderIds,
        amount: totalAmount,
         delivery_location_id: selectedLocation,
        payment_method: 'bank',
        transaction_id: transactionId,
      },
    };

    try {
      await payment({ active_outlet: activeOutlet, payload });
      setIsVerifying(false); // End verification state before success
      // alert('Bank transfer recorded. Your order is now pending verification.');
      onPaymentComplete?.(); 
    } catch (error) {
      console.error('Payment failed:', error);
      setIsVerifying(false); // End verification state before error
     alert('Payment failed. Please try again: ' + (error.response?.data.error || 'Something went wrong'));
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
      // Now record the payment in your system
      const orderIds = selectedOrders?.map(order => order.id);
      const paymentPayload = {
        [`sephcocco_${activeOutlet}_payment`]: {
          orders_ids: orderIds,
          amount: totalAmount,
          payment_method: 'online',
          transaction_id: response.reference,
           delivery_location_id: selectedLocation,
          paystack_reference: response.reference,
          status: response.status
        }
      };
      
      const res = await payment({ active_outlet: activeOutlet, payload: paymentPayload });
      console.log('payment created', res);
      
      const verificationResult = await paymentVerify({ active_outlet: activeOutlet, payload: verifyPayload });
      console.log('payment verify', verificationResult);
      
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
      setIsVerifying(false); // End verification state before error alert
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
    const orderIds = selectedOrders?.map(order => order.id).join('_');
    return `${orderIds}_${Date.now()}`;
  };

  console.log('okk', selectedOrders?.[0]);

  // Get user email from multiple sources
  const getUserEmail = () => {
    return activeUser || '';
  };

  // Handle auth success
  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    // Optionally refresh user data or trigger any needed updates
  };

  // Handle closing auth modals
  const handleCloseAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <>
      <div className="payment-right-column">
        <div className="payment-checkout-section payment-method-section">
              {/* Location Dropdown */}
        <div className="form-group">
           <h3 className="payment-section-title">  Delivery Location <span style={{color: 'red' }}>*</span></h3>
   
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            required
            className="location-select"
          >
            <option value="" >Select delivery location </option>
            {locations?.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location} - ₦{parseFloat(location.logistics_price).toLocaleString()}
              </option>
            ))}
          </select>
       
        </div>
          <h3 className="payment-section-title">Payment Method</h3>
          <div className="payment-options">
            <div
              className={`payment-option ${paymentMethod === 'bank' ? 'payment-selected-option' : ''} ${isVerifying ? 'disabled' : ''}`}
              onClick={isVerifying ? undefined : handleBankTransfer}
              style={{ opacity: isVerifying ? 0.6 : 1, cursor: isVerifying ? 'not-allowed' : 'pointer' }}
            >
              <div className="payment-option-inner">
                <div className="payment-option-icon">
                  <Landmark size={24} />
                </div>
                <div className="payment-option-label">Bank Transfer</div>
                {paymentMethod === 'bank' && (
                  <div className="payment-selected-indicator">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            </div>

            <div
              className={`payment-option ${paymentMethod === 'online' ? 'payment-selected-option' : ''} ${isVerifying ? 'disabled' : ''}`}
              onClick={isVerifying ? undefined : handleOnlinePayment}
              style={{ opacity: isVerifying ? 0.6 : 1, cursor: isVerifying ? 'not-allowed' : 'pointer' }}
            >
              <div className="payment-option-inner">
                <div className="payment-option-icon">
                  <CreditCard size={24} />
                </div>
                <div className="payment-option-label">Online Payment</div>
                {paymentMethod === 'online' && (
                  <div className="payment-selected-indicator">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="payment-checkout-section payment-total-section">
          <div className="payment-total-row">
            <span>Subtotal</span>
            <span>₦{parseFloat(totalCost).toLocaleString()}</span>
          </div>
              <div className="payment-total-row">
             <span>Delivery Cost </span>
            <span> {deliveryCost > 0 ? `₦${deliveryCost.toLocaleString()}` : '₦0'}</span>
          </div>
             
          <div className="payment-total-row payment-grand-total">
            <span>Total</span>
            <span>₦{parseFloat(totalAmount).toLocaleString()}</span>
          </div>
        </div>

        {paymentMethod === 'bank' && showBankDetails && <BankDetails transactionId={transactionId} />}

        {/* Conditional rendering based on payment method */}
        {paymentMethod === 'bank' ? (
          <>  
            <button
              className="payment-checkout-button"
              disabled={isProcessing || isVerifying || selectedLocation === ''}
              onClick={handleBankPayment}
            >
              {isProcessing  ? 'Verifying Payment...' : 'I have paid'}
            </button>
            {selectedLocation === '' && <small style={{color: 'red'}}>Please select your delivery location above</small>}
          </>
        ) : paymentMethod === 'online' ? (
          <div className="">
            <PaystackPayment
              email={getUserEmail()}
              amount={totalAmount}
              reference={generatePaystackReference()}
              onSuccess={handlePaystackSuccess}
              onClose={handlePaystackClose}
              disabled={isProcessing || isVerifying || selectedLocation === ''}
            />
          </div>
        ) : (
          <button
            className="payment-checkout-button payment-disabled"
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
  );
}