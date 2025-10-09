import React, { useState, useMemo } from 'react';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';
import '../styles/Product.css';
import { RenderMultipleShowcases } from '../components/RenderMultipleShowCases';
import ProductModal from '../components/ProductModal';
import OrderModal from '../components/OrderModal';
import { AuthModals } from '../components/AuthModal';
import ProductSkeleton from '../components/ProductSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useViewAllProduct } from '../hooks/useGetAllProduct';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser';


export default function Product() {
  const activeOutlet = getActiveOutlet();
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState('Newest First');
     
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingOrderProduct, setPendingOrderProduct] = useState(null);

  // Get user ID for API calls
  const user = getActiveUser();
  
  // Fetch products using the hook
  const { data: products = [], isLoading, error, refetch } = useViewAllProduct(activeOutlet, 1, 20, user?.id);

  const filterOptions = ['Categories', 'Price: Low to High', 'Price: High to Low', 'Newest First', 'Rating'];

  // Sort and filter products
  const sortedAndFilteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    let sortedProducts = [...products];
    
    // Apply sorting based on selected option
    switch (sortOption) {
      case 'Price: Low to High':
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'Price: High to Low':
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'Newest First':
        sortedProducts.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // Descending order (newest first)
        });
        break;
      case 'Rating':
        sortedProducts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        // Default to newest first
        sortedProducts.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA;
        });
    }
    
    // Return top 15 products
    return sortedProducts.slice(0, 15);
  }, [products, sortOption]);

  // Check if user is logged in
  const isUserLoggedIn = () => {
    return localStorage.getItem('token') !== null;
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
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
    setIsOrderModalClose(false);
    // Clear selected product when order modal is closed
    setSelectedProduct(null);
  };

  const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    // Clear selected product when product modal is closed
    setSelectedProduct(null);
  };

  const handleRetry = () => {
    refetch();
  };

  // Render loading state
  if (isLoading) {
    return (
      <>
        <SearchFilter 
          className='mobile-product-only' 
          filterOptions={filterOptions}
          onSortChange={handleSortChange}
          currentSort={sortOption}
        />
        <Hero/>
        <section className="product-showcases-container">
          <div className="products-loading-container">
            <div className="products-grid">
              {Array.from({ length: 15 }).map((_, idx) => (
                <div className="product-grid-item" key={`skeleton-${idx}`}>
                  <ProductSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <SearchFilter 
          className='mobile-product-only' 
          filterOptions={filterOptions}
          onSortChange={handleSortChange}
          currentSort={sortOption}
        />
        <Hero/>
        <section className="product-showcases-container">
          <ErrorState 
            message="Failed to load products. Please check your connection and try again." 
            onRetry={handleRetry}
          />
        </section>
      </>
    );
  }

  // Render empty state
  if (!isLoading && (!products || products.length === 0)) {
    return (
      <>
        <SearchFilter 
          className='mobile-product-only' 
          filterOptions={filterOptions}
          onSortChange={handleSortChange}
          currentSort={sortOption}
        />
        <Hero/>
        <section className="product-showcases-container">
          <EmptyState 
            message="No products available at the moment." 
            btnText="Refresh Products"
            handleAddCategory={handleRetry}
          />
        </section>
      </>
    );
  }

  return (
    <>
      <SearchFilter 
        className='mobile-product-only' 
        filterOptions={filterOptions}
        onSortChange={handleSortChange}
        currentSort={sortOption}
      />
      <Hero/>
      <section className="product-showcases-container">
        <div className="products-section-header">
          <h2>Top {sortedAndFilteredProducts.length} Products</h2>
          <p>Showing the best products sorted by {sortOption.toLowerCase()}</p>
        </div>
        <RenderMultipleShowcases 
          products={sortedAndFilteredProducts}
          onProductClick={handleProductClick} 
        />
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