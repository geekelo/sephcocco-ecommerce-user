import '../styles/ProductCard.css'
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
export const ProductCard = ({ 
    product, 
    onAddToCart = () => {}, 
    onFavorite = () => {} 
  }) => {
    const { 
      id, 
      image, 
      name, 
      price, 
      inStock, 
      stockCount, 
      isFavorite = false 
    } = product;
  
    return (
      <motion.div 
        className="product-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        <div className="product-image-container">
          <img src={image} alt={name} className="product-image" />
          <motion.button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={() => onFavorite(id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart size={16} fill={isFavorite ? "#ff6b6b" : "none"} color={isFavorite ? "#ff6b6b" : "#888"} />
          </motion.button>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <div className="product-price">${price.toFixed(2)}</div>
          <div className="product-stock">
            <span className={inStock ? 'in-stock' : 'out-of-stock'}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {stockCount && <span className="stock-count">{stockCount} items</span>}
          </div>
        </div>
        
        <motion.button 
          className="add-to-cart-button"
          onClick={() => onAddToCart(id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inStock}
        >
          Add Now
        </motion.button>
      </motion.div>
    );
  };