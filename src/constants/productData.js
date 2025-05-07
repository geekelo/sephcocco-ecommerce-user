import Image from '../assets/image.png'

// Top Sellers Data (pharmaceutical products)
export const topSellersData = [
  {
    id: 2,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 42,
    isFavorite: false,
    category: "pain-relief",
    likes: 387,
    description: "Panadol Extra provides fast and effective relief for headaches, back pain, and fever.",
    rating: 4.7,
    ratingCount: 125
  },
  {
    id: 4,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 17,
    isFavorite: true,
    category: "pain-relief",
    likes: 246,
    description: "Trusted pain relief with caffeine for enhanced effectiveness.",
    rating: 4.5,
    ratingCount: 102
  },
  {
    id: 6,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 31,
    isFavorite: false,
    category: "pain-relief",
    likes: 153,
    description: "Effective against migraines, toothaches, and fever symptoms.",
    rating: 4.4,
    ratingCount: 84
  },
  {
    id: 8,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 25,
    isFavorite: true,
    category: "pain-relief",
    likes: 456,
    description: "A reliable over-the-counter solution for daily aches and pains.",
    rating: 4.8,
    ratingCount: 138
  },
  {
    id: 10,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 39,
    isFavorite: false,
    category: "pain-relief",
    likes: 172,
    description: "Fast-acting formula with paracetamol and caffeine combo.",
    rating: 4.3,
    ratingCount: 77
  },
  {
    id: 12,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 21,
    isFavorite: true,
    category: "pain-relief",
    likes: 298,
    description: "Pain relief with minimal side effects for daily use.",
    rating: 4.6,
    ratingCount: 110
  },
  {
    id: 14,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: false,
    stockCount: 0,
    isFavorite: false,
    category: "pain-relief",
    likes: 95,
    description: "Temporarily out of stock — known for rapid headache relief.",
    rating: 4.2,
    ratingCount: 49
  },
  {
    id: 16,
    name: "Panadol Extra",
    price: 129.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 15,
    isFavorite: true,
    category: "pain-relief",
    likes: 221,
    description: "Customer favorite for reliable, fast-acting pain relief.",
    rating: 4.5,
    ratingCount: 91
  }
];

export const newArrivalsData = [
  {
    id: 1,
    name: "Vitamin C Tablets",
    price: 89.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 36,
    isFavorite: false,
    category: "vitamins",
    likes: 87,
    description: "Boost your immunity with high-potency Vitamin C tablets.",
    rating: 4.6,
    ratingCount: 64
  },
  {
    id: 3,
    name: "Zinc Supplement",
    price: 75.50,
    images: [Image, Image],
    inStock: true,
    stockCount: 19,
    isFavorite: true,
    category: "supplements",
    likes: 124,
    description: "Supports immune function and helps fight infections naturally.",
    rating: 4.3,
    ratingCount: 52
  },
  {
    id: 5,
    name: "Omega-3 Fish Oil",
    price: 149.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 28,
    isFavorite: false,
    category: "supplements",
    likes: 162,
    description: "Promotes heart, brain, and joint health with omega-3 fatty acids.",
    rating: 4.7,
    ratingCount: 98
  },
  {
    id: 7,
    name: "Multivitamin Complex",
    price: 199.00,
    images: [Image, Image],
    inStock: false,
    stockCount: 0,
    isFavorite: true,
    category: "vitamins",
    likes: 95,
    description: "Balanced mix of essential vitamins and minerals for daily health.",
    rating: 4.5,
    ratingCount: 67
  },
  {
    id: 9,
    name: "Probiotics Daily",
    price: 159.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 42,
    isFavorite: false,
    category: "digestive-health",
    likes: 73,
    description: "Maintain gut health with a daily dose of beneficial bacteria.",
    rating: 4.4,
    ratingCount: 56
  },
  {
    id: 11,
    name: "Melatonin Sleep Aid",
    price: 95.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 33,
    isFavorite: true,
    category: "sleep-aids",
    likes: 138,
    description: "Helps regulate your sleep cycle naturally and effectively.",
    rating: 4.6,
    ratingCount: 71
  },
  {
    id: 13,
    name: "Collagen Peptides",
    price: 219.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 17,
    isFavorite: false,
    category: "beauty-supplements",
    likes: 189,
    description: "Supports skin, hair, nail, and joint health with hydrolyzed collagen.",
    rating: 4.8,
    ratingCount: 88
  },
  {
    id: 15,
    name: "Protein Powder",
    price: 249.00,
    images: [Image, Image],
    inStock: true,
    stockCount: 24,
    isFavorite: true,
    category: "fitness-supplements",
    likes: 205,
    description: "Fuel your workouts and recovery with high-quality protein.",
    rating: 4.7,
    ratingCount: 105
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