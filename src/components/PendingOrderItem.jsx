import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Check, Trash2 } from 'lucide-react';
import '../styles/PendingOrderItem.css';
import { OrderStatusBadge } from './OrderStatusBadge';
import { getBorderColorClass } from '../utils/getBorderColorClass';

export const PendingOrderItem = ({ 
  order, 
  index, 
  quantity, 
  onIncrease, 
  onDecrease, 
  onClick, 
  isSelected,
  isChecked,
  onToggleCheck,
  onDelete 
}) => {
  const totalPrice = order?.total_cost * quantity;

  return (
    <motion.div
      className={`pending-order-item ${isSelected ? 'selected' : ''} ${getBorderColorClass(order.status)} ${isChecked ? 'checked' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className="pending-order-checkbox">
        <button 
          className={`checkbox-btn ${isChecked ? 'checked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCheck(order.id);
          }}
        >
          {isChecked && <Check size={16} />}
        </button>
      </div>

      <div className="pending-order-image">
        <img src={order?.product?.main_image_url} alt={order?.product?.name} />
      </div>

      <div className="pending-order-content">
        <div className="pending-order-info">
          <h3 className="pending-product-name">{order?.product?.name}</h3>
          <OrderStatusBadge status={order.status} />
          
          
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(order.id);
            }}
            title="Delete item"
          >
            <Trash2 size={16} color="#ff3b3b" />
          </button>
        </div>

        <div className="pending-order-details">
          <div className="pending-order-quantity">
            <span className="quantity-label">Quantity:</span>
            <div className="quantity-controls">
              <button
                className="quantity-btn quantity-decrease"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrease();
                }}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-btn quantity-increase"
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrease();
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="pending-order-price">
            <div className="price-row">
              <span className="price-label">Unit Price:</span>
              <span className="price-value">₦{order.unit_price}</span>
            </div>
            <div className="price-row total-price">
              <span className="price-label">Total:</span>
              <span className="price-value total-value">₦{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
