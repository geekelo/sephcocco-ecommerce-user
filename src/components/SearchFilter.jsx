import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '../styles/SearchFilter.css';

const SearchFilter = ({ 
  placeholder = "Search here...", 
  filterOptions = [], 
  defaultFilter = '',
  onSearch = () => {},
  onFilterChange = () => {},
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterSelect = (option) => {
    setSelectedFilter(option);
    setShowFilterOptions(false);
    onFilterChange(option);
  };

  return (
    <div className={`search-filter-wrapper ${className}`}>
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder} 
          className="search-input" 
        />
      </div>
      <div className="filter-dropdown">
        <div className="custom-select">
          <div 
            className="select-selected"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <span className="select-text">{selectedFilter || "Filter By"}</span> 
            <ChevronDown 
              size={14} 
              className={showFilterOptions ? "chevron-rotated" : ""} 
            />
          </div>
          {showFilterOptions && (
            <div className="select-items">
              {filterOptions.map((option, index) => (
                <div 
                  key={index} 
                  onClick={() => handleFilterSelect(option)}
                  className={selectedFilter === option ? "same-as-selected" : ""}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;