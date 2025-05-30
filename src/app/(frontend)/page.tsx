import { getPayload } from 'payload'
import React from 'react'
import Image from 'next/image'

import config from '@/payload.config'
import ProjectSection from './components/ProjectSection'
import PortfolioHeader from './components/PortfolioHeader'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  // Alle Projekte aus dem CMS abrufen
  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: '-creationYear', // Neueste Projekte zuerst
    depth: 2, // Um Media-Referenzen aufzulösen
  })

  const totalProjects = projects.length

  return (
    <div className="portfolio-container">
      <PortfolioHeader />
      
      {totalProjects > 0 ? (
        <>
          {projects.map((project, index) => (
            <ProjectSection 
              key={project.id} 
              project={project} 
              index={index}
              totalProjects={totalProjects}
            />
          ))}
        </>
      ) : (
        <div className="no-projects">
          <p>Noch keine Projekte vorhanden.</p>
        </div>
      )}
    </div>
  )
}
