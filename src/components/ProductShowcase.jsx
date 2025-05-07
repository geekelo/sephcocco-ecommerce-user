import '../styles/ProductShowcase.css'
import React from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from './SectionTitle';
import { ProductCard } from './ProductCard';

export const ProductShowcase = ({ 
  title, 
  products = [], 
  seeAllLink = "#",
  onAddToCart = () => {},
  onFavorite = () => {},
  maxItems = 8,
  onProductClick = () => {}
}) => {
  const displayProducts = products.slice(0, maxItems);

  return (
    <div className="product-showcase">
      <SectionTitle title={title} seeAllLink={seeAllLink} />
      
      <motion.div 
        className="product-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {displayProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
            onFavorite={onFavorite}
            onButtonClick={() => onProductClick(product)} 
            buttonText="Place Order"
          />
        ))}
      </motion.div>
    </div>
  );
};
