import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/SimilarDiscount.css';
import { ProductCard } from './ProductCard';

const SimilarDiscounts = ({ products, currentProduct, onProductChange }) => {
    // Make sure we're safely filtering products
    const filteredProducts = Array.isArray(products)
      ? products.filter(p => p && currentProduct && p.id !== currentProduct.id)
      : [];
    
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    
    const handleProductClick = (product) => {
      // Change the product
      onProductChange(product);
      
      // Use Framer Motion's functions or just use window scroll for simplicity
      // The animation will happen in the ProductCard component
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // For cases where the modal is in its own scrollable container
      const modalContainer = document.querySelector('.product-modal-overlay');
      if (modalContainer) {
        modalContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    };
    
    return (
      <motion.div 
        className="similar-discounts"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="similar-header">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Similar Discounts
          </motion.h2>
          <div className="nav-buttons">
            <motion.button 
              className="nav-button prev" 
              ref={prevRef} 
              aria-label="Previous products"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={16} />
            </motion.button>
            <motion.button 
              className="nav-button next" 
              ref={nextRef} 
              aria-label="Next products"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {filteredProducts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                  480: { slidesPerView: 2 },  
                  768: { slidesPerView: 3 },  
                  1200: { slidesPerView: 4 }
                }}
                className="discount-swiper"
              >
                {filteredProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.1 * (index % 4) // stagger animation based on position
                      }}
                    >
                      <ProductCard
                        product={product}
                        buttonText="More details"
                        onButtonClick={() => handleProductClick(product)}
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          ) : (
            <motion.div 
              className="no-products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              No similar products available
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

export default SimilarDiscounts;