'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import ProjectTooltip from './ProjectTooltip'
import { Project } from '@/payload-types'
import { useDragScroll } from '../hooks/useDragScroll'

// Standard Platzhalterbild
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/1200x800?text=Projekt+Vorschau'

// Hilfsfunktion: Extrahiert Dateinamen aus URL für Alt-Text
const getFileNameFromUrl = (url: string): string => {
  try {
    const fileName = url.split('/').pop()?.split('?')[0] || 'Datei'
    // Entferne Dateiendung und ersetze Unterstriche/Bindestriche durch Leerzeichen
    return fileName
      .replace(/\.[^/.]+$/, '') // Entferne Dateiendung
      .replace(/[_-]/g, ' ') // Ersetze _ und - durch Leerzeichen
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Kapitalisiere jeden Wortanfang
  } catch {
    return 'Datei'
  }
}

// Hilfsfunktion: Generiert Alt-Text basierend auf vorhandenem Text oder Dateinamen
const generateAltText = (
  existingAlt: string | undefined,
  url: string,
  projectName: string,
  mediaType: string = 'Bild',
): string => {
  if (existingAlt && existingAlt.trim()) {
    return existingAlt
  }

  const fileName = getFileNameFromUrl(url)
  return `${projectName} - ${fileName}`
}

interface ProjectSectionProps {
  project: Project
  index: number
  totalProjects: number
}

