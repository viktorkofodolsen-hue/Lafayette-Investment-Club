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
  "page": *[_id == "howToPitchPage"][0]{
    pageHeader,
    processFootnote,
    questionsEyebrow, questionsHeading, questionsLede,
    questions,
    additionalInfo
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

  // Process steps (shared with Home) + footnote
  const list = sections[0].querySelector('.process-list');
  if (list && Array.isArray(settings.pitchProcessSteps)) {
    list.innerHTML = settings.pitchProcessSteps
      .map(
        (step, i) => `
        <li data-reveal class="is-visible">
          <span class="process-num">${i + 1}</span>
          <h3>${step.title}</h3>
          <p>${step.body || ''}</p>
        </li>`,
      )
      .join('');
  }
  setHtml('.footnote', renderPortableText(page.processFootnote), sections[0]);

  // Three questions
  const questionsSection = sections[1];
  setText('.eyebrow', page.questionsEyebrow, questionsSection);
  setText('h2', page.questionsHeading, questionsSection);
  setText('.lede', page.questionsLede, questionsSection);
  const questionBlocks = questionsSection.querySelectorAll('.info-block');
  (page.questions || []).forEach((q, i) => {
    const block = questionBlocks[i];
    if (!block) return;
    block.innerHTML = `<h3>${q.title}</h3>${renderPortableText(q.body)}`;
  });

  // Additional info
  const additionalSection = sections[2];
  const additionalBlocks = additionalSection.querySelectorAll('.info-block');
  (page.additionalInfo || []).forEach((info, i) => {
    const block = additionalBlocks[i];
    if (!block) return;
    block.innerHTML = `<h3>${info.title}</h3>${renderPortableText(info.body)}`;
  });
}

init().catch((err) => console.error('Failed to load How to Pitch a Stock content from Sanity:', err));
