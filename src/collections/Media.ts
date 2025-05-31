import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
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
  upload: true,
}