interface MediaItem {
  url: string
  alt: string
  type: 'image' | 'video' | 'youtube'
  embedUrl?: string
  thumbnailUrl?: string
  aspectRatio?: number
  orientation?: 'landscape' | 'portrait' | 'square'
  width?: number
  height?: number
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ project, index, totalProjects }) => {
  // Refs für Videos, um später darauf zugreifen zu können
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Drag Scroll Hook für horizontales Scrollen
  const {
    ref: mediaContainerRef,
    isDragging,
    events: dragEvents,
  } = useDragScroll<HTMLDivElement>({
    direction: 'horizontal',
    sensitivity: 1.0,
    momentumMultiplier: 0.92, // Sanftes Ausrollen
  })

  // Tooltip State
  const [tooltipState, setTooltipState] = useState({
    isVisible: false,
    mousePosition: { x: 0, y: 0 },
    isShiftPressed: false,
  })

  // Keyboard Event Handlers für Shift-Taste
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setTooltipState((prev) => ({ ...prev, isShiftPressed: true }))
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setTooltipState((prev) => ({ ...prev, isShiftPressed: false }))
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
    setTooltipState((prev) => ({ ...prev, isVisible: true }))
  }

  const handleMouseLeave = () => {
    setTooltipState((prev) => ({
      ...prev,
      isVisible: false,
      isShiftPressed: false,
    }))
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipState((prev) => ({
      ...prev,
      mousePosition: { x: event.clientX, y: event.clientY },
    }))
  }

  // Verarbeiten der Projektbilder
  const getProjectMedia = (): MediaItem[] => {
    if (
      !project.projectImages ||
      project.projectImages.length === 0 ||
      project.projectImages.every(
        (item) => !item.image && !item.video && !item.youtubeUrl && !item.useDefaultImage,
      )
    ) {
      // Fallback auf Standardbild, wenn keine Medien vorhanden sind
      return [
        {
          url: DEFAULT_IMAGE_URL,
          alt: `${project.projectName} - Standardbild`,
          type: 'image',
        },
      ]
    }

    // Vorhandene Medien verarbeiten
    return project.projectImages
      .filter((item) => item.image || item.video || item.youtubeUrl || item.useDefaultImage)
      .map((item): MediaItem | null => {
        if (item.useDefaultImage) {
          return {
            url: DEFAULT_IMAGE_URL,
            alt: `${project.projectName} - Standardbild`,
            type: 'image',
          }
        }

        // YouTube-Video verarbeiten
        if (item.mediaType === 'youtube' && item.youtubeUrl) {
          // Für YouTube verwenden wir den Titel oder generieren einen aus der URL
          const altText =
            item.youtubeTitle ||
            generateAltText(undefined, item.youtubeUrl, project.projectName, 'YouTube Video')

          return {
            url: item.youtubeUrl,
            alt: altText,
            type: 'youtube',
            embedUrl: item.youtubeEmbedUrl || undefined,
            thumbnailUrl: item.youtubeThumbnailUrl || undefined,
            aspectRatio: item.youtubeAspectRatio || 16 / 9,
            orientation: item.youtubeOrientation || 'landscape',
            width: item.youtubeWidth || 1920,
            height: item.youtubeHeight || 1080,
          }
        }

        // Video-Element verarbeiten
        if (
          item.mediaType === 'video' &&
          item.video &&
          typeof item.video === 'object' &&
          'url' in item.video
        ) {
          const url = item.video.url
          if (!url) return null

          return {
            url,
            alt: generateAltText(item.video.alt, url, project.projectName, 'Video'),
            type: 'video',
          }
        }

        // Bild-Element verarbeiten (oder Legacy-Support)
        if (item.image && typeof item.image === 'object' && 'url' in item.image) {
          const url = item.image.url
          if (!url) return null

          // Legacy: Prüfe ob das "Bild" eigentlich ein Video ist
          const isVideo =
            url.endsWith('.mp4') ||
            url.endsWith('.webm') ||
            url.endsWith('.mov') ||
            item.image.mimeType?.startsWith('video/')

          return {
            url,
            alt: generateAltText(
              item.image.alt,
              url,
              project.projectName,
              isVideo ? 'Video' : 'Bild',
            ),
            type: isVideo ? 'video' : 'image',
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
          videoRefs.current.forEach((videoEl) => {
            if (videoEl) {
              if (entry.isIntersecting) {
                videoEl.play().catch((err) => console.log('Autoplay wurde verhindert:', err))
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
      behavior: 'smooth',
    })
  }

  const processedMedia = getProjectMedia()
  const isLastProject = index === totalProjects - 1

  // Video-Ref-Array zurücksetzen vor jedem Rendern
  videoRefs.current = []

  return (
    <section className="project-section" id={`project-${project.id}`}>
      <div
        className={`media-container ${isDragging ? 'dragging' : ''}`}
        ref={mediaContainerRef}
        {...dragEvents}
      >
        {processedMedia.map((media, i) =>
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
          ) : media.type === 'youtube' ? (
            <div
              key={i}
              className={`media-item youtube-container ${media.orientation || 'landscape'}`}
              style={
                {
                  '--aspect-ratio': media.aspectRatio || 16 / 9,
                } as React.CSSProperties
              }
            >
              {media.embedUrl ? (
                <iframe
                  src={media.embedUrl}
                  title={media.alt}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-iframe"
                />
              ) : (
                // Fallback wenn keine Embed-URL vorhanden ist
                <div className="youtube-fallback">
                  {media.thumbnailUrl && (
                    <img src={media.thumbnailUrl} alt={media.alt} className="youtube-thumbnail" />
                  )}
                  <div className="youtube-play-button">
                    <svg width="68" height="48" viewBox="0 0 68 48">
                      <path
                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                        fill="#f00"
                      />
                      <path d="M 45,24 27,14 27,34" fill="#fff" />
                    </svg>
                  </div>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="youtube-link"
                  >
                    Video auf YouTube ansehen
                  </a>
                </div>
              )}
            </div>
          ) : (
            <Image
              key={i}
              src={media.url}
              alt={media.alt}
              className="media-item"
              width={1200}
              height={800}
              priority={i === 0}
              unoptimized={
                media.url.includes('youtube.com') ||
                media.url.includes('youtu.be') ||
                media.url.includes('via.placeholder.com')
              }
            />
          ),
        )}
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
