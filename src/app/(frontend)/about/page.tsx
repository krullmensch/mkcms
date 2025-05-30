import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import PortfolioHeader from '../components/PortfolioHeader'

// Type definition for social links
interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'github' | 'other'
  customPlatform?: string | null
  url: string
  id?: string | null
}

// Metadaten für die Seite
export const metadata: Metadata = {
  title: 'Über mich',
  description: 'Mehr über mich und meine Arbeit',
}

// Email und Telefon Icons
const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor" />
  </svg>
)

// Social Media Icons
const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'instagram':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="currentColor"/>
        </svg>
      )
    case 'linkedin':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="currentColor"/>
        </svg>
      )
    case 'twitter':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" fill="currentColor"/>
        </svg>
      )
    case 'facebook':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" fill="currentColor"/>
        </svg>
      )
    case 'github':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.24.73-.53v-1.85c-3.03.66-3.67-1.45-3.67-1.45-.55-1.42-1.35-1.79-1.35-1.79-1.11-.76.08-.74.08-.74 1.23.09 1.88 1.26 1.88 1.26 1.09 1.87 2.86 1.33 3.56 1.02.11-.8.43-1.34.78-1.65-2.73-.31-5.6-1.36-5.6-6.06 0-1.34.48-2.43 1.26-3.29-.12-.31-.54-1.56.12-3.26 0 0 1.04-.33 3.4 1.27a11.98 11.98 0 016 0c2.36-1.6 3.4-1.27 3.4-1.27.66 1.7.24 2.95.12 3.26.78.86 1.26 1.95 1.26 3.29 0 4.7-2.87 5.75-5.61 6.06.44.38.83 1.12.83 2.26v3.35c0 .29.18.62.74.52A11 11 0 0012 1.27" fill="currentColor"/>
        </svg>
      )
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </svg>
      )
  }
}

export default async function AboutPage() {
  try {
    // Debug: API-Anfrage für About-Seite
    console.log('Fetching about data...');
    
    // Payload korrekt initialisieren wie auf der Hauptseite
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    
    // Zugriff über die korrekt initialisierte Payload-Instanz
    const aboutResponse = await payload.find({
      collection: 'about',
      limit: 1,
    });
    
    console.log('Payload find response:', JSON.stringify(aboutResponse, null, 2));
    
    // Wenn keine Daten gefunden wurden, zeige 404
    if (!aboutResponse || aboutResponse.docs.length === 0) {
      console.log('No about data found, showing 404');
      return notFound();
    }

    const aboutData = aboutResponse.docs[0];
    
    return (
      <div className="about-page">
        <PortfolioHeader />
        
        <div className="about-content">
          <div className="about-grid">
            {/* Linke Spalte - Profilbild und Kontakt */}
            <div className="profile-section">
              {/* Profilbild */}
              <div className="profile-image-container">
                {aboutData.profileImage && typeof aboutData.profileImage !== 'string' ? (
                  <Image
                    src={aboutData.profileImage.url || `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${aboutData.profileImage.filename}`}
                    alt={aboutData.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 256px, 320px"
                    priority
                    className="profile-image"
                  />
                ) : (
                  <div className="profile-placeholder">
                    <span>Kein Bild verfügbar</span>
                  </div>
                )}
              </div>

              {/* Kontakt-Informationen */}
              <div className="contact-section">
                <h2>Kontakt</h2>
                
                <div className="contact-links">
                  {aboutData.email && (
                    <a href={`mailto:${aboutData.email}`} className="contact-link">
                      <EmailIcon />
                      <span>{aboutData.email}</span>
                    </a>
                  )}
                  
                  {aboutData.phone && (
                    <a href={`tel:${aboutData.phone}`} className="contact-link">
                      <PhoneIcon />
                      <span>{aboutData.phone}</span>
                    </a>
                  )}
                </div>
                
                {/* Social Media Links */}
                {aboutData.socialLinks && aboutData.socialLinks.length > 0 && (
                  <div className="social-section">
                    <h3>Social Media</h3>
                    <div className="social-links">
                      {aboutData.socialLinks.map((social: SocialLink, index: number) => (
                        <a 
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          title={social.platform === 'other' ? (social.customPlatform || social.platform) : social.platform}
                        >
                          <SocialIcon platform={social.platform} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Rechte Spalte - Biografie */}
            <div className="biography-section">
              <div className="biography-content">
                {aboutData.biography && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {aboutData.biography}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading about page data:', error)
    return notFound()
  }
}