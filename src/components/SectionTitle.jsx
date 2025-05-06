import '../styles/SectionTitle.css'
import React from 'react';
import { motion } from 'framer-motion';

export const SectionTitle = ({ title, seeAllLink = "#" }) => {
    return (
      <div className="section-title-container">
        <h2 className="section-title">{title}</h2>
        <motion.a 
          href={seeAllLink}
          className="see-all-link"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          See all →
        </motion.a>
      </div>
    );
  };