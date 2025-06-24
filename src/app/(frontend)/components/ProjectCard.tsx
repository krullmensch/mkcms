import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Project } from '@/payload-types';

// Standard Platzhalterbild - kann durch ein eigenes Bild ersetzt werden
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/800x600?text=Projekt+Vorschau';

// Hilfsfunktion: Extrahiert Dateinamen aus URL für Alt-Text
const getFileNameFromUrl = (url: string): string => {
  try {
    const fileName = url.split('/').pop()?.split('?')[0] || 'Datei'
    // Entferne Dateiendung und ersetze Unterstriche/Bindestriche durch Leerzeichen
    return fileName
      .replace(/\.[^/.]+$/, '') // Entferne Dateiendung
      .replace(/[_-]/g, ' ') // Ersetze _ und - durch Leerzeichen
      .replace(/\b\w/g, l => l.toUpperCase()) // Kapitalisiere jeden Wortanfang
  } catch {
    return 'Datei'
  }
}

// Hilfsfunktion: Generiert Alt-Text basierend auf vorhandenem Text oder Dateinamen
const generateAltText = (existingAlt: string | undefined, url: string, projectName: string, mediaType: string = 'Bild'): string => {
  if (existingAlt && existingAlt.trim()) {
    return existingAlt
  }
  
  const fileName = getFileNameFromUrl(url)
  return `${projectName} - ${fileName}`
}

type ProjectCardProps = {
  project: Project;
  showScrollArrow?: boolean; // Optional: Zeigt den Scroll-Pfeil an
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, showScrollArrow = false }) => {  // Bestimme das anzuzeigende Bild (mit Video-Thumbnail-Unterstützung)
  const getImageToDisplay = () => {
    // Wenn keine Bilder vorhanden sind oder explizit das Standardbild verwendet werden soll
    if (!project.projectImages?.length || project.projectImages[0]?.useDefaultImage) {
      return {
        url: DEFAULT_IMAGE_URL,
        alt: `${project.projectName} - Standardbild`
      };
    }

    // Suche nach einem Media-Item (entweder Bild oder Video)
    const mediaItem = project.projectImages.find(item => 
      (item.image && typeof item.image === 'object' && item.image !== null && 'url' in item.image) ||
      (item.video && typeof item.video === 'object' && item.video !== null && 'url' in item.video)
    )
    
    if (!mediaItem) {
      return {
        url: DEFAULT_IMAGE_URL,
        alt: `${project.projectName} - Standardbild`
      };
    }

    // Wenn es ein Video ist, prüfe auf videoThumbnail
    if (mediaItem.mediaType === 'video' && mediaItem.videoThumbnail) {
      if (typeof mediaItem.videoThumbnail === 'object' && mediaItem.videoThumbnail !== null && 'url' in mediaItem.videoThumbnail) {
        return {
          url: mediaItem.videoThumbnail.url || DEFAULT_IMAGE_URL,
          alt: `${project.projectName} - Video Thumbnail`
        };
      }
      if (typeof mediaItem.videoThumbnail === 'string') {
        return {
          url: mediaItem.videoThumbnail,
          alt: generateAltText(undefined, mediaItem.videoThumbnail, project.projectName, 'Video Thumbnail')
        };
      }
    }

    // Wenn es ein Video ist aber kein videoThumbnail vorhanden ist, verwende Placeholder
    if (mediaItem.mediaType === 'video') {
      return {
        url: DEFAULT_IMAGE_URL,
        alt: `${project.projectName} - Video (kein Thumbnail)`
      };
    }
    
    // Für Bilder
    if (mediaItem.image && typeof mediaItem.image === 'object' && 'url' in mediaItem.image) {
      const firstImage = mediaItem.image;
      
      // Prüfe, ob es sich um ein Video handelt und ein Thumbnail verfügbar ist (Legacy-Support)
      if (firstImage.mimeType?.startsWith('video/') && firstImage.thumbnail) {
        // Wenn thumbnail ein Objekt ist (Media-Referenz)
        if (typeof firstImage.thumbnail === 'object' && firstImage.thumbnail !== null && 'url' in firstImage.thumbnail) {
          const thumbnailUrl = firstImage.thumbnail.url || DEFAULT_IMAGE_URL;
          return {
            url: thumbnailUrl,
            alt: generateAltText(firstImage.alt, thumbnailUrl, project.projectName, 'Video Thumbnail')
          };
        }
        // Wenn thumbnail ein String ist (direkte URL)
        if (typeof firstImage.thumbnail === 'string') {
          return {
            url: firstImage.thumbnail,
            alt: generateAltText(firstImage.alt, firstImage.thumbnail, project.projectName, 'Video Thumbnail')
          };
        }
      }
      
      // Fallback auf das eigentliche Media-File (für Bilder oder Videos ohne Thumbnail)
      const imageUrl = firstImage.url || DEFAULT_IMAGE_URL;
      return {
        url: imageUrl,
        alt: generateAltText(firstImage.alt, imageUrl, project.projectName)
      };
    }
    
    // Fallback auf Standardbild
    return {
      url: DEFAULT_IMAGE_URL,
      alt: `${project.projectName} - Standardbild`
    };
  };
  
  const imageToShow = getImageToDisplay();
  
  return (
    <div className="project-card">
      <div className="project-image">
        <Image 
          src={imageToShow.url}
          alt={imageToShow.alt}
          width={400}
          height={300}
          objectFit="cover"
        />
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.projectName}</h3>
        
        {/* Tags unter dem Titel in kleinen abgerundeten grauen Kästchen */}
        {project.tags && project.tags.length > 0 && (
          <div className="project-tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="project-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {project.creationYear && <p className="project-year">{project.creationYear}</p>}
        {project.description && (
          <div className="project-description">
            {/* Hier könnte eine Kurzfassung der Beschreibung angezeigt werden */}
            <p>
              {typeof project.description === 'object' && project.description.root 
                ? 'Beschreibung verfügbar'
                : 'Beschreibung verfügbar'}
            </p>
          </div>
        )}
        <Link href={`/projects/${project.id}`} className="view-project-btn">
          Projekt ansehen
        </Link>
      </div>
      
      {showScrollArrow && (
        <div className="scroll-arrow-container">
          <div className="scroll-arrow" aria-hidden="true" title="Nach unten scrollen">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .project-title {
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }
        
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        
        .project-tag {
          background-color: var(--tooltip-tag-bg);
          color: var(--text-color);
          padding: 0.2rem 0.5rem;
          border-radius: 15px;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;