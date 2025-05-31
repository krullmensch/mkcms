"use client"

import Link from 'next/link'
import React from 'react'
import ThemeToggle from './ThemeToggle'

interface PortfolioHeaderProps {
  isVisible?: boolean
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({ isVisible = true }) => {
  if (!isVisible) return null

  return (
    <>
      <header className="portfolio-header">
        <h1>
          <Link href="/">MARVIN KRULLMANN</Link>
        </h1>
      </header>
      
      {/* Theme Toggle */}
      <ThemeToggle />
    </>
  )
}

export default PortfolioHeader