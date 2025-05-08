import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { orders } from '../constants/orders';
import '../styles/OrderDetails.css';
import InfoSection from '../components/InfoSection';
import ProductInfo from '../components/ProductInfo';

const OrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  // Find the order by ID
  const order = orders.find(o => o.id.toString() === orderId) || orders[0]; 
  
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };
  
 
  
  return (
    <div className="order-details-container">
      {/* Navigation */}
      <div className="order-details-nav">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
      
      {/* Order Status Message */}
      <div className="order-status-message">
        <p className="status-text">
          Your order will be completed 2-3 hours after arrival. During this period, you can raise a dispute if 
          you did not receive your product or received the wrong product.
        </p>
      </div>
      
      {/* Product Information */}
      <ProductInfo 
        name={order.name}
        image={order.image}
        price={order.price}
        rating={order.rating}
        ratingCount={order.ratingCount}
        status={order.status}
        likes={order.likes}
        isFavorite={order.isFavorite}
      />
      
      {/* Product Description */}
      <div className="product-description-section">
        <h3 className="section-title">Product Description</h3>
        <p className="description-text">
          {order.longDescription || 
           "Lorem ipsum dolor sit amet consectetur. Neque tincidunt urna rhoncus vitae sit. Sodales nec diam dignissim eu risus. Orci ac sed pellentesque venenatis nunc mi cursus viverra. Turpis laculis massa elementum eu. Ipsum imperdiet tincida arcu erat gravida."}
        </p>
      </div>
      
      {/* Information Sections */}
      <div className="info-sections-container">
        <InfoSection 
          title="Payment Information"
          items={[
            { label: "Payment Method:", value: "Door step Delivery" },
            { label: "Payment Details:", value: "Lorem ipsum dolor sit amet consectetur. Rhoncus vel praesent duis et." }
          ]}
        />
        
        <InfoSection 
          title="Delivery Information"
          items={[
            { label: "Delivery Method:", value: "Door step Delivery" },
            { label: "Shipping Address:", value: "Lorem ipsum dolor sit amet consectetur. Rhoncus vel praesent duis et." },
            { label: "Shipping Details:", value: "Lorem ipsum dolor sit amet consectetur. Rhoncus vel praesent duis et." }
          ]}
        />
      </div>
      
      {/* Action Buttons */}
      <div className="order-action-buttons">
        <button className="help-button">Get Help</button>
        
      
      </div>
    </div>
  );
};

export default OrderDetails;