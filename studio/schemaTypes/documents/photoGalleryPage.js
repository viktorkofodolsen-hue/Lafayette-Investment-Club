import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const photoGalleryPage = defineType({
  name: 'photoGalleryPage',
  title: 'Photo Gallery Page',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
    }),
    defineField({
      name: 'placeholderMessage',
      title: 'Placeholder Message',
      description: 'Shown until real photos are ready to go live.',
      type: 'text',
      rows: 2,
      initialValue: "We're working on gathering photos and will be updating this page as soon as possible.",
    }),
  ],
})
