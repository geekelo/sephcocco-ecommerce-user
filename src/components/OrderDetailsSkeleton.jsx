import React from "react";
import "../styles/OrderDetailsSkeleton.css";

const OrderDetailsSkeleton = () => {
  return (
    <div className="order-details-container">
      {/* Navigation */}
      <div className="order-details-nav">
        <div className="back-button-skeleton">
          <div className="back-icon-skeleton"></div>
          <div className="back-text-skeleton"></div>
        </div>
      </div>

      {/* Order Status Message */}
      <div className="order-status-message">
        <div className="status-text-skeleton">
          <div className="status-line-1"></div>
          <div className="status-line-2"></div>
          <div className="status-line-3"></div>
        </div>
      </div>

      {/* Product Information */}
      <div className="product-info-skeleton">
        <div className="product-image-skeleton"></div>
        <div className="product-details-skeleton">
          <div className="product-name-skeleton"></div>
          <div className="product-price-skeleton"></div>
          <div className="product-total-skeleton"></div>
          <div className="product-rating-skeleton">
            <div className="rating-stars-skeleton"></div>
            <div className="rating-count-skeleton"></div>
          </div>
          <div className="product-status-skeleton"></div>
          <div className="track-button-skeleton"></div>
        </div>
      </div>

      {/* Product Description Section */}
      <div className="product-description-section">
        <div className="section-title-skeleton"></div>
        <div className="description-text-skeleton">
          <div className="description-line-1"></div>
          <div className="description-line-2"></div>
        </div>

        {/* Information Sections */}
        <div className="info-sections-container">
          {/* Payment Information */}
          <div className="info-section-skeleton">
            <div className="info-section-title-skeleton"></div>
            <div className="info-items-skeleton">
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="info-value-skeleton"></div>
              </div>
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="info-value-skeleton long"></div>
              </div>
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="info-value-skeleton short"></div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="info-section-skeleton">
            <div className="info-section-title-skeleton"></div>
            <div className="info-items-skeleton">
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="info-value-skeleton"></div>
              </div>
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="info-value-skeleton long"></div>
              </div>
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="info-value-skeleton"></div>
              </div>
              <div className="info-item-skeleton">
                <div className="info-label-skeleton"></div>
                <div className="order-stages-skeleton">
                  <div className="stage-skeleton"></div>
                  <div className="stage-skeleton"></div>
                  <div className="stage-skeleton"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-action-buttons">
        <div className="help-button-skeleton"></div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;