'use client'

import React, { useState, useRef, useEffect } from 'react'
import { About } from '@/payload-types'

interface AboutButtonProps {
  aboutData: About | null
  isOpen?: boolean
  onToggle?: () => void
}

const AboutButton: React.FC<AboutButtonProps> = ({ aboutData, isOpen = false, onToggle }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const aboutOverlayRef = useRef<HTMLDivElement>(null)

  // Synchronisiere mit external state wenn vorhanden
  useEffect(() => {
    setIsAboutOpen(isOpen)
  }, [isOpen])

  const handleAboutToggle = () => {
    if (isAboutOpen) {
      // Starte Fade-out Animation
      setIsClosing(true)
      setTimeout(() => {
        setIsAboutOpen(false)
        setIsClosing(false)
        onToggle?.() // Benachrichtige Parent-Component
      }, 250) // Wartet bis die Fade-out Animation beendet ist
    } else {
      // Öffne das About-Overlay
      setIsAboutOpen(true)
      onToggle?.() // Benachrichtige Parent-Component
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === aboutOverlayRef.current) {
      handleAboutToggle()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleAboutToggle()
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAboutOpen) {
        handleAboutToggle()
      }
    }

    if (isAboutOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isAboutOpen])

  const formatPhoneNumber = (phone: string) => {
    // Entferne alle Leerzeichen und Sonderzeichen für den tel:-Link
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    return cleanPhone
  }

  const formatSocialPlatform = (platform: string, customPlatform?: string | null) => {
    if (platform === 'other' && customPlatform) {
      return customPlatform
    }
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  if (!aboutData) {
    return null
  }

  return (
    <>
      {/* About-Overlay */}
      {isAboutOpen && (
        <div
          ref={aboutOverlayRef}
          className={`about-overlay ${isClosing ? 'closing' : ''}`}
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
        >
          <div className="about-container">
            <div className="about-header">
              <h2>Marvin Krullmann</h2>
              <button
                onClick={handleAboutToggle}
                className="about-close"
                aria-label="About schließen"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="about-content">
              {/* Profilbild */}
              {aboutData.profileImage && (
                <div className="about-profile-image">
                  <img
                    src={
                      typeof aboutData.profileImage === 'object' && aboutData.profileImage?.url
                        ? aboutData.profileImage.url
                        : typeof aboutData.profileImage === 'string'
                          ? aboutData.profileImage
                          : ''
                    }
                    alt={aboutData.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}

              {/* Biografie */}
              {aboutData.biography && (
                <div className="about-section">
                  <h4>About my work</h4>
                  <p>{aboutData.biography}</p>
                </div>
              )}

              {/* Kontakt */}
              <div className="about-section">
                <h4>Contact</h4>
                <div className="about-contact">
                  {/* E-Mail */}
                  <div className="about-contact-item">
                    <strong>E-Mail:</strong>{' '}
                    <a href={`mailto:${aboutData.email}`} className="about-contact-link">
                      {aboutData.email}
                    </a>
                  </div>

                  {/* Telefon */}
                  {aboutData.phone && (
                    <div className="about-contact-item">
                      <strong>Telefon:</strong>{' '}
                      <a
                        href={`tel:${formatPhoneNumber(aboutData.phone)}`}
                        className="about-contact-link"
                      >
                        {aboutData.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Instagram Link */}
              {aboutData.socialLinks && aboutData.socialLinks.length > 0 && (
                <div className="about-section">
                  {aboutData.socialLinks
                    .filter((link) => link.platform === 'instagram')
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="about-social-link"
                      >
                        Instagram
                      </a>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { AboutButton }
export default AboutButton
