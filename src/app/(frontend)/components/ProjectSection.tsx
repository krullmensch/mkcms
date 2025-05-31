'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ProjectTooltip from './ProjectTooltip'
import { Project } from '@/payload-types'

// Standard Platzhalterbild
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/1200x800?text=Projekt+Vorschau'

interface ProjectSectionProps {
  project: Project
  index: number
  totalProjects: number
}

interface MediaItem {
  url: string
  alt: string
  type: 'image' | 'video'
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ project, index, totalProjects }) => {
  // Refs für Videos, um später darauf zugreifen zu können
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  
  // Tooltip State
  const [tooltipState, setTooltipState] = useState({
    isVisible: false,
    mousePosition: { x: 0, y: 0 },
    isShiftPressed: false
  })

  // Keyboard Event Handlers für Shift-Taste
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setTooltipState(prev => ({ ...prev, isShiftPressed: true }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setTooltipState(prev => ({ ...prev, isShiftPressed: false }))
      }
    }

    // Add event listeners to document instead of window for better compatibility
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, []) // Entferne die problematische Abhängigkeit

  // Mouse Event Handlers für Tooltip
  const handleMouseEnter = () => {
    setTooltipState(prev => ({ ...prev, isVisible: true }))
  }

  const handleMouseLeave = () => {
    setTooltipState(prev => ({ 
      ...prev, 
      isVisible: false, 
      isShiftPressed: false 
    }))
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipState(prev => ({
      ...prev,
      mousePosition: { x: event.clientX, y: event.clientY }
    }))
  }

  // Verarbeiten der Projektbilder
  const getProjectMedia = (): MediaItem[] => {
    if (!project.projectImages || project.projectImages.length === 0 || 
        project.projectImages.every((item) => !item.image && !item.video && !item.useDefaultImage)) {
      // Fallback auf Standardbild, wenn keine Bilder vorhanden sind
      return [{ 
        url: DEFAULT_IMAGE_URL,
        alt: `${project.projectName} - Standardbild`,
        type: 'image'
      }]
    }

    // Vorhandene Medien verarbeiten
    return project.projectImages
      .filter((item) => item.image || item.video || item.useDefaultImage)
      .map((item): MediaItem | null => {
        if (item.useDefaultImage) {
          return {
            url: DEFAULT_IMAGE_URL,
            alt: `${project.projectName} - Standardbild`,
            type: 'image'
          }
        }
        
        // Video-Element verarbeiten
        if (item.mediaType === 'video' && item.video && typeof item.video === 'object' && 'url' in item.video) {
          const url = item.video.url
          if (!url) return null
          
          return {
            url,
            alt: item.video.alt || `${project.projectName} - Video`,
            type: 'video'
          }
        }
        
        // Bild-Element verarbeiten (oder Legacy-Support)
        if (item.image && typeof item.image === 'object' && 'url' in item.image) {
          const url = item.image.url
          if (!url) return null
          
          // Legacy: Prüfe ob das "Bild" eigentlich ein Video ist
          const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || 
                         item.image.mimeType?.startsWith('video/')
          
          return {
            url,
            alt: item.image.alt || `${project.projectName}`,
            type: isVideo ? 'video' : 'image'
          }
        }
        
        return null
      })
      .filter((item): item is MediaItem => item !== null)
  }

  useEffect(() => {
    // Intersection Observer für das automatische Abspielen/Pausieren von Videos
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // 50% Sichtbarkeit auslösen
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // ID des beobachteten Abschnitts
        const sectionId = entry.target.id
        
        // Prüfen, ob es sich um diesen Abschnitt handelt
        if (sectionId === `project-${project.id}`) {
          // Alle Videos in diesem Abschnitt abspielen/pausieren
          videoRefs.current.forEach(videoEl => {
            if (videoEl) {
              if (entry.isIntersecting) {
                videoEl.play().catch(err => console.log('Autoplay wurde verhindert:', err))
              } else {
                videoEl.pause()
              }
            }
          })
        }
      })
    }, options)

    // Beobachte diesen Projektabschnitt
    const section = document.getElementById(`project-${project.id}`)
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [project.id])

  const scrollToNextProject = () => {
    window.scrollTo({
      top: window.innerHeight * (index + 1),
      behavior: 'smooth'
    })
  }

  const mediaItems = getProjectMedia()
  const isLastProject = index === totalProjects - 1

  // Video-Ref-Array zurücksetzen vor jedem Rendern
  videoRefs.current = []

  return (
    <section className="project-section" id={`project-${project.id}`}>
      <div className="media-container">
        {mediaItems.map((media, i) => (
          media.type === 'video' ? (
            <video 
              key={i}
              className="media-item"
              // Entferne controls
              autoPlay={false} // Anfangs deaktiviert, wird durch den Observer gesteuert
              loop
              muted
              playsInline
              ref={(el) => {
                videoRefs.current[i] = el
              }}
            >
              <source src={media.url} type={`video/${media.url.split('.').pop()}`} />
              Dein Browser unterstützt das Video-Tag nicht.
            </video>
          ) : (
            <Image
              key={i}
              src={media.url}
              alt={media.alt}
              className="media-item"
              width={1200}
              height={800}
              priority={i === 0}
            />
          )
        ))}
      </div>
      
      <div 
        className="project-title"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <h2>
          {project.projectName}
          {project.creationYear && `_${project.creationYear}`}
        </h2>
      </div>
      
      {/* Tooltip */}
      <ProjectTooltip
        project={project}
        isVisible={tooltipState.isVisible}
        mousePosition={tooltipState.mousePosition}
        isShiftPressed={tooltipState.isShiftPressed}
      />
      
      {/* Zeige den Pfeil auf allen Seiten außer der letzten an */}
      {!isLastProject && (
        <div className="scroll-arrow" onClick={scrollToNextProject}>
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5L12 19M12 19L5 12M12 19L19 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </section>
  )
}

export default ProjectSection