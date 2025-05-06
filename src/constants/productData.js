import Image from '../assets/image.png'

// Top Sellers Data (pharmaceutical products)
export const topSellersData = [
    {
      id: 2,
      name: "Panadol Extra",
      price: 129.00,
      image: Image, 
      inStock: true,
      stockCount: 42,
      isFavorite: false,
      category: "pain-relief"
    },
    {
      id: 4,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: true,
      stockCount: 17,
      isFavorite: true,
      category: "pain-relief"
    },
    {
      id: 6,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: true, 
      stockCount: 31,
      isFavorite: false,
      category: "pain-relief"
    },
    {
      id: 8,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: true,
      stockCount: 25,
      isFavorite: true,
      category: "pain-relief"
    },
    {
      id: 10,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: true,
      stockCount: 39,
      isFavorite: false,
      category: "pain-relief"
    },
    {
      id: 12,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: true,
      stockCount: 21,
      isFavorite: true,
      category: "pain-relief"
    },
    {
      id: 14,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: false,
      stockCount: 0,
      isFavorite: false,
      category: "pain-relief"
    },
    {
      id: 16,
      name: "Panadol Extra",
      price: 129.00,
        image: Image, 
      inStock: true,
      stockCount: 15,
      isFavorite: true,
      category: "pain-relief"
    }
  ];
  
  // New Arrivals Data (variety of products)
  export const newArrivalsData = [
    {
      id: 1,
      name: "Vitamin C Tablets",
      price: 89.00,
      image: Image, 
      inStock: true,
      stockCount: 36,
      isFavorite: false,
      category: "vitamins"
    },
    {
      id: 3,
      name: "Zinc Supplement",
      price: 75.50,
      image: Image,
      inStock: true,
      stockCount: 19,
      isFavorite: true,
      category: "supplements"
    },
    {
      id: 5,
      name: "Omega-3 Fish Oil",
      price: 149.00,
      image: Image, 
      inStock: true,
      stockCount: 28,
      isFavorite: false,
      category: "supplements"
    },
    {
      id: 7,
      name: "Multivitamin Complex",
      price: 199.00,
      image: Image, 
      inStock: false,
      stockCount: 0,
      isFavorite: true,
      category: "vitamins"
    },
    {
      id: 9,
      name: "Probiotics Daily",
      price: 159.00,
      image: Image, 
      inStock: true,
      stockCount: 42,
      isFavorite: false,
      category: "digestive-health"
    },
    {
      id: 11,
      name: "Melatonin Sleep Aid",
      price: 95.00,
      image: Image, 
      inStock: true,
      stockCount: 33,
      isFavorite: true,
      category: "sleep-aids"
    },
    {
      id: 13,
      name: "Collagen Peptides",
      price: 219.00,
      image: Image, 
      inStock: true,
      stockCount: 17,
      isFavorite: false,
      category: "beauty-supplements"
    },
    {
      id: 15,
      name: "Protein Powder",
      price: 249.00,
      image: Image, 
      inStock: true,
      stockCount: 24,
      isFavorite: true,
      category: "fitness-supplements"
    }
  ];
  

  
  // Combined data for convenience
  export const allProducts = [
    ...topSellersData,
    ...newArrivalsData
  ];
  
  // Helper function to get products by category
  export const getProductsByCategory = (category) => {
    return allProducts.filter(product => product.category === category);
  };
  
  // Helper function to get products by multiple categories
  export const getProductsByCategories = (categoriesArray) => {
    return allProducts.filter(product => categoriesArray.includes(product.category));
  };
  
  // Helper function to search products by name
  export const searchProductsByName = (query) => {
    const searchTerm = query.toLowerCase();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
  };
  
  export default {
    topSellersData,
    newArrivalsData,
    allProducts,
    getProductsByCategory,
    getProductsByCategories,
    searchProductsByName
  };