import {defineType, defineField} from 'sanity'

export const placementCompany = defineType({
  name: 'placementCompany',
  title: 'Placement',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'One-line Description',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'description'},
  },
})
