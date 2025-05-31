'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true) // Standard: Dark Mode

  useEffect(() => {
    // Lade gespeicherte Einstellung aus localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      setIsDarkMode(false)
    }
  }, [])

  useEffect(() => {
    // Aktualisiere CSS-Variablen und localStorage
    if (isDarkMode) {
      document.documentElement.style.setProperty('--bg-color', '#000000')
      document.documentElement.style.setProperty('--text-color', '#ffffff')
      document.documentElement.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)')
      // Theme-spezifische Variablen für Komponenten
      document.documentElement.style.setProperty('--toggle-bg', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--toggle-border', 'rgba(255, 255, 255, 0.2)')
      document.documentElement.style.setProperty('--toggle-hover-bg', 'rgba(255, 255, 255, 0.15)')
      document.documentElement.style.setProperty('--toggle-hover-border', 'rgba(255, 255, 255, 0.3)')
      document.documentElement.style.setProperty('--tooltip-bg', 'rgba(0, 0, 0, 0.95)')
      document.documentElement.style.setProperty('--tooltip-border', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--tooltip-shadow', '0 8px 32px rgba(0, 0, 0, 0.4)')
      document.documentElement.style.setProperty('--tooltip-tag-bg', 'rgba(255, 255, 255, 0.1)')
      // Weitere Theme-Variablen
      document.documentElement.style.setProperty('--title-hover-color', 'rgba(255, 255, 255, 0.9)')
      document.documentElement.style.setProperty('--link-bg', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--code-bg', 'rgba(255, 255, 255, 0.15)')
      // Cursor-Variablen
      document.documentElement.style.setProperty('--cursor-color', '#ffffff')
      document.documentElement.style.setProperty('--cursor-dot-color', '#ffffff')
      // Search-Variablen (Dark Mode)
      document.documentElement.style.setProperty('--search-bg', '#000000')
      document.documentElement.style.setProperty('--search-text', '#ffffff')
      document.documentElement.style.setProperty('--search-border', 'rgba(255, 255, 255, 0.2)')
      document.documentElement.style.setProperty('--search-focus-border', '#ffffff')
      document.documentElement.style.setProperty('--search-focus-bg', '#000000')
      document.documentElement.style.setProperty('--search-results-bg', 'rgba(0, 0, 0, 0.95)')
      document.documentElement.style.setProperty('--search-header-bg', 'rgba(255, 255, 255, 0.05)')
      document.documentElement.style.setProperty('--search-item-border', 'rgba(255, 255, 255, 0.05)')
      document.documentElement.style.setProperty('--search-item-hover', 'rgba(255, 255, 255, 0.05)')
      document.documentElement.style.setProperty('--search-tag-bg', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--search-tag-text', '#ffffff')
      document.documentElement.style.setProperty('--search-tag-more-bg', 'rgba(255, 255, 255, 0.1)')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.style.setProperty('--bg-color', '#ffffff')
      document.documentElement.style.setProperty('--text-color', '#000000')
      document.documentElement.style.setProperty('--text-secondary', 'rgba(0, 0, 0, 0.7)')
      // Theme-spezifische Variablen für Komponenten  
      document.documentElement.style.setProperty('--toggle-bg', 'rgba(0, 0, 0, 0.1)')
      document.documentElement.style.setProperty('--toggle-border', 'rgba(0, 0, 0, 0.2)')
      document.documentElement.style.setProperty('--toggle-hover-bg', 'rgba(0, 0, 0, 0.15)')
      document.documentElement.style.setProperty('--toggle-hover-border', 'rgba(0, 0, 0, 0.3)')
      document.documentElement.style.setProperty('--tooltip-bg', 'rgba(255, 255, 255, 0.95)')
      document.documentElement.style.setProperty('--tooltip-border', 'rgba(0, 0, 0, 0.1)')
      document.documentElement.style.setProperty('--tooltip-shadow', '0 8px 32px rgba(0, 0, 0, 0.15)')
      document.documentElement.style.setProperty('--tooltip-tag-bg', 'rgba(0, 0, 0, 0.1)')
      // Weitere Theme-Variablen
      document.documentElement.style.setProperty('--title-hover-color', 'rgba(0, 0, 0, 0.9)')
      document.documentElement.style.setProperty('--link-bg', 'rgba(0, 0, 0, 0.1)')
      document.documentElement.style.setProperty('--code-bg', 'rgba(0, 0, 0, 0.15)')
      // Cursor-Variablen
      document.documentElement.style.setProperty('--cursor-color', '#000000')
      document.documentElement.style.setProperty('--cursor-dot-color', '#000000')
      // Search-Variablen (Light Mode)
      document.documentElement.style.setProperty('--search-bg', '#ffffff')
      document.documentElement.style.setProperty('--search-text', '#000000')
      document.documentElement.style.setProperty('--search-border', 'rgba(0, 0, 0, 0.2)')
      document.documentElement.style.setProperty('--search-focus-border', '#000000')
      document.documentElement.style.setProperty('--search-focus-bg', '#ffffff')
      document.documentElement.style.setProperty('--search-results-bg', 'rgba(255, 255, 255, 0.95)')
      document.documentElement.style.setProperty('--search-header-bg', 'rgba(0, 0, 0, 0.05)')
      document.documentElement.style.setProperty('--search-item-border', 'rgba(0, 0, 0, 0.05)')
      document.documentElement.style.setProperty('--search-item-hover', 'rgba(0, 0, 0, 0.05)')
      document.documentElement.style.setProperty('--search-tag-bg', 'rgba(0, 0, 0, 0.1)')
      document.documentElement.style.setProperty('--search-tag-text', '#000000')
      document.documentElement.style.setProperty('--search-tag-more-bg', 'rgba(0, 0, 0, 0.1)')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
