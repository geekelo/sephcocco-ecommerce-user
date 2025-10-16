import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PaymentHistoryFilter } from './PaymentHistoryFilter';
import { Copy, Check } from 'lucide-react';
import '../styles/DesktopPaymentHistory.css';

export const DesktopPaymentHistoryTable = ({ payments: allPayments, onFilterChange }) => {
  const [filteredPayments, setFilteredPayments] = useState(allPayments);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
  });

  const [copiedIndex, setCopiedIndex] = useState(null);

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
      result = result.filter(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.date);
        return paymentDate >= startDate;
      });
    }

    if (currentFilters.endDate) {
      const endDate = new Date(currentFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(payment => {
        const paymentDate = new Date(payment.paymentDate || payment.date);
        return paymentDate <= endDate;
      });
    }

    if (currentFilters.status) {
      result = result.filter(payment =>
        payment.status.toLowerCase() === currentFilters.status.toLowerCase()
      );
    }

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

  // ✅ handle copy action
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000); // reset after 2s
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
              
               <th>Delivery Amount</th>
               <th>Delivery Location</th>
 <th>Item Amount</th>
                <th>Total Amount</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Payment method</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments?.length > 0 ? (
              filteredPayments?.map((payment, index) => (
                <tr key={payment.id || index}>
                  <td>{new Date(payment.paymentDate || payment.date).toLocaleDateString()}</td>
        
                   <td>₦{payment?.deliveryAmount}</td>
                     <td>{payment?.deliveryLocation}</td>
                       <td>{payment?.amount - payment?.deliveryAmount || 'N/A' }</td>
                    <td>₦{payment?.amount}</td>
                  <td>
                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                      {payment.status.toLowerCase() === 'paid' ? 'Awaiting confirmation' : payment.status}
                    </span>
                  </td>
                  <td className="reference-cell">
                    <span>{payment.transactionId}</span>
                    {copiedIndex === index ? (
                      <Check size={16} className="icon-success" />
                    ) : (
                      <Copy
                        size={16}
                        className="icon-copy"
                        onClick={() => handleCopy(payment.transactionId, index)}
                      />
                    )}
                  </td>
                  <td className='payment-method'>{payment.paymentMethod}</td>
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
