import { getPayload } from 'payload';
import React from 'react';

import ProjectCard from '../components/ProjectCard';
import config from '@/payload.config';

export const metadata = {
  title: 'Portfolio Projekte',
  description: 'Übersicht aller Projekte im Portfolio',
};

export default async function ProjectsPage() {
  // Payload-Konfiguration laden und Projekte abrufen
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  
  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 2, // Um Media-Referenzen aufzulösen
  });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Meine Projekte</h1>
        <p>Eine Übersicht meiner Arbeiten</p>
      </div>
      
      <div className="projects-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>Noch keine Projekte vorhanden.</p>
        )}
      </div>
      
      <style jsx global>{`
        .projects-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .projects-header {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .project-card {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          background: white;
        }
        
        .project-card:hover {
          transform: translateY(-5px);
        }
        
        .project-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .project-info {
          padding: 1.5rem;
        }
        
        .project-info h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .project-year {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }
        
        .view-project-btn {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }
        
        .view-project-btn:hover {
          background-color: #0051a8;
        }
      `}</style>
    </div>
  );
}