// ProductSkeleton.js
import React from 'react';
import '../styles/ProductSkeleton.css';

export const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-rating"></div>
        </div>
        <div className="skeleton-price"></div>
        <div className="skeleton-stock"></div>
        <div className="skeleton-actions">
          <div className="skeleton-button"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </div>
  );
};