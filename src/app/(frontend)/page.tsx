import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import PortfolioMain from './components/PortfolioMain'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Alle Projekte aus dem CMS abrufen
  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: '-creationDate', // Neueste Projekte zuerst basierend auf dem Datum
    depth: 2, // Um Media-Referenzen aufzulösen
  })

  // About-Daten für "Marvin Krullmann" abrufen
  const { docs: abouts } = await payload.find({
    collection: 'about',
    where: {
      name: {
        equals: 'Marvin Krullmann',
      },
    },
    depth: 1,
  })

  const aboutData = abouts.length > 0 ? abouts[0] : null

  return <PortfolioMain projects={projects} aboutData={aboutData} />
}
