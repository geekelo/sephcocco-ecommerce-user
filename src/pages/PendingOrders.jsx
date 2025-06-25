import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';
import { DeliveryOrderItem } from "../components/DeliveryOrderItem";
import { PendingOrderItem } from "../components/PendingOrderItem";
import { orders, getSimilarOrderProducts } from "../constants/orders";
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

const PendingOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'delivering'
  const [orderQuantities, setOrderQuantities] = useState({});
  const [checkedOrders, setCheckedOrders] = useState({});
  const navigate = useNavigate();
  const activeOutlet = getActiveOutlet()
  const {data: orderData, refetch} = useGetPendingOrder(activeOutlet)
  const deleteOrderMutation = useDeleteOrder();
  const updateOrderMutation = useUpdateOrder();
const {data: deliveryData} = useGetDeliveryOrder(activeOutlet)
  console.log("Order Data:", orderData);
  
  // Check for mobile device on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter orders based on their status
  const pendingApprovalOrders = orders.filter(order => 
    ['Processing Order', 'Processing Payment', 'Awaiting Payment Confirmation'].includes(order.status)
  );

  const deliveringOrders = orders.filter(order => 
    ['Delivering'].includes(order.status)
  );

  // Initialize quantities for pending orders
  useEffect(() => {
    const initialQuantities = {};
    pendingApprovalOrders.forEach(order => {
      initialQuantities[order.id] = order.items ? order.items.length : 1;
    });
    setOrderQuantities(initialQuantities);
  }, []);

  // Set current order for similar discounts - default to first order of active tab
  useEffect(() => {
    const activeOrders = activeTab === 'pending' ? pendingApprovalOrders : deliveringOrders;
    if (activeOrders.length > 0 && (!currentOrder || !activeOrders.some(order => order.id === currentOrder.id))) {
      setCurrentOrder(activeOrders[0]);
    }
  }, [activeTab, pendingApprovalOrders, deliveringOrders, currentOrder]);

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
  const handleDeleteOrder = (orderId) => {
    deleteOrderMutation.mutate(
      { active_outlet: activeOutlet, orderId },
      {
        onSuccess: () => {
          toast.success("Order deleted successfully");
          // Optional: Refresh or remove the order from the local state/UI
        },
        onError: () => {
          toast.error("Failed to delete order");
        }
      }
    );
    refetch();
  };
  
  const handleOrderClick = (order) => {
    setCurrentOrder(order);
  };
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const handleQuantityUpdate = (orderId, newQuantity) => {
    setOrderQuantities(prev => ({
      ...prev,
      [orderId]: newQuantity
    }));
  
    updateOrderMutation.mutate(
      {
        active_outlet: activeOutlet,
        orderId,
        payload: {
          [`sephcocco_${activeOutlet}order`]: {
            quantity: newQuantity
          }
        }
      }
    );
    refetch()
  };
  
  // Increase quantity for a pending order
  const increaseQuantity = (orderId) => {
    const newQty = (orderQuantities[orderId] || 1) + 1;
    setOrderQuantities(prev => ({
      ...prev,
      [orderId]: (prev[orderId] || 1) + 1
    }));
    handleQuantityUpdate(orderId, newQty);
  };

  // Decrease quantity for a pending order
  const decreaseQuantity = (orderId) => {
    const currentQty = orderQuantities[orderId] || 1;
    const newQty = Math.max(1, currentQty - 1);
  
    setOrderQuantities(prev => ({
      ...prev,
      [orderId]: Math.max(1, (prev[orderId] || 1) - 1)
    }));
    handleQuantityUpdate(orderId, newQty);
  };

  // Toggle checked state of an order
  const toggleOrderCheck = (orderId) => {
    setCheckedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Calculate total selected items
  const calculateSelectedItems = () => {
    let totalItems = 0;

    pendingApprovalOrders.forEach(order => {
      if (checkedOrders[order.id]) {
        const quantity = orderQuantities[order.id] || 1;
        totalItems += quantity;
      }
    });

    return totalItems;
  };

  const selectedItemsCount = calculateSelectedItems();
  const hasSelectedItems = selectedItemsCount > 0;

  // Get selected orders data for the payment modal
  const getSelectedOrdersData = () => {
    return pendingApprovalOrders
      .filter(order => checkedOrders[order.id])
      .map(order => ({
        ...order,
        quantity: orderQuantities[order.id] || 1,
        total: (orderQuantities[order.id] || 1) * order.price
      }));
  };

  // Handle make payment button click
  const handleMakePayment = () => {
    setIsPaymentModalOpen(true);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
 
    
    setIsPaymentModalOpen(false);  // Close the payment modal
    setIsPaymentSuccessful(true);  // Show success message
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

  // Get similar products with applied discounts
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
          <h1 className="header-title">Orders</h1>
        </div>
        
        {/* Tab Navigation - Centered */}
        <div className="order-tabs">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
           Unpaid ({pendingApprovalOrders.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'delivering' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivering')}
          >
            In Delivery ({deliveringOrders.length})
          </button>
        </div>
        
        {/* Payment Success Message */}

        {isPaymentSuccessful && (
  <>
    <div className="payment-success-backdrop" />
    <PaymentSuccessModal onClose={() => setIsPaymentSuccessful(false)} />
  </>
)}
        {/* Selected Items Indicator */}
       
        
        {/* Order List */}
        <div className="orders-content">
          <AnimatePresence mode="wait">
            <motion.div 
              className="order-list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              key={activeTab} // Force re-render of animation when tab changes
            >
              {activeTab === 'pending' ? (
                orderData?.length > 0 ? (
                  orderData?.map((order, index) => (
                    <PendingOrderItem 
                      key={order.id}
                      order={order}
                      index={index}
                      quantity={orderQuantities[order.quantity] || 1}
                      onIncrease={() => increaseQuantity(order.quantity)}
                      onDecrease={() => decreaseQuantity(order.quantity)}
                      onClick={() => handleOrderClick(order)}
                      isSelected={currentOrder && currentOrder.id === order.id}
                      isChecked={!!checkedOrders[order.id]}
                      onToggleCheck={toggleOrderCheck}
                      onDelete={handleDeleteOrder}
                    />
                  ))
                ) : (
                  <div className="no-orders-message">
                    No pending orders to approve.
                  </div>
                )
              ) : (
                deliveryData?.length > 0 ? (
                  deliveryData?.map((order, index) => (
                    <DeliveryOrderItem 
                      key={order.id}
                      order={order}
                      index={index}
                      onClick={() => handleOrderClick(order)}
                      isSelected={currentOrder && currentOrder.id === order.id}
                    />
                  ))
                ) : (
                  <div className="no-orders-message">
                    No orders in delivery.
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        {activeTab === 'pending' && hasSelectedItems && !isPaymentSuccessful && (
          <div className="selected-items-indicator">
            <span className="selected-items-text">
              <em>{selectedItemsCount} item{selectedItemsCount !== 1 ? 's' : ''} selected</em>
            </span>
          </div>
        )}
        {/* Make Payment Button (only show in pending tab) */}
        {activeTab === 'pending' && orderData?.length > 0 && (
          <div className="make-payment-container">
            <button 
              className="make-payment-button"
              disabled={!hasSelectedItems}
              onClick={handleMakePayment}
            >
              <ShoppingCart size={18} style={{ marginRight: '8px' }} />
              Make Payment
            </button>
          </div>
        )}
        
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
      
      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          selectedOrders={getSelectedOrdersData()}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default PendingOrders;