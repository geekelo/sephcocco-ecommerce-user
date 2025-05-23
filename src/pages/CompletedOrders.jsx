import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import { orders, getSimilarOrderProducts } from "../constants/orders";
import '../styles/PendingOrders.css';
import SimilarDiscounts from "../components/SimilarDiscounts";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import OrderModal from "../components/OrderModal";
import { OrderItem } from "../components/OrderItem";

const CompletedOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check for mobile device on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter only pending orders
  const CompletedOrders = orders.filter(order => (order.status === "Completed")
  );

  // Set current order for similar discounts - default to first order
  useEffect(() => {
    if (CompletedOrders.length > 0 && !currentOrder) {
      setCurrentOrder(CompletedOrders[0]);
    }
  }, [CompletedOrders, currentOrder]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const handleBack = () => {
    navigate('/products');
  };

  const handleOrderClick = (order) => {
    setCurrentOrder(order);
  };
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Calculate discount percentage for display
  const calculateDiscount = (product) => {
    return Math.floor(Math.random() * 20) + 5; // Random discount between 5-25%
  };

  // Apply discount calculation to similar products
  const getDiscountedProducts = (products) => {
    return products.map(product => ({
      ...product,
      discountPercent: calculateDiscount(product),
      discountedPrice: product.price * (1 - calculateDiscount(product) / 100)
    }));
  };

  // Get similar completed with applied discounts
  const getSimilarDiscountProducts = () => {
    if (!currentOrder) return [];
    
    const similarProducts = getSimilarOrderProducts(currentOrder);
    return getDiscountedProducts(similarProducts);
  };

  return (
    <div className="orders-container full-width">
      <div className="centered-content">
    
        <div className="orders-header">
          {isMobile && (
            <motion.button 
              onClick={handleBack}
              className="back-btn"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
          )}
          <h1 className="header-title">Completed Orders</h1>
        </div>
        
     
        <div className="orders-static-section">
          <AnimatePresence mode="wait">
            <motion.div 
              className="order-list-no-scroll"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {CompletedOrders.length > 0 ? (
                CompletedOrders.map((order, index) => (
                  <OrderItem 
                    key={order.id} 
                    order={order} 
                    index={index} 
                    onClick={() => handleOrderClick(order)}
                    isSelected={currentOrder && currentOrder.id === order.id}
                  />
                ))
              ) : (
                <div className="no-orders-message">
                  No orders Completed.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Similar Discounts Section - Using actual similar products from same category */}
        {currentOrder && (
          <div className="similar-discounts-container">
         
            
            <motion.div 
              className="similar-order"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <SimilarDiscounts
                products={getSimilarDiscountProducts()}
                currentProduct={currentOrder}
                onProductChange={handleProductClick}
              />
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Product Modal */}
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onBuyNow={() => {
         
            setShowModal(false);
            setIsOrderModalOpen(true);
        
          }}
        />
      )}
      
      {isOrderModalOpen && 
        <OrderModal 
          product={selectedProduct} 
          onClose={() => setIsOrderModalOpen(false)}
        />
      }
    </div>
  );
};
     
    

export default CompletedOrders;