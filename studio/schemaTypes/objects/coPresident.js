import {defineType, defineField} from 'sanity'

export const coPresident = defineType({
  name: 'coPresident',
  title: 'Co-President Contact',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'classYear',
      title: 'Class Year (optional, e.g. \'26)',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'email'},
  },
})
