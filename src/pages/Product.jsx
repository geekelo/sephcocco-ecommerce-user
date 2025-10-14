import React, { useState, useMemo, useEffect } from 'react';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';
import Pagination from '../components/Pagination';
import '../styles/Product.css';
import { RenderMultipleShowcases } from '../components/RenderMultipleShowCases';
import ProductModal from '../components/ProductModal';
import OrderModal from '../components/OrderModal';
import { AuthModals } from '../components/AuthModal';
import {ProductSkeleton} from '../components/ProductSkeleton';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { useViewAllProduct } from '../hooks/useGetAllProduct';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { useViewProductCategories } from '../hooks/useGetProductCategories';
import { useSearch } from '../components/SearchContext';
import { useLikedProduct } from '../hooks/useLikedProduct';
import { useUnlikedProduct } from '../hooks/useUnlikedProduct';
import { getActiveUser } from '../utils/getActiveUser';
import PaymentSuccessModal from '../components/PaymentSuccessModal';
import { useGetPendingOrder } from "../hooks/useGetPendingOrder";
import { useGetLocation } from '../hooks/useGetLocation';

export default function Product() {
  const [activeOutlet, setActiveOutlet] = useState(getActiveOutlet());
  const activeUser = getActiveUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Get global search state
  const { 
    searchTerm, 
    sortOption, 
    selectedCategory, 
    updateSearch, 
    updateSort, 
    updateCategory,
    clearAllFilters 
  } = useSearch();
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
     
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [pendingOrderProduct, setPendingOrderProduct] = useState(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  
  // Fixed: Initialize checkedOrders as an object to track selected products
  const [checkedOrders, setCheckedOrders] = useState({});
  
  // Fetch data with pagination
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError, 
    refetch,
    isPreviousData 
  } = useViewAllProduct(activeOutlet, currentPage, itemsPerPage, activeUser?.id);
  
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError, 
    refetch: refetchCategories 
  } = useViewProductCategories(activeOutlet);
const {data: locations, isLoading: locationsLoading, error: locationsError} = useGetLocation()
console.log('locations',locations);

  // Add pending orders hook for refetching
  const { refetch: refetchPendingOrders } = useGetPendingOrder(
    activeOutlet, 
    1,
    10,
    { enabled: false } 
  );

