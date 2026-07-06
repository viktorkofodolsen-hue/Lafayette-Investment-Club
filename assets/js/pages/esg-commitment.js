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
  "page": *[_id == "esgCommitmentPage"][0]{
    pageHeader,
    introBody,
    pillars,
    closingBody,
    signatureLine
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

  const sections = document.querySelectorAll('main .section');
  setHtml('.about-copy', renderPortableText(page.introBody), sections[0]);

  const pillarBlocks = document.querySelectorAll('.info-grid .info-block');
  (page.pillars || []).forEach((pillar, i) => {
    const block = pillarBlocks[i];
    if (!block) return;
    block.querySelector('h3').textContent = pillar.title;
    block.querySelector('p').outerHTML = renderPortableText(pillar.body);
  });

  const closingContainer = sections[2] ? sections[2].querySelector('.about-copy') : null;
  if (closingContainer) {
    const signatureHtml = page.signatureLine
      ? `<p class="thanks-line">${page.signatureLine.replace(/\n/g, '<br>')}</p>`
      : '';
    closingContainer.innerHTML = renderPortableText(page.closingBody) + signatureHtml;
  }
}

init().catch((err) => console.error('Failed to load ESG Commitment content from Sanity:', err));
