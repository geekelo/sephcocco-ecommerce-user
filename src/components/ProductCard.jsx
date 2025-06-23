import React from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import '../styles/ProductCard.css';

export const ProductCard = ({
  product,
  onFavorite = () => {},
  onButtonClick = () => {},
  buttonText = "Place Order",
}) => {
  const {
    id,
    name,
    price,
    amount_in_stock,
    out_of_stock_status,
    likes,
    liked_by_user = false,
    main_image_url,
    other_image_urls = [],
  } = product;

  // Get the first available image
  const productImage = main_image_url 

  // Determine if product is in stock
  const inStock = !out_of_stock_status && amount_in_stock > 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={productImage} alt={name} className="product-image" />
        <button
          className={`favorite-button ${liked_by_user ? 'active' : ''}`}
          onClick={() => onFavorite(id)}
        >
          <Heart
            size={16}
            fill={liked_by_user ? '#ff6b6b' : 'none'}
            color={liked_by_user ? '#ff6b6b' : '#888'}
          />
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-price">₦{parseFloat(price || 0).toFixed(2)}</div>
        <div className="product-stock">
          <span className={inStock ? 'in-stock' : 'out-of-stock'}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          {amount_in_stock > 0 && (
            <span className="stock-count">{amount_in_stock} items</span>
          )}
        </div>
        <div className="product-likes">
          <ThumbsUp size={14} /> <span>{likes} likes</span>
        </div>
      </div>

      <button
        className="add-to-cart-button"
        onClick={() => onButtonClick(product)}
        disabled={!inStock}
      >
        {buttonText}
      </button>
    </div>
  );
};