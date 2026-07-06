import {defineType, defineField, defineArrayMember} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'meetings', title: 'Meetings & Contact'},
    {name: 'process', title: 'Pitch Process'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      initialValue: 'Lafayette Investment Club',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'establishedLabel',
      title: 'Established Label (e.g. "Est. 1946")',
      type: 'string',
      group: 'general',
      initialValue: 'Est. 1946',
    }),
    defineField({
      name: 'logo',
      title: 'Logo / Crest',
      type: 'image',
      group: 'general',
      options: {hotspot: true},
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'general',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'general',
    }),
    defineField({
      name: 'groupMeUrl',
      title: 'GroupMe Join Link',
      type: 'url',
      group: 'general',
      description: 'Used by the "Join the GroupMe" button on Home and Get Involved.',
    }),

    defineField({
      name: 'weeklyMeetingLocation',
      title: 'Weekly Meeting Location',
      type: 'string',
      group: 'meetings',
    }),
    defineField({
      name: 'weeklyMeetingTime',
      title: 'Weekly Meeting Time',
      type: 'string',
      group: 'meetings',
    }),
    defineField({
      name: 'weeklyMeetingFoodNote',
      title: 'Food & Beverages Note',
      type: 'string',
      group: 'meetings',
    }),
    defineField({
      name: 'executiveBoardMeetingNote',
      title: 'Executive Board Meeting Note',
      description: 'Shown only on the Get Involved page, e.g. "Fridays, following the general meeting — Simon Conference Room".',
      type: 'string',
      group: 'meetings',
    }),
    defineField({
      name: 'coPresidents',
      title: 'Co-Presidents',
      description: 'Shown on Home, Get Involved, and Alumni as the club\'s contact people.',
      type: 'array',
      group: 'meetings',
      of: [defineArrayMember({type: 'coPresident'})],
    }),

    defineField({
      name: 'pitchProcessSteps',
      title: 'Pitch Process Steps',
      description: 'The 3-step "pitch to position" process, shown on both Home and How to Pitch a Stock.',
      type: 'array',
      group: 'process',
      of: [defineArrayMember({type: 'pitchStep'})],
    }),

    defineField({
      name: 'footerDisclaimer',
      title: 'Footer Disclaimer',
      type: 'text',
      group: 'footer',
      rows: 4,
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright Year',
      type: 'number',
      group: 'footer',
    }),
  ],
})
