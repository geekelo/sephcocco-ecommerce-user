// import React from "react";
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowLeft } from 'lucide-react';
// import '../styles/PendingOrders.css';

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

// export default CompletedOrdersSkeleton;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

// import { OrderItem } from "../components/OrderItem";
import { orders, getSimilarOrderProducts } from "../constants/orders";
import '../styles/PendingOrders.css';
import SimilarDiscounts from "../components/SimilarDiscounts";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import OrderModal from "../components/OrderModal";
import { OrderItem } from "../components/OrderItem";
import { getActiveOutlet } from "../utils/getActiveOutlets";
import { useGetCompletedOrder } from "../hooks/userGetCompletedOrder";

const CompletedOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const navigate = useNavigate();
  const activeOutlet = getActiveOutlet()
  const {data: completedData, isLoading: isLoadingCompleted} = useGetCompletedOrder(activeOutlet)
  console.log('com',completedData);
  
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
if (isLoadingCompleted) {
  return <CompletedOrdersSkeleton/>
}
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
              {completedData?.orders?.length > 0 ? (
                completedData?.orders?.map((order, index) => (
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
        {/* {currentOrder && (
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
        )} */}
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