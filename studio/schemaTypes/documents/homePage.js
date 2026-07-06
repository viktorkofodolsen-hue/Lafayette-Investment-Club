import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'about', title: 'About'},
    {name: 'stats', title: 'Club Facts'},
    {name: 'performance', title: 'Performance'},
    {name: 'sectors', title: 'Sector Allocation'},
    {name: 'members', title: 'Members Section'},
    {name: 'contact', title: 'Contact Section'},
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: "Lafayette College · Founded 1946",
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Headline',
      type: 'text',
      rows: 2,
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Primary Button Text',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroPrimaryCtaLink',
      title: 'Primary Button Link',
      type: 'string',
      description: 'A page URL or an in-page anchor like "#about".',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Secondary Button Text',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSecondaryCtaLink',
      title: 'Secondary Button Link',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video (MP4)',
      type: 'file',
      group: 'hero',
      options: {accept: 'video/mp4'},
    }),
    defineField({
      name: 'heroPosterImage',
      title: 'Hero Poster / Fallback Image',
      description: 'Shown while the video loads, and as a fallback if video fails.',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
    }),

    // About
    defineField({
      name: 'aboutBody',
      title: 'About the Club — Body Text',
      type: 'blockContent',
      group: 'about',
    }),

    // Stats
    defineField({
      name: 'stats',
      title: 'Club Facts (stat counters)',
      type: 'array',
      group: 'stats',
      of: [defineArrayMember({type: 'statFigure'})],
      validation: (rule) => rule.max(6),
    }),

    // Performance
    defineField({
      name: 'performanceEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'performance',
    }),
    defineField({
      name: 'performanceHeading',
      title: 'Heading',
      type: 'string',
      group: 'performance',
    }),
    defineField({
      name: 'performanceLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 3,
      group: 'performance',
    }),
    defineField({
      name: 'inceptionDate',
      title: 'Inception Date',
      type: 'date',
      group: 'performance',
    }),
    defineField({
      name: 'returnSinceInception',
      title: 'Return Since Inception (e.g. "More than +30%")',
      type: 'string',
      group: 'performance',
    }),
    defineField({
      name: 'benchmarksTracked',
      title: 'Benchmarks Tracked (e.g. "S&P 500 · Nasdaq · Dow Jones Industrial Average · Russell 2000")',
      type: 'string',
      group: 'performance',
    }),
    defineField({
      name: 'performanceChartImage',
      title: 'Performance Chart Image',
      type: 'image',
      group: 'performance',
      options: {hotspot: true},
    }),
    defineField({
      name: 'performanceChartCaption',
      title: 'Chart Caption',
      type: 'string',
      group: 'performance',
    }),

    // Sector Allocation (current)
    defineField({
      name: 'sectorsEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'sectors',
    }),
    defineField({
      name: 'sectorsHeading',
      title: 'Heading',
      type: 'string',
      group: 'sectors',
    }),
    defineField({
      name: 'sectorsLede',
      title: 'Intro Sentence',
      type: 'text',
      rows: 2,
      group: 'sectors',
    }),
    defineField({
      name: 'sectorsChartImage',
      title: 'Sector Allocation Chart Image',
      type: 'image',
      group: 'sectors',
      options: {hotspot: true},
    }),
    defineField({
      name: 'sectorsChartCaption',
      title: 'Chart Caption',
      type: 'string',
      group: 'sectors',
    }),
    defineField({
      name: 'sectors',
      title: 'Sector Weights (current holdings)',
      type: 'array',
      group: 'sectors',
      of: [defineArrayMember({type: 'sectorWeight'})],
    }),
    defineField({
      name: 'sectorsFootnote',
      title: 'Footnote',
      type: 'string',
      group: 'sectors',
    }),

    // Members / process section
    defineField({
      name: 'membersEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'members',
      initialValue: 'Members',
    }),
    defineField({
      name: 'membersHeading',
      title: 'Heading',
      type: 'string',
      group: 'members',
      initialValue: 'From pitch to position.',
      description: 'The 3 process steps themselves are edited in Site Settings → Pitch Process, since they\'re shared with the How to Pitch a Stock page.',
    }),

    // Contact section
    defineField({
      name: 'contactEyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'contact',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'contactHeading',
      title: 'Heading',
      type: 'string',
      group: 'contact',
      initialValue: 'Get in touch.',
      description: 'Meeting logistics and co-president contacts are edited in Site Settings.',
    }),
  ],
})
