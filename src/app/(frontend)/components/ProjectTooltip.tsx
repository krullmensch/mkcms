'use client'

import React, { useState, useEffect } from 'react'
import { Project } from '@/payload-types'

interface ProjectTooltipProps {
  project: Project
  isVisible: boolean
  mousePosition: { x: number; y: number }
  isShiftPressed: boolean
}

const ProjectTooltip: React.FC<ProjectTooltipProps> = ({ 
  project, 
  isVisible, 
  mousePosition, 
  isShiftPressed 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [shouldRender, setShouldRender] = useState(false)

  // Hilfsfunktion zur Extraktion von Text aus RichText oder String
  const extractTextFromDescription = (description: any): string => {
    if (typeof description === 'string') {
      return description
    }
    
    if (description && typeof description === 'object' && description.root && description.root.children) {
      // Lexical RichText-Objekt: Extrahiere den Text aus allen Nodes
      const extractTextFromNodes = (nodes: any[]): string => {
        return nodes.map(node => {
          if (node.text) {
            return node.text
          }
          if (node.children && Array.isArray(node.children)) {
            return extractTextFromNodes(node.children)
          }
          return ''
        }).join('\n') // Verwende Zeilenumbrüche zwischen Paragraphen
      }
      
      return extractTextFromNodes(description.root.children).trim()
    }
    
    return ''
  }

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      
      // Dynamische Breite basierend auf Shift-Status und Content-Länge
      const descriptionText = extractTextFromDescription(project.description)
      const isLongDescription = isShiftPressed && descriptionText.trim().length > 0
      const hasLongContent = isLongDescription && descriptionText.length > 200
      
      // Berechne dynamische Tooltip-Dimensionen
      let tooltipWidth = 350 // Standard-Breite
      if (hasLongContent) {
        tooltipWidth = Math.min(600, window.innerWidth * 0.6) // Erweitere bis max 600px oder 60% der Bildschirmbreite
      }
      
      // Dynamische Höhenberechnung basierend auf Content
      const baseHeight = 80 // Basis-Höhe für Label und Hint
      const tagsHeight = project.tags && project.tags.length > 0 ? 40 : 0 // Tags
      const yearHeight = project.creationYear ? 20 : 0 // Jahr
      
      let contentHeight = 0
      if (isLongDescription) {
        // Schätze Höhe basierend auf Textlänge (ca. 20px pro Zeile bei line-height 1.5)
        const estimatedLines = Math.ceil(descriptionText.length / (tooltipWidth / 8)) // ~8 Zeichen pro px
        contentHeight = Math.max(40, estimatedLines * 20) // Mindestens 40px, dann 20px pro Zeile
      } else {
        // Kurzbeschreibung
        const shortText = project.shortDescription || ''
        const estimatedLines = Math.ceil(shortText.length / (tooltipWidth / 8))
        contentHeight = Math.max(20, estimatedLines * 20)
      }
      
      const tooltipHeight = baseHeight + contentHeight + tagsHeight + yearHeight + 40 // +40px für Padding
      
      // Verankere das Tooltip am unteren Rand (nahe dem Cursor)
      const verticalOffset = 15 // Abstand zum Cursor
      let x = mousePosition.x // Cursor X-Position als linke Kante des Tooltips
      
      // Fixe Y-Position: Tooltip soll immer am selben unteren Punkt verankert bleiben
      // So erweitert es sich nur nach oben, wenn sich die Größe ändert
      const anchorY = mousePosition.y - verticalOffset // Feste untere Verankerung
      let y = anchorY - tooltipHeight // Tooltip oberhalb der Verankerung
      
      // Stelle sicher, dass das Tooltip nicht über die rechte Kante hinausgeht
      if (x + tooltipWidth > window.innerWidth - 20) {
        x = window.innerWidth - tooltipWidth - 20 // 20px Abstand zum Rand
      }
      
      // Stelle sicher, dass das Tooltip nicht über die linke Kante hinausgeht
      if (x < 20) {
        x = 20 // Mindestabstand zum linken Rand
      }
      
      // Falls das Tooltip zu hoch für den verfügbaren Platz oberhalb ist,
      // positioniere es unterhalb des Cursors (als Fallback)
      if (y < 20) {
        // Nicht genug Platz oberhalb - zeige unterhalb des Cursors
        y = mousePosition.y + verticalOffset
        
        // Überprüfe, ob es unten genug Platz gibt
        if (y + tooltipHeight > window.innerHeight - 20) {
          // Auch unten nicht genug Platz - positioniere am oberen Rand
          y = 20
        }
      }
      
      setPosition({ x, y })
    } else {
      // Verzögerung beim Ausblenden für smoother Animation
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [mousePosition, isVisible, isShiftPressed, project.tags, project.creationYear, project.shortDescription])

  if (!shouldRender) return null

  // Sichere Überprüfung der Beschreibung
  const descriptionText = extractTextFromDescription(project.description)
  const hasLongDescription = descriptionText.trim().length > 0
  
  // Berechne dynamische Breite für das Tooltip (konsistent mit useEffect)
  const hasLongContent = isShiftPressed && hasLongDescription && descriptionText.length > 200
  const tooltipWidth = hasLongContent ? Math.min(600, window.innerWidth * 0.6) : 350

  return (
    <div 
      className="project-tooltip"
      style={{
        left: position.x,
        top: position.y,
        width: tooltipWidth,
      }}
    >
      <div className="tooltip-content">
        <div className="tooltip-description">
          {isShiftPressed && hasLongDescription ? (
            <>
              <strong>Ausführliche Beschreibung:</strong>
              <div className="description-text">
                {descriptionText || 'Keine ausführliche Beschreibung verfügbar'}
              </div>
            </>
          ) : (
            <>
              <strong>Kurzbeschreibung:</strong>
              <div className="description-text">
                {project.shortDescription || 'Keine Kurzbeschreibung verfügbar'}
              </div>
            </>
          )}
        </div>
        
        {/* Zeige Tags wenn vorhanden */}
        {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="tooltip-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="tooltip-tag">
                {String(tag)}
              </span>
            ))}
          </div>
        )}
        
        {/* Zeige Erstellungsjahr */}
        {project.creationYear && (
          <div className="tooltip-year">
            {String(project.creationYear)}
          </div>
        )}
        
        {/* Shift-Hinweis */}
        <div className="tooltip-hint">
          {isShiftPressed 
            ? 'Shift loslassen für Kurzbeschreibung' 
            : 'Shift halten für ausführliche Beschreibung'
          }
        </div>
      </div>
    </div>
  )
}

export default ProjectTooltip
