import React from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import '../styles/ProductCard.css';

export const ProductCard = ({
  product,
  onFavorite = () => {},
  onButtonClick = () => {},
  buttonText,
}) => {
  const {
    id,
    images,
    name,
    price,
    inStock,
    stockCount,
    isFavorite = false,
    likes = 0,
  } = product;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={images[0]} alt={name} className="product-image" />
        <button
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={() => onFavorite(id)}
        >
          <Heart
            size={16}
            fill={isFavorite ? '#ff6b6b' : 'none'}
            color={isFavorite ? '#ff6b6b' : '#888'}
          />
        </button>
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