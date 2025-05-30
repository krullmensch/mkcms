"use client"

import Link from 'next/link'
import React, { useState } from 'react'

const PortfolioHeader: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="portfolio-header">
      <div 
        className="header-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1>
          <Link href="/">MARVIN KRULLMANN</Link>
        </h1>
        
        {/* About Button with slide-in animation */}
        <div className={`about-nav ${isHovered ? 'visible' : ''}`}>
          <Link href="/about">About</Link>
        </div>
      </div>
    </header>
  )
}

export default PortfolioHeader