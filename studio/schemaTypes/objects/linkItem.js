import {defineType, defineField} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const linkItem = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Link Text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'url'},
  },
})
