import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PaymentHistoryFilter } from './PaymentHistoryFilter';
import '../styles/DesktopPaymentHistory.css';

export const DesktopPaymentHistoryTable = ({ payments: allPayments, onFilterChange }) => {
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
    // Pass filters to parent component for API calls
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const applyFilters = (currentFilters) => {
    let result = [...allPayments];

    // Filter by date range
    if (currentFilters.startDate) {
      const startDate = new Date(currentFilters.startDate);
      result = result.filter(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.date);
        return paymentDate >= startDate;
      });
    }

    if (currentFilters.endDate) {
      const endDate = new Date(currentFilters.endDate);
      // Set time to end of day
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.date);
        return paymentDate <= endDate;
      });
    }

    // Filter by status
    if (currentFilters.status) {
      result = result.filter(payment =>
        payment.status.toLowerCase() === currentFilters.status.toLowerCase()
      );
    }

    // Filter by search terms (search in transaction ID, order ID, customer name, etc.)
    if (currentFilters.search_terms) {
      const searchTerm = currentFilters.search_terms.toLowerCase();
      result = result.filter(payment =>
        payment.transactionId?.toLowerCase().includes(searchTerm) ||
        payment.orderId?.toString().toLowerCase().includes(searchTerm) ||
        payment.customerName?.toLowerCase().includes(searchTerm) ||
        payment.customerEmail?.toLowerCase().includes(searchTerm)
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
              <th>Payment method</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <tr key={payment.id || index}>
                  <td>{new Date(payment.paymentDate || payment.date).toLocaleDateString()}</td>
                  <td>₦{payment.amount}</td>
                  <td>
                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                      {payment.status.toLowerCase() === 'paid' ? 'Awaiting comfirmation' : payment.status}
                    </span>
                  </td>
                  <td>{payment.transactionId}</td>
               
                  <td>{payment.paymentMethod}</td>
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