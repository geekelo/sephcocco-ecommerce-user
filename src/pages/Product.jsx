import React, { useState } from 'react';
import SearchFilter from '../components/SearchFilter';
import Hero from '../components/Hero';
import '../styles/Product.css';
import { RenderMultipleShowcases } from '../components/RenderMultipleShowCases';
import ProductModal from '../components/ProductModal';
import { allProducts } from '../constants/productData';

export default function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Categories', 'Rating'];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <SearchFilter className='mobile-product-only' filterOptions={filterOptions}/>
      <Hero/>
      <section className="product-showcases-container">
        <RenderMultipleShowcases onProductClick={handleProductClick} />
      </section>
      {isModalOpen && 
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      }
    </>
  );
}
