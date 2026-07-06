import {defineType, defineField, defineArrayMember} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

export const howToPitchPage = defineType({
  name: 'howToPitchPage',
  title: 'How to Pitch a Stock Page',
  type: 'document',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'header', title: 'Page Header', default: true},
    {name: 'questions', title: 'Three Questions'},
    {name: 'additional', title: 'Additional Info'},
  ],
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
      group: 'header',
    }),
    defineField({
      name: 'processFootnote',
      title: 'Footnote Below the Process Steps',
      description: 'The 3 process steps themselves are edited in Site Settings → Pitch Process.',
      type: 'blockContent',
      group: 'header',
    }),

    defineField({
      name: 'questionsEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'questions',
    }),
    defineField({
      name: 'questionsHeading',
      title: 'Heading',
      type: 'string',
      group: 'questions',
    }),
    defineField({
      name: 'questionsLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
      group: 'questions',
    }),
    defineField({
      name: 'questions',
      title: 'Who / What / Why Blocks',
      type: 'array',
      group: 'questions',
      of: [defineArrayMember({type: 'infoBlock'})],
      validation: (rule) => rule.max(3),
    }),

    defineField({
      name: 'additionalInfo',
      title: 'Additional Info Blocks',
      description: 'Financial Metrics, Compare to a Rival, Risks, Research Resources.',
      type: 'array',
      group: 'additional',
      of: [defineArrayMember({type: 'infoBlock'})],
    }),
  ],
})
