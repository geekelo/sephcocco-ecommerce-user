

import React, { useEffect } from 'react';

const MobileOrderResponsiveFix = ({ showPaymentOnMobile }) => {
  useEffect(() => {
    // This helps ensure the mobile layout adjusts properly
    // when switching between summary and payment views
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Force a reflow to ensure CSS transitions work correctly
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.body.style.overflow = 'hidden';
        }, 10);
      }
    };

    // Call once on mount/state change
    handleResize();
    
    // Add listener for orientation changes
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [showPaymentOnMobile]);

  return null; // This is a utility component, doesn't render anything
};

export default MobileOrderResponsiveFix;