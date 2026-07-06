import {defineType, defineField} from 'sanity'

export const infoBlock = defineType({
  name: 'infoBlock',
  title: 'Info Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
