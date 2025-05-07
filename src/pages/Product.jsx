import React from 'react'
import SearchFilter from '../components/SearchFilter'
import Hero from '../components/Hero'
import '../styles/Product.css'
import { RenderMultipleShowcases } from '../components/RenderMultipleShowCases';

export default function Product() {
    const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Categories', 'Rating'];
  return (
    <>
      <SearchFilter className='mobile-product-only' filterOptions={filterOptions}/>
      <Hero/>
      <section className="product-showcases-container">
        <RenderMultipleShowcases/>
        </section>
    </>
 
  )
}
