import { PaystackButton } from 'react-paystack';
import '../styles/PaystackPayment.css'; 

const PaystackPayment = ({ email, amount, reference, onSuccess, onClose, disabled = false }) => {
  const publicKey = "pk_test_ac62c03eab599d53ff6439b3d7caf71cb604d1fd"; 

  const componentProps = {
    email,
    amount: amount * 100, // Paystack expects amount in kobo (i.e., cents)
    reference,
    publicKey,
    text: "Pay Now",
    onSuccess: (response) => {
      // response contains reference, status, etc
      onSuccess(response); // send to backend for verification
    },
    onClose: () => {
      onClose();
    },
    className: `paystack-pay-button ${disabled ? 'paystack-disabled' : ''}`,
    disabled: disabled
  };

  return (
    <div className="paystack-button-wrapper">
      <PaystackButton {...componentProps} />
    </div>
  );
};

export default PaystackPayment;