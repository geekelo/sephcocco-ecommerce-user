import React from 'react'
import SearchFilter from '../components/SearchFilter'
import Hero from '../components/Hero'
import '../styles/Product.css'
import { renderMultipleShowcases } from '../components/RenderMultipleShowCases';

export default function Product() {
    const filterOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First', 'Popularity', 'Rating'];
  return (
    <>
      <SearchFilter className='mobile-product-only' filterOptions={filterOptions}/>
      <Hero/>
      <section className="product-showcases-container">
          {renderMultipleShowcases()}
        </section>
    </>
 
  )
}
