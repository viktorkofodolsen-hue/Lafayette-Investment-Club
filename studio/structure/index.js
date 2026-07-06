import {
  CogIcon,
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  EarthGlobeIcon,
  TrendUpwardIcon,
  BulbOutlineIcon,
  UserIcon,
  ImageIcon,
} from '@sanity/icons'

// Every content type in this Studio is a singleton (one document per page /
// one settings document). Each gets a fixed document ID so there's only ever
// one instance, and editors land straight on the form instead of a list.
function singleton(S, {id, type, title, icon}) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(id).title(title))
}

export const structure = (S) =>
  S.list()
    .title('Website Content')
    .items([
      singleton(S, {id: 'siteSettings', type: 'siteSettings', title: 'Site Settings', icon: CogIcon}),
      S.divider(),
      singleton(S, {id: 'homePage', type: 'homePage', title: 'Home Page', icon: HomeIcon}),
      singleton(S, {id: 'whatWeDoPage', type: 'whatWeDoPage', title: 'What We Do', icon: DocumentTextIcon}),
      singleton(S, {id: 'clubStructurePage', type: 'clubStructurePage', title: 'Club Structure', icon: UsersIcon}),
      singleton(S, {id: 'esgCommitmentPage', type: 'esgCommitmentPage', title: 'ESG Commitment', icon: EarthGlobeIcon}),
      singleton(S, {id: 'executiveBoardPage', type: 'executiveBoardPage', title: 'Executive Board', icon: UsersIcon}),
      singleton(S, {id: 'ourPortfolioPage', type: 'ourPortfolioPage', title: 'Our Portfolio', icon: TrendUpwardIcon}),
      singleton(S, {id: 'getInvolvedPage', type: 'getInvolvedPage', title: 'Get Involved', icon: UsersIcon}),
      singleton(S, {id: 'howToPitchPage', type: 'howToPitchPage', title: 'How to Pitch a Stock', icon: BulbOutlineIcon}),
      singleton(S, {id: 'alumniPage', type: 'alumniPage', title: 'Alumni', icon: UserIcon}),
      singleton(S, {id: 'photoGalleryPage', type: 'photoGalleryPage', title: 'Photo Gallery', icon: ImageIcon}),
    ])
