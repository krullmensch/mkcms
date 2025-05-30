'use client'

import React from 'react'

interface ScrollArrowProps {
  onClick?: () => void
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Default scroll behavior - scroll to next viewport height
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="scroll-arrow" onClick={handleClick}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    </div>
  )
}

export default ScrollArrow