import { useEffect, useState } from "react";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { OTPModal } from "./OtpModal";
import { useResendOtp } from "../hooks/useResendOtp";

export const AuthModals = ({ showLogin, showRegister, onCloseAll, onAuthSuccess }) => {
  const [currentModal, setCurrentModal] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
const {
  mutateAsync: resendOtp,
} = useResendOtp();
  useEffect(() => {
    if (showLogin) {
      setCurrentModal('login');
    } else if (showRegister) {
      setCurrentModal('register');
    } else {
      setCurrentModal(null);
    }
  }, [showLogin, showRegister]);

  const handleClose = () => {
    setCurrentModal(null);
    setRegisteredEmail("");
    onCloseAll();
  };

  const switchToLogin = () => {
    setCurrentModal('login');
  };

  const switchToRegister = () => {
    setCurrentModal('register');
  };

  const switchToOTP = (email) => {
    setRegisteredEmail(email);
    setCurrentModal('otp');
  };

  const handleAuthSuccess = () => {
    handleClose();
    onAuthSuccess && onAuthSuccess();
  };

  const handleRegisterSuccess = (email) => {
    // After successful registration, show OTP modal
    switchToOTP(email);
  };

  const handleOTPVerifySuccess = (data) => {
    // After successful OTP verification, complete the auth process
    handleAuthSuccess();
  };

  return (
    <>
      <LoginModal
        isOpen={currentModal === 'login'}
        onClose={handleClose}
        onSwitchToRegister={switchToRegister}
       onSuccess={(email) => {
   if (email) {
   resendOtp(email);
     switchToOTP(email);

   } else {
     handleAuthSuccess();
  }
 }}
      />
      
      <RegisterModal
        isOpen={currentModal === 'register'}
        onClose={handleClose}
        onSwitchToLogin={switchToLogin}
        onSuccess={handleRegisterSuccess}
      />
      
      <OTPModal
        isOpen={currentModal === 'otp'}
        onClose={handleClose}
        onVerifySuccess={handleOTPVerifySuccess}
        userEmail={registeredEmail}
      />
    </>
  );
};