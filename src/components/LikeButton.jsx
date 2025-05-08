import React, { useState } from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LikeButton.css';

const LikeButton = ({ initialLikes = 0, isLiked = false, onLike = () => {} }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showThumbsUpAnimation, setShowThumbsUpAnimation] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    const newLiked = !liked;
    setLiked(newLiked);
    
    if (newLiked) {
      setLikes(prev => prev + 1);
      setShowThumbsUpAnimation(true);
      setTimeout(() => {
        setShowThumbsUpAnimation(false);
      }, 1000);
    } else {
      setLikes(prev => prev - 1);
    }
    
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
        
        {/* Animated hearts that appear when liked */}
        {isAnimating && liked && (
          <div className="floating-hearts">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="floating-heart"
                initial={{ 
                  scale: 0,
                  opacity: 0.7,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: 0,
                  x: (Math.random() - 0.5) * 40,
                  y: -Math.random() * 50 - 10
                }}
                transition={{
                  duration: Math.random() * 0.8 + 0.5,
                  ease: "easeOut"
                }}
              >
                <Heart size={12} fill="#e74c3c" color="#e74c3c" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.button>
      
      <div className="like-count-container">
        <motion.span 
          className="like-count"
          animate={showThumbsUpAnimation ? { y: [0, -5, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <ThumbsUp 
            size={14} 
            className={liked ? 'thumbs-up active' : 'thumbs-up'} 
          /> 
          {likes}
        </motion.span>
        
        {/* Animated thumbs up when count increases */}
        <AnimatePresence>
          {showThumbsUpAnimation && (
            <motion.div
              className="thumbs-up-indicator"
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <ThumbsUp size={12} />
              <span>+1</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LikeButton;