import {defineType, defineField} from 'sanity'

export const statFigure = defineType({
  name: 'statFigure',
  title: 'Club Fact',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label (e.g. "Assets Under Management")',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Number',
      description: 'The number to count up to, e.g. 1.6 for "$1.6M+"',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'decimals',
      title: 'Decimal Places',
      description: 'How many digits after the decimal point to show, e.g. 1 for "1.6"',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'prefix',
      title: 'Prefix (e.g. "$")',
      type: 'string',
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix (e.g. "M+" or "+")',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
