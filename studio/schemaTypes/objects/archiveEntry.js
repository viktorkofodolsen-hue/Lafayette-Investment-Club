import {defineType, defineField} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const archiveEntry = defineType({
  name: 'archiveEntry',
  title: 'Archive Entry',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label (e.g. "January 2024")',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File (PDF, XLSX, or CSV)',
      type: 'file',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label'},
  },
})
