import React, { useState } from "react";
import { newArrivalsData, topSellersData } from "../constants/productData";
import { ProductShowcase } from "./ProductShowcase";

export const RenderMultipleShowcases = ({ onProductClick }) => {
  const [products, setProducts] = useState({
    topSellers: topSellersData,
    newArrivals: newArrivalsData,
  });

  const handleAddToCart = (productId) => {
    console.log(`Adding product ${productId} to cart`);
  };

  const handleToggleFavorite = (productId) => {
    const categoryKey = Object.keys(products).find(key =>
      products[key].some(product => product.id === productId)
    );

    if (categoryKey) {
      setProducts(prev => ({
        ...prev,
        [categoryKey]: prev[categoryKey].map(product =>
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
        onProductClick={onProductClick}
      />
      <ProductShowcase
        title="New Arrivals"
        products={products.newArrivals}
        seeAllLink="/products/new-arrivals"
        onAddToCart={handleAddToCart}
        onFavorite={handleToggleFavorite}
        onProductClick={onProductClick}
      />
    </>
  );
};
