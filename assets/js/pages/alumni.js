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
  "page": *[_id == "alumniPage"][0]{
    pageHeader,
    thanksIntroBody,
    thanksLine,
    networkingBody,
    placementsEyebrow, placementsHeading, placementsLede,
    placements
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

  const thanksBody = renderPortableText(page.thanksIntroBody);
  const thanksLineHtml = page.thanksLine ? `<p class="thanks-line">${page.thanksLine}</p>` : '';
  const contactItems = (settings.coPresidents || [])
    .map(
      (person) =>
        `<li><a href="mailto:${person.email}">Co-President ${person.name} ${person.classYear || ''}<span>${person.email}</span></a></li>`,
    )
    .join('');
  setHtml(
    '.alumni-thanks-inner',
    `${thanksBody}${thanksLineHtml}<h3>Contact</h3><ul class="contact-list">${contactItems}</ul>`,
  );

  const sections = document.querySelectorAll('main .section');
  setHtml('.about-copy', renderPortableText(page.networkingBody), sections[1]);

  const placementsSection = document.querySelector('.placements');
  setText('.eyebrow', page.placementsEyebrow, placementsSection);
  setText('h2', page.placementsHeading, placementsSection);
  setText('.lede', page.placementsLede, placementsSection);
  const grid = placementsSection ? placementsSection.querySelector('.placements-grid') : null;
  if (grid && Array.isArray(page.placements)) {
    grid.innerHTML = page.placements
      .map(
        (company) => `
        <button class="company-tile" type="button">
          <span class="company-name">${company.name}</span>
          <span class="company-desc"><span>${company.description}</span></span>
        </button>`,
      )
      .join('');
  }
}

init().catch((err) => console.error('Failed to load Alumni content from Sanity:', err));
