// Reusable object types
import {blockContent} from './objects/blockContent'
import {pageHeader} from './objects/pageHeader'
import {statFigure} from './objects/statFigure'
import {sectorWeight} from './objects/sectorWeight'
import {boardMember} from './objects/boardMember'
import {pitchStep} from './objects/pitchStep'
import {coPresident} from './objects/coPresident'
import {infoBlock} from './objects/infoBlock'
import {linkItem} from './objects/linkItem'
import {linkCategory} from './objects/linkCategory'
import {archiveEntry} from './objects/archiveEntry'
import {placementCompany} from './objects/placementCompany'

// Page / settings documents (all singletons — see ../structure/index.js)
import {siteSettings} from './documents/siteSettings'
import {homePage} from './documents/homePage'
import {whatWeDoPage} from './documents/whatWeDoPage'
import {clubStructurePage} from './documents/clubStructurePage'
import {esgCommitmentPage} from './documents/esgCommitmentPage'
import {executiveBoardPage} from './documents/executiveBoardPage'
import {ourPortfolioPage} from './documents/ourPortfolioPage'
import {getInvolvedPage} from './documents/getInvolvedPage'
import {howToPitchPage} from './documents/howToPitchPage'
import {alumniPage} from './documents/alumniPage'
import {photoGalleryPage} from './documents/photoGalleryPage'

export const schemaTypes = [
  // objects
  blockContent,
  pageHeader,
  statFigure,
  sectorWeight,
  boardMember,
  pitchStep,
  coPresident,
  infoBlock,
  linkItem,
  linkCategory,
  archiveEntry,
  placementCompany,
  // documents
  siteSettings,
  homePage,
  whatWeDoPage,
  clubStructurePage,
  esgCommitmentPage,
  executiveBoardPage,
  ourPortfolioPage,
  getInvolvedPage,
  howToPitchPage,
  alumniPage,
  photoGalleryPage,
]
