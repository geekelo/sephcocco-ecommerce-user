import React from "react";
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import '../styles/PendingOrders.css';

const PendingOrdersSkeleton = ({ isMobile = false }) => {
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

  // Skeleton for individual order items
  const OrderItemSkeleton = ({ index }) => (
    <motion.div 
      className="order-item skeleton-item"
      variants={itemVariants}
      style={{ 
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb'
      }}
    >
      <div className="order-item-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        {/* Checkbox skeleton */}
        <motion.div 
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            marginRight: '12px',
            background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200px 100%'
          }}
        />
        
        {/* Product image skeleton */}
        <motion.div 
          className="skeleton-box"
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
        
        <div style={{ flex: 1 }}>
          {/* Product name skeleton */}
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: '16px',
              width: '80%',
              marginBottom: '8px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
          
          {/* Price skeleton */}
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: '14px',
              width: '60%',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
        </div>
        
        {/* Quantity controls skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              width: '40px',
              height: '24px',
              borderRadius: '4px',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
        </div>
      </div>
      
      {/* Order details skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div 
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: '12px',
            width: '100px',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200px 100%'
          }}
        />
        <motion.div 
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: '12px',
            width: '80px',
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
          <h1 className="header-title">Orders</h1>
        </div>
        
        {/* Tab Navigation skeleton */}
        <div className="order-tabs">
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: '40px',
              width: '120px',
              borderRadius: '20px',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: '40px',
              width: '120px',
              borderRadius: '20px',
              marginLeft: '12px',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%'
            }}
          />
        </div>
        
        {/* Selected items indicator skeleton */}
        <motion.div 
          className="selected-items-indicator"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            padding: '8px 16px',
            margin: '16px 0',
            borderRadius: '20px',
            background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
            backgroundSize: '200px 100%',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />
        
        {/* Order List skeleton */}
        <div className="orders-content">
          <motion.div 
            className="order-list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Generate skeleton items */}
            {[...Array(3)].map((_, index) => (
              <OrderItemSkeleton key={index} index={index} />
            ))}
          </motion.div>
        </div>
        
        {/* Make Payment Button skeleton */}
        <div className="make-payment-container">
          <motion.div 
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: '48px',
              width: '200px',
              borderRadius: '24px',
              margin: '0 auto',
              background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
              backgroundSize: '200px 100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShoppingCart size={18} style={{ marginRight: '8px', opacity: 0.3 }} />
            <span style={{ opacity: 0.3 }}>Make Payment</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PendingOrdersSkeleton;