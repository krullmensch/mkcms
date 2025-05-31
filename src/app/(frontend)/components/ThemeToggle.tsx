'use client'

import React, { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createWaveEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    // Entferne vorherige Wellen
    const existingOverlay = document.querySelector('.theme-wave-overlay')
    if (existingOverlay) {
      existingOverlay.remove()
    }

    // Erstelle Overlay-Container
    const overlay = document.createElement('div')
    overlay.className = 'theme-wave-overlay'
    document.body.appendChild(overlay)

    // Berechne Position des Buttons
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Berechne die maximale Distanz für die Welle
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
      Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
    )

    // Erstelle mehrere Wellen für einen schönen Effekt
    for (let i = 1; i <= 3; i++) {
      const wave = document.createElement('div')
      wave.className = `theme-wave theme-wave-${i} active`
      
      const size = maxDistance * 2.5
      wave.style.width = `${size}px`
      wave.style.height = `${size}px`
      wave.style.left = `${centerX - size / 2}px`
      wave.style.top = `${centerY - size / 2}px`
      
      overlay.appendChild(wave)
    }

    // Rufe das eigentliche Theme-Toggle mit einer kleinen Verzögerung auf
    // damit die Welle Zeit hat sich auszubreiten
    setTimeout(() => {
      toggleTheme()
    }, 200)

    // Entferne das Overlay nach der Animation
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        overlay.remove()
      }
    }, 1000)
  }

  return (
    <button
      ref={buttonRef}
      onClick={createWaveEffect}
      className="theme-toggle"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        // Sun Icon für Light Mode
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        // Moon Icon für Dark Mode
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
