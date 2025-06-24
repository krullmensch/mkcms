import type { CollectionConfig } from 'payload'

export const MediaBulk: CollectionConfig = {
  slug: 'media-bulk',
  admin: {
    useAsTitle: 'name',
    description: 'Mehrere Medien gleichzeitig hochladen',
    group: 'Medien',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Name für diesen Batch-Upload (z.B. "Projekt XY Bilder")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional: Beschreibung für diesen Upload-Batch',
      },
    },
    {
      name: 'files',
      type: 'array',
      label: 'Dateien',
      minRows: 1,
      admin: {
        description: 'Fügen Sie mehrere Bilder oder Videos hinzu',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Datei auswählen',
          },
        },
        {
          name: 'customAlt',
          type: 'text',
          admin: {
            description:
              'Optional: Spezifischer Alt-Text für diese Datei (überschreibt automatische Generierung)',
          },
        },
        {
          name: 'tags',
          type: 'text',
          admin: {
            description: 'Optional: Tags für bessere Organisation (komma-getrennt)',
          },
        },
      ],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        description: 'Optional: Verknüpfe diese Medien mit einem Projekt',
      },
    },
    {
      name: 'autoAddToProject',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatisch alle Dateien zum ausgewählten Projekt hinzufügen',
        condition: (data) => !!data.project,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Hook um automatisch Dateien zu Projekten hinzuzufügen
        if (doc.autoAddToProject && doc.project && doc.files) {
          try {
            const projectId = typeof doc.project === 'object' ? doc.project.id : doc.project

            // Hole das aktuelle Projekt
            const project = await req.payload.findByID({
              collection: 'projects',
              id: projectId,
            })

            if (project) {
              // Erstelle neue Media-Items für das Projekt
              const newMediaItems = doc.files.map((fileItem: any) => ({
                mediaType: 'image', // Default, könnte intelligenter sein
                image: fileItem.file,
              }))

              // Füge die neuen Items zu den bestehenden hinzu
              const updatedProjectImages = [...(project.projectImages || []), ...newMediaItems]

              // Update das Projekt
              await req.payload.update({
                collection: 'projects',
                id: projectId,
                data: {
                  projectImages: updatedProjectImages,
                },
              })
            }
          } catch (error) {
            console.error('Fehler beim automatischen Hinzufügen der Medien zum Projekt:', error)
          }
        }
      },
    ],
  },
}
