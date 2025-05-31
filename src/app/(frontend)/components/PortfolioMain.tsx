'use client'

import React, { useState, useEffect } from 'react'
import { Project } from '@/payload-types'
import PortfolioHeader from './PortfolioHeader'
import NameIntro from './NameIntro'
import ProjectSection from './ProjectSection'
import CustomCursor from './CustomCursor'
import SearchButton from './SearchButton'

interface PortfolioMainProps {
  projects: Project[]
}

const PortfolioMain: React.FC<PortfolioMainProps> = ({ projects }) => {
  const [showIntro, setShowIntro] = useState(false)
  
  // Titel-Animation ist deaktiviert - showIntro bleibt immer false
  // useEffect(() => {
  //   const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
  //   if (hasSeenIntro) {
  //     setShowIntro(false)
  //   }
  // }, [])

  const handleAnimationComplete = () => {
    setShowIntro(false)
    sessionStorage.setItem('hasSeenIntro', 'true')
  }

  const totalProjects = projects.length

  return (
    <div className="portfolio-container">
      <CustomCursor />
      {showIntro && <NameIntro onAnimationComplete={handleAnimationComplete} />}
      
      <PortfolioHeader isVisible={!showIntro} />
      
      {/* Search Button - nur anzeigen wenn Intro vorbei ist */}
      {!showIntro && <SearchButton projects={projects} />}

      {totalProjects > 0 ? (
        <>
          {projects.map((project, index) => (
            <ProjectSection 
              key={project.id} 
              project={project} 
              index={index}
              totalProjects={totalProjects}
            />
          ))}
        </>
      ) : (
        <div className="no-projects">
          <p>Noch keine Projekte vorhanden.</p>
        </div>
      )}
    </div>
  )
}

export default PortfolioMain
