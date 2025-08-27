import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageGallery from './ImageGallery';
import LikeButton from './LikeButton';
import ActionButtons from './ActionButtons';
import ExpandableDescription from './ExpandableDescription';
import '../styles/ProductDetails.css';
import { HelpCircle } from 'lucide-react';
import { useLikedProduct } from '../hooks/useLikedProduct';
import { useUnlikedProduct } from '../hooks/useUnlikedProduct';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { useNavigate } from 'react-router-dom';

const ProductDetails = ({ product, onCloseModal, onBuyNow, onProductUpdate }) => {
  const [selectedImage, setSelectedImage] = useState(product?.main_image_url);
  const [isPending, setIsPending] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;
  const navigate = useNavigate()
  // Get current active outlet
  const activeOutlet = getActiveOutlet();
  
  // Like/Unlike mutations
  const likeProductMutation = useLikedProduct();
  const unlikeProductMutation = useUnlikedProduct();
   
  const shortDescription = product?.short_description || "No description available";
  const longDescription = product?.long_description || null;

  if (!product) {
    return <div className="product-loading">Loading product details...</div>;
  }

  // Handle Like Product
  const handleLikeProduct = async () => {
    if (!isLoggedIn) return;

    try {
    
      
       await likeProductMutation.mutateAsync({
        active_outlet: activeOutlet,
        productId: product.id
      });
      
  
      
      // Notify parent to refetch/update data
      onProductUpdate?.();
      console.log('Product liked successfully');
    } catch (error) {
      console.error('❌ LIKE API CALL FAILED');
      console.error('Failed to like product:', error);
    }
  };

  // Handle Unlike Product
  const handleUnlikeProduct = async () => {
    if (!isLoggedIn) return;

    try {
  
      
       await unlikeProductMutation.mutateAsync({
        active_outlet: activeOutlet,
        productId: product.id
      });
      
   
      
      // Notify parent to refetch/update data
      onProductUpdate?.();
      console.log('Product unliked successfully');
    } catch (error) {

    }
  };

  // Handle Like Toggle - determines whether to like or unlike
  const handleLikeToggle = async () => {
    if (!isLoggedIn) return;


    if (product.liked_by_user) {
      // If already liked, unlike it
      console.log('🔄 Product is currently LIKED - calling UNLIKE');
      await handleUnlikeProduct();
    } else {
      // If not liked, like it
      console.log('🔄 Product is currently UNLIKED - calling LIKE');
      await handleLikeProduct();
    }
    
    console.log('=== END LIKE TOGGLE DEBUG ===');
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
            {/* Only show like button if user is logged in */}
            {isLoggedIn && (
              <LikeButton 
                initialLikes={product.likes}
                isLiked={product.liked_by_user}
                onLike={handleLikeToggle}
                disabled={false}
                isLoading={likeProductMutation.isPending || unlikeProductMutation.isPending}
              />
            )}
          </div>
           
          <p className="stock-status">
            {!product?.out_of_stock_status
              ? `In stock : ${product.amount_in_stock} Items`
              : 'Out of stock'}
          </p>
           
        {
product?.discount_price ? <div className="discount-price"> ₦{parseFloat(product?.discount_price || 0).toFixed(2) } <span className='product-price'> ₦{product.price}</span></div> : <p className="discount-price">
  ₦{parseFloat(product?.price || 0).toFixed(2)}
</p>
}
          
          <div className="product-description">
            <h3>Product Description</h3>
            <ExpandableDescription
              shortDescription={shortDescription}
              longDescription={longDescription}
            />
          </div>
           
          <div className="pending-order-container">
            <div className="enquiry-help" onClick={() => navigate('/messages')}>
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