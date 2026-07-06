import {defineType, defineField} from 'sanity'

export const sectorWeight = defineType({
  name: 'sectorWeight',
  title: 'Sector Weight',
  type: 'object',
  fields: [
    defineField({
      name: 'sector',
      title: 'Sector Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'percentage',
      title: 'Weight (%)',
      type: 'number',
      validation: (rule) => rule.required().min(0).max(100),
    }),
  ],
  preview: {
    select: {title: 'sector', subtitle: 'percentage'},
    prepare({title, subtitle}) {
      return {title, subtitle: subtitle ? `${subtitle}%` : undefined}
    },
  },
})
