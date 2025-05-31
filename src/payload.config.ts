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
import { About } from './collections/About'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Generate year options for dropdown
function generateYearOptions() {
  const currentYear = new Date().getFullYear();
  const startYear = 2000; // Startjahr
  const years = [];
  
  for (let year = currentYear; year >= startYear; year--) {
    years.push({
      label: year.toString(),
      value: year.toString(),
    });
  }
  
  return years;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, About,
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
          ({ data }) => {
            // Wenn kein Bild hochgeladen wurde, stellen wir sicher, dass das Feld nicht undefined ist
            if (!data.projectImages || data.projectImages.length === 0) {
              data.projectImages = [
                {
                  // Wir erstellen einen leeren Eintrag, der im Frontend erkannt wird
                  image: null,
                  useDefaultImage: true
                }
              ];
            }
            return data;
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
                }
              ],
              admin: {
                description: 'Wählen Sie aus, ob Sie ein Foto oder Video hochladen möchten.'
              }
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Laden Sie Ihr Foto hoch.',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'image';
                }
              },
              filterOptions: {
                mimeType: { contains: 'image' }
              }
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Laden Sie Ihr Video hoch.',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'video';
                }
              },
              filterOptions: {
                mimeType: { contains: 'video' }
              }
            },
            {
              name: 'videoThumbnail',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Laden Sie ein Thumbnail-Bild für Ihr Video hoch (empfohlen für bessere Darstellung in Suchergebnissen).',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'video';
                }
              },
              filterOptions: {
                mimeType: { contains: 'image' }
              }
            },
            {
              name: 'useDefaultImage',
              type: 'checkbox',
              label: 'Standardbild verwenden',
              defaultValue: false,
              admin: {
                description: 'Aktivieren Sie diese Option, um ein Standardbild zu verwenden, bis Sie ein eigenes Bild hochladen.',
                condition: (data, siblingData) => {
                  return siblingData?.mediaType === 'image';
                }
              }
            }
          ]
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Ausführliche Beschreibung',
          required: true,
          admin: {
            description: 'Ausführliche Beschreibung des Projekts (wird im Tooltip bei Shift+Hover angezeigt)',
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
            }
          ],
          admin: {
            description: 'Wählen Sie einen oder mehrere Tags zur Kategorisierung des Projekts',
            isClearable: true,
            isSortable: true,
          }
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
            }
          ],
          defaultValue: 'finished',
          admin: {
            layout: 'horizontal',
          }
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
            }
          ]
        }
      ]
    }
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
