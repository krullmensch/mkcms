// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { MediaBulk } from './collections/MediaBulk'
import { About } from './collections/About'

// Funktion zur Validierung von YouTube URLs
function validateYouTubeURL(url: string): boolean {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&[\w=]*)*$/
  return youtubeRegex.test(url)
}

// Funktion zur Extraktion der YouTube Video ID
function extractYouTubeVideoId(url: string): string | null {
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const regex of regexes) {
    const match = url.match(regex)
    if (match) {
      return match[1]
    }
  }
  return null
}

// Funktion zum Abrufen der YouTube Video-Informationen
async function fetchYouTubeVideoInfo(videoId: string): Promise<any> {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    const response = await fetch(oEmbedUrl)

    if (!response.ok) {
      console.warn(`YouTube oEmbed API error: ${response.status}`)
      return null
    }

    const data = await response.json()

    // Aspect Ratio und Orientierung berechnen
    const width = data.width || 1920
    const height = data.height || 1080
    const aspectRatio = width / height

    let orientation: 'landscape' | 'portrait' | 'square'
    if (aspectRatio > 1.1) {
      orientation = 'landscape'
    } else if (aspectRatio < 0.9) {
      orientation = 'portrait'
    } else {
      orientation = 'square'
    }

    return {
      title: data.title || 'YouTube Video',
      thumbnailUrl: data.thumbnail_url,
      aspectRatio,
      orientation,
      width,
      height,
    }
  } catch (error) {
    console.error('Error fetching YouTube video info:', error)
    return null
  }
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Generate year options for dropdown
function generateYearOptions() {
  const currentYear = new Date().getFullYear()
  const startYear = 2000 // Startjahr
  const years = []

  for (let year = currentYear; year >= startYear; year--) {
    years.push({
      label: year.toString(),
      value: year.toString(),
    })
  }

  return years
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    MediaBulk,
    About,
    {
      slug: 'projects',
      admin: {
        useAsTitle: 'projectName',
        components: {
          // Hier könnten wir in Zukunft benutzerdefinierte Komponenten einbinden
        },
      },
      hooks: {
        beforeChange: [
          async ({ data }) => {
            // Wenn kein Bild hochgeladen wurde, stellen wir sicher, dass das Feld nicht undefined ist
            if (!data.projectImages || data.projectImages.length === 0) {
              data.projectImages = [
                {
                  // Wir erstellen einen leeren Eintrag, der im Frontend erkannt wird
                  image: null,
                  useDefaultImage: true,
                },
              ]
            }

            // Verarbeite YouTube URLs und extrahiere Video IDs und Metadaten
            if (data.projectImages) {
              const processedImages = []

              for (const item of data.projectImages) {
                if (item.mediaType === 'youtube' && item.youtubeUrl) {
                  const videoId = extractYouTubeVideoId(item.youtubeUrl)
                  if (videoId) {
                    item.youtubeVideoId = videoId
                    // Generiere Embed URL
                    item.youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`
                    // Generiere Standard-Thumbnail URL
                    item.youtubeThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

                    // Versuche Video-Informationen von YouTube API zu holen
                    try {
                      const videoInfo = await fetchYouTubeVideoInfo(videoId)
                      if (videoInfo) {
                        if (!item.youtubeTitle) {
                          item.youtubeTitle = videoInfo.title
                        }
                        item.youtubeAspectRatio = videoInfo.aspectRatio
                        item.youtubeOrientation = videoInfo.orientation
                        item.youtubeWidth = videoInfo.width
                        item.youtubeHeight = videoInfo.height
                        // Verwende das hochauflösende Thumbnail von der API falls verfügbar
                        if (videoInfo.thumbnailUrl) {
                          item.youtubeThumbnailUrl = videoInfo.thumbnailUrl
                        }
                      }
                    } catch (error) {
                      console.warn('Could not fetch YouTube video info:', error)
                      // Fallback-Werte setzen
                      item.youtubeAspectRatio = 16 / 9 // Standard 16:9
                      item.youtubeOrientation = 'landscape'
                      item.youtubeWidth = 1920
                      item.youtubeHeight = 1080
                    }
                  }
                }
                processedImages.push(item)
              }

              data.projectImages = processedImages
            }

            return data
          },
        ],
      },
      fields: [
        {
          name: 'projectName',
          type: 'text',
          required: true,
          unique: true,
        },
        {
          name: 'projectImages',
          type: 'array',
          label: 'Medien',
          minRows: 0,
          maxRows: 10,
          labels: {
            singular: 'Medium',
            plural: 'Medien',
          },
          fields: [
            {
              name: 'mediaType',
              type: 'select',
              label: 'Medientyp',
              required: true,
              defaultValue: 'image',
              options: [
                {
                  label: 'Foto',
                  value: 'image',
                },
                {
                  label: 'Video',
                  value: 'video',
                },
                {
                  label: 'YouTube Video',
                  value: 'youtube',
                },
              ],
              admin: {
                description:
                  'Wählen Sie aus, ob Sie ein Foto, Video oder YouTube-Video hinzufügen möchten.',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Laden Sie Ihr Foto hoch.',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'image'
                },
              },
              filterOptions: {
                mimeType: { contains: 'image' },
              },
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Laden Sie Ihr Video hoch.',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'video'
                },
              },
              filterOptions: {
                mimeType: { contains: 'video' },
              },
            },
            {
              name: 'videoThumbnail',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description:
                  'Laden Sie ein Thumbnail-Bild für Ihr Video hoch (empfohlen für bessere Darstellung in Suchergebnissen).',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'video'
                },
              },
              filterOptions: {
                mimeType: { contains: 'image' },
              },
            },
            {
              name: 'youtubeUrl',
              type: 'text',
              label: 'YouTube URL',
              required: false,
              admin: {
                description:
                  'Geben Sie die vollständige YouTube-URL ein (z.B. https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
              validate: (val: string | null | undefined, { siblingData }: any) => {
                if (siblingData?.mediaType === 'youtube') {
                  if (!val) {
                    return 'YouTube URL ist erforderlich wenn YouTube als Medientyp ausgewählt ist'
                  }
                  if (!validateYouTubeURL(val)) {
                    return 'Bitte geben Sie eine gültige YouTube URL ein'
                  }
                }
                return true
              },
            },
            {
              name: 'youtubeTitle',
              type: 'text',
              label: 'Video Titel',
              required: false,
              admin: {
                description: 'Optional: Titel für das YouTube Video (wird als Alt-Text verwendet)',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeVideoId',
              type: 'text',
              label: 'YouTube Video ID',
              admin: {
                readOnly: true,
                description: 'Automatisch extrahierte Video ID (nur lesbar)',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeEmbedUrl',
              type: 'text',
              label: 'YouTube Embed URL',
              admin: {
                readOnly: true,
                description: 'Automatisch generierte Embed URL (nur lesbar)',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeThumbnailUrl',
              type: 'text',
              label: 'YouTube Thumbnail URL',
              admin: {
                readOnly: true,
                description: 'Automatisch generierte Thumbnail URL (nur lesbar)',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeAspectRatio',
              type: 'number',
              label: 'Video Seitenverhältnis',
              admin: {
                readOnly: true,
                description: 'Automatisch berechnetes Seitenverhältnis (Breite/Höhe)',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeOrientation',
              type: 'select',
              label: 'Video Orientierung',
              options: [
                { label: 'Querformat', value: 'landscape' },
                { label: 'Hochformat', value: 'portrait' },
                { label: 'Quadratisch', value: 'square' },
              ],
              admin: {
                readOnly: true,
                description: 'Automatisch erkannte Video-Orientierung',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeWidth',
              type: 'number',
              label: 'Video Breite (px)',
              admin: {
                readOnly: true,
                description: 'Originalbreite des Videos in Pixel',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'youtubeHeight',
              type: 'number',
              label: 'Video Höhe (px)',
              admin: {
                readOnly: true,
                description: 'Originalhöhe des Videos in Pixel',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'youtube'
                },
              },
            },
            {
              name: 'useDefaultImage',
              type: 'checkbox',
              label: 'Standardbild verwenden',
              defaultValue: false,
              admin: {
                description:
                  'Aktivieren Sie diese Option, um ein Standardbild zu verwenden, bis Sie ein eigenes Bild hochladen.',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'image'
                },
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Ausführliche Beschreibung',
          required: true,
          admin: {
            description:
              'Ausführliche Beschreibung des Projekts (wird im Tooltip bei Shift+Hover angezeigt)',
          },
        },
        {
          name: 'shortDescription',
          type: 'textarea',
          label: 'Kurzbeschreibung',
          admin: {
            description: 'Eine kurze Zusammenfassung des Projekts (max. 200 Zeichen)',
          },
          maxLength: 200,
        },
        {
          name: 'tags',
          type: 'select',
          hasMany: true,
          label: 'Tags',
          options: [
            {
              label: 'Photo',
              value: 'photo',
            },
            {
              label: 'Video',
              value: 'video',
            },
            {
              label: 'YouTube',
              value: 'youtube',
            },
            {
              label: '3D',
              value: '3d',
            },
            {
              label: 'Interactive',
              value: 'interactive',
            },
            {
              label: 'Rendering',
              value: 'rendering',
            },
            {
              label: 'Live',
              value: 'live',
            },
            {
              label: 'Projection',
              value: 'projection',
            },
          ],
          admin: {
            description: 'Wählen Sie einen oder mehrere Tags zur Kategorisierung des Projekts',
            isClearable: true,
            isSortable: true,
          },
        },
        {
          name: 'creationYear',
          type: 'select',
          label: 'Erstellungsjahr',
          required: true,
          options: generateYearOptions(),
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Projektstatus',
          required: true,
          options: [
            {
              label: 'Laufend',
              value: 'ongoing',
            },
            {
              label: 'Abgeschlossen',
              value: 'finished',
            },
          ],
          defaultValue: 'finished',
          admin: {
            layout: 'horizontal',
          },
        },
        {
          name: 'contributors',
          type: 'array',
          label: 'Mitwirkende',
          minRows: 0,
          labels: {
            singular: 'Mitwirkender',
            plural: 'Mitwirkende',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'role',
              type: 'text',
              label: 'Rolle',
            },
          ],
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
