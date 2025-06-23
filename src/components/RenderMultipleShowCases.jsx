import React, { useMemo } from "react";
import { ProductShowcase } from "./ProductShowcase";
import { useSearch } from "./SearchContext";

export const RenderMultipleShowcases = ({ products = [], onProductClick, onFavorite }) => {
  // Get global search state to check if user has applied custom sorting
  const { sortOption, searchTerm, selectedCategory } = useSearch();
   
  // Check if user has applied any filters/search/sort
  const hasActiveFilters = sortOption || searchTerm || selectedCategory;
       
  // If user has active filters, show filtered results directly without categorizing
  if (hasActiveFilters) {
    return (
      <ProductShowcase
        title={`Filtered Results (${products.length})`}
        products={products}
        onProductClick={onProductClick}
        onFavorite={onFavorite} // Pass favorite handler
        maxItems={15}
        showSeeAll={false} // Don't show "See All" for filtered results
      />
    );
  }
   
  // Process products for Top Sellers (based on highest likes, top 15)
  const topSellers = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
         
    return [...products]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 15);
  }, [products]);

  // Process products for New Arrivals (based on created_at descending, top 15)
  const newArrivals = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
         
    return [...products]
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Descending order (newest first)
      })
      .slice(0, 15);
  }, [products]);

  const handleAddToCart = (productId) => {
    console.log(`Adding product ${productId} to cart`);
  };

  return (
    <>
      <ProductShowcase
        title="Top Sellers"
        products={topSellers}
        onAddToCart={handleAddToCart}
        onFavorite={onFavorite} // Pass favorite handler
        onProductClick={onProductClick}
        maxItems={8}
      />
      <ProductShowcase
        title="New Arrivals"
        products={newArrivals}
        onAddToCart={handleAddToCart}
        onFavorite={onFavorite} // Pass favorite handler
        onProductClick={onProductClick}
        maxItems={8}
      />
    </>
  );
};