'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Project } from '@/payload-types'

interface SearchButtonProps {
  projects: Project[]
}

// Alle verfügbaren Tags aus dem Backend
const AVAILABLE_TAGS = [
  'photo',
  'video', 
  '3d',
  'interactive',
  'rendering',
  'live',
  'projection'
] as const

type TagType = typeof AVAILABLE_TAGS[number]

const SearchButton: React.FC<SearchButtonProps> = ({ projects }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<TagType[]>([])
  const [filteredProjects, setFilteredProjects] = useState<any[]>([])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchOverlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      // Fokus auf das Suchfeld setzen wenn es geöffnet wird
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    // Filtere Projekte basierend auf Suchbegriff und ausgewählten Tags
    let filtered = projects

    // Text-Suche
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(project => 
        project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Tag-Filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project => 
        project.tags?.some((tag: any) => selectedTags.includes(tag as TagType))
      )
    }

    setFilteredProjects(filtered)
  }, [searchTerm, selectedTags, projects])

  const handleTagToggle = (tag: TagType) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      // Starte Fade-out Animation
      setIsClosing(true)
      setTimeout(() => {
        setIsSearchOpen(false)
        setIsClosing(false)
        setSearchTerm('')
        setSelectedTags([])
        setFilteredProjects([])
      }, 250) // Wartet bis die Fade-out Animation beendet ist
    } else {
      // Öffne die Suche
      setIsSearchOpen(true)
    }
  }

  const handleProjectClick = (projectId: string) => {
    // Scroll zu dem entsprechenden Projekt
    const projectElement = document.getElementById(`project-${projectId}`)
    if (projectElement) {
      projectElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      // Starte Fade-out Animation
      setIsClosing(true)
      setTimeout(() => {
        setIsSearchOpen(false)
        setIsClosing(false)
        setSearchTerm('')
        setSelectedTags([])
        setFilteredProjects([])
      }, 250)
    }
  }

  // Hilfsfunktion um das erste Projektbild zu holen
  const getProjectThumbnail = (project: Project): string => {
    const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=Projekt+Vorschau'
    
    if (!project.projectImages || project.projectImages.length === 0) {
      return DEFAULT_IMAGE
    }

    const firstImage = project.projectImages.find(item => 
      item.image && typeof item.image === 'object' && item.image !== null && 'url' in item.image
    )
    
    if (firstImage?.image && typeof firstImage.image === 'object' && 'url' in firstImage.image) {
      return firstImage.image.url || DEFAULT_IMAGE
    }
    
    return DEFAULT_IMAGE
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === searchOverlayRef.current) {
      handleSearchToggle()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSearchToggle()
    }
  }

  return (
    <>
      {/* Lupen-Button */}
      <button
        className={`search-button ${isSearchOpen ? 'hidden' : ''}`}
        onClick={handleSearchToggle}
        aria-label="Suche öffnen"
        title="Projekte durchsuchen"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </button>

      {/* Such-Overlay */}
      {isSearchOpen && (
        <div 
          ref={searchOverlayRef}
          className={`search-overlay ${isClosing ? 'closing' : ''}`}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg 
                className="search-icon"
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Projekte durchsuchen..."
                className="search-input"
              />
              <button
                onClick={handleSearchToggle}
                className="search-close"
                aria-label="Suche schließen"
              >
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
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Tag-Filter */}
            <div className="search-tags-section">
              <div className="search-tags-header">Filter nach Tags:</div>
              <div className="search-tags-container">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`search-tag-filter ${selectedTags.includes(tag) ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="search-tags-clear"
                  >
                    Alle entfernen
                  </button>
                )}
              </div>
            </div>

            {/* Suchergebnisse */}
            {(searchTerm.trim() !== '' || selectedTags.length > 0) && (
              <div className="search-results">
                {filteredProjects.length > 0 ? (
                  <>
                    <div className="search-results-header">
                      {filteredProjects.length} Projekt{filteredProjects.length !== 1 ? 'e' : ''} gefunden
                      {selectedTags.length > 0 && (
                        <span className="search-active-filters">
                          {' '}mit Tag{selectedTags.length > 1 ? 's' : ''}: {selectedTags.join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="search-results-grid">
                      {filteredProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => handleProjectClick(project.id)}
                          className="search-result-card"
                        >
                          <div className="search-result-thumbnail">
                            <img 
                              src={getProjectThumbnail(project)} 
                              alt={project.projectName || 'Projekt Thumbnail'}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Projekt+Vorschau'
                              }}
                            />
                          </div>
                          <div className="search-result-content">
                            <div className="search-result-title">{project.projectName}</div>
                            {project.creationYear && (
                              <div className="search-result-year">{project.creationYear}</div>
                            )}
                            {project.shortDescription && (
                              <div className="search-result-description">
                                {project.shortDescription}
                              </div>
                            )}
                            {project.tags && project.tags.length > 0 && (
                              <div className="search-result-tags">
                                {project.tags.slice(0, 3).map((tag: string, index: number) => (
                                  <span key={index} className="search-result-tag">
                                    {tag}
                                  </span>
                                ))}
                                {project.tags.length > 3 && (
                                  <span className="search-result-tag-more">
                                    +{project.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="search-no-results">
                    {searchTerm.trim() !== '' ? (
                      <>Keine Projekte gefunden für "{searchTerm}"</>
                    ) : (
                      <>Keine Projekte mit den ausgewählten Tags gefunden</>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SearchButton
