// contexts/SearchContext.js
import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const updateSearch = (term) => {
    console.log('Global search updated:', term);
    setSearchTerm(term);
  };

  const updateSort = (option) => {
    console.log('Global sort updated:', option);
    setSortOption(option);
  };

  const updateCategory = (category) => {
    console.log('Global category updated:', category);
    setSelectedCategory(category);
  };

  const clearAllFilters = () => {
    console.log('Clearing all global filters');
    setSearchTerm('');
    setSortOption('');
    setSelectedCategory('');
  };

  const value = {
    searchTerm,
    sortOption,
    selectedCategory,
    updateSearch,
    updateSort,
    updateCategory,
    clearAllFilters
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};