;

  // Like/Unlike mutations
  const likeProductMutation = useLikedProduct();
  const unlikeProductMutation = useUnlikedProduct();

  const products = productsData?.products || [];
  const meta = productsData?.meta || {};
  const filterOptions = ['Categories', 'Price: Low to High', 'Price: High to Low', 'Newest First', 'Rating'];
  const isLoading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  // Watch for changes in the actual outlet (in case it changes elsewhere)
  useEffect(() => {
    const currentOutlet = getActiveOutlet();
    if (currentOutlet !== activeOutlet) {
      setActiveOutlet(currentOutlet);
      setCurrentPage(1);
      refetch();
      refetchCategories();
    }
  }, [activeOutlet, refetch, refetchCategories]);

  // Listen for outlet changes from Header component
  useEffect(() => {
    const handleOutletChange = (event) => {
      const newOutlet = event.detail.newOutlet;
      console.log('Product component received outlet change:', newOutlet);
      
      if (newOutlet !== activeOutlet) {
        setActiveOutlet(newOutlet);
        setCurrentPage(1);
        refetch();
        refetchCategories();
      }
    };

    window.addEventListener('outletChanged', handleOutletChange);
    
    return () => {
      window.removeEventListener('outletChanged', handleOutletChange);
    };
  }, [activeOutlet, refetch, refetchCategories]);

  // Handle Like Product
  const handleLikeProduct = async (productId) => {
    const isLoggedIn = localStorage.getItem('token') !== null;
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      console.log('Liking product:', productId);
      await likeProductMutation.mutateAsync({
        active_outlet: activeOutlet,
        productId: productId
      });
      
      refetch();
      console.log('Product liked successfully');
    } catch (error) {
      console.error('Failed to like product:', error);
    }
  };

  // Handle Unlike Product
  const handleUnlikeProduct = async (productId) => {
    const isLoggedIn = localStorage.getItem('token') !== null;
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      console.log('Unliking product:', productId);
      await unlikeProductMutation.mutateAsync({
        active_outlet: activeOutlet,
        productId: productId
      });
      
      refetch();
      console.log('Product unliked successfully');
    } catch (error) {
      console.error('Failed to unlike product:', error);
    }
  };

  // Handle Favorite Toggle
  const handleFavoriteToggle = async (productId) => {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    if (product.liked_by_user) {
      await handleUnlikeProduct(productId);
    } else {
      await handleLikeProduct(productId);
    }
  };

  // Fixed: Add function to handle product selection for orders
  const handleProductSelection = (productId, isSelected) => {
    setCheckedOrders(prev => ({
      ...prev,
      [productId]: isSelected
    }));
  };

  // Client-side filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    
    let result = [...products];
    
    // Apply search
    if (searchTerm && searchTerm.trim()) {
      console.log('🔍 APPLYING SEARCH for:', searchTerm);
      const search = searchTerm.toLowerCase().trim();
      
      result = result.filter(product => {
        const name = (product?.name || '').toLowerCase();
        const shortDesc = (product?.short_description || '').toLowerCase();
        const longDesc = (product?.long_description || '').toLowerCase();
        const categoryNames = product?.categories?.map(cat => (cat?.name || '').toLowerCase()).join(' ') || '';
        
        const matches = name.includes(search) || 
               shortDesc.includes(search) || 
               longDesc.includes(search) || 
               categoryNames.includes(search);
        
        if (matches) {
          console.log(`✅ Product "${product?.name}" matches search`);
        }
        
        return matches;
      });
      
      console.log(`Search filtered: ${products.length} → ${result.length}`);
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory.trim()) {
      console.log('📁 APPLYING CATEGORY FILTER for:', selectedCategory);
      
      result = result.filter(product => {
        const hasCategory = product?.categories?.some(cat => cat?.name === selectedCategory);
        if (hasCategory) {
          console.log(`✅ Product "${product?.name}" has category "${selectedCategory}"`);
        }
        return hasCategory;
      });
      
      console.log(`Category filtered: result length now: ${result.length}`);
    }
    
    // Apply sorting
    if (sortOption && sortOption.trim()) {
      console.log('🔽 APPLYING SORT:', sortOption);
      
      switch (sortOption) {
        case 'Price: Low to High':
          result.sort((a, b) => parseFloat(a?.price || 0) - parseFloat(b?.price || 0));
          break;
        case 'Price: High to Low':
          result.sort((a, b) => parseFloat(b?.price || 0) - parseFloat(a?.price || 0));
          break;
        case 'Newest First':
          result.sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
          break;
        case 'Rating':
          result.sort((a, b) => (b?.likes || 0) - (a?.likes || 0));
          break;
      }
    }
    
    console.log('Final result length:', result.length);
    console.log('=== END FILTERING DEBUG ===');
    
    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Mobile-only event handlers
  const handleMobileSearch = (term) => {
    console.log('📱 Mobile search:', term);
    updateSearch(term);
  };

  const handleMobileSortChange = (option) => {
    console.log('📱 Mobile sort:', option);
    updateSort(option);
  };

  const handleMobileCategoryChange = (category) => {
    console.log('📱 Mobile category:', category);
    updateCategory(category);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleBuyNow = () => {
    const user = getActiveUser();
    const isLoggedIn = user && user.token && user.id;
    
    if (!isLoggedIn) {
      setPendingOrderProduct(selectedProduct);
      setIsProductModalOpen(false);
      setShowLoginModal(true);
      return;
    }

    // Fixed: Automatically select the current product for order
    if (selectedProduct) {
      setCheckedOrders(prev => ({
        ...prev,
        [selectedProduct.id]: true
      }));
    }

    setIsProductModalOpen(false);
    setIsOrderModalOpen(true);
  };

  // Updated to include pending orders refetch
  const handleProductUpdate = () => {
    refetch();
    refetchPendingOrders();
  };

  const handleAuthSuccess = () => {
    if (pendingOrderProduct) {
      setSelectedProduct(pendingOrderProduct);
      // Fixed: Auto-select the pending product
      setCheckedOrders(prev => ({
        ...prev,
        [pendingOrderProduct.id]: true
      }));
      setIsOrderModalOpen(true);
      setPendingOrderProduct(null);
    }
  };

  const handleCloseAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setPendingOrderProduct(null);
  };

  const handleRetry = () => {
    refetch();
    refetchCategories();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fixed: Create selectedOrders array based on checkedOrders state
  const selectedOrders = useMemo(() => {
    return products.filter(product => checkedOrders[product.id]);
  }, [products, checkedOrders]);

  console.log('okkd',products);

  // Loading state
  if (isLoading && !isPreviousData) {
    return (
      <>
        <SearchFilter 
          className='mobile-product-only' 
          filterOptions={filterOptions}
          categories={categories}
          onSearch={handleMobileSearch}
          onSortChange={handleMobileSortChange}
          onCategoryChange={handleMobileCategoryChange}
        />
        <Hero/>
        <section className="product-showcases-container" id="products-section">
          <div className="products-loading-container">
            <div className="products-grid">
              {Array.from({ length: itemsPerPage }).map((_, idx) => (
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

  // Error state
  if (error) {
    return (
      <>
        <SearchFilter 
          className='mobile-product-only' 
          filterOptions={filterOptions}
          categories={categories}
          onSearch={handleMobileSearch}
          onSortChange={handleMobileSortChange}
          onCategoryChange={handleMobileCategoryChange}
        />
        <Hero/>
        <section className="product-showcases-container" id="products-section">
          <ErrorState 
            message="Failed to load products. Please check your connection and try again." 
            onRetry={handleRetry}
          />
        </section>
      </>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <>
        <SearchFilter 
          className='mobile-product-only' 
          filterOptions={filterOptions}
          categories={categories}
          onSearch={handleMobileSearch}
          onSortChange={handleMobileSortChange}
          onCategoryChange={handleMobileCategoryChange}
        />
        <Hero/>
        <section className="product-showcases-container" id="products-section">
          <EmptyState 
            message="No products available at the moment." 
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
        categories={categories}
        onSearch={handleMobileSearch}
        onSortChange={handleMobileSortChange}
        onCategoryChange={handleMobileCategoryChange}
      />
      <Hero/>
      <section className="product-showcases-container" id="products-section">
        
        {filteredAndSortedProducts.length > 0 ? (
          <>
            <RenderMultipleShowcases 
              products={filteredAndSortedProducts}
              onProductClick={handleProductClick}
              onFavorite={handleFavoriteToggle}
              // Fixed: Pass selection handlers if needed by RenderMultipleShowcases
              onProductSelection={handleProductSelection}
              checkedOrders={checkedOrders}
            />
            
            {meta && meta.total_pages > 1 && (
              <Pagination
                currentPage={meta.current_page || currentPage}
                totalPages={meta.total_pages}
                totalItems={meta.total_count}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                name='Products'
                className={isPreviousData ? 'pagination-loading' : ''}
              />
            )}
          </>
        ) : (
          <EmptyState 
            message="No products match your current filters." 
            btnText="Clear Filters"
            handleAddCategory={() => {
              console.log('Clearing all filters from Product page');
              clearAllFilters();
            }}
          />
        )}
      </section>
           
      {/* Modals */}
      {isProductModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
          onBuyNow={handleBuyNow}
          onProductUpdate={handleProductUpdate} 
        />
      )}
           
      {isOrderModalOpen && (
        <OrderModal
          // Fixed: Pass the properly constructed selectedOrders array
          selectedOrders={selectedOrders}
          product={selectedProduct}
          locations={locations}
          setIsPaymentSuccessful={setIsPaymentSuccessful}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedProduct(null);
            // Fixed: Clear the selection when closing modal
            setCheckedOrders({});
          }}
        />
      )}

      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
      />
      {isPaymentSuccessful && (
        <>
          <div className="payment-success-backdrop" />
          <PaymentSuccessModal onClose={() => setIsPaymentSuccessful(false)} />
        </>
      )}
    </>
  );
}