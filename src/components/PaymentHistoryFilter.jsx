import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/PaymentHistoryFilter.css";

export const PaymentHistoryFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      status: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="payment-filter-container"
    >
      <h3 className="filter-title">Filter Transactions</h3>

      <div className="filter-section">
        {/* Date Filters */}
        <div className="filter-group date-filters">
          <div className="filter-field">
            <label htmlFor="startDate">From Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="date-input"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="endDate">To Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="date-input"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <div className="filter-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="status-select"
            >
              <option value="">All Statuses</option>
              <option value="paid">Awaiting confirmation</option>
              <option value="payment confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="filter-actions">
        <button className="apply-filters-btn" onClick={applyFilters}>
          Apply Filters
        </button>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </motion.div>
  );
};