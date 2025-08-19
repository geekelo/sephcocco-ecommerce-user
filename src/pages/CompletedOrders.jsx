import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import '../styles/PendingOrders.css';

const CompletedOrdersSkeleton = ({ isMobile = false }) => {
  // Animation variants for skeleton
  const shimmerVariants = {
    initial: { backgroundPosition: '-200px 0' },
    animate: { 
      backgroundPosition: '200px 0',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Skeleton for individual completed order items
  const CompletedOrderItemSkeleton = ({ index }) => (
    <motion.div 
      className="order-item skeleton-item"
      variants={itemVariants}
      style={{ 
        padding: '16px',
        width: '220px',
        marginBottom: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb',
        position: 'relative'
      }}
    >
      {/* Order header with status indicator */}
      <div className="order-item-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        {/* Product image skeleton */}
        <motion.div 
          className="skeleton-box-order"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            marginRight: '12px',
            background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200px 100%'
          }}
        />
        
   
        
   
      </div>
      
   
      
      {/* Completion indicator */}
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
        <motion.div 
          className="skeleton-box-order"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            marginRight: '8px',
            background: 'linear-gradient(90deg, #dcfce7 25%, #f0fdf4 50%, #dcfce7 75%)',
            backgroundSize: '200px 100%'
          }}
        />
        <motion.div 
          className="skeleton-box-order"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: '12px',
            width: '120px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200px 100%'
          }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="orders-container full-width">
      <div className="centered-content">
        {/* Header skeleton */}
        <div className="orders-header">
          {isMobile && (
            <motion.button 
              className="back-btn"
              whileTap={{ scale: 0.95 }}
              disabled
              style={{ opacity: 0.5 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
          )}
          <h1 className="header-title">Completed Orders</h1>
        </div>
        
        {/* Orders section skeleton */}
        <div className="orders-static-section">
          <AnimatePresence mode="wait">
            <motion.div 
              className="order-list-no-scroll"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Generate skeleton items for completed orders */}
              {[...Array(4)].map((_, index) => (
                <CompletedOrderItemSkeleton key={index} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
   
      </div>
    </div>
  );
};

export default CompletedOrdersSkeleton;