import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageGallery from './ImageGallery';
import LikeButton from './LikeButton';
import ActionButtons from './ActionButtons';
import ExpandableDescription from './ExpandableDescription';
import '../styles/ProductDetails.css';

const ProductDetails = ({ product, onCloseModal, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);
  
  const shortDescription = product?.shortDescription || "No description available";
  const longDescription = product?.longDescription || null;

  if (!product) {
    return <div className="product-loading">Loading product details...</div>;
  }

  const handleLike = (isLiked) => {
    // Here you would typically update this on the backend
    console.log(`Product ${product.id} like status changed to: ${isLiked}`);
  };

  return (
    <div className="product-details-container">
      <motion.div 
        className="product-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ImageGallery
          images={product.images}
          selectedImage={selectedImage}
          onSelect={setSelectedImage}
        />
        <div className="product-details-info">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <LikeButton 
              initialLikes={product.likes}
              isLiked={product.isFavorite}
              onLike={handleLike}
            />
          </div>
          
          <p className="stock-status">
            {product.inStock
              ? `In stock : ${product.stockCount} Items`
              : 'Out of stock'}
          </p>
          
          <div className="product-price">${product.price.toFixed(2)}</div>

          <div className="product-description">
            <h3>Product Description</h3>
            <ExpandableDescription
              shortDescription={shortDescription}
              longDescription={longDescription}
            />
          </div>
          
          <ActionButtons 
            product={product} 
            closeProductModal={onCloseModal}
            onBuyNow={onBuyNow}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;