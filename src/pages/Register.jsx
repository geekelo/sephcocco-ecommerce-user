import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/LoginPage.css";
import storeImage from "../assets/login.png";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateName, validatePasswordMatch, getPasswordStrength } from "../schema/RegisterSchema";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);

    // Real-time validation
    if (value.trim() === "") {
      setFullNameError("Full name is required");
    } else if (!validateName(value)) {
      setFullNameError("Please enter a valid full name (at least 2 characters)");
    } else {
      setFullNameError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation
    if (value.trim() === "") {
      setEmailError("Email is required");
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };


 const handleSubmit = async () => {
    try {
      // Merge firstName and lastName into full name
      const fullName = `${formValues.firstName || ''} ${formValues.lastName || ''}`.trim();
      
      const payload = {
        user: {
      name: fullName,
        address: formValues.address || '',
        email: formValues.email || '',
        phone_number: formValues.phone_number || '',
        whatsapp_number: formValues.whatsapp_number || '',
        password:  '',
        password_confirmation:  '',
        role: "user",
        outlet: ''
        }
  
      };
console.log(payload);

   const response =   await register(payload);
   console.log(response);
   if (response?.message) {
closeAllModals(); 
   }
     
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error appropriately
    }
  };



  // Get password strength for display
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="login-container">
      <div className="background-overlay"></div>
      <img src={storeImage} alt="Store" className="background-image" />

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={handleFullNameChange}
              className={fullNameError ? "error" : ""}
            />
            {fullNameError && <p className="error-message">{fullNameError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              className={emailError ? "error" : ""}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
   <div className="form-group">
              <label  htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formValues.address || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-input-form ${validationErrors.address || formErrors.address ? 'error' : ''}`}
                placeholder="Enter address"
              />
              {(validationErrors.address || formErrors.address) && (
                <div className="form-error-form">{validationErrors.address || formErrors.address}</div>
              )}
            </div>
            <div className="form-group">
              <label  htmlFor="phone_number">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formValues.phone_number || ''}
                onChange={handleInputChange}
                className={`form-input-form ${validationErrors.phone_number || formErrors.phone_number ? 'error' : ''}`}
                placeholder="Enter phone number"
              />
              {(validationErrors.phone_number || formErrors.phone_number) && (
                <div className="form-error-form">{validationErrors.phone_number || formErrors.phone_number}</div>
              )}
            </div>

            <div className="form-field-form">
              <label className="form-label-form" htmlFor="whatsapp_number">WhatsApp Number</label>
              <input
                id="whatsapp_number"
                name="whatsapp_number"
                type="tel"
                value={formValues.whatsapp_number || ''}
                onChange={handleInputChange}
                className={`form-input-form ${validationErrors.whatsapp_number || formErrors.whatsapp_number ? 'error' : ''}`}
                placeholder="Enter WhatsApp number"
              />
              {(validationErrors.whatsapp_number || formErrors.whatsapp_number) && (
                <div className="form-error-form">{validationErrors.whatsapp_number || formErrors.whatsapp_number}</div>
              )}
            </div>


          

          <motion.button
            type="submit"
            className="sign-up-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className="spinner"></div> : "Create Account"}
          </motion.button>
        </form>

        <p className="sign-up-text">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;