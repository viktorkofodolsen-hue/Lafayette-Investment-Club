import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Every schema type in this Studio is a singleton (see ./structure).
const SINGLETON_TYPES = new Set([
  'siteSettings',
  'homePage',
  'whatWeDoPage',
  'clubStructurePage',
  'esgCommitmentPage',
  'executiveBoardPage',
  'ourPortfolioPage',
  'getInvolvedPage',
  'howToPitchPage',
  'alumniPage',
  'photoGalleryPage',
])

export default defineConfig({
  name: 'default',
  title: 'Lafayette Investment Club',

  projectId: '3quwa2do',
  dataset: 'lafayette-ic',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Singletons shouldn't show up in the global "Create new document" menu.
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
      }
      return prev
    },
    // Singletons can't be duplicated or deleted — there should only ever be one.
    actions: (prev, {schemaType}) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return prev.filter(({action}) => !['unpublish', 'delete', 'duplicate'].includes(action))
      }
      return prev
    },
  },
})
