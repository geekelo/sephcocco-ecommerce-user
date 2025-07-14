import React from 'react';
import { MobilePaymentHistoryCard } from '../components/MobilePaymentHistory';
import { DesktopPaymentHistoryTable } from '../components/DesktopPaymentHistory';
import { payments } from '../constants/payments';
import '../styles/PaymentHistory.css'
import { useViewPayment } from '../hooks/useViewPayment';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { useState } from 'react';

const PaymentHistory = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [filters, setFilters] = useState({
    search_terms: "",
    status: "",
    start_date: "",
    end_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Define itemsPerPage
  
  const activeOutlet = getActiveOutlet();
  
  const { data: payment, isLoading } = useViewPayment(
    activeOutlet, 
    filters,
    currentPage,
    itemsPerPage,
  );

  const paymentData = payment?.payments?.flatMap(payment =>
    payment.paid_orders?.map(order => ({
      id: payment.id,
      customerName: order.customer?.name,
      customerEmail: order.customer?.email,
      orderId: order.id,
      phoneNumber: order.customer?.phone_number,
      orderDate: order.created_at,
      orderStatus: order.status,
      paymentMethod: payment.payment_method,
      status: payment.status,
      notes: order.notes,
      products: order.product,
      amount: payment.amount,
      transactionId: payment.transaction_id,
      paymentDate: payment.created_at,
      orderNumber: order.order_number,
      totalPrice: order.total_price,
      // Add formatted date for filtering
      date: new Date(payment.created_at).toLocaleDateString()
    })) || []
  ) || [];

  // Handle filter changes from child components
  const handleFilterChange = (newFilters) => {
    // Convert filter names to match API expectations
    const apiFilters = {
      search_terms: newFilters.search_terms || "",
      status: newFilters.status || "",
      start_date: newFilters.startDate || newFilters.start_date || "",
      end_date: newFilters.endDate || newFilters.end_date || "",
    };
    
    setFilters(apiFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className='payment-history'>
        <h1 className='payment-history-title'>Payment history</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className='payment-history'>
      <h1 className='payment-history-title'>Payment history</h1>
      {isMobile ? (
        <MobilePaymentHistoryCard 
          payments={paymentData} 
          onFilterChange={handleFilterChange}
        />
      ) : (
        <DesktopPaymentHistoryTable 
          payments={paymentData} 
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default PaymentHistory;