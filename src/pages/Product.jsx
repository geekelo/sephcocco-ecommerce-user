import React, { useState } from 'react';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';
import '../styles/Product.css';
import { RenderMultipleShowcases } from '../components/RenderMultipleShowCases';
import ProductModal from '../components/ProductModal';
import OrderModal from '../components/OrderModal';
import { AuthModals } from '../components/AuthModal';


export default function Product() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingOrderProduct, setPendingOrderProduct] = useState(null);

  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Categories', 'Rating'];

  // Check if user is logged in
  const isUserLoggedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleBuyNow = () => {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
      // Store the product for later and show login modal
      setPendingOrderProduct(selectedProduct);
      setIsProductModalOpen(false);
      setShowLoginModal(true);
      return;
    }

    // User is logged in, proceed with order
    setIsProductModalOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // User successfully logged in/registered
    if (pendingOrderProduct) {
      // Continue with the order process
      setSelectedProduct(pendingOrderProduct);
      setIsOrderModalOpen(true);
      setPendingOrderProduct(null);
    }
  };

  const handleCloseAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    // Clear pending order if user cancels auth
    setPendingOrderProduct(null);
  };

  const handleOrderModalClose = () => {
    setIsOrderModalOpen(false);
    // Clear selected product when order modal is closed
    setSelectedProduct(null);
  };

  const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    // Clear selected product when product modal is closed
    setSelectedProduct(null);
  };

  return (
    <>
      <SearchFilter className='mobile-product-only' filterOptions={filterOptions}/>
      <Hero/>
      <section className="product-showcases-container">
        <RenderMultipleShowcases onProductClick={handleProductClick} />
      </section>
      
      {/* Product Modal */}
      {isProductModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={handleProductModalClose}
          onBuyNow={handleBuyNow}
        />
      )}
      
      {/* Order Modal - only shown when user is authenticated */}
      {isOrderModalOpen && (
        <OrderModal
          product={selectedProduct}
          onClose={handleOrderModalClose}
        />
      )}

      {/* Authentication Modals */}
      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}