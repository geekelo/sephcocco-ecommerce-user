import { useState } from "react";
import {  newArrivalsData, topSellersData } from "../constants/productData";
import { ProductShowcase } from "./ProductShowcase";

export const renderMultipleShowcases = () => {

    const [products, setProducts] = useState({
        topSellers: topSellersData,
        newArrivals: newArrivalsData
      });
    
      // Handler for adding to cart
      const handleAddToCart = (productId) => {
        console.log(`Adding product ${productId} to cart`);
        // Implement your cart functionality here
        // For example, show a notification, update cart count, etc.
      };
    
      // Handler for toggling favorites
      const handleToggleFavorite = (productId) => {
        // Determine which product category contains this product
        let categoryKey = Object.keys(products).find(key => 
          products[key].some(product => product.id === productId)
        );
    
        if (categoryKey) {
          setProducts(prevState => ({
            ...prevState,
            [categoryKey]: prevState[categoryKey].map(product => 
              product.id === productId 
                ? { ...product, isFavorite: !product.isFavorite } 
                : product
            )
          }));
        }
      };
    return (
      <>
       <ProductShowcase 
          title="Top Sellers"
          products={products.topSellers}
          seeAllLink="/products/top-sellers"
          onAddToCart={handleAddToCart}
          onFavorite={handleToggleFavorite}
        />
        
        <ProductShowcase 
          title="New Arrivals"
          products={products.newArrivals}
          seeAllLink="/products/new-arrivals"
          onAddToCart={handleAddToCart}
          onFavorite={handleToggleFavorite}
        />
      </>
    );
  };