import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProductModal.css';
import ProductDetails from './ProductDetails';
import SimilarDiscounts from './SimilarDiscounts';
import { allProducts } from '../constants/productData';
import { useViewAllProduct } from '../hooks/useGetAllProduct';
import { getActiveOutlet } from '../utils/getActiveOutlets';

const ProductModal = ({ product, onClose, onBuyNow,onProductUpdate }) => {
  const [activeOutlet, setActiveOutlet] = useState(getActiveOutlet());
  const [currentProduct, setCurrentProduct] = useState(product);
  // const { data: productsData } = useViewAllProduct(activeOutlet);
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

  // Find products in the same category for similar discounts
  // const getSimilarProducts = () => {
  //   if (!currentProduct || !currentProduct.categories || currentProduct.discount_price == null) return [];
  
  //   // Define acceptable range for "similar" discount
  //   const discountThreshold = 5; // for ±5% tolerance (adjust as needed)
  
  //   return productsData?.products?.filter(p => 
    
  //     Math.abs(p.discount_price - currentProduct.discount_price) <= discountThreshold
  //   );
  // };
  // console.log('okk',getSimilarProducts());
  
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
          />
          
          {/* <SimilarDiscounts
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
          /> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;