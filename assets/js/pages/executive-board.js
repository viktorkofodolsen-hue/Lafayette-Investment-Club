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
  "page": *[_id == "executiveBoardPage"][0]{
    pageHeader,
    members[]{
      name,
      role,
      "photo": photo{"url": asset->url, alt}
    },
    closingNote
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

  const grid = document.querySelector('.board-grid');
  if (grid && Array.isArray(page.members)) {
    grid.innerHTML = page.members
      .map((member) => {
        const photoUrl = member.photo && member.photo.url ? member.photo.url : '';
        const alt = (member.photo && member.photo.alt) || member.name;
        return `
          <div class="board-card">
            <img class="board-photo" src="${photoUrl}" alt="${alt}" loading="lazy">
            <h3>${member.name}</h3>
            <p class="board-role">${member.role}</p>
          </div>`;
      })
      .join('');
  }

  setHtml('.board-note', renderPortableText(page.closingNote));
}

init().catch((err) => console.error('Failed to load Executive Board content from Sanity:', err));
