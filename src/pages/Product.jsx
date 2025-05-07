import React, { useState } from 'react';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';
import '../styles/Product.css';
import { RenderMultipleShowcases } from '../components/RenderMultipleShowCases';
import ProductModal from '../components/ProductModal';
import OrderModal from '../components/OrderModal';

export default function Product() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Categories', 'Rating'];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleBuyNow = () => {
    // Close product modal and open order modal
    setIsProductModalOpen(false);
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <SearchFilter className='mobile-product-only' filterOptions={filterOptions}/>
      <Hero/>
      <section className="product-showcases-container">
        <RenderMultipleShowcases onProductClick={handleProductClick} />
      </section>
      
      {isProductModalOpen && 
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setIsProductModalOpen(false)}
          onBuyNow={handleBuyNow}
        />
      }
      
      {isOrderModalOpen && 
        <OrderModal 
          product={selectedProduct} 
          onClose={() => setIsOrderModalOpen(false)}
        />
      }
    </>
  );
}