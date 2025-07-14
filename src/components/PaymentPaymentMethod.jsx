import { CheckCircle, CreditCard, Landmark } from 'lucide-react';
import React, { useState } from 'react';
import BankDetails from './BankDetails';
import PaymentSuccessModal from './PaymentSuccessModal';
import { usePayment } from '../hooks/usePayment';
import '../styles/PaymentPaymentMethod.css';
import { getActiveOutlet } from '../utils/getActiveOutlets';

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

  const transactionId = localStorage.getItem('pay-ref');
const activeOutlet = getActiveOutlet()
console.log('act',activeOutlet);

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

  const handleCheckout = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);

    const orderIds = selectedOrders?.map(order => order.id);

    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: orderIds,
        amount: totalCost,
        payment_method: paymentMethod,
        transaction_id: transactionId,
      },
    };

    try {
      await payment({ active_outlet: activeOutlet, payload });

      if (paymentMethod === 'bank') {
        onPaymentComplete?.(); 
      } else {
    
        onPaymentComplete?.(); 
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

      <button
        className={`payment-checkout-button ${!paymentMethod ? 'payment-disabled' : ''}`}
        disabled={!paymentMethod || isProcessing}
        onClick={handleCheckout}
      >
        {isProcessing ? 'Processing...' : paymentMethod === 'bank' ? 'I have paid' : 'Proceed to Payment'}
      </button>

    
    </div>
  );
}
