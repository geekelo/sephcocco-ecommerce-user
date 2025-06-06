import { useEffect, useState } from "react";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";


export const AuthModals = ({ showLogin, showRegister, onCloseAll, onAuthSuccess }) => {
  const [currentModal, setCurrentModal] = useState(null);

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
    onCloseAll();
  };

  const switchToLogin = () => {
    setCurrentModal('login');
  };

  const switchToRegister = () => {
    setCurrentModal('register');
  };

  const handleAuthSuccess = () => {
    handleClose();
    onAuthSuccess && onAuthSuccess();
  };

  const handleRegisterSuccess = () => {
    // After successful registration, user should login
    setCurrentModal('login');
    // Don't call onAuthSuccess yet - wait for login
  };

  return (
    <>
      <LoginModal
        isOpen={currentModal === 'login'}
        onClose={handleClose}
        onSwitchToRegister={switchToRegister}
        onSuccess={handleAuthSuccess}
      />
      <RegisterModal
        isOpen={currentModal === 'register'}
        onClose={handleClose}
        onSwitchToLogin={switchToLogin}
        onSuccess={handleRegisterSuccess}
      />
    </>
  );
};
