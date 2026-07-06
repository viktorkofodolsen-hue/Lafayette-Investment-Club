import {
  sanityFetch,
  siteSettingsProjection,
  applySiteSettings,
  renderPortableText,
  setText,
  setHtml,
  setImage,
  animateStatCounters,
  formatDate,
} from '../sanity-client.js';

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]${siteSettingsProjection},
  "page": *[_id == "homePage"][0]{
    heroEyebrow, heroHeadline, heroSubheading,
    heroPrimaryCtaLabel, heroPrimaryCtaLink,
    heroSecondaryCtaLabel, heroSecondaryCtaLink,
    "heroVideoUrl": heroVideo.asset->url,
    "heroPoster": heroPosterImage{"url": asset->url, alt},
    aboutBody,
    stats,
    performanceEyebrow, performanceHeading, performanceLede,
    inceptionDate, returnSinceInception, benchmarksTracked,
    "performanceChart": performanceChartImage{"url": asset->url, alt},
    performanceChartCaption,
    sectorsEyebrow, sectorsHeading, sectorsLede,
    "sectorsChart": sectorsChartImage{"url": asset->url, alt},
    sectorsChartCaption,
    sectors,
    sectorsFootnote,
    membersEyebrow, membersHeading,
    contactEyebrow, contactHeading
  }
}`;

function populateHero(page) {
  const hero = document.querySelector('#top');
  if (!hero) return;
  setText('.eyebrow', page.heroEyebrow, hero);
  setText('.hero-headline', page.heroHeadline, hero);
  setText('.hero-sub', page.heroSubheading, hero);

  const [primaryCta, secondaryCta] = hero.querySelectorAll('.hero-actions a');
  if (primaryCta) {
    if (page.heroPrimaryCtaLabel) primaryCta.textContent = page.heroPrimaryCtaLabel;
    if (page.heroPrimaryCtaLink) primaryCta.setAttribute('href', page.heroPrimaryCtaLink);
  }
  if (secondaryCta) {
    if (page.heroSecondaryCtaLabel) secondaryCta.textContent = page.heroSecondaryCtaLabel;
    if (page.heroSecondaryCtaLink) secondaryCta.setAttribute('href', page.heroSecondaryCtaLink);
  }

  if (page.heroVideoUrl) {
    const source = hero.querySelector('video.hero-video source');
    const video = hero.querySelector('video.hero-video');
    if (source) {
      source.setAttribute('src', page.heroVideoUrl);
      if (video) video.load();
    }
  }
  if (page.heroPoster && page.heroPoster.url) {
    const video = hero.querySelector('video.hero-video');
    if (video) video.setAttribute('poster', page.heroPoster.url);
    setImage('.hero-video-fallback', page.heroPoster, hero);
  }
}

function populateAbout(page) {
  setHtml('#about .about-copy', renderPortableText(page.aboutBody), document);
}

function populateStats(page) {
  if (!Array.isArray(page.stats) || !page.stats.length) return;
  const slots = document.querySelectorAll('.stats-banner-inner > div');
  page.stats.forEach((stat, i) => {
    const slot = slots[i];
    if (!slot) return;
    const dd = slot.querySelector('dd');
    const dt = slot.querySelector('dt');
    if (dd) {
      dd.dataset.value = String(stat.value);
      dd.dataset.decimals = String(stat.decimals || 0);
      if (stat.prefix) dd.dataset.prefix = stat.prefix;
      else delete dd.dataset.prefix;
      if (stat.suffix) dd.dataset.suffix = stat.suffix;
      else delete dd.dataset.suffix;
    }
    if (dt) dt.textContent = stat.label;
  });
  // Hide any leftover static slots beyond what Sanity actually returned.
  for (let i = page.stats.length; i < slots.length; i += 1) {
    slots[i].style.display = 'none';
  }
  animateStatCounters(document.querySelector('.stats-banner-inner'));
}

function populatePerformance(page) {
  const section = document.querySelector('#portfolio');
  if (!section) return;
  setText('.eyebrow', page.performanceEyebrow, section);
  setText('h2', page.performanceHeading, section);
  setText('.lede', page.performanceLede, section);

  const ledgerRows = section.querySelectorAll('.ledger-list > div > dd');
  if (ledgerRows[0] && page.inceptionDate) ledgerRows[0].textContent = formatDate(page.inceptionDate);
  if (ledgerRows[1] && page.returnSinceInception) ledgerRows[1].textContent = page.returnSinceInception;
  if (ledgerRows[2] && page.benchmarksTracked) ledgerRows[2].textContent = page.benchmarksTracked;

  setImage('.split-media img', page.performanceChart, section);
  setText('.caption', page.performanceChartCaption, section);
}

function populateSectors(page) {
  const section = document.querySelector('#sectors');
  if (!section) return;
  setText('.eyebrow', page.sectorsEyebrow, section);
  setText('h2', page.sectorsHeading, section);
  setText('.lede', page.sectorsLede, section);
  setImage('.split-media img', page.sectorsChart, section);
  setText('.caption', page.sectorsChartCaption, section);
  setText('.footnote', page.sectorsFootnote, section);

  const tbody = section.querySelector('table.manifest tbody');
  if (tbody && Array.isArray(page.sectors)) {
    tbody.innerHTML = page.sectors
      .map((row) => `<tr><th scope="row">${row.sector}</th><td>${row.percentage}%</td></tr>`)
      .join('');
  }
}

function populateMembers(page, settings) {
  const section = document.querySelector('#members');
  if (!section) return;
  setText('.eyebrow', page.membersEyebrow, section);
  setText('h2', page.membersHeading, section);

  const list = section.querySelector('.process-list');
  if (list && Array.isArray(settings.pitchProcessSteps)) {
    list.innerHTML = settings.pitchProcessSteps
      .map(
        (step, i) => `
        <li data-reveal class="is-visible">
          <span class="process-num">${i + 1}</span>
          <h3></h3>
          <p></p>
        </li>`,
      )
      .join('');
    list.querySelectorAll('li').forEach((li, i) => {
      const step = settings.pitchProcessSteps[i];
      li.querySelector('h3').textContent = step.title;
      li.querySelector('p').textContent = step.body || '';
    });
  }
}

function populateContact(page, settings) {
  const section = document.querySelector('#contact');
  if (!section) return;
  setText('.eyebrow', page.contactEyebrow, section);
  setText('h2', page.contactHeading, section);

  const meetingDds = section.querySelectorAll('.detail-block:nth-of-type(1) .ledger-list dd');
  if (meetingDds[0] && settings.weeklyMeetingLocation) meetingDds[0].textContent = settings.weeklyMeetingLocation;
  if (meetingDds[1] && settings.weeklyMeetingTime) meetingDds[1].textContent = settings.weeklyMeetingTime;
  if (meetingDds[2] && settings.weeklyMeetingFoodNote) meetingDds[2].textContent = settings.weeklyMeetingFoodNote;

  const contactList = section.querySelector('.contact-list');
  if (contactList && Array.isArray(settings.coPresidents) && settings.coPresidents.length) {
    contactList.innerHTML = settings.coPresidents
      .map(
        (person) =>
          `<li><a href="mailto:${person.email}">${person.name}<span>${person.email}</span></a></li>`,
      )
      .join('');
  }

  const groupMeBtn = section.querySelector('.detail-block:nth-of-type(2) .btn-ghost');
  if (groupMeBtn && settings.groupMeUrl) groupMeBtn.setAttribute('href', settings.groupMeUrl);
}

async function init() {
  const {settings, page} = await sanityFetch(QUERY);
  applySiteSettings(settings);
  if (!page) return;
  populateHero(page);
  populateAbout(page);
  populateStats(page);
  populatePerformance(page);
  populateSectors(page);
  populateMembers(page, settings);
  populateContact(page, settings);
}

init().catch((err) => console.error('Failed to load home page content from Sanity:', err));
