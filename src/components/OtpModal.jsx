import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import logo from "../assets/logo.png";
import '../styles/Auth.css';
import { useOtp } from "../hooks/useOtp";
import { useResendOtp } from "../hooks/useResendOtp";

export const OTPModal = ({ isOpen, onClose, onVerifySuccess, userEmail }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [apiError, setApiError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  
  // Use hooks for OTP operations
const {
  mutateAsync: verifyOtp,
  isPending: isSubmitting,
} = useOtp();

const {
  mutateAsync: resendOtp,
  isPending: isResending,
} = useResendOtp();
  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setApiError("");
      setResendCooldown(0);
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
    
    // Clear error when user starts typing
    if (apiError) setApiError("");
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        
        // Focus the next empty input or last input
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setApiError("Please enter the complete 6-digit code");
      return;
    }
    
    // Validate that all characters are digits
    if (!/^\d{6}$/.test(otpString)) {
      setApiError("Please enter only numbers");
      return;
    }
    
    try {

  
      
      // Use the useOtp hook
    const response = await verifyOtp({ email: userEmail, token: otpString });

      console.log('OTP verification response:', response);
      

      onVerifySuccess && onVerifySuccess(response);
      onClose();
      // Refresh page after successful OTP verification
      window.location.reload();
    } catch (error) {
      console.error("OTP verification failed:", error);
      setApiError(error?.response?.data?.error || error?.message || "Invalid verification code. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResending) return;
    
    try {
      setApiError("");
      

      
      // Use the useResendOtp hook
      const response = await resendOtp(userEmail);
      
      console.log('Resend OTP response:', response);
      
      setResendCooldown(60); // 60 second cooldown
      setOtp(["", "", "", "", "", ""]); // Clear current OTP
      inputRefs.current[0]?.focus();
      
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setApiError(error?.response?.data?.error || error?.message || "Failed to resend code. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay-auth"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-card-auth"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header-auth">
            <div className="logo-container-auth">
              <img src={logo} alt="Logo" className="logo-auth" />
              <h2 className="modal-title-auth">Verify Email</h2>
            </div>
            <button
              type="button"
              className="close-button-auth"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <form className="modal-form-auth" onSubmit={handleSubmit}>
            <div className="otp-description">
              <p>We've sent a 6-digit verification code to:</p>
              <strong>{userEmail}</strong>
            </div>

            <div className="form-group-auth">
              <label>Enter Verification Code</label>
              <div className="otp-input-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={e => handleInputChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className="otp-input"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>

            {apiError && (
              <div className="error-message general-error">{apiError}</div>
            )}

            <button
              type="submit"
              className="sign-up-button"
              disabled={isSubmitting || otp.some(digit => !digit)}
            >
              {isSubmitting ? (
                "Verifying..."
              ) : (
                "Verify Code"
              )}
            </button>

            <div className="resend-container">
              <span>Didn't receive the code? </span>
              <button
                type="button"
                className={`switch-button ${resendCooldown > 0 || isResending ? 'disabled' : ''}`}
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isResending}
              >
                {isResending 
                  ? "Sending..." 
                  : resendCooldown > 0 
                    ? `Resend in ${resendCooldown}s` 
                    : "Resend Code"
                }
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};