import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/MobilePaymentHistory.css';

export const MobilePaymentHistoryCard = ({ payments }) => {
    console.log(payments);
    
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="payment-history-card-container"
    >
      {payments.map((payment, index) => (
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
      ))}
    </motion.div>
  );
};
