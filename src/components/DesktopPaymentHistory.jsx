
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/DesktopPaymentHistory.css';

export const DesktopPaymentHistoryTable = ({ payments }) => {
  return (
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
          {payments.map((payment, index) => (
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
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};