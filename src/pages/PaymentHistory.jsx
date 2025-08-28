import React from "react";
import { MobilePaymentHistoryCard } from "../components/MobilePaymentHistory";
import { DesktopPaymentHistoryTable } from "../components/DesktopPaymentHistory";
import "../styles/PaymentHistory.css";
import { useViewPayment } from "../hooks/useViewPayment";
import { getActiveOutlet } from "../utils/getActiveOutlets";
import { getActiveUser } from "../utils/getActiveUser";
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import Pagination from "../components/Pagination";
import { AuthModals } from '../components/AuthModal'; // Import auth modals
import { useNavigate } from "react-router-dom";

// PaymentHistorySkeleton component (same as before)
const PaymentHistorySkeleton = ({ isMobile = false }) => {
  // Animation variants for skeleton
  const shimmerVariants = {
    initial: { backgroundPosition: "-200px 0" },
    animate: {
      backgroundPosition: "200px 0",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Skeleton for mobile payment cards
  const MobilePaymentCardSkeleton = ({ index }) => (
    <motion.div
      className="payment-card skeleton-item"
      variants={itemVariants}
      style={{
        padding: "16px",
        marginBottom: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        <div style={{ flex: 1 }}>
          {/* Transaction ID skeleton */}
          <motion.div
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: "16px",
              width: "70%",
              marginBottom: "8px",
              borderRadius: "4px",
              background:
                "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
              backgroundSize: "200px 100%",
            }}
          />

          {/* Customer name skeleton */}
          <motion.div
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: "14px",
              width: "60%",
              borderRadius: "4px",
              background:
                "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
              backgroundSize: "200px 100%",
            }}
          />
        </div>

        {/* Status badge skeleton */}
        <motion.div
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            width: "70px",
            height: "24px",
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, #dcfce7 25%, #f0fdf4 50%, #dcfce7 75%)",
            backgroundSize: "200px 100%",
          }}
        />
      </div>

      {/* Payment details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <motion.div
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: "18px",
            width: "40%",
            borderRadius: "4px",
            background:
              "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
            backgroundSize: "200px 100%",
          }}
        />

        <motion.div
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: "14px",
            width: "35%",
            borderRadius: "4px",
            background:
              "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
            backgroundSize: "200px 100%",
          }}
        />
      </div>

      {/* Order details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <motion.div
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: "12px",
            width: "50%",
            borderRadius: "4px",
            background:
              "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
            backgroundSize: "200px 100%",
          }}
        />

        <motion.div
          className="skeleton-box"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            height: "12px",
            width: "30%",
            borderRadius: "4px",
            background:
              "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
            backgroundSize: "200px 100%",
          }}
        />
      </div>
    </motion.div>
  );

  // Skeleton for desktop table
  const DesktopTableSkeleton = () => (
    <div className="desktop-table-container" style={{ marginTop: "20px" }}>
      {/* Table header skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 100px",
          gap: "16px",
          padding: "16px",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        {[...Array(7)].map((_, index) => (
          <motion.div
            key={index}
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              height: "14px",
              width: "80%",
              borderRadius: "4px",
              background:
                "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
              backgroundSize: "200px 100%",
            }}
          />
        ))}
      </div>

      {/* Table rows skeleton */}
      {[...Array(5)].map((_, rowIndex) => (
        <motion.div
          key={rowIndex}
          variants={itemVariants}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 100px",
            gap: "16px",
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {[...Array(7)].map((_, colIndex) => (
            <motion.div
              key={colIndex}
              className="skeleton-box"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                height: colIndex === 6 ? "24px" : "14px", // Status badge is taller
                width: colIndex === 6 ? "70px" : "90%",
                borderRadius: colIndex === 6 ? "12px" : "4px",
                background:
                  colIndex === 6
                    ? "linear-gradient(90deg, #dcfce7 25%, #f0fdf4 50%, #dcfce7 75%)"
                    : "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
                backgroundSize: "200px 100%",
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );

  // Filters skeleton
  const FiltersSkeleton = () => (
    <div
      className="filters-container"
      style={{
        marginBottom: "20px",
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "8px",
        display: isMobile ? "block" : "flex",
        gap: isMobile ? "12px" : "16px",
        alignItems: "center",
      }}
    >
      {/* Search bar skeleton */}
      <motion.div
        className="skeleton-box"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          height: "40px",
          width: isMobile ? "100%" : "300px",
          marginBottom: isMobile ? "12px" : "0",
          borderRadius: "6px",
          background:
            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
          backgroundSize: "200px 100%",
        }}
      />

      {/* Status filter skeleton */}
      <motion.div
        className="skeleton-box"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          height: "40px",
          width: isMobile ? "100%" : "150px",
          marginBottom: isMobile ? "12px" : "0",
          borderRadius: "6px",
          background:
            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
          backgroundSize: "200px 100%",
        }}
      />

      {/* Date filters skeleton */}
      <motion.div
        className="skeleton-box"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          height: "40px",
          width: isMobile ? "48%" : "140px",
          marginBottom: isMobile ? "12px" : "0",
          borderRadius: "6px",
          background:
            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
          backgroundSize: "200px 100%",
          display: isMobile ? "inline-block" : "block",
          marginRight: isMobile ? "4%" : "0",
        }}
      />

      <motion.div
        className="skeleton-box"
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
        style={{
          height: "40px",
          width: isMobile ? "48%" : "140px",
          borderRadius: "6px",
          background:
            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
          backgroundSize: "200px 100%",
          display: isMobile ? "inline-block" : "block",
        }}
      />
    </div>
  );

  return (
    <div className="payment-history">
      <h1 className="payment-history-title">Payment history</h1>

      {/* Filters skeleton */}
      <FiltersSkeleton />

      {/* Content skeleton based on device type */}
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {isMobile ? (
          // Mobile cards skeleton
          <div className="mobile-payment-cards">
            {[...Array(6)].map((_, index) => (
              <MobilePaymentCardSkeleton key={index} index={index} />
            ))}
          </div>
        ) : (
          // Desktop table skeleton
          <DesktopTableSkeleton />
        )}
      </motion.div>

      {/* Pagination skeleton */}
      <div
        className="pagination-container"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="skeleton-box"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              width: index === 2 ? "40px" : "32px", // Middle button is current page
              height: "32px",
              borderRadius: "6px",
              background:
                index === 2
                  ? "linear-gradient(90deg, #dbeafe 25%, #eff6ff 50%, #dbeafe 75%)"
                  : "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
              backgroundSize: "200px 100%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Main PaymentHistory component
const PaymentHistory = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  const [filters, setFilters] = useState({
    search_terms: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
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

  // Only fetch payment data if authenticated
  const { data: payment, isLoading, isPreviousData } = useViewPayment(
    activeOutlet,
    filters,
    currentPage,
    itemsPerPage,
    { enabled: isAuthenticated } // Only fetch if authenticated
  );

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

  // Handle page changes (only if authenticated)
  const handlePageChange = (page) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter changes from child components (only if authenticated)
  const handleFilterChange = (newFilters) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Convert filter names to match API expectations
    const apiFilters = {
      search_terms: newFilters.search_terms || "",
      status: newFilters.status || "",
      start_date: newFilters.startDate || newFilters.start_date || "",
      end_date: newFilters.endDate || newFilters.end_date || "",
    };

    setFilters(apiFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show loading skeleton if checking auth or loading data
  if (isCheckingAuth || (isAuthenticated && isLoading)) {
    return <PaymentHistorySkeleton isMobile={isMobile} />;
  }

  // Don't render main content if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="payment-history">
        <h1 className="payment-history-title">Payment history</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          flexDirection: 'column',
          gap: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p>Please log in to view your payment history</p>
        </div>

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
  }

  // Fix: Get meta from the correct location in the API response
  const meta = payment?.meta || {};
  
  const paymentData = isAuthenticated ? (
    payment?.payments?.flatMap(
      (payment) =>
        payment.paid_orders?.map((order) => ({
          id: payment.id,
          customerName: order.customer?.name,
          customerEmail: order.customer?.email,
          orderId: order.id,
          phoneNumber: order.customer?.phone_number,
          orderDate: order.created_at,
          orderStatus: order.status,
          paymentMethod: payment.payment_method,
          status: payment.status,
          notes: order.notes,
          products: order.product,
          amount: payment.amount,
          transactionId: payment.transaction_id,
          paymentDate: payment.created_at,
          orderNumber: order.order_number,
          totalPrice: order.total_price,
          // Add formatted date for filtering
          date: new Date(payment.created_at).toLocaleDateString(),
          // Add timestamp for sorting
          timestamp: new Date(payment.created_at).getTime(),
        })) || []
    )
    // Sort by most recent first (descending order)
    .sort((a, b) => b.timestamp - a.timestamp) || []
  ) : [];

  return (
    <div className="payment-history">
      <h1 className="payment-history-title">Payment history</h1>
      {isMobile ? (
        <MobilePaymentHistoryCard
          payments={paymentData}
          onFilterChange={handleFilterChange}
        />
      ) : (
        <DesktopPaymentHistoryTable
          payments={paymentData}
          onFilterChange={handleFilterChange}
        />
      )}
      
      {/* Show pagination only if there are multiple pages and user is authenticated */}
      {isAuthenticated && meta && meta.total_pages > 1 && (
        <Pagination
          currentPage={meta.current_page || currentPage}
          totalPages={meta.total_pages}
          totalItems={meta.total_count}
          itemsPerPage={itemsPerPage}
          name='Payment history'
          onPageChange={handlePageChange}
          className={isPreviousData ? 'pagination-loading' : ''}
        />
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

export default PaymentHistory;