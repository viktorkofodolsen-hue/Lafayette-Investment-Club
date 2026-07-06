import {defineType, defineField, defineArrayMember} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const alumniPage = defineType({
  name: 'alumniPage',
  title: 'Alumni Page',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'header', title: 'Page Header', default: true},
    {name: 'placements', title: 'Placements'},
  ],
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
      group: 'header',
    }),
    defineField({
      name: 'thanksIntroBody',
      title: 'Thank-You Intro Body Text',
      type: 'blockContent',
      group: 'header',
      description: 'Co-president contacts are edited in Site Settings.',
    }),
    defineField({
      name: 'thanksLine',
      title: 'Thank-You Line',
      type: 'string',
      group: 'header',
      initialValue: 'And from all of us, thank you!',
    }),
    defineField({
      name: 'networkingBody',
      title: 'Networking Body Text',
      type: 'blockContent',
      group: 'header',
    }),

    defineField({
      name: 'placementsEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'placements',
    }),
    defineField({
      name: 'placementsHeading',
      title: 'Heading',
      type: 'string',
      group: 'placements',
    }),
    defineField({
      name: 'placementsLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
      group: 'placements',
    }),
    defineField({
      name: 'placements',
      title: 'Alumni Placements',
      type: 'array',
      group: 'placements',
      of: [defineArrayMember({type: 'placementCompany'})],
    }),
  ],
})
