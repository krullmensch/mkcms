import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'filename',
    description: 'Medien-Bibliothek für Bilder und Videos',
    group: 'Medien',
    // Aktiviere Bulk-Upload
    enableRichTextLink: false,
    components: {
      // Hier könnten wir später eine benutzerdefinierte Upload-Komponente hinzufügen
    }
  },
  upload: {
    // Aktiviere Multi-File-Upload
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
    // Maximale Dateigröße (50MB)
    resizeOptions: {
      width: 1920,
      height: 1080,
      position: 'centre',
      fit: 'inside',
      withoutEnlargement: true,
    },
    // Thumbnail-Generierung
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        fit: 'cover',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
        fit: 'cover',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional: Alt-Text für Barrierefreiheit. Wenn leer, wird automatisch der Dateiname verwendet.',
        placeholder: 'Wird automatisch aus dem Dateinamen generiert...'
      }
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      label: 'Video-Thumbnail',
      admin: {
        description: 'Optional: Thumbnail-Bild für Videos. Wird automatisch in der Suche und Vorschau angezeigt.',
        condition: (data, siblingData) => {
          // Zeige das Feld nur an, wenn es sich um ein Video handelt
          if (data?.mimeType) {
            return data.mimeType.startsWith('video/')
          }
          return false
        }
      }
    },
  ],
}
