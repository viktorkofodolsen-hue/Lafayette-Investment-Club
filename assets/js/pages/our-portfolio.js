import {sanityFetch, siteSettingsProjection, applySiteSettings, setText, setImage} from '../sanity-client.js';

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]${siteSettingsProjection},
  "page": *[_id == "ourPortfolioPage"][0]{
    pageHeader,
    targetEyebrow, targetHeading, targetLede,
    "targetChart": targetChartImage{"url": asset->url, alt},
    targetSectors,
    liveEyebrow, liveHeading, liveLede, liveLinkLabel, liveLinkUrl,
    performersEyebrow, performersHeading, topPerformers,
    archiveEyebrow, archiveHeading, archiveLede,
    archiveEntries[]{
      label,
      "url": file.asset->url,
      "filename": file.asset->originalFilename
    }
  }
}`;

function extLabel(filename) {
  const ext = (filename || '').split('.').pop();
  return ext ? `.${ext}` : '';
}

async function init() {
  const {settings, page} = await sanityFetch(QUERY);
  applySiteSettings(settings);
  if (!page) return;
  const header = page.pageHeader || {};
  setText('.page-header .eyebrow', header.eyebrow);
  setText('.page-header h1', header.title);
  setText('.page-header .lede', header.lede);

  const sections = document.querySelectorAll('main .section');

  // Target Allocation
  const targetSection = document.querySelector('#target-allocation');
  setText('.eyebrow', page.targetEyebrow, targetSection);
  setText('h2', page.targetHeading, targetSection);
  setText('.lede', page.targetLede, targetSection);
  setImage('.split-media img', page.targetChart, targetSection);
  const targetTbody = targetSection ? targetSection.querySelector('table.manifest tbody') : null;
  if (targetTbody && Array.isArray(page.targetSectors)) {
    targetTbody.innerHTML = page.targetSectors
      .map((row) => `<tr><th scope="row">${row.sector}</th><td>${row.percentage}%</td></tr>`)
      .join('');
  }

  // Live Portfolio
  const liveSection = sections[1];
  setText('.eyebrow', page.liveEyebrow, liveSection);
  setText('h2', page.liveHeading, liveSection);
  setText('.lede', page.liveLede, liveSection);
  const liveLink = liveSection ? liveSection.querySelector('a.btn-primary') : null;
  if (liveLink) {
    if (page.liveLinkLabel) liveLink.textContent = page.liveLinkLabel;
    if (page.liveLinkUrl) liveLink.setAttribute('href', page.liveLinkUrl);
  }

  // Top Performers
  const performersSection = sections[2];
  setText('.eyebrow', page.performersEyebrow, performersSection);
  setText('h2', page.performersHeading, performersSection);
  const performersList = performersSection ? performersSection.querySelector('.performers-list') : null;
  if (performersList && Array.isArray(page.topPerformers)) {
    performersList.innerHTML = page.topPerformers.map((name) => `<li>${name}</li>`).join('');
  }

  // Archive
  const archiveSection = sections[3];
  setText('.eyebrow', page.archiveEyebrow, archiveSection);
  setText('h2', page.archiveHeading, archiveSection);
  setText('.lede', page.archiveLede, archiveSection);
  const archiveList = archiveSection ? archiveSection.querySelector('.archive-list') : null;
  if (archiveList && Array.isArray(page.archiveEntries)) {
    archiveList.innerHTML = page.archiveEntries
      .map(
        (entry) => `
        <div>
          <dt>${entry.label}</dt>
          <dd><a href="${entry.url}" download>Download (${extLabel(entry.filename)})</a></dd>
        </div>`,
      )
      .join('');
  }
}

init().catch((err) => console.error('Failed to load Our Portfolio content from Sanity:', err));
