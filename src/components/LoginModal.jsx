
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import logo from "../assets/logo.png";
import { validateEmail, validateName } from "../schema/RegisterSchema";
import { useLogin } from "../hooks/useLogin";

import '../styles/Auth.css'

export const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const { mutateAsync: login } = useLogin();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value.trim() === "") {
      setEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!email.trim() || !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        user: { email} 
      };
      
      const response = await login(payload);
      console.log(response);
      
      if (response?.message) {
        localStorage.setItem('token', response?.token);
        localStorage.setItem('userId', response?.user?.id);
        localStorage.setItem('pay-ref', response?.user?.payment_ref)
        // Cookies.set('userId', response?.user?.id, { expires: 1 });
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Login failed:", error);
      setApiError(error?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          className="modal-card login-modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-header">
            <div className="logo-container-auth">
              <img src={logo} alt="Logo" className="logo-auth" />
              <h2 className="modal-title">Welcome Back!</h2>
            </div>
            <button onClick={onClose} className="close-button">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                className={emailError ? 'error' : ''}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>

            {apiError && <p className="error-message general-error">{apiError}</p>}

            <button type="submit" disabled={isSubmitting} className="sign-up-button">
              {isSubmitting ? <div className="spinner"></div> : "Sign In"}
            </button>
          </form>

          <p className="sign-up-text">
            Don't have an account?{" "}
            <button type="button" onClick={onSwitchToRegister} className="switch-button">
              Create account
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
