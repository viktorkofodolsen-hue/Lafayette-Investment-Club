import {defineType, defineField, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const executiveBoardPage = defineType({
  name: 'executiveBoardPage',
  title: 'Executive Board Page',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
    }),
    defineField({
      name: 'members',
      title: 'Board Members',
      description: 'Drag to reorder. This list is replaced each election cycle.',
      type: 'array',
      of: [defineArrayMember({type: 'boardMember'})],
    }),
    defineField({
      name: 'closingNote',
      title: 'Closing Note',
      description: 'Shown below the board grid, e.g. pointing members to the pitch process page.',
      type: 'blockContent',
    }),
  ],
})
