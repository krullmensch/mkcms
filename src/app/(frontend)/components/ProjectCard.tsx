import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Standard Platzhalterbild - kann durch ein eigenes Bild ersetzt werden
const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/800x600?text=Projekt+Vorschau';

type ProjectCardProps = {
  project: {
    id: string;
    projectName: string;
    projectImages?: Array<{
      image?: {
        url: string;
        alt?: string;
      } | null;
      useDefaultImage?: boolean;
    }>;
    creationYear?: string;
    description?: any; // Rich Text Format
    tags?: ('photo' | 'video' | '3d' | 'interactive' | 'rendering' | 'live' | 'projection')[] | null;
  };
  showScrollArrow?: boolean; // Optional: Zeigt den Scroll-Pfeil an
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, showScrollArrow = false }) => {
  // Bestimme das anzuzeigende Bild
  const getImageToDisplay = () => {
    // Wenn keine Bilder vorhanden sind oder explizit das Standardbild verwendet werden soll
    if (!project.projectImages?.length || project.projectImages[0]?.useDefaultImage) {
      return {
        url: DEFAULT_IMAGE_URL,
        alt: `${project.projectName} - Standardbild`
      };
    }
    
    // Erstes verfügbares Bild verwenden
    const firstImage = project.projectImages[0]?.image;
    if (firstImage) {
      return {
        url: firstImage.url,
        alt: firstImage.alt || `${project.projectName}`
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
              {typeof project.description === 'string' 
                ? project.description.substring(0, 100) + '...' 
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
          background-color: #e0e0e0;
          color: #333;
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