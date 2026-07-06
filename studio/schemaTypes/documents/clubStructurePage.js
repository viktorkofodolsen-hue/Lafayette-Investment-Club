import {defineType, defineField, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const clubStructurePage = defineType({
  name: 'clubStructurePage',
  title: 'Club Structure Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
    }),
    defineField({
      name: 'introBody',
      title: 'Intro Body Text',
      type: 'blockContent',
    }),
    defineField({
      name: 'generalMembersDescription',
      title: 'General Club Members — Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'officerPositions',
      title: 'Executive Board — Officer Positions',
      description: 'The list of officer titles, e.g. "Co-Presidents", "Treasurer".',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
})
