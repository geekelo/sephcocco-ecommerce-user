import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/MobilePaymentHistory.css';
import { MobilePaymentHistoryFilter } from './MobilePaymentHistoryFilter';

export const MobilePaymentHistoryCard = ({ payments: allPayments = [], onFilterChange }) => {
  const [filteredPayments, setFilteredPayments] = useState(allPayments);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    applyFilters(filters);
  }, [filters, allPayments]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const applyFilters = (currentFilters) => {
    let result = [...allPayments];

    if (currentFilters.startDate) {
      const startDate = new Date(currentFilters.startDate);
      result = result.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate || payment.date);
        return paymentDate >= startDate;
      });
    }

    if (currentFilters.endDate) {
      const endDate = new Date(currentFilters.endDate);
      endDate.setHours(23, 59, 59, 999);

      result = result.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate || payment.date);
        return paymentDate <= endDate;
      });
    }

    if (currentFilters.status) {
      result = result.filter(
        (payment) =>
          (payment.status || '').toLowerCase() === currentFilters.status.toLowerCase()
      );
    }

    setFilteredPayments(result);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const getDisplayStatus = (status) => {
    const normalizedStatus = (status || '').toLowerCase();

    if (normalizedStatus === 'paid') {
      return 'Awaiting confirmation';
    }

    return status || 'N/A';
  };

  const getProductNames = (payment) => {
    if (Array.isArray(payment.products) && payment.products.length > 0) {
      return payment.products
        .map((product) => product?.name)
        .filter(Boolean)
        .join(', ');
    }

    return payment.productName || 'N/A';
  };

  const getOrderNumbers = (payment) => {
    if (Array.isArray(payment.orderNumbers) && payment.orderNumbers.length > 0) {
      return payment.orderNumbers.join(', ');
    }

    return payment.orderNumber || 'N/A';
  };

  return (
    <>
      <MobilePaymentHistoryFilter onFilterChange={handleFilterChange} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mobile-payment-history-container"
      >
        {filteredPayments.length > 0 ? (
          <div className="payment-cards-container">
            {filteredPayments.map((payment, index) => {
              const deliveryAmount = Number(payment?.deliveryAmount || 0);
              const totalAmount = Number(payment?.amount || 0);
              const itemAmount =
                payment?.orderAmount !== undefined
                  ? Number(payment.orderAmount || 0)
                  : totalAmount - deliveryAmount;

              return (
                <motion.div
                  key={payment.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="payment-card"
                >
                  <div className="payment-card-header">
                    <div className={`payment-status ${(payment.status || '').toLowerCase()}`}>
                      {getDisplayStatus(payment.status)}
                    </div>
                  </div>

                  <div className="payment-card-body">
                    <div className="payment-detail">
                      <span className="detail-label">Transaction ID:</span>
                      <span className="detail-value transaction-id">
                        {payment.transactionId || 'N/A'}
                      </span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(payment.paymentDate || payment.date).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>

                    {payment.customerName && (
                      <div className="payment-detail">
                        <span className="detail-label">Customer:</span>
                        <span className="detail-value">{payment.customerName}</span>
                      </div>
                    )}

                    {payment.paymentMethod && (
                      <div className="payment-detail">
                        <span className="detail-label">Method:</span>
                        <span className="detail-value">{payment.paymentMethod}</span>
                      </div>
                    )}

                    <div className="payment-detail">
                      <span className="detail-label">Orders:</span>
                      <span className="detail-value">
                        {payment.orderCount || payment.orders?.length || 1}
                      </span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Order Number(s):</span>
                      <span className="detail-value">{getOrderNumbers(payment)}</span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Product(s):</span>
                      <span className="detail-value">{getProductNames(payment)}</span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Delivery Location:</span>
                      <span className="detail-value">
                        {payment?.deliveryLocation || 'N/A'}
                      </span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Delivery Amount:</span>
                      <span className="detail-value">
                        {formatAmount(deliveryAmount)}
                      </span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Item Amount:</span>
                      <span className="detail-value">
                        {formatAmount(itemAmount)}
                      </span>
                    </div>

                    <div className="payment-detail">
                      <span className="detail-label">Total Amount:</span>
                      <span className="detail-value">
                        {formatAmount(totalAmount)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="no-results-mobile"
          >
            <div className="no-results-icon">📋</div>
            <h3>No matching transactions found</h3>
            <p>Try adjusting your filters or search terms</p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};