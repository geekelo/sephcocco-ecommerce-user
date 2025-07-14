import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/MobilePaymentHistoryFilter.css';

export const MobilePaymentHistoryFilter = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      status: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleFilterView = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mobile-payment-filter-container"
    >
      <div className="filter-header-mobile" onClick={toggleFilterView}>
        <h3 className="filter-title-mobile">Filter Transactions</h3>
        <span className={`filter-toggle-icon ${isExpanded ? 'expanded' : ''}`}>
          &#9660;
        </span>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="filter-content-mobile"
        >
          <div className="filter-field-mobile">
            <label htmlFor="mobileStartDate">From Date</label>
            <input
              type="date"
              id="mobileStartDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="date-input-mobile"
            />
          </div>
          
          <div className="filter-field-mobile">
            <label htmlFor="mobileEndDate">To Date</label>
            <input
              type="date"
              id="mobileEndDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="date-input-mobile"
            />
          </div>
          
          <div className="filter-field-mobile">
            <label htmlFor="mobileStatus">Status</label>
            <select
              id="mobileStatus"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="status-select-mobile"
            >
              <option value="">All Statuses</option>
              <option value="paid">Awaiting confirmation</option>
              <option value="payment confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-mobile-actions">
            <button 
              className="clear-filters-btn-mobile"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};