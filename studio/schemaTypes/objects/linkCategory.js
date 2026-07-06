import {defineType, defineField, defineArrayMember} from 'sanity'

export const linkCategory = defineType({
  name: 'linkCategory',
  title: 'Resource Category',
  type: 'object',
  fields: [
    defineField({
      name: 'categoryName',
      title: 'Category Name (e.g. "News")',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'linkItem'})],
    }),
  ],
  preview: {
    select: {title: 'categoryName'},
  },
})
