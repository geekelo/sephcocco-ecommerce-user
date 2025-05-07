import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProductModal.css';
import ProductDetails from './ProductDetails';
import SimilarDiscounts from './SimilarDiscounts';
import { allProducts } from '../constants/productData';

const ProductModal = ({ product, onClose }) => {
  const [currentProduct, setCurrentProduct] = useState(product);

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

  // Find products in the same category for similar discounts
  const getSimilarProducts = () => {
    if (!currentProduct || !currentProduct.category) return [];
    
    return allProducts.filter(p => 
      p.category === currentProduct.category && 
      p.id !== currentProduct.id
    );
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
          <ProductDetails product={currentProduct} />
          
          <SimilarDiscounts
            products={getSimilarProducts()}
            currentProduct={currentProduct}
            onProductChange={(product) => {
              // Create a smooth transition effect when changing products
              setCurrentProduct(product);
              
              // Scroll to top when changing products
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;