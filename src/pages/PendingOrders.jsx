import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { DeliveryOrderItem } from "../components/DeliveryOrderItem";
import { PendingOrderItem } from "../components/PendingOrderItem";
import Pagination from "../components/Pagination";
import '../styles/PendingOrders.css';

import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import OrderModal from "../components/OrderModal";
import PaymentModal from "../components/PaymentModal";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import { useSearchParams } from 'react-router-dom';
import { AuthModals } from '../components/AuthModal'; // Import auth modals
import { useGetPendingOrder } from "../hooks/useGetPendingOrder";
import { getActiveOutlet } from "../utils/getActiveOutlets";
import { getActiveUser } from "../utils/getActiveUser";
import { useDeleteOrder } from "../hooks/useDeleteOrder";
import { useUpdateOrder } from "../hooks/useUpdateOrder";
import { useGetDeliveryOrder } from "../hooks/useGetDeliveryOrder";
import { useGetPaidOrder } from "../hooks/useGetPaidOrder";

// PendingOrdersSkeleton component
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

const PendingOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [searchParams] = useSearchParams();
    const fromTab = searchParams.get("tab") || "pending";
  const [activeTab, setActiveTab] = useState(fromTab);

  const [checkedOrders, setCheckedOrders] = useState({});
  const [orderQuantities, setOrderQuantities] = useState({});

  // Pagination states for each tab
  const [pendingPage, setPendingPage] = useState(1);
  const [paidPage, setPaidPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const itemsPerPage = 10;

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);


  const navigate = useNavigate();
  
  // Get auth token and user info
  const authToken = localStorage.getItem('token');
  const activeOutlet = getActiveOutlet();
  const user = getActiveUser();

  // Check authentication status
  useEffect(() => {
    const checkAuthentication = () => {
      setIsAuthenticated(!!authToken);
      setIsCheckingAuth(false);
      
      // If not authenticated, show login modal
      if (!authToken) {
        console.log('🚫 User not authenticated, showing login modal');
        setShowLoginModal(true);
      }
    };

    checkAuthentication();
  }, [authToken]);

  // Separate hooks for different order types with pagination (only if authenticated)
  const { 
    data: pendingData, 
    refetch: refetchPending, 
    isLoading: isLoadingPending, 
    isPreviousData: isPendingPreviousData 
  } = useGetPendingOrder(
    activeOutlet, 
    pendingPage, 
    itemsPerPage,
    { enabled: isAuthenticated }
  );
  
  const { 
    data: paidData, 
    refetch: refetchPaid, 
    isLoading: isLoadingPaid, 
    isPreviousData: isPaidPreviousData 
  } = useGetPaidOrder(
    activeOutlet, 
    paidPage, 
    itemsPerPage,
    { enabled: isAuthenticated } // Only fetch if authenticated
  );
  
  const { 
    data: deliveryData, 
    refetch: refetchDelivery, 
    isLoading: isLoadingDelivery, 
    isPreviousData: isDeliveryPreviousData 
  } = useGetDeliveryOrder(
    activeOutlet, 
    deliveryPage, 
    itemsPerPage,
    { enabled: isAuthenticated } // Only fetch if authenticated
  );
  
  const deleteOrderMutation = useDeleteOrder();
  const updateOrderMutation = useUpdateOrder();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Init orderQuantities from API (only for pending orders and if authenticated)
  useEffect(() => {
    if (!pendingData || !isAuthenticated) return;
    const initialQuantities = {};
    pendingData?.orders?.forEach(order => {
      initialQuantities[order.id] = order.quantity || 1;
    });
    setOrderQuantities(initialQuantities);
  }, [pendingData, isAuthenticated]);

  // Reset to first page when switching tabs
  useEffect(() => {
    if (!isAuthenticated) return;
    
    switch(activeTab) {
      case "pending":
        if (pendingPage !== 1) setPendingPage(1);
        break;
      case "paid":
        if (paidPage !== 1) setPaidPage(1);
        break;
      case "delivering":
        if (deliveryPage !== 1) setDeliveryPage(1);
        break;
    }
  }, [activeTab, isAuthenticated]);

  // Authentication handlers
  const handleAuthSuccess = () => {
    console.log('✅ Authentication successful');
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleCloseAuthModals = () => {
    console.log('❌ Auth modals closed without authentication');
    setShowLoginModal(false);
    setShowRegisterModal(false);

  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  // Handle page changes for each tab
  const handlePageChange = (page) => {
    if (!isAuthenticated) return;
    
    switch(activeTab) {
      case "pending":
        setPendingPage(page);
        break;
      case "paid":
        setPaidPage(page);
        break;
      case "delivering":
        setDeliveryPage(page);
        break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab }); // update query param
  };
  // Handle delete
  const handleDeleteOrder = (orderId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setCheckedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Selected items & total (only for pending orders and if authenticated)
  const { selectedItemsCount, totalPrice } = useMemo(() => {
    if (!isAuthenticated) return { selectedItemsCount: 0, totalPrice: 0 };
    
    let count = 0;
    let total = 0;

    pendingData?.orders?.forEach(order => {
      if (checkedOrders[order.id]) {
        const qty = orderQuantities[order.id] || order.quantity || 1;
        count += qty;
        total += qty * parseFloat(order.unit_price);
      }
    });

    return { selectedItemsCount: count, totalPrice: total };
  }, [pendingData, checkedOrders, orderQuantities, isAuthenticated]);

  // Get current data and meta based on active tab with sorting
  const getCurrentData = () => {
    if (!isAuthenticated) return { data: [], meta: {} };
    
    let data = [];
    let meta = {};
    
    switch(activeTab) {
      case "pending": 
        data = pendingData?.orders || [];
        meta = pendingData?.meta || {};
        break;
      case "paid": 
        data = paidData?.orders || [];
        meta = paidData?.meta || {};
        break;
      case "delivering": 
        data = deliveryData?.orders || [];
        meta = deliveryData?.meta || {};
        break;
      default: 
        return { data: [], meta: {} };
    }
    
    // Sort data by most recent first (descending order)
    const sortedData = data.sort((a, b) => {
      const dateA = new Date(a.created_at || a.updated_at).getTime();
      const dateB = new Date(b.created_at || b.updated_at).getTime();
      return dateB - dateA; // Most recent first
    });
    
    return { data: sortedData, meta };
  };

  // Get current page for active tab
  const getCurrentPage = () => {
    switch(activeTab) {
      case "pending": return pendingPage;
      case "paid": return paidPage;
      case "delivering": return deliveryPage;
      default: return 1;
    }
  };

  // Get current loading state
  const getCurrentPreviousData = () => {
    switch(activeTab) {
      case "pending": return isPendingPreviousData;
      case "paid": return isPaidPreviousData;
      case "delivering": return isDeliveryPreviousData;
      default: return false;
    }
  };

  const isLoading = isLoadingPending || isLoadingPaid || isLoadingDelivery;
if (!activeOutlet) {
  return <PendingOrdersSkeleton isMobile={isMobile} />;
}

  // Show loading skeleton if checking auth or loading data
 if (isCheckingAuth ||  (isAuthenticated && isLoading)) {
  return <PendingOrdersSkeleton isMobile={isMobile} />;
}
  // // Don't render main content if not authenticated
  // if (!isAuthenticated) {
  //   return (
  //     <div className="orders-container full-width">
  //       <div className="centered-content">
  //         <div className="orders-header">
  //           {isMobile && (
  //             <motion.button onClick={() => navigate("/products")} className="back-btn" whileTap={{ scale: 0.95 }}>
  //               <ArrowLeft size={20} />
  //             </motion.button>
  //           )}
  //           <h1 className="header-title">Orders</h1>
  //         </div>
  //         <div style={{ 
  //           display: 'flex', 
  //           justifyContent: 'center', 
  //           alignItems: 'center', 
  //           minHeight: '200px',
  //           flexDirection: 'column',
  //           gap: '16px'
  //         }}>
  //           <p>Please log in to view your orders</p>
  //         </div>
  //       </div>

  //       {/* Authentication Modals */}
  //       <AuthModals
  //         showLogin={showLoginModal}
  //         showRegister={showRegisterModal}
  //         onCloseAll={handleCloseAuthModals}
  //         onAuthSuccess={handleAuthSuccess}
  //         onSwitchToRegister={handleSwitchToRegister}
  //         onSwitchToLogin={handleSwitchToLogin}
  //       />
  //     </div>
  //   );
  // }

  const { data: currentData, meta } = getCurrentData();

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
             onClick={() => handleTabChange("pending")}
          >
            Unpaid {pendingData?.meta?.total_count > 0 && `(${pendingData?.meta?.total_count})`}
          </button>
          <button 
            className={`tab-button ${activeTab === "paid" ? "active" : ""}`} 
            onClick={() => handleTabChange("paid")}
          >
            Paid {paidData?.meta?.total_count > 0 && `(${paidData?.meta?.total_count})`}
          </button>
          <button 
            className={`tab-button ${activeTab === "delivering" ? "active" : ""}`} 
           onClick={() => handleTabChange("delivering")}
          >
            In delivery {deliveryData?.meta?.total_count > 0 && `(${deliveryData?.meta?.total_count})`}
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
                      activeTab={activeTab}
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

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <Pagination
            currentPage={meta.current_page || getCurrentPage()}
            totalPages={meta.total_pages}
            totalItems={meta.total_count}
            name='Orders'
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            className={getCurrentPreviousData() ? 'pagination-loading' : ''}
          />
        )}

        {/* Selected Items & Payment (only for pending tab) */}
        {activeTab === "pending" && selectedItemsCount > 0 && (
          <div className="selected-items-indicator">
            <span>
              {selectedItemsCount} item{selectedItemsCount !== 1 ? "s" : ""} selected — ₦{totalPrice}
            </span>
          </div>
        )}

        {activeTab === "pending" && pendingData?.orders?.length > 0 && (
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
          selectedOrders={pendingData?.orders?.filter(order => checkedOrders[order.id])}
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
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          <PaymentSuccessModal onClose={() => setIsPaymentSuccessful(false)} />
        </>
      )}

      {/* Authentication Modals */}
      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default PendingOrders;