'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import AboutButton from './AboutButton'
import { About } from '@/payload-types'

interface PortfolioHeaderProps {
  isVisible?: boolean
  aboutData?: About | null
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  isVisible = true,
  aboutData = null,
}) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  if (!isVisible) return null

  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAboutOpen(true)
  }

  return (
    <>
      <header className="portfolio-header">
        <h1>
          <button
            onClick={handleNameClick}
            className="portfolio-name-button"
            aria-label="About Me öffnen"
          >
            Marvin Krullmann
          </button>
        </h1>
      </header>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* About Button Component */}
      <AboutButton
        aboutData={aboutData}
        isOpen={isAboutOpen}
        onToggle={() => setIsAboutOpen(!isAboutOpen)}
      />
    </>
  )
}

export default PortfolioHeader
