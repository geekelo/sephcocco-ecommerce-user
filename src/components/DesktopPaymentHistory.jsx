import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PaymentHistoryFilter } from './PaymentHistoryFilter';
import '../styles/DesktopPaymentHistory.css';

export const DesktopPaymentHistoryTable = ({ payments: allPayments }) => {
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
      <PaymentHistoryFilter onFilterChange={handleFilterChange} />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="payment-history-table-container"
      >
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Order Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.date}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.reference}</td>
                  <td>
                    <Link
                      to={`/order/${payment.orderNumber}`}
                      className="order-link"
                    >
                      {payment.orderNumber}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="no-results-row">
                <td colSpan="5" className="no-results-cell">
                  No matching transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </>
  );
};