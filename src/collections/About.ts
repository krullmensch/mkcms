import type { CollectionConfig } from 'payload'

export const About: CollectionConfig = {
  slug: 'about',
  admin: {
    useAsTitle: 'name',
    description: 'Informationen für die About-Seite',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Profilbild',
    },
    {
      name: 'biography',
      type: 'textarea',
      required: true,
      label: 'Biographie',
      admin: {
        description: 'Ihre Biographie als einfacher Text',
        rows: 8,
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-Mail',
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
      label: 'Telefonnummer',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      minRows: 0,
      maxRows: 5,
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'GitHub', value: 'github' },
            { label: 'Andere', value: 'other' }
          ],
        },
        {
          name: 'customPlatform',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.platform === 'other',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ]
    },
  ],
  versions: {
    drafts: true,
  },
}