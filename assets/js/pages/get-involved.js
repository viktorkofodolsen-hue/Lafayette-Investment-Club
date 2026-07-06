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
  "page": *[_id == "getInvolvedPage"][0]{
    pageHeader,
    introBody,
    waysEyebrow, waysHeading,
    ways,
    resourcesEyebrow, resourcesHeading,
    resourceCategories
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
  const introSection = sections[0];

  setHtml('.about-copy', renderPortableText(page.introBody), introSection);

  const meetingDds = introSection.querySelectorAll('.detail-block:nth-of-type(1) .ledger-list dd');
  if (meetingDds[0] && settings.weeklyMeetingLocation) meetingDds[0].textContent = settings.weeklyMeetingLocation;
  if (meetingDds[1] && settings.weeklyMeetingTime) meetingDds[1].textContent = settings.weeklyMeetingTime;
  if (meetingDds[2] && settings.weeklyMeetingFoodNote) meetingDds[2].textContent = settings.weeklyMeetingFoodNote;
  if (meetingDds[3] && settings.executiveBoardMeetingNote) meetingDds[3].textContent = settings.executiveBoardMeetingNote;

  const contactList = introSection.querySelector('.contact-list');
  if (contactList && Array.isArray(settings.coPresidents) && settings.coPresidents.length) {
    contactList.innerHTML = settings.coPresidents
      .map((person) => `<li><a href="mailto:${person.email}">${person.name}<span>${person.email}</span></a></li>`)
      .join('');
  }
  const groupMeBtn = introSection.querySelector('.detail-block:nth-of-type(2) .btn-ghost');
  if (groupMeBtn && settings.groupMeUrl) groupMeBtn.setAttribute('href', settings.groupMeUrl);

  // Ways to get involved
  const waysSection = sections[1];
  setText('.eyebrow', page.waysEyebrow, waysSection);
  setText('h2', page.waysHeading, waysSection);
  const waysBlocks = waysSection.querySelectorAll('.info-block');
  (page.ways || []).forEach((way, i) => {
    const block = waysBlocks[i];
    if (!block) return;
    block.innerHTML = `<h3>${way.title}</h3>${renderPortableText(way.body)}`;
  });

  // Resources
  const resourcesSection = sections[2];
  setText('.eyebrow', page.resourcesEyebrow, resourcesSection);
  setText('h2', page.resourcesHeading, resourcesSection);
  const resourcesGrid = resourcesSection.querySelector('.resources-grid');
  if (resourcesGrid && Array.isArray(page.resourceCategories)) {
    resourcesGrid.innerHTML = page.resourceCategories
      .map(
        (category) => `
        <div>
          <h3>${category.categoryName}</h3>
          <ul class="resource-list">
            ${(category.links || [])
              .map(
                (link) =>
                  `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`,
              )
              .join('')}
          </ul>
        </div>`,
      )
      .join('');
  }
}

init().catch((err) => console.error('Failed to load Get Involved content from Sanity:', err));
