import {defineType, defineField, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const getInvolvedPage = defineType({
  name: 'getInvolvedPage',
  title: 'Get Involved Page',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'header', title: 'Page Header', default: true},
    {name: 'ways', title: 'Ways to Get Involved'},
    {name: 'resources', title: 'Resources'},
  ],
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
      group: 'header',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body Text',
      type: 'blockContent',
      group: 'header',
      description: 'Meeting logistics and co-president contacts are edited in Site Settings.',
    }),

    defineField({
      name: 'waysEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'ways',
    }),
    defineField({
      name: 'waysHeading',
      title: 'Heading',
      type: 'string',
      group: 'ways',
    }),
    defineField({
      name: 'ways',
      title: 'Ways to Get Involved',
      type: 'array',
      group: 'ways',
      of: [defineArrayMember({type: 'infoBlock'})],
    }),

    defineField({
      name: 'resourcesEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'resources',
    }),
    defineField({
      name: 'resourcesHeading',
      title: 'Heading',
      type: 'string',
      group: 'resources',
    }),
    defineField({
      name: 'resourceCategories',
      title: 'Resource Categories',
      type: 'array',
      group: 'resources',
      of: [defineArrayMember({type: 'linkCategory'})],
    }),
  ],
})
