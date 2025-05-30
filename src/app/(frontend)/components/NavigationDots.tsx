'use client'

import React, { useEffect, useState } from 'react'

interface NavigationDotsProps {
  totalProjects: number
  projectNames: string[]
}

const NavigationDots: React.FC<NavigationDotsProps> = ({ totalProjects, projectNames }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const newIndex = Math.round(scrollPosition / windowHeight)
      
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < totalProjects) {
        setActiveIndex(newIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeIndex, totalProjects])

  const scrollToProject = (index: number) => {
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div className="navigation-dots">
      {Array.from({ length: totalProjects }).map((_, index) => (
        <button
          key={index}
          className={`dot ${index === activeIndex ? 'active' : ''}`}
          onClick={() => scrollToProject(index)}
          title={projectNames[index]}
          aria-label={`Zum Projekt ${projectNames[index]} scrollen`}
        />
      ))}
    </div>
  )
}

export default NavigationDots