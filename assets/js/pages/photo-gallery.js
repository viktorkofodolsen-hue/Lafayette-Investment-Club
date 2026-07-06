import {sanityFetch, siteSettingsProjection, applySiteSettings, setText} from '../sanity-client.js';

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]${siteSettingsProjection},
  "page": *[_id == "photoGalleryPage"][0]{
    pageHeader,
    placeholderMessage
  }
}`;

async function init() {
  const {settings, page} = await sanityFetch(QUERY);
  applySiteSettings(settings);
  if (!page) return;
  const header = page.pageHeader || {};
  setText('.page-header .eyebrow', header.eyebrow);
  setText('.page-header h1', header.title);
  setText('main .lede', page.placeholderMessage);
}

init().catch((err) => console.error('Failed to load Photo Gallery content from Sanity:', err));
