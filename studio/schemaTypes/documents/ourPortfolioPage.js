import {defineType, defineField, defineArrayMember} from 'sanity'
import {TrendUpwardIcon} from '@sanity/icons'

export const ourPortfolioPage = defineType({
  name: 'ourPortfolioPage',
  title: 'Our Portfolio Page',
  type: 'document',
  icon: TrendUpwardIcon,
  groups: [
    {name: 'header', title: 'Page Header', default: true},
    {name: 'target', title: 'Target Allocation'},
    {name: 'live', title: 'Live Portfolio'},
    {name: 'performers', title: 'Top Performers'},
    {name: 'archive', title: 'Archive'},
  ],
  fields: [
    defineField({
      name: 'pageHeader',
      title: 'Page Header',
      type: 'pageHeader',
      group: 'header',
    }),

    defineField({
      name: 'targetEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'target',
    }),
    defineField({
      name: 'targetHeading',
      title: 'Heading',
      type: 'string',
      group: 'target',
    }),
    defineField({
      name: 'targetLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
      group: 'target',
    }),
    defineField({
      name: 'targetChartImage',
      title: 'Target Allocation Chart Image',
      type: 'image',
      group: 'target',
      options: {hotspot: true},
    }),
    defineField({
      name: 'targetSectors',
      title: 'Target Sector Weights',
      type: 'array',
      group: 'target',
      of: [defineArrayMember({type: 'sectorWeight'})],
    }),

    defineField({
      name: 'liveEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'live',
    }),
    defineField({
      name: 'liveHeading',
      title: 'Heading',
      type: 'string',
      group: 'live',
    }),
    defineField({
      name: 'liveLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
      group: 'live',
    }),
    defineField({
      name: 'liveLinkLabel',
      title: 'Button Text',
      type: 'string',
      group: 'live',
      initialValue: 'View the Live Portfolio',
    }),
    defineField({
      name: 'liveLinkUrl',
      title: 'Live Spreadsheet URL',
      type: 'url',
      group: 'live',
    }),

    defineField({
      name: 'performersEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'performers',
    }),
    defineField({
      name: 'performersHeading',
      title: 'Heading',
      type: 'string',
      group: 'performers',
    }),
    defineField({
      name: 'topPerformers',
      title: 'Top Performing Companies',
      type: 'array',
      group: 'performers',
      of: [defineArrayMember({type: 'string'})],
    }),

    defineField({
      name: 'archiveEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'archive',
    }),
    defineField({
      name: 'archiveHeading',
      title: 'Heading',
      type: 'string',
      group: 'archive',
    }),
    defineField({
      name: 'archiveLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
      group: 'archive',
    }),
    defineField({
      name: 'archiveEntries',
      title: 'Archived Portfolio Snapshots',
      description: 'Add a new entry each time a new snapshot is published. Newest first.',
      type: 'array',
      group: 'archive',
      of: [defineArrayMember({type: 'archiveEntry'})],
    }),
  ],
})
