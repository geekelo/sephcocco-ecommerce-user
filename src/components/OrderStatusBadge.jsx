import { getStatusClass } from "../utils/getStatusClass";
import '../styles/OrderStatusBadge.css'
export const OrderStatusBadge = ({ status }) => {
   
    return (
      <span className={`status-badge ${getStatusClass(status)}`}>
        {status}
      </span>
    );
  };