import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

import '../styles/ProductInfo.css';
import LikeButton from './LikeButton';
import { OrderStatusBadge } from './OrderStatusBadge';

const ProductInfo = ({ name, image, onTrackOrder, price, rating, ratingCount, status,likes,isFavorite }) => {

    const handleTrackOrder = () => {
        // Implement order tracking functionality
        console.log('Track order:', order.id);
      };
      
      const handleDiscardOrder = () => {
        // Implement discard order functionality
        console.log('Discard order:', order.id);
      };
    const handleLike = (isLiked) => {
        // Here you would typically update this on the backend
        console.log(`Product ${product.id} like status changed to: ${isLiked}`);
      };
    
  return (
    <div className="product-info-container">
      <div className="product-info-left">
        <div className="product-image-order-container">
          <img src={image} alt={name} className="product-order-product-image" />
        </div>
      </div>
      
      <div className="product-info-right">
        <h2 className="product-order-product-name ">{name}</h2>
        
        <div className="product-status-row">
          <OrderStatusBadge status={status} />
        </div>
        
        <div className="product-rating">
          <div className="stars-container">
          <LikeButton 
          disabled={true}
              initialLikes={likes}
              isLiked={isFavorite}
              onLike={handleLike}
            />
          </div>
          <span className="rating-count">({ratingCount || 0})</span>
        </div>
        
        <div className="product-price">₦{parseFloat(price).toFixed(2)}</div>
      </div>
      <div className="order-primary-actions">
          {/* <button className="discard-button" onClick={handleDiscardOrder}>
            <span>Discard Order</span>
            <ArrowRight size={16} />
          </button> */}
          
          <button className="track-button" onClick={onTrackOrder}>
            Track Order
          </button>
        </div>
    </div>
  );
};

export default ProductInfo;