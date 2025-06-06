import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/LoginPage.css";
import storeImage from "../assets/login.png";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../schema/LoginSchema";
import { useLogin } from "../hooks/useLogin";

const LoginPage = () => {
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");


  const {mutateAsync: login} = useLogin()
  const navigate = useNavigate();

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



const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError(""); // Clear previous API error

  // Final validation
  let isValid = true;

  if (!email.trim() || !validateEmail(email)) {
    setEmailError("Please enter a valid email address");
    isValid = false;
  }



  if (!isValid) return;

  setIsSubmitting(true);

  try {
    const payload = {
     user: { email, password: ''}
    }
    console.log(payload);
    
    const response = await login(payload);
    if (response?.message) {
    localStorage.setItem('token', response?.token)
    console.log("Login success:", response);
    navigate("/products");
    }

  } catch (error) {
    console.error("Login failed:", error);
    setApiError(error?.response?.data?.error || "Login failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};



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

        <motion.h1
          className="welcome-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome Back!
        </motion.h1>

        <form onSubmit={handleSubmit} className="login-form">
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
              className={emailError ? "error email-input" : "email-input"}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>

      
{apiError && <p className="error-message api-error">{apiError}</p>}

          <motion.button
            type="submit"
            className="sign-up-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className="spinner"></div> : "Sign In"}
          </motion.button>
        </form>

      
      </motion.div>
    </div>
  );
};

export default LoginPage;