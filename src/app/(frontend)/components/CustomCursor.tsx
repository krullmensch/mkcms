'use client'

import React, { useEffect, useState, useRef } from 'react'

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if device supports hover (desktop)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mediaQuery.matches) return

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Interactive elements that should trigger hover state
    const interactiveSelectors = [
      'a',
      'button',
      '[role="button"]',
      '.theme-toggle',
      '.project-title h2',
      '.scroll-arrow',
      '.portfolio-header a',
      '[data-tooltip]',
      'input',
      'textarea',
      'select'
    ].join(', ')

    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest(interactiveSelectors)) {
        setIsHovered(true)
      }
    }

    const handleElementLeave = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest(interactiveSelectors)) {
        setIsHovered(false)
      }
    }

    // Add event listeners
    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseover', handleElementHover)
    document.addEventListener('mouseout', handleElementLeave)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseover', handleElementHover)
      document.removeEventListener('mouseout', handleElementLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isVisible ? 'visible' : ''} ${isHovered ? 'hover' : ''}`}
      style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        transition: 'none', // Entfernt jeglichen Drag-Effekt
      }}
    >
      <div className="cursor-dot" />
    </div>
  )
}

export default CustomCursor
