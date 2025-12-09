import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import '../styles/OrderDetails.css';
import InfoSection from '../components/InfoSection';
import ProductInfo from '../components/ProductInfo';
import OrderStages from '../components/OrderStages';
import Receipt from '../components/Receipt';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { useGetDeliveryOrder } from '../hooks/useGetDeliveryOrder';
import OrderDetailsSkeleton from '../components/OrderDetailsSkeleton';
import { useTrackOrder } from '../hooks/useTrackOrder';

import { useGetPaidOrder } from '../hooks/useGetPaidOrder';
import { useGetCompletedOrder } from '../hooks/userGetCompletedOrder';

const OrderDetails = () => {
 
  const { orderId } = useParams();
  const activeOutlet = getActiveOutlet();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromTab = searchParams.get("tab") || "pending";

  const handleBack = () => {
    navigate(`/pending-orders?tab=${fromTab}`);
  };

  const {
    data: deliveryData,
    isLoading: isLoadingDelivery,
  } = useGetDeliveryOrder(activeOutlet);

  const {
    data: paidData,
    isLoading: isLoadingPaid,
  } = useGetPaidOrder(activeOutlet);

  const {
    data: completedData,
    isLoading: isLoadingCompleted,
  } = useGetCompletedOrder(activeOutlet);

  const [showTracking, setShowTracking] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Find the order by ID from API response - check all order types
  const order =
    deliveryData?.orders?.find((o) => o.id.toString() === orderId) || 
    paidData?.orders?.find((o) => o.id.toString() === orderId) ||
    completedData?.orders?.find((o) => o.id.toString() === orderId);



  // Fetch tracking info only when needed
  const { data: trackData, isLoading: isTrackingLoading } = useTrackOrder(
    order?.assigned_rider?.id,
    { enabled: showTracking } // only run if tracking is opened
  );

  // Helper function to format payment details
  const formatPaymentDetails = (paymentDetails) => {
    if (!paymentDetails || typeof paymentDetails !== 'object') {
      return 'N/A';
    }
    
    // Extract key information from payment details object
    const { payment_method, status, amount, transaction_id } = paymentDetails;
    
    const details = [];
    if (payment_method) details.push(`Method: ${payment_method}`);
    if (status) details.push(`Status: ${status}`);
    if (amount) details.push(`Amount: ₦${amount}`);
    if (transaction_id) details.push(`Transaction ID: ${transaction_id}`);
    
    return details.length > 0 ? details.join(', ') : 'N/A';
  };

  // Helper function to generate default stages based on order status
  const generateDefaultStages = (order) => {
    if (!order) return [];
    
    const stages = [];
    const now = new Date();
    
    // Always add order placed stage
    stages.push({
      status: 'Order Placed',
      date: order.created_at || order.order_date || now.toISOString()
    });
    
    // Add stages based on current status
    const status = order.status?.toLowerCase();
    
    if (status === 'paid' || status === 'processing' || status === 'confirmed') {
      stages.push({
        status: 'Payment Confirmed',
        date: order.payment_confirmed_at || now.toISOString()
      });
      stages.push({
        status: 'Processing Order',
        date: order.processing_at || now.toISOString()
      });
    }
    
    if (status === 'delivering' || status === 'shipped') {
      stages.push({
        status: 'Payment Confirmed',
        date: order.payment_confirmed_at || now.toISOString()
      });
      stages.push({
        status: 'Processing Order',
        date: order.processing_at || now.toISOString()
      });
      stages.push({
        status: 'Shipped',
        date: order.shipped_at || now.toISOString()
      });
    }
    
    if (status === 'completed' || status === 'delivered' || status === 'arrived') {
      stages.push({
        status: 'Payment Confirmed',
        date: order.payment_confirmed_at || now.toISOString()
      });
      stages.push({
        status: 'Processing Order',
        date: order.processing_at || now.toISOString()
      });
      stages.push({
        status: 'Shipped',
        date: order.shipped_at || now.toISOString()
      });
      stages.push({
        status: 'Delivered',
        date: order.delivered_at || order.completed_at || now.toISOString()
      });
    }
    
    return stages;
  };

  if (isLoadingDelivery || isLoadingPaid || isLoadingCompleted) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return <p className="error-text">Order not found</p>;
  }

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
          Your order will be completed 2-3 hours after arrival. During this
          period, you can raise a dispute if you did not receive your product or
          received the wrong product.
        </p>
      </div>

      {/* Product Information */}
      <ProductInfo
        name={order.product?.name}
        image={order.product?.main_image_url}
        price={order.unit_price}
        totalPrice={order.total_price}
        rating={order.rating ?? 0}
        ratingCount={order.ratingCount ?? 0}
        status={order.status}
        likes={order.likes ?? 0}
        isFavorite={false}
        onTrackOrder={() => setShowTracking(true)}
        onPrintReceipt={() => setShowReceipt(true)}
      />

      <OrderStages 
        stages={order.stages && Array.isArray(order.stages) && order.stages.length > 0 
          ? order.stages 
          : generateDefaultStages(order)} 
      />

      {/* Product Description OR Tracking */}
      {!showTracking ? (
        <div className="product-description-section">
          <h3 className="section-title">Product Description</h3>
          <p className="description-text">
            {order.additional_notes ||
              'No additional notes provided for this order.'}
          </p>
          <br />
          {/* Information Sections */}
          <div className="info-sections-container">
            <InfoSection
              title="Payment Information"
              items={[
                { 
                  label: 'Payment Method:', 
                  value: order.payment_details?.payment_method || 'N/A' 
                },
                {
                  label: 'Payment Details:',
                  value: formatPaymentDetails(order.payment_details),
                },
                { label: 'Total Price:', value: `₦${order.total_price}` },
              ]}
            />

            <InfoSection
              title="Delivery Information"
              items={[
                { label: 'Delivery Method:', value: 'Door step Delivery' },
                { label: 'Shipping Address:', value: order.address },
                { label: 'Phone Number:', value: order.phone_number },
              ]}
            />
          </div>
        </div>
      ) : (
        <div className="tracking-info-section">
          <h3 className="section-title">Tracking Information</h3>
          {isTrackingLoading ? (
            <p className="description-text">Loading tracking details...</p>
          ) : trackData && trackData.locations?.length > 0 ? (
            <div className="tracking-details">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Latitude:</strong> {trackData.locations[0].latitude}</p>
              <p><strong>Longitude:</strong> {trackData.locations[0].longitude}</p>
            </div>
          ) : (
            <p className="description-text">No tracking info available yet.</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="order-action-buttons">
        <button
          onClick={() => {
            navigate('/messages');
          }}
          className="help-button"
        >
          Get Help
        </button>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <Receipt 
          order={order} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
    </div>
  );
};

export default OrderDetails;