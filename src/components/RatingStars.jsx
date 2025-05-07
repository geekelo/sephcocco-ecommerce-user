import React from 'react';
import { Star } from 'lucide-react';
import '../styles/RatingStar.css';

const RatingStars = ({ rating, count }) => {
  const fullStars = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < fullStars);
  
  return (
    <div className="rating">
      {stars.map((filled, index) => (
        <Star
          key={index}
          size={18}
          color={filled ? '#e74c3c' : '#e5e7eb'}
          fill={filled ? '#e74c3c' : 'none'}
        />
      ))}
      <span className="rating-count">({count})</span>
    </div>
  );
};

export default RatingStars;