
import { PaystackButton } from 'react-paystack';

const PaystackPayment = ({ email, amount, reference, onSuccess, onClose }) => {
  const publicKey = "pk_test_ac62c03eab599d53ff6439b3d7caf71cb604d1fd"; // Replace with your actual public key

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
  };

  return <PaystackButton {...componentProps} />;
};

export default PaystackPayment;