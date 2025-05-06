// OutletPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import '../styles/Outlet.css';
import Logo from '../assets/logo.png';
import OutletImage from '../assets/outlet.png';

const OutletPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="outlet-container">
      <motion.div 
        className="outlet-content"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left side - Image (hidden on small screens) */}
        <motion.div 
          className="image-section"
          variants={itemVariants}
        >
          <motion.img
            src={OutletImage}
            alt="Shopping Experience"
            className="shopping-illustration"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>
        
        {/* Right side - Content */}
        <motion.div 
          className="info-section"
          variants={itemVariants}
        >
          <motion.div 
            className="logo-container-outlet"
            variants={itemVariants}
          >
            <img 
              src={Logo}
              alt="Sephcocco Logo" 
              className="logo"
            />
          </motion.div>
          
          <div className="info-content">
            <motion.h1 
              className="welcome-title"
              variants={itemVariants}
            >
              Welcome to Sephcocco Outlet
            </motion.h1>
            
            <motion.p
              className="service-tagline"
              variants={itemVariants}
            >
              Please choose any of the Sephcocco outlets to place your orders.
              <br />
              <em>Always at your service.</em>
            </motion.p>
            
            <motion.div 
              className="navigation-buttons"
              variants={itemVariants}
            >
              <motion.button
                className="nav-button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Our Restuarant 
                <ArrowRight className="arrow-icon" />
              </motion.button>
              
              <motion.button
                className="nav-button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Our Lounge
                <ArrowRight className="arrow-icon" />
              </motion.button>
              
              <motion.button
                className="nav-button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Our Pharmacy 
                <ArrowRight className="arrow-icon" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OutletPage;