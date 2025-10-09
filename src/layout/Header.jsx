import React, { useState, useEffect, useRef } from 'react';
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
import { getActiveUser } from '../utils/getActiveUser';

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
  
  // State management
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const profileRef = useRef(null);
  
  // Get active outlet and user data
  const [activeOutlet, setActiveOutlet] = useState(getActiveOutlet());
  const activeUserData = getActiveUser();
  
  // Parse the full user object from localStorage
  const fullUser = activeUserData.user ? JSON.parse(activeUserData.user) : null;
  
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token');
  
  // Get search context
  const { updateSearch, updateSort, updateCategory, clearAllFilters } = useSearch();
  
  // Fetch categories
  const { data: categories = [], refetch: refetchCategories } = useViewProductCategories(activeOutlet);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfile]);

  // Handle responsive behavior
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
  }, [isMenuOpen]);

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

  // Format date for last login
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get user profile data
  const getUserProfileData = () => {
    return {
      name: activeUserData.name || fullUser?.name || '',
      email: activeUserData.email || fullUser?.email || '',
      address: fullUser?.address || '',
      whatsappNumber: fullUser?.whatsapp_number || '',
      phoneNumber: fullUser?.phone_number || '',
    };
  };

  const profileData = getUserProfileData();

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLogoutModalOpen(false);
    alert('Logged out successfully');
    window.location.reload();
  };

  // Handle outlet/store change
  const handleStoreChange = (store) => {
    const storeToOutletMap = {
      'Pharmacy': 'pharmacy',
      'De Choco Club': 'lounge', 
      'Restaurant and Bar': 'restaurant'
    };
    
    const outletValue = storeToOutletMap[store];
    
    if (outletValue) {
      Cookies.set('userActiveOutlet', outletValue, { expires: 1 });
      setActiveOutlet(outletValue);
      clearAllFilters();
      refetchCategories();
      setIsMenuOpen(false);
      setStoreDropdownOpen(false);
      
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

  const storeOptions = ['Pharmacy', 'De Choco Club', 'Restaurant and Bar'];
  const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Categories', 'Rating'];

  // Check if a link is active
  const isLinkActive = (linkHref) => {
    if (linkHref === '#') return false;
    if (currentPath === linkHref) return true;
    if (linkHref === '/' && currentPath === '/') return true;
    if (linkHref !== '/' && currentPath.startsWith(linkHref)) return true;
    return false;
  };

  // Check if a store is active
  const isStoreActive = (store) => {
    const storeToOutletMap = {
      'Pharmacy': 'pharmacy',
      'De Choco Club': 'lounge', 
      'Restaurant and Bar': 'restaurant'
    };
    return storeToOutletMap[store] === activeOutlet;
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleStoreDropdown = (e) => {
    e.preventDefault();
    setStoreDropdownOpen(prev => !prev);
  };

  // Search handlers
  const handleSearch = (term) => {
    updateSearch(term);
  };

  const handleFilterChange = (filter) => {
    updateSort(filter);
  };

  const handleCategoryChange = (category) => {
    updateCategory(category);
  };

  const showDesktopSearch = currentPath === '/products' || currentPath.startsWith('/products');

  return (
    <header className="header">
      <div className="header-wrapper">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container-header">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
        </div>

        {/* Mobile Menu Toggle and Avatar */}
        <div className="mobile-header-actions">
          {/* Mobile Avatar - Only show when logged in */}
          {isLoggedIn && isMobile && (
            <div className="mobile-avatar-wrapper" ref={profileRef}>
              <button 
                className="mobile-avatar-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <User size={18} color="#666" />
              </button>

              {/* Mobile Profile Dropdown */}
              {showProfile && (
                <div className="mobile-profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-avatar">
                      <User size={20} color="#666" />
                    </div>
                    <div className="profile-header-info">
                      <h4>{profileData.name}</h4>
                    </div>
                  </div>
                  
                  <div className="profile-dropdown-content">
                    <div className="profile-item">
                      <label>Email</label>
                      <span>{profileData.email}</span>
                    </div>
                    
                    <div className="profile-item address">
                      <label>Address</label>
                      <span>{profileData.address}</span>
                    </div>
                    
                    <div className="profile-item">
                      <label>WhatsApp</label>
                      <span>{profileData.whatsappNumber}</span>
                    </div>
                    
                    <div className="profile-item phone">
                      <label>Phone</label>
                      <span>{profileData.phoneNumber}</span>
                    </div>

                    {/* Logout Button inside dropdown */}
                    <div className="profile-item profile-logout-section">
                      <button 
                        className="profile-logout-button" 
                        onClick={() => {
                          setShowProfile(false);
                          setIsLogoutModalOpen(true);
                        }}
                      >
                        <LogOut size={16} />
                        <span className='logout'>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <button onClick={toggleMenu} className="menu-toggle-button">
            { <Menu size={20} color="#ff4500"/>}
          </button>
        </div>

        {/* Desktop Navigation */}
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
            {/* User Profile Section with Dropdown - Desktop Only */}
            {isLoggedIn && (
              <div className="user-profile-section" ref={profileRef}>
                <div 
                  className="user-profile-header"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="avatar-header">
                    <User size={16} color="#666" />
                  </div>
                  <span className="username">{profileData.name}</span>
                  <ChevronDown 
                    size={14} 
                    className={`profile-chevron ${showProfile ? 'rotated' : ''}`}
                  />
                </div>

                {/* Profile Dropdown */}
                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar">
                        <User size={20} color="#666" />
                      </div>
                      <div className="profile-header-info">
                        <h4>{profileData.name}</h4>
                      </div>
                    </div>
                    
                    <div className="profile-dropdown-content">
                      <div className="profile-item">
                        <label>Email</label>
                        <span>{profileData.email}</span>
                      </div>
                      
                      <div className="profile-item address">
                        <label>Address</label>
                        <span>{profileData.address}</span>
                      </div>
                      
                      <div className="profile-item">
                        <label>WhatsApp</label>
                        <span>{profileData.whatsappNumber}</span>
                      </div>
                      
                      <div className="profile-item phone">
                        <label>Phone</label>
                        <span>{profileData.phoneNumber}</span>
                      </div>

                      {/* Logout Button inside dropdown */}
                      <div className="profile-item profile-logout-section">
                        <button 
                          className="profile-logout-button" 
                          onClick={() => {
                            setShowProfile(false);
                            setIsLogoutModalOpen(true);
                          }}
                        >
                          <LogOut size={16} />
                          <span className='logout'>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
              {/* Mobile Menu Header */}
              <div className="mobile-menu-header">
                <div className="logo-container-header">
                  <img src="/logo.png" alt="Logo" className="logo" />
                </div>
                <button 
                  className="menu-toggle-button" 
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} color="#ff4500" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
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
                                    onClick={() => {
                                      handleStoreChange(store);
                                      setIsMenuOpen(false);
                                    }}
                                    className="mobile-dropdown-item"
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
                          onClick={() => setIsMenuOpen(false)}
                          className={`mobile-nav-link ${isLinkActive(link.href) ? 'active-link' : ''}`}
                        >
                          {link.name}
                        </Link>
                      );
                    }
                  })}
                </div>
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