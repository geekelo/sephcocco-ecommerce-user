import { ChevronRight } from "lucide-react";

import { motion } from 'framer-motion';
import '../styles/OrderItem.css'
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Link } from "react-router-dom";
export const OrderItem = ({ order, index }) => {
    return (
      <motion.div 
        className="order-item"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="order-image">
          <img src={order?.product?.main_image_url} alt={order.product?.name} />
        </div>
        
        <div className="order-info">
          <h3 className="product-order-name">{order?.product?.name}</h3>
       
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="order-actions">
          <div className="price">${order.total_cost}</div>
          <Link to={`/order/${order.id}`} className="see-more">
            See More Details <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>
    );
  };