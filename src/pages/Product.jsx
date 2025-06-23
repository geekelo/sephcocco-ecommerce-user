import React, { useState, useMemo, useEffect } from 'react';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';
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


export default function Product() {
  const [activeOutlet, setActiveOutlet] = useState(getActiveOutlet());
  
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

  // Fetch data
  const { data: productsData, isLoading: productsLoading, error: productsError, refetch } = useViewAllProduct(activeOutlet);
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError,refetch: refetchCategories } = useViewProductCategories(activeOutlet);
console.log('prod',productsData);

  const products = productsData?.products || [];
  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Rating'];
  const isLoading = productsLoading || categoriesLoading;
  const error = productsError || categoriesError;




  // Watch for changes in the actual outlet (in case it changes elsewhere)
  useEffect(() => {
    const currentOutlet = getActiveOutlet();
    if (currentOutlet !== activeOutlet) {
      setActiveOutlet(currentOutlet);
      refetch();
    refetchCategories();
    }
  }, [activeOutlet, refetch, refetchCategories]);

  // Simple filtering and sorting using global state
  const filteredAndSortedProducts = useMemo(() => {

    if (!products || products.length === 0) {
    
      return [];
    }
    
    let result = [...products];
    
    // 1. Apply search (if search term exists)
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
    
    // 2. Apply category filter (if category is selected)
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
    
    // 3. Apply sorting (if sort option is selected)
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
    
    const finalResult = result.slice(0, 15);
    console.log('Final result length:', finalResult.length);
    console.log('=== END FILTERING DEBUG ===');
    
    return finalResult;
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Mobile-only event handlers (for the mobile SearchFilter)
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
    const isLoggedIn = localStorage.getItem('token') !== null;
    
    if (!isLoggedIn) {
      setPendingOrderProduct(selectedProduct);
      setIsProductModalOpen(false);
      setShowLoginModal(true);
      return;
    }

    setIsProductModalOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (pendingOrderProduct) {
      setSelectedProduct(pendingOrderProduct);
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
  };

  // Loading state
  if (isLoading) {
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
        <section className="product-showcases-container">
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
      {/* Mobile-only SearchFilter */}
      <SearchFilter 
        className='mobile-product-only' 
        filterOptions={filterOptions}
        categories={categories}
        onSearch={handleMobileSearch}
        onSortChange={handleMobileSortChange}
        onCategoryChange={handleMobileCategoryChange}
      />
      <Hero/>
      <section className="product-showcases-container">
        
        
        {filteredAndSortedProducts.length > 0 ? (
          <RenderMultipleShowcases 
            products={filteredAndSortedProducts}
            onProductClick={handleProductClick} 
          />
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
        />
      )}
           
      {isOrderModalOpen && (
        <OrderModal
          product={selectedProduct}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}