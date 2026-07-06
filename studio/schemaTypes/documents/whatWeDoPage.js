import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const whatWeDoPage = defineType({
  name: 'whatWeDoPage',
  title: 'What We Do Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'blockContent',
    }),
  ],
})
