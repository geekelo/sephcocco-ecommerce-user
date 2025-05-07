import React, { useState } from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/LikeButton.css';

const LikeButton = ({ initialLikes = 0, isLiked = false, onLike = () => {} }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(prev => newLiked ? prev + 1 : prev - 1);
    onLike(newLiked);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="like-container">
      <motion.button 
        className={`like-button ${liked ? 'active' : ''}`}
        onClick={handleLike}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? { 
          scale: [1, 1.2, 1],
          transition: { duration: 0.5 }
        } : {}}
      >
        <Heart
          size={20}
          fill={liked ? '#e74c3c' : 'none'}
          color={liked ? '#e74c3c' : '#666'}
          strokeWidth={liked ? 2 : 1.5}
        />
      </motion.button>
 
      <span className="like-count">   <ThumbsUp size={14} /> {likes}</span>
    </div>
  );
};

export default LikeButton;