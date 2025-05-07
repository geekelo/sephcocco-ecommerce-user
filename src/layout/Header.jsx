import React, { useState } from 'react';
import {
  ChevronDown,
  User,
  ShoppingCart,
  Menu,
  X,
  CircleHelp,
  CircleUserRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Header.css';
import SearchFilter from '../components/SearchFilter';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Pending', href: '/pending' },
    { name: 'Completed', href: '/completed' },
    { name: 'Messages', href: '/messages' },
    { name: 'Stores', href: '#', isDropdown: true },
    { name: 'Payment History', href: '/payment-history' },
  ];

  const storeOptions = ['Pharmacy', 'Lounge', 'Restaurant'];
  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Categories', 'Rating'];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleStoreDropdown = (e) => {
    e.preventDefault();
    setStoreDropdownOpen(prev => !prev);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    console.log('Filter changed to:', filter);
  };

  return (
    <header className="header">
      <div className="header-wrapper">

        {/* Logo */}
        <div className="logo-section">
          <div className="logo-container-header">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-menu-icon">
          <button onClick={toggleMenu} className="menu-toggle-button">
            {isMenuOpen ? <X size={20} color="#ff4500" /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="nav-section desktop-only">
          <div className="nav-links">
            {navLinks.map((link, index) => {
              if (link.isDropdown) {
                return (
                  <div key={index} className="dropdown">
                    <a href="#" className="nav-link dropdown-toggle">
                      {link.name} <span className="dropdown-icon-wrapper"><ChevronDown size={16} className="dropdown-chevron" /></span>
                    </a>
                    <div className="dropdown-menu">
                      {storeOptions.map((store, idx) => (
                        <a key={idx} href={`/stores/${store.toLowerCase()}`} className="dropdown-item">{store}</a>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <a key={index} href={link.href} className={`nav-link ${link.href === '/products' ? 'active-link' : ''}`}>
                    {link.name}
                  </a>
                );
              }
            })}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="actions-section desktop-only">
          <SearchFilter
            placeholder="Search here..."
            filterOptions={filterOptions}
            defaultFilter={selectedFilter}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            className="desktop-search-filter"
          />
          <div className="header-icons">
            <button className="mobile-icon-button" aria-label="Help" title="Help">
              <CircleHelp size={24} />
            </button>
            <button className="mobile-icon-button" aria-label="User Profile" title="User Profile">
              <CircleUserRound size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-slide-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Logo on Mobile */}
              <div className="mobile-menu-header">
                <div className="logo-container-header">
                  <img src="/logo.png" alt="Logo" className="logo" />
                </div>
              </div>

              {/* Nav Links */}
              <div className="mobile-nav-links-container">
                <div className="mobile-nav-links">
                  {navLinks.map((link, index) => {
                    if (link.isDropdown) {
                      return (
                        <div key={index} className="mobile-dropdown">
                          <a href="#" className="mobile-nav-link" onClick={toggleStoreDropdown}>
                            {link.name} <ChevronDown size={16} className={storeDropdownOpen ? "chevron-rotated" : ""} />
                          </a>
                          <AnimatePresence>
                            {storeDropdownOpen && (
                              <motion.div
                                className="mobile-dropdown-menu store-dropdown"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {storeOptions.map((store, idx) => (
                                  <a key={idx} href={`/stores/${store.toLowerCase()}`} className="mobile-dropdown-item">{store}</a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    } else {
                      return (
                        <a key={index} href={link.href} className="mobile-nav-link">
                          {link.name}
                        </a>
                      );
                    }
                  })}
                </div>
              </div>

              {/* User Actions */}
              <div className="mobile-user-actions">
                <button className="mobile-icon-button" aria-label="Help" title="Help">
                  <CircleHelp size={24} />
                </button>
                <button className="mobile-icon-button" aria-label="User Profile" title="User Profile">
                  <CircleUserRound size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
