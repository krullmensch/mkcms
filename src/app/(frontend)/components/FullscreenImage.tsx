'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface FullscreenImageProps {
  src: string
  alt: string
  onClose: () => void
  type: 'image' | 'video'
}

const FullscreenImage: React.FC<FullscreenImageProps> = ({ src, alt, onClose, type }) => {
  // Schließe den Vollbildmodus mit der Escape-Taste
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onClose])

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Schließe nur, wenn der Hintergrund und nicht das Bild selbst geklickt wurde
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fullscreen-overlay" 
      onClick={handleBackgroundClick}
    >
      <button 
        className="fullscreen-close" 
        onClick={onClose}
        aria-label="Vollbildansicht schließen"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {type === 'video' ? (
        <video 
          className="fullscreen-media" 
          controls
          autoPlay
          loop
          src={src}
        >
          <source src={src} type={`video/${src.split('.').pop()}`} />
          Dein Browser unterstützt das Video-Tag nicht.
        </video>
      ) : (
        <div className="fullscreen-image-container">
          <Image
            src={src}
            alt={alt}
            fill
            className="fullscreen-media"
            priority
            sizes="100vw"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  )
}

export default FullscreenImage