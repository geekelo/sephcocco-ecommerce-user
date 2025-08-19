import { CheckCircle, CreditCard, Landmark } from 'lucide-react';
import React, { useState } from 'react';
import BankDetails from './BankDetails';
import PaymentSuccessModal from './PaymentSuccessModal';
import PaystackPayment from './PaystackButton';

import { usePayment } from '../hooks/usePayment';
import { usePaymentVerify } from '../hooks/usePaymentVerify'; // Add this import
import '../styles/PaymentPaymentMethod.css';

import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser'; // Add this import

export default function PaymentPaymentMethod({
  product,
  quantity,
  onPaymentComplete,
  selectedOrders,
}) {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
 
  const { mutateAsync: payment } = usePayment();
  const { mutateAsync: paymentVerify } = usePaymentVerify(); // Add this hook

  const transactionId = localStorage.getItem('pay-ref');
  const activeOutlet = getActiveOutlet();
  const activeUser = getActiveUser(); // Get active user data
  console.log('act', activeOutlet);

  const itemTotal =
    selectedOrders?.reduce((sum, order) => {
      const cost = Number(order.total_cost || order.price * order.quantity || 0);
      return sum + cost;
    }, 0) || 0;

  const totalCost = itemTotal;

  const handleBankTransfer = () => {
    setPaymentMethod('bank');
    setShowBankDetails(true);
  };

  const handleOnlinePayment = () => {
    setPaymentMethod('online');
    setShowBankDetails(false);
  };

  // Handle bank payment
  const handleBankPayment = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);

    const orderIds = selectedOrders?.map(order => order.id);

    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: orderIds,
        amount: totalCost,
        payment_method: 'bank',
        transaction_id: transactionId,
      },
    };

    try {
      await payment({ active_outlet: activeOutlet, payload });
      alert('Bank transfer recorded. Your order is now pending verification.');
      onPaymentComplete?.(); 
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle successful Paystack payment
  const handlePaystackSuccess = async (response) => {
    console.log('Paystack payment successful:', response);
    
    setIsProcessing(true);
    
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
            amount: totalCost,
            payment_method: 'online',
            transaction_id: response.reference,
            paystack_reference: response.reference,
            status: response.status
          }
        };
    const res =  await payment({ active_outlet: activeOutlet, payload: paymentPayload });
    console.log('payment created', res);
    
    const  verificationResult = await paymentVerify({ active_outlet: activeOutlet, payload: verifyPayload });
       console.log('payment verify', verificationResult);
      if (verificationResult.payment.status) {
        console.log("Payment verified ✅");
        
   

       
        onPaymentComplete?.();
      } else {
        console.log("Payment verification failed ❌");
        alert('Payment verification failed. Please contact support with reference: ' + response.reference);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment successful but verification failed. Please contact support with reference: ' + response.reference);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Paystack payment closure/cancellation
  const handlePaystackClose = () => {
    console.log('Paystack payment closed');
    // Optionally handle what happens when user closes payment modal
  };

  // Generate a unique reference for Paystack
  const generatePaystackReference = () => {
    const orderIds = selectedOrders?.map(order => order.id).join('_');
    return `${orderIds}_${Date.now()}`;
  };

  console.log('okk', selectedOrders?.[0]);

  // Get user email from multiple sources
  const getUserEmail = () => {
    // Priority order: activeUser email > selectedOrders email > default
    return activeUser.email 
  };

  return (
    <div className="payment-right-column">
      <div className="payment-checkout-section payment-method-section">
        <h3 className="payment-section-title">Payment Method</h3>
        <div className="payment-options">
          <div
            className={`payment-option ${paymentMethod === 'bank' ? 'payment-selected-option' : ''}`}
            onClick={handleBankTransfer}
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
            className={`payment-option ${paymentMethod === 'online' ? 'payment-selected-option' : ''}`}
            onClick={handleOnlinePayment}
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
          <span>₦{itemTotal.toLocaleString()}</span>
        </div>
        <div className="payment-total-row payment-grand-total">
          <span>Total</span>
          <span>₦{totalCost.toLocaleString()}</span>
        </div>
      </div>

      {paymentMethod === 'bank' && showBankDetails && <BankDetails />}

      {/* Conditional rendering based on payment method */}
      {paymentMethod === 'bank' ? (
        <button
          className="payment-checkout-button"
          disabled={isProcessing}
          onClick={handleBankPayment}
        >
          {isProcessing ? 'Processing...' : 'I have paid'}
        </button>
      ) : paymentMethod === 'online' ? (
        <div className="">
          <PaystackPayment
            email={getUserEmail()}
            amount={totalCost}
            reference={generatePaystackReference()}
            onSuccess={handlePaystackSuccess}
            onClose={handlePaystackClose}
            disabled={isProcessing}
          />
        </div>
      ) : (
        <button
          className="payment-checkout-button payment-disabled"
          disabled
        >
          Select Payment Method
        </button>
      )}
    </div>
  );
}