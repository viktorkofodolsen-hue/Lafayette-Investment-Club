import {defineType, defineField, defineArrayMember} from 'sanity'
import {EarthGlobeIcon} from '@sanity/icons'

export const esgCommitmentPage = defineType({
  name: 'esgCommitmentPage',
  title: 'ESG Commitment Page',
  type: 'document',
  icon: EarthGlobeIcon,
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
      name: 'pillars',
      title: 'ESG Pillars',
      description: 'Environmental, Social, and Corporate Governance blocks.',
      type: 'array',
      of: [defineArrayMember({type: 'infoBlock'})],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'closingBody',
      title: 'Closing Body Text',
      type: 'blockContent',
    }),
    defineField({
      name: 'signatureLine',
      title: 'Signature Line',
      type: 'text',
      rows: 2,
      initialValue: 'Sincerely,\nThe Members of The Lafayette College Investment Club',
    }),
  ],
})
