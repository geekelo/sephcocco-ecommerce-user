import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import '../styles/SearchFilter.css';

const SearchFilter = ({
  placeholder = "Search here...",
  filterOptions = [],
  categories = [],
  onSearch = () => {},
  onSortChange = () => {},
  onCategoryChange = () => {},
  className = ''
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [currentSort, setCurrentSort] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategoriesSubmenu, setShowCategoriesSubmenu] = useState(false);

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchValue(value);
  onSearch(value);
};


  const handleSortSelect = (option) => {
    if (option === 'Categories') {
      setShowCategoriesSubmenu(!showCategoriesSubmenu);
      return;
    }

    setCurrentSort(option);
    setSelectedCategory('');
    setShowDropdown(false);
    setShowCategoriesSubmenu(false);
    onSortChange(option);
    onCategoryChange('');
  };

  const clearSort = () => {
    setCurrentSort('');
    setSelectedCategory('');
    setShowDropdown(false);
    setShowCategoriesSubmenu(false);
    onSortChange('');
    onCategoryChange('');
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentSort('Categories');
    setShowDropdown(false);
    setShowCategoriesSubmenu(false);
    onCategoryChange(categoryName);
    onSortChange('Categories');
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
      setShowCategoriesSubmenu(false);
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  const getDisplayText = () => {
    if (selectedCategory) return selectedCategory;
    if (currentSort) return currentSort;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Filter size={16} />
        <span>Filter By</span>
      </div>
    );
  };

  return (
    <div className={`search-filter-wrapper ${className}`}>
      <div className="search-container">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="search-input"
        />
      </div>

      <div className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
        <div className="custom-select">
          <div
            className="select-selected"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="select-text">{getDisplayText()}</span>
            <ChevronDown
              size={14}
              className={showDropdown ? "chevron-rotated" : ""}
            />
          </div>

          {showDropdown && (
            <div className="select-items">
              {(currentSort || selectedCategory) && (
                <>
                  <div onClick={clearSort} className="clear-option">
                    Clear Sort
                  </div>
                  <div style={{ borderBottom: '1px solid #eee', margin: '0.5rem 0' }} />
                </>
              )}

              {filterOptions?.map((option) => (
                <div key={option} style={{ position: 'relative' }}>
                  <div
                    onClick={() => handleSortSelect(option)}
                    className={`${currentSort === option ? "same-as-selected" : ""} ${option === 'Categories' ? 'category-item' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{option}</span>
                    {option === 'Categories' && (
                      <ChevronRight
                        size={14}
                        style={{
                          transform: showCategoriesSubmenu ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }}
                      />
                    )}
                  </div>

                  {option === 'Categories' &&
                    showCategoriesSubmenu &&
                    categories?.length > 0 && (
                      <div className="categories-submenu">
                        {categories.map((category) => {
                          const categoryName = category.name || category;
                          return (
                            <div
                              key={categoryName}
                              onClick={() => handleCategorySelect(categoryName)}
                              className={selectedCategory === categoryName ? "same-as-selected" : ""}
                            >
                              {categoryName}
                            </div>
                          );
                        })}
                      </div>
                    )}
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