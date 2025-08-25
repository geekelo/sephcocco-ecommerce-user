import React from "react";
import "../styles/OrderDetailsSkeleton.css";

const OrderDetailsSkeleton = () => {
  return (
    <div className="order-details-container animate-pulse">
      {/* Navigation */}
      <div className="order-details-nav">
        <div className="back-button w-24 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Order Status Message */}
      <div className="order-status-message mt-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>

      {/* Product Image + Info */}
      <div className="flex items-start mt-6 gap-4">
        <div className="w-32 h-32 bg-gray-300 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>

      {/* Description Section */}
      <div className="product-description-section mt-8">
        <div className="h-5 bg-gray-300 rounded w-40 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="info-sections-container mt-8 space-y-6">
        <div>
          <div className="h-5 bg-gray-300 rounded w-52 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>

        <div>
          <div className="h-5 bg-gray-300 rounded w-52 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-action-buttons mt-10 flex gap-3">
        <div className="w-24 h-10 bg-gray-300 rounded"></div>
        <div className="w-24 h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton;
