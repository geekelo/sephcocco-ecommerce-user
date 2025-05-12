import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MobilePaymentHistoryFilter } from './MobilePaymentHistoryFilter';
import '../styles/MobilePaymentHistory.css';


export const MobilePaymentHistoryCard = ({ payments: allPayments }) => {
  const [filteredPayments, setFilteredPayments] = useState(allPayments);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  useEffect(() => {
    applyFilters(filters);
  }, [filters, allPayments]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let result = [...allPayments];

    // Filter by date range
    if (currentFilters.startDate) {
      const startDate = new Date(currentFilters.startDate);
      result = result.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate;
      });
    }

    if (currentFilters.endDate) {
      const endDate = new Date(currentFilters.endDate);
      // Set time to end of day
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate <= endDate;
      });
    }

    // Filter by status
    if (currentFilters.status) {
      result = result.filter(payment => 
        payment.status.toLowerCase() === currentFilters.status.toLowerCase()
      );
    }

    setFilteredPayments(result);
  };

  return (
    <>
      <MobilePaymentHistoryFilter onFilterChange={handleFilterChange} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="payment-history-card-container"
      >
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="payment-history-card"
            >
              <div className="card-header">
                <span className="card-date">{payment.date}</span>
                <span className={`status-badge ${payment.status.toLowerCase()}`}>
                  {payment.status}
                </span>
              </div>
              <div className="card-body">
                <div className="card-amount">
                  <span className="label">Amount:</span>
                  <span className="value">${payment.amount.toFixed(2)}</span>
                </div>
                <div className="card-reference">
                  <span className="label">Reference:</span>
                  <span className="value">{payment.reference}</span>
                </div>
                <div className="card-order">
                  <span className="label">Order Number:</span>
                  <Link
                    to={`/order/${payment.orderNumber}`}
                    className="order-link"
                  >
                    {payment.orderNumber}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="no-results-message">
            No matching transactions found
          </div>
        )}
      </motion.div>
    </>
  );
};