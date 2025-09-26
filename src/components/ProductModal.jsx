import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProductModal.css';
import ProductDetails from './ProductDetails';
import SimilarDiscounts from './SimilarDiscounts';
import { AuthModals } from './AuthModal'; 
import { getActiveOutlet } from '../utils/getActiveOutlets';

const ProductModal = ({ product, onClose, onBuyNow, onProductUpdate }) => {
  const [activeOutlet, setActiveOutlet] = useState(getActiveOutlet());
  const [currentProduct, setCurrentProduct] = useState(product);
  
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  // Check authentication status
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Prevent scrolling of the body when the modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  console.log(currentProduct);

  // Handle showing auth modal
  const handleShowAuthModal = () => {
    setShowLoginModal(true);
  };

  // Handle auth success
  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    // Optionally refetch product data or update UI
    onProductUpdate?.();
  };

  // Handle closing auth modals
  const handleCloseAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="product-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="close-button"
          onClick={onClose}
          aria-label="Close"
          whileHover={{ scale: 1.1, backgroundColor: '#e0e0e0' }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={24} strokeWidth={2.5} />
        </motion.button>
        
        <motion.div
          className="product-modal-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ProductDetails 
            product={currentProduct} 
            onCloseModal={onClose}
            onBuyNow={onBuyNow}
            onProductUpdate={onProductUpdate}
            onShowAuthModal={handleShowAuthModal}
            isAuthenticated={isAuthenticated}
          />
          
          {/* Uncomment when you want to add similar discounts back */}
          {/* <SimilarDiscounts
            products={getSimilarProducts()}
            currentProduct={currentProduct}
            onProductChange={(product) => {
              setCurrentProduct(product);
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          /> */}
        </motion.div>

        {/* Auth Modals */}
        <AuthModals
          showLogin={showLoginModal}
          showRegister={showRegisterModal}
          onCloseAll={handleCloseAuthModals}
          onAuthSuccess={handleAuthSuccess}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;