
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import logo from "../assets/logo.png";
import { validateEmail, validateName } from "../schema/RegisterSchema";
import '../styles/Auth.css'
import { useRegister } from "../hooks/useRegister";

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin, onSuccess }) => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone_number: "",
    whatsapp_number: ""
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: register } = useRegister();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (value.trim() === "") {
          error = `${fieldName === "firstName" ? "First" : "Last"} name is required`;
        } else if (!validateName(value)) {
          error = "Please enter a valid name (at least 2 characters)";
        }
        break;
      case "email":
        if (value.trim() === "") {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone_number":
        if (value.trim() === "") {
          error = "Phone number is required";
        }
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullName = `${formValues.firstName || ''} ${formValues.lastName || ''}`.trim();
      
      const payload = {
        user: {
          name: fullName,
          address: formValues.address || '',
          email: formValues.email || '',
          phone_number: formValues.phone_number || '',
          whatsapp_number: formValues.whatsapp_number || '',
          password: '', // Empty password as requested
          password_confirmation: '',
          role: "user",
          outlet: ''
        }
      };

      const response = await register(payload);
      
      if (response?.message) {
        // Don't set token yet - user needs to login after registration
        // The toast will be handled by the calling component
        onSuccess && onSuccess();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setFormErrors({ general: error?.response?.data?.error || "Registration failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          className="modal-card register-modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div className="modal-header">
            <div className="logo-container-auth">
              <img src={logo} alt="Logo" className="logo-auth" />
              <h2 className="modal-title">Create Account</h2>
            </div>
            <button onClick={onClose} className="close-button">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={validationErrors.firstName ? 'error' : ''}
                  placeholder="First name"
                />
                {validationErrors.firstName && (
                  <p className="error-message">{validationErrors.firstName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={validationErrors.lastName ? 'error' : ''}
                  placeholder="Last name"
                />
                {validationErrors.lastName && (
                  <p className="error-message">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={validationErrors.email ? 'error' : ''}
                placeholder="Enter your email address"
              />
              {validationErrors.email && (
                <p className="error-message">{validationErrors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formValues.address}
                onChange={handleInputChange}
                placeholder="Enter address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formValues.phone_number}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={validationErrors.phone_number ? 'error' : ''}
                placeholder="Enter phone number"
              />
              {validationErrors.phone_number && (
                <p className="error-message">{validationErrors.phone_number}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="whatsapp_number">WhatsApp Number</label>
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                value={formValues.whatsapp_number}
                onChange={handleInputChange}
                placeholder="Enter WhatsApp number"
              />
            </div>

            {formErrors.general && (
              <p className="error-message general-error">{formErrors.general}</p>
            )}

            <button type="submit" disabled={isSubmitting} className="sign-up-button">
              {isSubmitting ? <div className="spinner"></div> : "Create Account"}
            </button>
          </form>

          <p className="sign-up-text">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin} className="switch-button">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

