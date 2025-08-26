// import React from "react";
// import { motion } from 'framer-motion';
// import { ArrowLeft, ShoppingCart } from 'lucide-react';
// import '../styles/PendingOrders.css';

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

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { DeliveryOrderItem } from "../components/DeliveryOrderItem";
import { PendingOrderItem } from "../components/PendingOrderItem";
import '../styles/PendingOrders.css';

import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import OrderModal from "../components/OrderModal";
import PaymentModal from "../components/PaymentModal";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import {  useGetPendingOrder } from "../hooks/useGetPendingOrder";
import { getActiveOutlet } from "../utils/getActiveOutlets";
import { useDeleteOrder } from "../hooks/useDeleteOrder";
import { useUpdateOrder } from "../hooks/useUpdateOrder";
import { useGetDeliveryOrder } from "../hooks/useGetDeliveryOrder";
import { useGetPaidOrder } from "../hooks/useGetPaidOrder";

const PendingOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const [checkedOrders, setCheckedOrders] = useState({});
  const [orderQuantities, setOrderQuantities] = useState({});

  const navigate = useNavigate();
  const activeOutlet = getActiveOutlet();
  
  // Separate hooks for different order types
  const { data: pendingData, refetch: refetchPending, isLoading: isLoadingPending } = useGetPendingOrder(activeOutlet);
  const { data: paidData, refetch: refetchPaid, isLoading: isLoadingPaid } = useGetPaidOrder(activeOutlet);
  const { data: deliveryData, refetch: refetchDelivery, isLoading: isLoadingDelivery } = useGetDeliveryOrder(activeOutlet);
  
  const deleteOrderMutation = useDeleteOrder();
  const updateOrderMutation = useUpdateOrder();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Init orderQuantities from API (only for pending orders)
  useEffect(() => {
    if (!pendingData) return;
    const initialQuantities = {};
    pendingData.forEach(order => {
      initialQuantities[order.id] = order.quantity || 1;
    });
    setOrderQuantities(initialQuantities);
  }, [pendingData]);

  // Handle delete
  const handleDeleteOrder = (orderId) => {
    deleteOrderMutation.mutate({ active_outlet: activeOutlet, orderId }, { 
      onSuccess: () => {
        refetchPending();
        refetchPaid();
        refetchDelivery();
      }
    });
  };

  // Handle quantity update → sync with API
  const handleQuantityUpdate = (orderId, newQuantity) => {
    setOrderQuantities(prev => ({ ...prev, [orderId]: newQuantity }));

    const payload = {
      [`sephcocco_${activeOutlet}_order`]: { quantity: newQuantity },
    };

    updateOrderMutation.mutate({ active_outlet: activeOutlet, orderId, payload }, { 
      onSuccess: refetchPending 
    });
  };

  // Increase / Decrease
  const increaseQuantity = (orderId) => {
    const currentQty = orderQuantities[orderId] || 1;
    handleQuantityUpdate(orderId, currentQty + 1);
  };

  const decreaseQuantity = (orderId) => {
    const currentQty = orderQuantities[orderId] || 1;
    const newQty = Math.max(1, currentQty - 1);
    handleQuantityUpdate(orderId, newQty);
  };

  // Toggle checkbox
  const toggleOrderCheck = (orderId) => {
    setCheckedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Selected items & total (only for pending orders)
  const { selectedItemsCount, totalPrice } = useMemo(() => {
    let count = 0;
    let total = 0;

    pendingData?.forEach(order => {
      if (checkedOrders[order.id]) {
        const qty = orderQuantities[order.id] || order.quantity || 1;
        count += qty;
        total += qty * parseFloat(order.unit_price);
      }
    });

    return { selectedItemsCount: count, totalPrice: total };
  }, [pendingData, checkedOrders, orderQuantities]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch(activeTab) {
      case "pending": return pendingData;
      case "paid": return paidData;
      case "delivering": return deliveryData;
      default: return [];
    }
  };

  const isLoading = isLoadingPending || isLoadingPaid || isLoadingDelivery;

  if (isLoading) {
    return <PendingOrdersSkeleton />;
  }

  const currentData = getCurrentData();

  return (
    <div className="orders-container full-width">
      <div className="centered-content">
        {/* Header */}
        <div className="orders-header">
          {isMobile && (
            <motion.button onClick={() => navigate("/products")} className="back-btn" whileTap={{ scale: 0.95 }}>
              <ArrowLeft size={20} />
            </motion.button>
          )}
          <h1 className="header-title">Orders</h1>
        </div>

        {/* Tabs */}
        <div className="order-tabs">
          <button 
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`} 
            onClick={() => setActiveTab("pending")}
          >
            Unpaid {pendingData?.length > 0 && `(${pendingData?.length})`}
          </button>
          <button 
            className={`tab-button ${activeTab === "paid" ? "active" : ""}`} 
            onClick={() => setActiveTab("paid")}
          >
            Paid {paidData?.length > 0 && `(${paidData?.length})`}
          </button>
          <button 
            className={`tab-button ${activeTab === "delivering" ? "active" : ""}`} 
            onClick={() => setActiveTab("delivering")}
          >
            In delivery {deliveryData?.length > 0 && `(${deliveryData?.length})`}
          </button>
        </div>

        {/* Order list */}
        <div className="orders-content">
          <AnimatePresence mode="wait">
            <motion.div
              className="order-list"
              initial="hidden"
              animate="show"
              exit="exit"
              key={activeTab}
            >
              {activeTab === "pending" ? (
                // Pending orders with interactive features
                currentData && currentData?.length > 0 ? (
                  currentData.map((order, index) => (
                    <PendingOrderItem
                      key={order.id}
                      order={order}
                      index={index}
                      quantity={orderQuantities[order.id] || order.quantity || 1}
                      onIncrease={increaseQuantity}
                      onDecrease={decreaseQuantity}
                      onClick={() => setCurrentOrder(order)}
                      isSelected={currentOrder?.id === order.id}
                      isChecked={!!checkedOrders[order.id]}
                      onToggleCheck={toggleOrderCheck}
                      onDelete={handleDeleteOrder}
                    />
                  ))
                ) : (
                  <div className="no-orders">No pending orders found</div>
                )
              ) : (
                // Paid and Delivery orders (read-only)
                currentData && currentData?.length > 0 ? (
                  currentData.map((order, index) => (
                    <DeliveryOrderItem
                      key={order.id}
                      order={order}
                      index={index}
                      onClick={() => setCurrentOrder(order)}
                      isSelected={currentOrder?.id === order.id}
                    />
                  ))
                ) : (
                  <div className="no-orders">
                    {activeTab === "paid" ? "No paid orders found" : "No delivery orders found"}
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selected Items & Payment (only for pending tab) */}
        {activeTab === "pending" && selectedItemsCount > 0 && (
          <div className="selected-items-indicator">
            <span>
              {selectedItemsCount} item{selectedItemsCount !== 1 ? "s" : ""} selected — ₦{totalPrice}
            </span>
          </div>
        )}

        {activeTab === "pending" && pendingData?.length > 0 && (
          <div className="make-payment-container">
            <button
              className="make-payment-button"
              disabled={selectedItemsCount === 0}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <ShoppingCart size={18} style={{ marginRight: "8px" }} />
              Make Payment
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
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

      {isOrderModalOpen && (
        <OrderModal product={selectedProduct} onClose={() => setIsOrderModalOpen(false)} />
      )}

      {isPaymentModalOpen && (
        <PaymentModal
          selectedOrders={pendingData.filter(order => checkedOrders[order.id])}
          onClose={() => setIsPaymentModalOpen(false)}
          totalCost={totalPrice} 
          onPaymentComplete={() => {
            setIsPaymentModalOpen(false);
            setIsPaymentSuccessful(true);
            refetchPending();
            refetchPaid();
            refetchDelivery();
          }}
        />
      )}

      {isPaymentSuccessful && (
        <>
          <div className="payment-success-backdrop" />
          <PaymentSuccessModal onClose={() => setIsPaymentSuccessful(false)} />
        </>
      )}
    </div>
  );
};
export default PendingOrders;