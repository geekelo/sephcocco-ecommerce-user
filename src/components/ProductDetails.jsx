import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageGallery from './ImageGallery';
import LikeButton from './LikeButton';
import ActionButtons from './ActionButtons';
import ExpandableDescription from './ExpandableDescription';
import '../styles/ProductDetails.css';
import { HelpCircle } from 'lucide-react';

const ProductDetails = ({ product, onCloseModal, onBuyNow }) => {
  const [selectedImage, setSelectedImage] = useState(product?.main_image_url);
  const [isPending, setIsPending] = useState(false);
  
  const shortDescription = product?.short_description || "No description available";
  const longDescription = product?.long_description || null;

  if (!product) {
    return <div className="product-loading">Loading product details...</div>;
  }

  const handleLike = (isLiked) => {
    // Here you would typically update this on the backend
    console.log(`Product ${product.id} like status changed to: ${isLiked}`);
  };

  const handlePendingOrder = () => {
    setIsPending(true);
    // Here you would typically update this on the backend
    console.log(`Product ${product.id} added to pending orders`);
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
          images={product.other_image_urls}
          selectedImage={selectedImage}
          onSelect={setSelectedImage}
        />
        <div className="product-details-info">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <LikeButton 
              initialLikes={product.likes}
              isLiked={product.liked_by_user}
              onLike={handleLike}
            />
          </div>
          
          <p className="stock-status">
            {!product?.out_of_stock_status
              ? `In stock : ${product.amount_in_stock} Items`
              : 'Out of stock'}
          </p>
          
          <div className="product-price">₦{parseFloat(product?.price || 0).toFixed(2)}</div>

          <div className="product-description">
            <h3>Product Description</h3>
            <ExpandableDescription
              shortDescription={shortDescription}
              longDescription={longDescription}
            />
          </div>
          
          <div className="pending-order-container">
          <div className="enquiry-help">
    <HelpCircle size={18} strokeWidth={1.5} className="help-icon" />
    <span className="help-text">Make enquiries</span>
  </div>
          </div>
          
          <ActionButtons 
          onPending={handlePendingOrder}
            product={product}
            closeProductModal={onCloseModal}
            onBuyNow={onBuyNow}
            isPending={isPending}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetails;