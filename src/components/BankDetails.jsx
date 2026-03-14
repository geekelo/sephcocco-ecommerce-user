import React from 'react'
import { BANK_DETAILS } from '../constants/BankDetails'
import { motion } from 'framer-motion';
import '../styles/BankDetails.css'
export default function BankDetails({transactionId}) {
    
  return (
    <motion.div
    className="bank-details-section"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="section-title">Bank Transfer Details</h3>
    <div className="bank-details-content">
      <div className="bank-detail-row">
        <span>Account Name:</span>
        <span>{BANK_DETAILS.accountName}</span>
      </div>
      <div className="bank-detail-row">
        <span>Account Number:</span>
        <span>{BANK_DETAILS.accountNumber}</span>
      </div>
      <div className="bank-detail-row">
        <span>Bank Name:</span>
        <span>{BANK_DETAILS.bankName}</span>
      </div>
      <div className="bank-detail-row">
        <span>Routing Number:</span>
        <span>{BANK_DETAILS.routingNumber}</span>
      </div>
    </div>
    <div className="bank-instructions">
      <p>Please make your transfer with this <strong>"{transactionId}"</strong> number as reference. Your order will be processed once payment is confirmed.</p>
    </div>
  </motion.div>
  )
}
