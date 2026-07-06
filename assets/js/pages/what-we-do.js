import {
  sanityFetch,
  siteSettingsProjection,
  applySiteSettings,
  renderPortableText,
  setText,
  setHtml,
} from '../sanity-client.js';

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]${siteSettingsProjection},
  "page": *[_id == "whatWeDoPage"][0]{
    pageHeader,
    body
  }
}`;

async function init() {
  const {settings, page} = await sanityFetch(QUERY);
  applySiteSettings(settings);
  if (!page) return;
  const header = page.pageHeader || {};
  setText('.page-header .eyebrow', header.eyebrow);
  setText('.page-header h1', header.title);
  setText('.page-header .lede', header.lede);
  setHtml('.about-copy', renderPortableText(page.body));
}

init().catch((err) => console.error('Failed to load What We Do content from Sanity:', err));
