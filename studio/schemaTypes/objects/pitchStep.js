import {defineType, defineField} from 'sanity'

export const pitchStep = defineType({
  name: 'pitchStep',
  title: 'Process Step',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Step Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Step Description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
