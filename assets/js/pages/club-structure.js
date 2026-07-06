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
  "page": *[_id == "clubStructurePage"][0]{
    pageHeader,
    introBody,
    generalMembersDescription,
    officerPositions
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
  setHtml('.about-copy', renderPortableText(page.introBody));
  setText('.detail-block:nth-of-type(1) .lede', page.generalMembersDescription);

  const list = document.querySelector('.detail-block:nth-of-type(2) .role-list');
  if (list && Array.isArray(page.officerPositions)) {
    list.innerHTML = page.officerPositions.map((title) => `<li>${title}</li>`).join('');
  }
}

init().catch((err) => console.error('Failed to load Club Structure content from Sanity:', err));
