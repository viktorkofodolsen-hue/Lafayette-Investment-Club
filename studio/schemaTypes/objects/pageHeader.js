import {defineType, defineField} from 'sanity'

export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Page Header',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (small label above the heading)',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Page Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
    }),
  ],
})
