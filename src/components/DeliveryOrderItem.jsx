import { ChevronRight } from "lucide-react";
import { motion } from 'framer-motion';
import '../styles/DeliveryOrderItem.css';
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Link } from "react-router-dom";
import { getBorderColorClass } from "../utils/getBorderColorClass";

export const DeliveryOrderItem = ({ order, index, onClick, isSelected,activeTab }) => {
 
  return (
    <motion.div
      className={`delivery-order-item ${isSelected ? 'selected' : ''} ${getBorderColorClass(order.status)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={onClick}
    >
      <div className="delivery-order-image">
        <img src={order?.product?.main_image_url} alt={order.product?.name} />
      </div>
      
      <div className="delivery-order-info">
        <h3 className="delivery-product-name">{order?.product?.name}</h3>
   
        <OrderStatusBadge status={order.status} />
      </div>
      
      <div className="delivery-order-actions">
        <div className="delivery-price">₦{order.total_cost}</div>
        <Link to={`/order/${order.id}?tab=${activeTab}`}   className="delivery-see-more">
          See More Details <ChevronRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};