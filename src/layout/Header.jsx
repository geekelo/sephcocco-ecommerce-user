import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  User,
  ShoppingCart,
  Menu,
  X,
  CircleHelp,
  CircleUserRound,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Header.css';
import SearchFilter from '../components/SearchFilter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { useViewProductCategories } from '../hooks/useGetProductCategories';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { useSearch } from '../components/SearchContext';

// Logout Modal Component
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <motion.div
        className="logout-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <div className="logout-modal-header">
          <h3>Confirm Logout</h3>
          <button className="logout-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="logout-modal-body">
          <p>Are you sure you want to log out of your account?</p>
        </div>
        
        <div className="logout-modal-footer">
          <button 
            className="logout-cancel-btn" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="logout-confirm-btn" 
            onClick={onConfirm}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [activeOutlet, setActiveOutlet] = useState(getActiveOutlet());
  
  // Logout modal state
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Check if user is logged in by checking localStorage token
  const isLoggedIn = !!localStorage.getItem('token');
  
  // Get search context
  const { updateSearch, updateSort, updateCategory, clearAllFilters } = useSearch();
  
  // Fetch categories for the dropdown
  const { data: categories = [], refetch: refetchCategories } = useViewProductCategories(activeOutlet);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle logout functionality
  const handleLogout = () => {

    // Clear localStorage if you store any user data there
    localStorage.clear();
    

    
    // Close modal
    setIsLogoutModalOpen(false);

    alert('Logged out successfully');
      window.location.reload();
  };

  // Updated handleStoreChange function
  const handleStoreChange = (store) => {
    console.log('Selected store:', store);
    
    // Map store names to outlet values
    const storeToOutletMap = {
      'Pharmacy': 'pharmacy',
      'Lounge': 'lounge', 
      'Restaurant': 'restaurant'
    };
    
    const outletValue = storeToOutletMap[store];
    
    if (outletValue) {
      // Update the cookie
      Cookies.set('userActiveOutlet', outletValue, { expires: 1 });
      
      // Update local state
      setActiveOutlet(outletValue);
      
      // Clear all search filters when switching outlets
      clearAllFilters();
      
      // Refetch categories for the new outlet
      refetchCategories();
      
      // Close mobile menu if open
      setIsMenuOpen(false);
      setStoreDropdownOpen(false);
      
      // Trigger a custom event that the Product component can listen to
      window.dispatchEvent(new CustomEvent('outletChanged', { 
        detail: { newOutlet: outletValue } 
      }));
    }
  };

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Pending', href: '/pending-orders' },
    { name: 'Completed', href: '/completed-orders' },
    { name: 'Messages', href: '/messages' },
    { name: 'Stores', href: '#', isDropdown: true },
    { name: 'Payment History', href: '/payment-history' },
  ];

  const storeOptions = ['Pharmacy', 'Lounge', 'Restaurant'];
  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First','Categories', 'Rating'];

  // Check if a link is active based on current path
  const isLinkActive = (linkHref) => {
    if (linkHref === '#') return false;
    if (currentPath === linkHref) return true;
    if (linkHref === '/' && currentPath === '/') return true;
    if (linkHref !== '/' && currentPath.startsWith(linkHref)) return true;
    return false;
  };

  // Helper function to check if a store is currently active
  const isStoreActive = (store) => {
    const storeToOutletMap = {
      'Pharmacy': 'pharmacy',
      'Lounge': 'lounge', 
      'Restaurant': 'restaurant'
    };
    return storeToOutletMap[store] === activeOutlet;
  };

  const handleResize = () => {
    const isMobileView = window.innerWidth <= 768;
    setIsMobile(isMobileView);
    
    if (!isMobileView && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for outlet changes from other components
  useEffect(() => {
    const handleOutletChange = () => {
      const currentOutlet = getActiveOutlet();
      if (currentOutlet !== activeOutlet) {
        setActiveOutlet(currentOutlet);
        refetchCategories();
      }
    };

    window.addEventListener('outletChanged', handleOutletChange);
    return () => window.removeEventListener('outletChanged', handleOutletChange);
  }, [activeOutlet, refetchCategories]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleStoreDropdown = (e) => {
    e.preventDefault();
    setStoreDropdownOpen(prev => !prev);
  };

  // Updated handlers to use global state
  const handleSearch = (term) => {
    console.log('Header: Searching for:', term);
    updateSearch(term);
  };

  const handleFilterChange = (filter) => {
    console.log('Header: Filter changed to:', filter);
    updateSort(filter);
  };

  const handleCategoryChange = (category) => {
    console.log('Header: Category changed to:', category);
    updateCategory(category);
  };

  // Only show SearchFilter on Product page for desktop
  const showDesktopSearch = currentPath === '/products' || currentPath.startsWith('/products');

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
            {isMenuOpen ? <X size={20} color="#ff4500" /> : <Menu size={20} color="#ff4500"/>}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="nav-section desktop-only">
          <div className="nav-links">
            {navLinks.map((link, index) => {
              if (link.isDropdown) {
                return (
                  <div key={index} className="dropdown">
                    <Link to='#' className="nav-link dropdown-toggle">
                      {link.name} <span className="dropdown-icon-wrapper"><ChevronDown size={16} className="dropdown-chevron" /></span>
                    </Link>
                    <div className="dropdown-menu">
                      {/* Show current selection first */}
                      {storeOptions
                        .sort((a, b) => {
                          const aActive = isStoreActive(a);
                          const bActive = isStoreActive(b);
                          if (aActive && !bActive) return -1;
                          if (!aActive && bActive) return 1;
                          return 0;
                        })
                        .map((store, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handleStoreChange(store)}
                          className={`dropdown-item ${isStoreActive(store) ? 'active-link' : ''}`}
                        >
                          {store} {isStoreActive(store) && <span className="current-selection">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link 
                    key={index} 
                    to={link.href} 
                    className={`nav-link ${isLinkActive(link.href) ? 'active-link' : ''}`}
                  >
                    {link.name}
                  </Link>
                );
              }
            })}
          </div>
        </nav>

        {/* Desktop Actions */}
        <div className="actions-section desktop-only">
          {/* Only show SearchFilter on Products page */}
          {showDesktopSearch && (
            <SearchFilter
              placeholder="Search products..."
              filterOptions={filterOptions}
              categories={categories}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              onSortChange={handleFilterChange}
              onCategoryChange={handleCategoryChange}
              className="desktop-search-filter"
            />
          )}
          <div className="header-icons">
            {/* Commented out help and user profile icons */}
            {/* <button className="mobile-icon-button" aria-label="Help" title="Help">
              <CircleHelp size={24} />
            </button>
            <button className="mobile-icon-button" aria-label="User Profile" title="User Profile">
              <CircleUserRound size={24} />
            </button> */}
            
            {/* Logout button - only show if logged in */}
            {isLoggedIn && (
              <button 
                className="logout-button desktop-logout-btn" 
                aria-label="Logout" 
                title="Logout"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut size={20} />
                <span className="logout-text">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Slide-in Menu */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
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
                                {storeOptions
                                  .sort((a, b) => {
                                    const aActive = isStoreActive(a);
                                    const bActive = isStoreActive(b);
                                    if (aActive && !bActive) return -1;
                                    if (!aActive && bActive) return 1;
                                    return 0;
                                  })
                                  .map((store, idx) => (
                                  <button 
                                    key={idx} 
                                    onClick={() => handleStoreChange(store)}
                                    className={`mobile-dropdown-item ${isStoreActive(store) ? 'active-link' : ''}`}
                                  >
                                    {store} {isStoreActive(store) && <span className="current-selection">✓</span>}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    } else {
                      return (
                        <Link 
                          key={index} 
                          to={link.href} 
                          className={`mobile-nav-link ${isLinkActive(link.href) ? 'active-link' : ''}`}
                        >
                          {link.name}
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>

              {/* User Actions */}
              <div className="mobile-user-actions">
                {/* Commented out help and user profile icons */}
                {/* <button className="mobile-icon-button" aria-label="Help" title="Help">
                  <CircleHelp size={24} />
                </button>
                <button className="mobile-icon-button" aria-label="User Profile" title="User Profile">
                  <CircleUserRound size={24} />
                </button> */}
                
                {/* Logout button for mobile - only show if logged in */}
                {isLoggedIn && (
                  <button 
                    className="mobile-icon-button logout-button" 
                    aria-label="Logout" 
                    title="Logout"
                    onClick={() => setIsLogoutModalOpen(true)}
                  >
                    <LogOut size={24} />
                    <span className="logout-text">Logout</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Modal */}
        <AnimatePresence>
          {isLogoutModalOpen && (
            <LogoutModal
              isOpen={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
              onConfirm={handleLogout}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;